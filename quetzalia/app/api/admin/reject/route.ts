import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/server-auth";
import { Registration } from "@/lib/types";
import { sendRejectedEmail } from "@/lib/email";
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
    const { registrationId, adminNote } = body;

    if (!registrationId) {
      return NextResponse.json(
        { error: "Se requiere el ID del registro a rechazar." },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("registrations").doc(registrationId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Registro no encontrado." }, { status: 404 });
    }

    const currentReg = docSnap.data() as Registration;
    const now = new Date().toISOString();

    const updates: Partial<Registration> = {
      status: "rechazado",
      updatedAt: now,
    };

    if (adminNote !== undefined) {
      updates.adminNote = adminNote;
    }

    await docRef.update(updates);

    // Enviar correo de notificación
    sendRejectedEmail(
      currentReg.email,
      currentReg.chosenName || currentReg.fullName,
      currentReg.type
    ).catch((err) => console.error("Error al enviar email de rechazo:", err));

    // Eliminar o desuscribir contacto de la audiencia de Resend si existía
    removeApprovedContact({
      email: currentReg.email,
      contactId: currentReg.resendContactId,
    })
      .then(async () => {
        if (currentReg.resendContactId) {
          await docRef.update({
            resendContactId: null as unknown as undefined,
          }).catch((e) => console.warn("Error limpiando resendContactId:", e));
        }
      })
      .catch((err) => console.warn("Error en removeApprovedContact:", err));

    return NextResponse.json({
      success: true,
      message: "Registro marcado como no aceptado/rechazado.",
      registrationId,
      status: "rechazado",
    });
  } catch (error: unknown) {
    console.error("[POST /api/admin/reject] Error:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar estatus." },
      { status: 500 }
    );
  }
}
