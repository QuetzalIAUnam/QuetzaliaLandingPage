import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/server-auth";
import { Registration } from "@/lib/types";
import {
  sendReceivedEmail,
  sendAcceptedEmail,
  sendWaitlistEmail,
  sendRejectedEmail,
  sendPromotedEmail,
  sendNoticeEmail,
} from "@/lib/email";
import {
  renderRegistrationReceivedEmail,
  renderRegistrationApprovedEmail,
  renderWaitlistEmail,
  renderRejectedEmail,
  renderWaitlistPromotedEmail,
  renderCustomNoticeEmail,
  OFFICIAL_TEMPLATES_CATALOG,
} from "@/lib/email-templates";

/**
 * GET /api/admin/notices?templateId=xxx&type=yyy
 * Previsualización de plantillas oficiales para el panel del comité
 */
export async function GET(req: Request) {
  try {
    const authCheck = await verifyAdminUser(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.errorMessage || "Acceso restringido al comité organizador." },
        { status: authCheck.errorStatus || 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const templateId = searchParams.get("templateId") || "received";
    const type = searchParams.get("type") || "speaker";
    const dummyName = "Dra. Alejandra Morales";
    const dummyFolio = "QUETZ-2027-DEMO-001";
    const dummyOrg = "Instituto de Investigaciones en Matemáticas Aplicadas y en Sistemas (IIMAS - UNAM)";
    const dummyTalk = "Inteligencia Artificial y Ética Algorítmica en México";

    let rendered;

    switch (templateId) {
      case "received":
        rendered = renderRegistrationReceivedEmail({
          toName: dummyName,
          regId: dummyFolio,
          type,
        });
        break;
      case "approved":
        rendered = renderRegistrationApprovedEmail({
          toName: dummyName,
          type,
          organization: dummyOrg,
          talkTitle: dummyTalk,
        });
        break;
      case "waitlist":
        rendered = renderWaitlistEmail({
          toName: dummyName,
          type,
        });
        break;
      case "rejected":
        rendered = renderRejectedEmail({
          toName: dummyName,
          type,
        });
        break;
      case "promoted":
        rendered = renderWaitlistPromotedEmail({
          toName: dummyName,
          type,
          organization: dummyOrg,
          talkTitle: dummyTalk,
        });
        break;
      case "custom":
        rendered = renderCustomNoticeEmail({
          toName: dummyName,
          subject: "Aviso importante sobre acreditaciones y logística",
          messageContent:
            "Estimada comunidad:\n\nLes compartimos las recomendaciones finales para su llegada a la FES Acatlán este próximo viernes.\n\nRecuerden portar su identificación oficial y presentarse 15 minutos antes de la ceremonia de inauguración.",
          actionUrl: "https://quetzalia.dev/mi-registro",
          actionText: "Consultar Mi Pase",
        });
        break;
      default:
        return NextResponse.json({ error: "Plantilla desconocida." }, { status: 400 });
    }

    return NextResponse.json({
      templateId,
      catalog: OFFICIAL_TEMPLATES_CATALOG,
      subject: rendered.subject,
      previewText: rendered.previewText,
      html: rendered.html,
    });
  } catch (error: unknown) {
    console.error("[GET /api/admin/notices] Error:", error);
    return NextResponse.json(
      { error: "Error al generar la vista previa de la plantilla." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/notices
 * Envío de avisos personalizados o re-envío de plantilla de estatus
 */
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
    const { action } = body;

    // 1. Re-enviar correo de estatus actual a un registro específico
    if (action === "resend_status") {
      const { registrationId } = body;
      if (!registrationId) {
        return NextResponse.json(
          { error: "Se requiere el ID del registro." },
          { status: 400 }
        );
      }

      const docSnap = await adminDb.collection("registrations").doc(registrationId).get();
      if (!docSnap.exists) {
        return NextResponse.json({ error: "Registro no encontrado." }, { status: 404 });
      }

      const reg = docSnap.data() as Registration;
      const toName = reg.chosenName || reg.fullName;

      let emailResult;
      if (body.templateType === "promoted") {
        emailResult = await sendPromotedEmail(reg.email, toName, reg.type, {
          talkTitle: reg.talkTitle,
          organization: reg.organization,
        });
      } else {
        switch (reg.status) {
          case "aprobado":
            emailResult = await sendAcceptedEmail(reg.email, toName, reg.type, {
              talkTitle: reg.talkTitle,
              organization: reg.organization,
            });
            break;
          case "lista_espera":
            emailResult = await sendWaitlistEmail(reg.email, toName, reg.type);
            break;
          case "rechazado":
            emailResult = await sendRejectedEmail(reg.email, toName, reg.type);
            break;
          case "pendiente":
          default:
            emailResult = await sendReceivedEmail(reg.email, toName, reg.id, reg.type);
            break;
        }
      }

      return NextResponse.json({
        success: true,
        message: `Correo de estatus '${reg.status}' enviado exitosamente a ${reg.email}.`,
        emailResult,
      });
    }

    // 2. Enviar aviso o comunicado personalizado (individual o segmentado)
    if (action === "send_custom") {
      const {
        target, // "single" | "filter"
        registrationId,
        filterType,
        filterStatus,
        subject,
        message,
        actionUrl,
        actionText,
      } = body;

      if (!subject?.trim() || !message?.trim()) {
        return NextResponse.json(
          { error: "El asunto y el mensaje son obligatorios." },
          { status: 400 }
        );
      }

      const recipients: { email: string; name: string }[] = [];

      if (target === "single") {
        if (!registrationId) {
          return NextResponse.json(
            { error: "Se requiere registrationId para envío individual." },
            { status: 400 }
          );
        }
        const docSnap = await adminDb.collection("registrations").doc(registrationId).get();
        if (!docSnap.exists) {
          return NextResponse.json({ error: "Registro no encontrado." }, { status: 404 });
        }
        const reg = docSnap.data() as Registration;
        recipients.push({
          email: reg.email,
          name: reg.chosenName || reg.fullName,
        });
      } else {
        // Consultar registros filtrados
        let query: FirebaseFirestore.Query = adminDb.collection("registrations");

        if (filterType && filterType !== "all") {
          query = query.where("type", "==", filterType);
        }
        if (filterStatus && filterStatus !== "all") {
          query = query.where("status", "==", filterStatus);
        }

        const snapshot = await query.get();
        snapshot.forEach((doc) => {
          const reg = doc.data() as Registration;
          if (reg.email) {
            recipients.push({
              email: reg.email,
              name: reg.chosenName || reg.fullName,
            });
          }
        });
      }

      if (recipients.length === 0) {
        return NextResponse.json(
          { error: "No se encontraron destinatarios que cumplan con los filtros seleccionados." },
          { status: 404 }
        );
      }

      // Enviar correos de manera asíncrona
      let sentCount = 0;
      for (const rec of recipients) {
        try {
          await sendNoticeEmail({
            toEmail: rec.email,
            toName: rec.name,
            subject: subject.trim(),
            message: message.trim(),
            actionUrl: actionUrl?.trim() || undefined,
            actionText: actionText?.trim() || undefined,
          });
          sentCount++;
        } catch (err) {
          console.error(`Error enviando aviso a ${rec.email}:`, err);
        }
      }

      return NextResponse.json({
        success: true,
        sentCount,
        totalRecipients: recipients.length,
        message: `Comunicado enviado exitosamente a ${sentCount} de ${recipients.length} destinatario(s).`,
      });
    }

    return NextResponse.json({ error: "Acción no reconocida." }, { status: 400 });
  } catch (error: unknown) {
    console.error("[POST /api/admin/notices] Error:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el envío de avisos." },
      { status: 500 }
    );
  }
}
