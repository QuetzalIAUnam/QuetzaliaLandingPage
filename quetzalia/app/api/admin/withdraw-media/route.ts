import { NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
import { verifyAuthUser, getAllAdminEmails } from "@/lib/server-auth";
import { Registration } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const authUser = await verifyAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "No autenticado. Se requiere token Bearer válido." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { registrationId, reason } = body;

    if (!registrationId) {
      return NextResponse.json(
        { error: "Se requiere el ID del registro." },
        { status: 400 }
      );
    }

    // Comprobar si quien solicita es el administrador o la dueña del registro
    const adminEmails = await getAllAdminEmails();
    const userEmail = (authUser.email || "").toLowerCase().trim();
    const isAdmin = adminEmails.includes(userEmail);
    const isOwner = authUser.uid === registrationId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "No autorizado. Solo la ponente o el comité pueden solicitar el retiro de materiales." },
        { status: 403 }
      );
    }

    const docRef = adminDb.collection("registrations").doc(registrationId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Registro no encontrado." }, { status: 404 });
    }

    const reg = docSnap.data() as Registration;
    const bucket = adminStorage.bucket();

    // 1. Eliminar foto pública si existe
    try {
      const publicFile = bucket.file(`speakers/public/${registrationId}/photo.jpg`);
      const [pubExists] = await publicFile.exists();
      if (pubExists) {
        await publicFile.delete();
      }
    } catch (e) {
      console.warn("No se encontró o no se pudo borrar foto pública:", e);
    }

    // 2. Eliminar foto privada si existe
    try {
      const privateFile = bucket.file(`speakers/private/${registrationId}/photo.jpg`);
      const [privExists] = await privateFile.exists();
      if (privExists) {
        await privateFile.delete();
      }
    } catch (e) {
      console.warn("No se encontró o no se pudo borrar foto privada:", e);
    }

    // 3. Eliminar logo si es sponsor
    try {
      const logoFile = bucket.file(`sponsors/logos/${registrationId}/logo.jpg`);
      const [logoExists] = await logoFile.exists();
      if (logoExists) {
        await logoFile.delete();
      }
    } catch (e) {
      console.warn("No se encontró logotipo a eliminar:", e);
    }

    const now = new Date().toISOString();

    // 4. Actualizar Firestore retirando paths y materiales
    await docRef.update({
      photoPath: null,
      logoPath: null,
      talkMaterials: "[Contenido retirado por ejercicio del derecho de cancelación/oposición]",
      updatedAt: now,
      adminNote: reg.adminNote
        ? `${reg.adminNote}\n[Retiro de fotografía y materiales ejecutado el ${new Date().toLocaleDateString("es-MX")}. Motivo: ${reason || "Solicitud de retiro"}]`
        : `Retiro de materiales y foto ejecutado el ${new Date().toLocaleDateString("es-MX")}. Motivo: ${reason || "Solicitud de retiro"}`,
    });

    return NextResponse.json({
      success: true,
      message:
        "Garantía de Retiro en 72h cumplida: La fotografía y los materiales han sido despublicados y eliminados permanentemente de los servidores públicos de Quetzalia.",
      withdrawnAt: now,
    });
  } catch (error: unknown) {
    console.error("[POST /api/admin/withdraw-media] Error:", error);
    return NextResponse.json(
      { error: "Error interno al ejecutar el retiro de medios." },
      { status: 500 }
    );
  }
}
