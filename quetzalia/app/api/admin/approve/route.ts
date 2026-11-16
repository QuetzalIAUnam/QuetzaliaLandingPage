import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/server-auth";
import { MAX_APPROVED, Registration } from "@/lib/types";
import { sendAcceptedEmail } from "@/lib/email";
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

    const body = await req.json();
    const { registrationId, adminNote } = body;

    if (!registrationId) {
      return NextResponse.json(
        { error: "Se requiere el ID del registro a aprobar." },
        { status: 400 }
      );
    }

    // 1. Verificar cupo máximo
    const approvedSnapshot = await adminDb
      .collection("registrations")
      .where("status", "==", "aprobado")
      .count()
      .get();
    const approvedCount = approvedSnapshot.data().count;

    if (approvedCount >= MAX_APPROVED) {
      return NextResponse.json(
        {
          error: `Cupo máximo alcanzado (${MAX_APPROVED} personas). No es posible aprobar este registro; debe enviarse a lista de espera.`,
          code: "MAX_CAPACITY_REACHED",
          currentApproved: approvedCount,
          maxApproved: MAX_APPROVED,
        },
        { status: 409 }
      );
    }

    // 2. Obtener registro
    const docRef = adminDb.collection("registrations").doc(registrationId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Registro no encontrado." }, { status: 404 });
    }

    const currentReg = docSnap.data() as Registration;
    const now = new Date().toISOString();

    const updates: Partial<Registration> = {
      status: "aprobado",
      approvedBy: authCheck.user?.email || "comite@quetzalia.org",
      approvedAt: now,
      updatedAt: now,
    };

    if (adminNote !== undefined) {
      updates.adminNote = adminNote;
    }

    await docRef.update(updates);

    // 3. Enviar correo de aceptación
    sendAcceptedEmail(
      currentReg.email,
      currentReg.chosenName || currentReg.fullName,
      currentReg.type,
      {
        talkTitle: currentReg.talkTitle,
        organization: currentReg.organization,
      }
    ).catch((err) => console.error("Error al enviar email de aceptación:", err));

    // 4. Sincronizar contacto en audiencia de Resend (Fase 6: Broadcast)
    // Se ejecuta en segundo plano y nunca interrumpe la aprobación en caso de fallo
    syncApprovedContact({
      email: currentReg.email,
      firstName: currentReg.chosenName || currentReg.fullName,
    })
      .then(async (contactRes) => {
        if (contactRes.contactId) {
          await docRef.update({
            resendContactId: contactRes.contactId,
          }).catch((e) => console.warn("Error guardando resendContactId:", e));
        } else if (contactRes.error) {
          await docRef.update({
            resendSyncError: contactRes.error,
          }).catch((e) => console.warn("Error guardando resendSyncError:", e));
        }
      })
      .catch((err) => console.error("Error en syncApprovedContact:", err));

    return NextResponse.json({
      success: true,
      message: "Registro aprobado exitosamente.",
      registrationId,
      status: "aprobado",
    });
  } catch (error: unknown) {
    console.error("[POST /api/admin/approve] Error:", error);
    return NextResponse.json(
      { error: "Error interno al aprobar el registro." },
      { status: 500 }
    );
  }
}
