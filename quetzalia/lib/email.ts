import { Resend } from "resend";
import {
  renderRegistrationReceivedEmail,
  renderRegistrationApprovedEmail,
  renderWaitlistEmail,
  renderRejectedEmail,
  renderWaitlistPromotedEmail,
  renderCustomNoticeEmail,
  getBaseEmailLayout,
} from "./email-templates";

export { getBaseEmailLayout };

interface SendEmailParams {
  toEmail: string;
  toName: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: string;
}

// Inicialización de cliente Resend
function getResendClient(): Resend | null {
  const apiKey =
    process.env.RESEND_API_KEY ||
    process.env.RESED_API_KEY ||
    "";

  if (!apiKey || apiKey.includes("tu_resend_api_key_aqui")) {
    return null;
  }

  return new Resend(apiKey);
}

export async function sendEmail({
  toEmail,
  toName,
  subject,
  htmlContent,
  replyTo,
}: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResendClient();
  const rawSender = process.env.RESEND_SENDER_EMAIL || "Quetzalia <registro@quetzalia.dev>";
  const defaultReplyTo = process.env.RESEND_REPLY_TO || "923475@pcpuma.acatlan.unam.mx";

  const from = rawSender.includes("<")
    ? rawSender
    : `Quetzalia <${rawSender}>`;

  if (!resend) {
    console.warn(
      `[Email Resend] RESEND_API_KEY no configurada. Simulando envío a ${toEmail} con asunto: "${subject}"`
    );
    return { success: true, id: "simulated-id" };
  }

  try {
    const recipient = toName ? `${toName} <${toEmail}>` : toEmail;
    const finalReplyTo = replyTo || defaultReplyTo;

    const { data, error } = await resend.emails.send({
      from,
      to: [recipient],
      replyTo: finalReplyTo,
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error("[Email Resend] Error devuelto por Resend:", error);
      return { success: false, error: error.message };
    }

    console.log(`[Email Resend] Correo enviado exitosamente a ${toEmail} (Reply-To: ${finalReplyTo}). ID: ${data?.id}`);
    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Email Resend] Excepción de red al enviar correo:", error);
    return { success: false, error: error?.message || "Error de red" };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Plantilla: Registro Recibido
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function sendReceivedEmail(
  toEmail: string,
  toName: string,
  regId?: string,
  type?: string
) {
  const rendered = renderRegistrationReceivedEmail({
    toName,
    regId,
    type,
  });

  return sendEmail({
    toEmail,
    toName,
    subject: rendered.subject,
    htmlContent: rendered.html,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. Plantilla: Registro Aprobado
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function sendAcceptedEmail(
  toEmail: string,
  toName: string,
  type?: string,
  details?: { talkTitle?: string; organization?: string }
) {
  const rendered = renderRegistrationApprovedEmail({
    toName,
    type,
    talkTitle: details?.talkTitle,
    organization: details?.organization,
  });

  return sendEmail({
    toEmail,
    toName,
    subject: rendered.subject,
    htmlContent: rendered.html,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. Plantilla: Lista de Espera
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function sendWaitlistEmail(
  toEmail: string,
  toName: string,
  type?: string
) {
  const rendered = renderWaitlistEmail({
    toName,
    type,
  });

  return sendEmail({
    toEmail,
    toName,
    subject: rendered.subject,
    htmlContent: rendered.html,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. Plantilla: Rechazado / No Aceptado
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function sendRejectedEmail(
  toEmail: string,
  toName: string,
  type?: string
) {
  const rendered = renderRejectedEmail({
    toName,
    type,
  });

  return sendEmail({
    toEmail,
    toName,
    subject: rendered.subject,
    htmlContent: rendered.html,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. Plantilla: Promovido de Lista de Espera
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function sendPromotedEmail(
  toEmail: string,
  toName: string,
  type?: string,
  details?: { talkTitle?: string; organization?: string }
) {
  const rendered = renderWaitlistPromotedEmail({
    toName,
    type,
    talkTitle: details?.talkTitle,
    organization: details?.organization,
  });

  return sendEmail({
    toEmail,
    toName,
    subject: rendered.subject,
    htmlContent: rendered.html,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. Aviso / Comunicado Personalizado
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function sendNoticeEmail({
  toEmail,
  toName,
  subject,
  message,
  actionUrl,
  actionText,
}: {
  toEmail: string;
  toName: string;
  subject: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}) {
  const rendered = renderCustomNoticeEmail({
    toName,
    subject,
    messageContent: message,
    actionUrl,
    actionText,
  });

  return sendEmail({
    toEmail,
    toName,
    subject: rendered.subject,
    htmlContent: rendered.html,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. Sincronización con Resend Audience / Contacts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function addContactToAudience(
  email: string,
  firstName?: string,
  lastName?: string
) {
  const resend = getResendClient();
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!resend || !audienceId) {
    return null;
  }

  try {
    const { data, error } = await resend.contacts.create({
      email,
      firstName,
      lastName,
      audienceId,
      unsubscribed: false,
    });

    if (error) {
      console.warn("[Resend Audience] Error al registrar contacto:", error.message);
      return null;
    }

    console.log(`[Resend Audience] Contacto registrado en audiencia ${audienceId}: ${email}`);
    return data;
  } catch (err: unknown) {
    const error = err as Error;
    console.warn("[Resend Audience] Excepción al registrar contacto:", error.message);
    return null;
  }
}
