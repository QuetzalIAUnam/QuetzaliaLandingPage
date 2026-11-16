import { Resend } from "resend";
import { renderBroadcastEmail } from "./email-templates";

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

/**
 * Agrega o actualiza un contacto en la audiencia de Resend cuando un participante es APROBADO o PROMOVIDO.
 * La audiencia SOLO contiene participantes con estatus APROBADO.
 * Nunca lanza excepciones que interrumpan la aprobación.
 */
export async function syncApprovedContact({
  email,
  firstName,
}: {
  email: string;
  firstName?: string;
}): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!audienceId) {
    console.warn("[Resend Audience] RESEND_AUDIENCE_ID no configurada en variables de entorno.");
    return {
      success: false,
      error: "RESEND_AUDIENCE_ID no configurada en variables de entorno.",
    };
  }

  const resend = getResendClient();
  if (!resend) {
    console.warn(`[Resend Audience] RESEND_API_KEY no configurada. Simulando sincronización para ${email}`);
    return { success: true, contactId: "simulated-contact-id" };
  }

  try {
    // 1. Intentar crear el contacto
    const createRes = await resend.contacts.create({
      audienceId,
      email: email.trim().toLowerCase(),
      firstName: firstName?.trim(),
      unsubscribed: false,
    });

    if (createRes.data?.id) {
      console.log(`[Resend Audience] Contacto creado exitosamente en audiencia: ${email} (ID: ${createRes.data.id})`);
      return { success: true, contactId: createRes.data.id };
    }

    // 2. Si falló (por ejemplo ya existía), intentar actualizarlo
    console.log(`[Resend Audience] Contacto ya registrado o respuesta sin ID, intentando actualizar ${email}...`);
    try {
      const updateRes = await resend.contacts.update({
        audienceId,
        email: email.trim().toLowerCase(),
        firstName: firstName?.trim(),
        unsubscribed: false,
      });

      if (updateRes.data?.id) {
        return { success: true, contactId: updateRes.data.id };
      }
    } catch {
      // Ignorar fallo de update y probar get
    }

    // 3. Consultar ID existente
    try {
      const getRes = await resend.contacts.get({
        audienceId,
        email: email.trim().toLowerCase(),
      });
      if (getRes.data?.id) {
        return { success: true, contactId: getRes.data.id };
      }
    } catch {
      // Ignorar fallo de get
    }

    return {
      success: false,
      error: createRes.error?.message || "No se pudo sincronizar el contacto con Resend.",
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Resend Audience] Error al sincronizar contacto:", error);
    return { success: false, error: error?.message || "Error al conectar con Resend." };
  }
}

/**
 * Elimina o desuscribe a un contacto de la audiencia de Resend cuando su estatus pasa a RECHAZADO.
 * Nunca lanza excepciones que interrumpan el rechazo.
 */
export async function removeApprovedContact({
  email,
  contactId,
}: {
  email: string;
  contactId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!audienceId) {
    return { success: false, error: "RESEND_AUDIENCE_ID no configurada" };
  }

  const resend = getResendClient();
  if (!resend) {
    return { success: true };
  }

  try {
    // 1. Si tenemos el ID del contacto en Resend, eliminarlo por ID
    if (contactId) {
      try {
        await resend.contacts.remove({
          audienceId,
          id: contactId,
        });
        console.log(`[Resend Audience] Contacto eliminado por ID ${contactId} de la audiencia.`);
        return { success: true };
      } catch (err) {
        console.warn(`[Resend Audience] No se pudo eliminar por ID ${contactId}, intentando por email...`, err);
      }
    }

    // 2. Intentar eliminar por email
    try {
      await resend.contacts.remove({
        audienceId,
        email: email.trim().toLowerCase(),
      });
      console.log(`[Resend Audience] Contacto ${email} eliminado de la audiencia.`);
      return { success: true };
    } catch (err) {
      console.warn(`[Resend Audience] Fallo al remover por email, intentando marcar como desuscrito...`, err);
    }

    // 3. Fallback: marcar como desuscrito para garantizar que no reciba correos
    await resend.contacts.update({
      audienceId,
      email: email.trim().toLowerCase(),
      unsubscribed: true,
    });

    console.log(`[Resend Audience] Contacto ${email} marcado como desuscrito.`);
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.warn("[Resend Audience] Error al desuscribir contacto:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Crea y envía un Broadcast de aviso general a toda la audiencia de participantes APROBADOS.
 * - Utiliza resend.broadcasts.create y resend.broadcasts.send
 * - No cuenta contra el límite transaccional de 100 correos al día
 */
export async function sendBroadcastNotice({
  subject,
  message,
  actionUrl,
  actionText,
}: {
  subject: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}): Promise<{ broadcastId: string; html: string }> {
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!audienceId) {
    throw new Error(
      "RESEND_AUDIENCE_ID no está configurada en las variables de entorno. Crea la audiencia 'Quetzalia' en tu dashboard de Resend y añade su ID en Vercel o en .env.local."
    );
  }

  const resend = getResendClient();
  if (!resend) {
    console.warn("[Resend Broadcast] Modo simulación activo (sin API key).");
    return {
      broadcastId: "simulated-broadcast-id",
      html: renderBroadcastEmail({ subject, messageContent: message, actionUrl, actionText }).html,
    };
  }

  const rendered = renderBroadcastEmail({
    subject,
    messageContent: message,
    actionUrl,
    actionText,
  });

  const from = process.env.RESEND_SENDER_EMAIL || "Quetzalia <registro@quetzalia.dev>";
  const replyTo = process.env.RESEND_REPLY_TO || "923475@pcpuma.acatlan.unam.mx";

  try {
    // 1. Crear el broadcast en Resend
    const createRes = await resend.broadcasts.create({
      audienceId,
      from,
      replyTo,
      subject: rendered.subject,
      html: rendered.html,
      name: `Quetzalia: ${subject.slice(0, 40)}`,
    });

    if (createRes.error || !createRes.data?.id) {
      const errMsg = createRes.error?.message || "Error al crear el broadcast en Resend";
      if (errMsg.includes("403") || errMsg.toLowerCase().includes("limit")) {
        throw new Error(
          "Límite de audiencia alcanzado (1,000 contactos en plan gratuito). Es necesario limpiar la audiencia o actualizar el plan en Resend."
        );
      }
      throw new Error(errMsg);
    }

    const broadcastId = createRes.data.id;

    // 2. Enviar el broadcast
    const sendRes = await resend.broadcasts.send(broadcastId);
    if (sendRes.error) {
      throw new Error(sendRes.error.message || "Error al disparar el envío del broadcast en Resend.");
    }

    console.log(`[Resend Broadcast] Broadcast ${broadcastId} enviado exitosamente.`);
    return {
      broadcastId,
      html: rendered.html,
    };
  } catch (err: unknown) {
    const error = err as Error;
    if (error.message?.includes("403") || error.message?.toLowerCase().includes("limit")) {
      throw new Error(
        "Límite de audiencia alcanzado (1,000 contactos en plan gratuito). Es necesario limpiar la audiencia o actualizar el plan en Resend."
      );
    }
    throw error;
  }
}
