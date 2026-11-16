import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/server-auth";
import { Registration } from "@/lib/types";
import { sendWaitlistEmail } from "@/lib/email";

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
        { error: "Se requiere el ID del registro para enviar a lista de espera." },
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
      status: "lista_espera",
      updatedAt: now,
    };

    if (adminNote !== undefined) {
      updates.adminNote = adminNote;
    }

    await docRef.update(updates);

    // Enviar correo informativo de lista de espera
    sendWaitlistEmail(
      currentReg.email,
      currentReg.chosenName || currentReg.fullName,
      currentReg.type
    ).catch((err) => console.error("Error al enviar email de lista de espera:", err));

    return NextResponse.json({
      success: true,
      message: "Registro asignado a lista de espera.",
      registrationId,
      status: "lista_espera",
    });
  } catch (error: unknown) {
    console.error("[POST /api/admin/waitlist] Error:", error);
    return NextResponse.json(
      { error: "Error interno al asignar a lista de espera." },
      { status: 500 }
    );
  }
}
