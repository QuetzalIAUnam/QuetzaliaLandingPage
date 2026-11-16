import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/server-auth";
import { MAX_APPROVED, Registration } from "@/lib/types";
import { sendPromotedEmail } from "@/lib/email";
import { syncApprovedContact } from "@/lib/resend-broadcast";

export async function POST(req: Request) {
  try {
    const authCheck = await verifyAdminUser(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.errorMessage || "Acceso restringido al comité organizador." },
        { status: authCheck.errorStatus || 403 }
      );
    }

    // 1. Verificar si hay cupo disponible
    const approvedSnapshot = await adminDb
      .collection("registrations")
      .where("status", "==", "aprobado")
      .count()
      .get();
    const approvedCount = approvedSnapshot.data().count;

    if (approvedCount >= MAX_APPROVED) {
      return NextResponse.json(
        {
          error: `No hay lugares disponibles. El cupo sigue lleno (${approvedCount}/${MAX_APPROVED}).`,
          code: "MAX_CAPACITY_REACHED",
        },
        { status: 409 }
      );
    }

    // 2. Buscar al primer participante en lista de espera (orden cronológico asc)
    const waitlistSnapshot = await adminDb
      .collection("registrations")
      .where("status", "==", "lista_espera")
      .orderBy("createdAt", "asc")
      .limit(1)
      .get();

    if (waitlistSnapshot.empty) {
      return NextResponse.json(
        { message: "No hay ninguna persona registrada en lista de espera actualmente.", promoted: null },
        { status: 200 }
      );
    }

    const firstDoc = waitlistSnapshot.docs[0];
    const candidate = firstDoc.data() as Registration;
    const now = new Date().toISOString();

    // 3. Promover a aprobado
    await firstDoc.ref.update({
      status: "aprobado",
      approvedBy: authCheck.user?.email || "comite@quetzalia.org",
      approvedAt: now,
      updatedAt: now,
      adminNote: candidate.adminNote
        ? `${candidate.adminNote}\n[Promovido automáticamente desde lista de espera el ${new Date().toLocaleDateString("es-MX")}]`
        : `Promovido desde lista de espera el ${new Date().toLocaleDateString("es-MX")}`,
    });

    // 4. Enviar correo de notificación de promoción
    sendPromotedEmail(
      candidate.email,
      candidate.chosenName || candidate.fullName,
      candidate.type,
      {
        talkTitle: candidate.talkTitle,
        organization: candidate.organization,
      }
    ).catch((err) => console.error("Error al enviar email de promoción:", err));

    // 5. Sincronizar contacto en audiencia de Resend (Fase 6: Broadcast)
    syncApprovedContact({
      email: candidate.email,
      firstName: candidate.chosenName || candidate.fullName,
    })
      .then(async (contactRes) => {
        if (contactRes.contactId) {
          await firstDoc.ref.update({
            resendContactId: contactRes.contactId,
          }).catch((e) => console.warn("Error guardando resendContactId:", e));
        } else if (contactRes.error) {
          await firstDoc.ref.update({
            resendSyncError: contactRes.error,
          }).catch((e) => console.warn("Error guardando resendSyncError:", e));
        }
      })
      .catch((err) => console.error("Error en syncApprovedContact:", err));

    return NextResponse.json({
      success: true,
      message: `Participante promovida/o exitosamente: ${candidate.chosenName || candidate.fullName}`,
      promoted: {
        id: firstDoc.id,
        email: candidate.email,
        fullName: candidate.fullName,
        type: candidate.type,
        status: "aprobado",
        promotedAt: now,
      },
    });
  } catch (error: unknown) {
    console.error("[POST /api/admin/promote] Error:", error);
    return NextResponse.json(
      { error: "Error interno al promover participante de lista de espera." },
      { status: 500 }
    );
  }
}
