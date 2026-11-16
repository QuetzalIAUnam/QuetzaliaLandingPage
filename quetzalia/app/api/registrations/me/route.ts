import { NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
import { verifyAuthUser, getAllAdminEmails } from "@/lib/server-auth";
import { Registration } from "@/lib/types";
import { removeApprovedContact } from "@/lib/resend-broadcast";

export async function GET(req: Request) {
  try {
    const authUser = await verifyAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "No autenticado. Inicia sesión con Google." },
        { status: 401 }
      );
    }

    const userEmail = (authUser.email || "").toLowerCase().trim();
    const adminEmails = await getAllAdminEmails();
    const isAdmin = adminEmails.includes(userEmail);

    const docSnap = await adminDb.collection("registrations").doc(authUser.uid).get();

    if (!docSnap.exists) {
      return NextResponse.json({ exists: false, registration: null, isAdmin }, { status: 200 });
    }

    return NextResponse.json(
      { exists: true, registration: { id: docSnap.id, ...docSnap.data() }, isAdmin },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[GET /api/registrations/me] Error:", error);
    return NextResponse.json(
      { error: "Error al consultar tu registro." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const authUser = await verifyAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "No autenticado. Inicia sesión con Google." },
        { status: 401 }
      );
    }

    const docRef = adminDb.collection("registrations").doc(authUser.uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const regData = docSnap.data() as Registration;
      if (regData.resendContactId || regData.email) {
        removeApprovedContact({
          email: regData.email,
          contactId: regData.resendContactId,
        }).catch((err) => console.warn("Error al remover de Resend:", err));
      }

      // Eliminar fotografías y logotipos de Storage
      try {
        const bucket = adminStorage.bucket();
        const files = [
          regData.photoPath && !regData.photoPath.startsWith("data:") ? regData.photoPath : undefined,
          `speakers/private/${authUser.uid}/photo.jpg`,
          `speakers/public/${authUser.uid}/photo.jpg`,
          `sponsors/logos/${authUser.uid}/logo.jpg`,
          `communities/logos/${authUser.uid}/logo.jpg`,
        ].filter(Boolean) as string[];

        await Promise.all(
          files.map((p) => bucket.file(p).delete({ ignoreNotFound: true }).catch(() => {}))
        );
      } catch (err) {
        console.warn("[Delete Me] Advertencia al eliminar Storage:", err);
      }

      await docRef.delete();
    }

    return NextResponse.json({
      success: true,
      message: "Tu postulación ha sido eliminada con éxito. Ya puedes postularte nuevamente para tus pruebas.",
    });
  } catch (error: unknown) {
    console.error("[DELETE /api/registrations/me] Error:", error);
    return NextResponse.json(
      { error: "Error al eliminar tu registro." },
      { status: 500 }
    );
  }
}
