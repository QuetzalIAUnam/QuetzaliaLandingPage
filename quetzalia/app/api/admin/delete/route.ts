import { NextResponse } from "next/server";
import { adminDb, adminAuth, adminStorage } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/server-auth";
import { Registration } from "@/lib/types";
import { removeApprovedContact } from "@/lib/resend-broadcast";

export async function POST(req: Request) {
  try {
    const authCheck = await verifyAdminUser(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.errorMessage || "Acceso restringido al comité organizador." },
        { status: authCheck.errorStatus || 403 }
      );
    }

    const body = await req.json();
    const { registrationId, deleteAuthUser } = body;

    if (!registrationId) {
      return NextResponse.json(
        { error: "Se requiere el ID del registro a eliminar." },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("registrations").doc(registrationId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Registro no encontrado en Firestore." }, { status: 404 });
    }

    const regData = docSnap.data() as Registration;

    // 1. Remover de la audiencia de Resend si existía
    if (regData.resendContactId || regData.email) {
      removeApprovedContact({
        email: regData.email,
        contactId: regData.resendContactId,
      }).catch((err) => console.warn("Error al remover contacto de Resend:", err));
    }

    // 2. Eliminar fotografías o logotipos en Firebase Storage
    try {
      const bucket = adminStorage.bucket();
      const filesToDelete = [
        regData.photoPath,
        `speakers/private/${registrationId}/photo.jpg`,
        `speakers/public/${registrationId}/photo.jpg`,
        `sponsors/logos/${registrationId}/logo.jpg`,
      ].filter(Boolean) as string[];

      await Promise.all(
        filesToDelete.map((filePath) =>
          bucket.file(filePath).delete({ ignoreNotFound: true }).catch((err) => {
            console.warn(`[Delete Storage] Archivo ${filePath} omitido o no encontrado:`, err?.message);
          })
        )
      );
    } catch (storageErr) {
      console.warn("[Delete Storage] Advertencia al limpiar archivos de Storage:", storageErr);
    }

    // 3. Eliminar el documento de Firestore
    await docRef.delete();

    // 4. Si se solicitó eliminar también de Firebase Auth
    if (deleteAuthUser) {
      await adminAuth.deleteUser(registrationId).catch((authErr) => {
        console.warn("No se pudo eliminar el usuario de Firebase Auth (posiblemente ya no existe):", authErr);
      });
    }

    return NextResponse.json({
      success: true,
      message: `Postulación de ${regData.fullName} eliminada exitosamente junto con sus archivos de imagen${deleteAuthUser ? " (y cuenta de Google restablecida)" : ""}.`,
    });
  } catch (error: unknown) {
    console.error("[POST /api/admin/delete] Error:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar el registro." },
      { status: 500 }
    );
  }
}
