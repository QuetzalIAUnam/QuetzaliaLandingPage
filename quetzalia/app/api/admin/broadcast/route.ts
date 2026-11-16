import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminUser } from "@/lib/server-auth";
import { sendBroadcastNotice } from "@/lib/resend-broadcast";
import { renderBroadcastEmail } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/broadcast
 * Consulta el historial de broadcasts enviados y la métrica de asistentes aprobados
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

    // 1. Contar asistentes aprobados en la base de datos
    const approvedSnap = await adminDb
      .collection("registrations")
      .where("status", "==", "aprobado")
      .count()
      .get();
    const approvedCount = approvedSnap.data().count;

    // 2. Obtener historial de broadcasts enviados
    const broadcastsSnap = await adminDb
      .collection("broadcasts")
      .orderBy("sentAt", "desc")
      .limit(30)
      .get();

    const history = broadcastsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const audienceIdConfigured = Boolean(process.env.RESEND_AUDIENCE_ID?.trim());

    return NextResponse.json({
      approvedCount,
      audienceIdConfigured,
      history,
    });
  } catch (error: unknown) {
    console.error("[GET /api/admin/broadcast] Error:", error);
    return NextResponse.json(
      { error: "Error al consultar el historial de avisos generales." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/broadcast
 * Emite un aviso general o recordatorio por Broadcast a toda la audiencia de aprobados
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
    const { subject, message, html: customHtml, actionUrl, actionText, previewOnly } = body;

    if (!subject?.trim()) {
      return NextResponse.json(
        { error: "El asunto del aviso es obligatorio." },
        { status: 400 }
      );
    }

    const contentText = (message || "").trim();
    if (!contentText && !customHtml) {
      return NextResponse.json(
        { error: "El contenido o mensaje del aviso es obligatorio." },
        { status: 400 }
      );
    }

    // Modo solo vista previa
    if (previewOnly) {
      const preview = renderBroadcastEmail({
        subject: subject.trim(),
        messageContent: contentText,
        actionUrl: actionUrl?.trim() || undefined,
        actionText: actionText?.trim() || undefined,
      });

      return NextResponse.json({
        previewSubject: preview.subject,
        previewHtml: preview.html,
      });
    }

    // Contar asistentes aprobados actuales
    const approvedSnap = await adminDb
      .collection("registrations")
      .where("status", "==", "aprobado")
      .count()
      .get();
    const audienceCount = approvedSnap.data().count;

    if (audienceCount === 0) {
      return NextResponse.json(
        {
          error: "No hay ningún participante con estatus 'aprobado'. El aviso solo se envía a participantes aprobados.",
        },
        { status: 400 }
      );
    }

    // Crear y enviar el broadcast vía Resend
    const result = await sendBroadcastNotice({
      subject: subject.trim(),
      message: contentText,
      actionUrl: actionUrl?.trim() || undefined,
      actionText: actionText?.trim() || undefined,
    });

    const now = new Date().toISOString();
    const senderEmail = authCheck.user?.email || "comite@quetzalia.dev";

    // Guardar en la colección broadcasts de Firestore
    const docRef = await adminDb.collection("broadcasts").add({
      broadcastId: result.broadcastId,
      subject: subject.trim(),
      message: contentText,
      html: result.html,
      audienceCount,
      sentAt: now,
      sentBy: senderEmail,
      status: "sent",
    });

    return NextResponse.json({
      success: true,
      message: `Aviso general (Broadcast) enviado exitosamente a la audiencia aprobada (${audienceCount} asistentes).`,
      broadcastId: result.broadcastId,
      id: docRef.id,
      audienceCount,
      sentAt: now,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[POST /api/admin/broadcast] Error:", err);

    const isLimitError =
      err.message?.includes("1,000") ||
      err.message?.includes("403") ||
      err.message?.toLowerCase().includes("limit");

    return NextResponse.json(
      {
        error: isLimitError
          ? "Límite de audiencia alcanzado (1,000 contactos en plan gratuito). Es necesario limpiar la audiencia o actualizar el plan en Resend."
          : err.message || "Error al enviar el aviso general vía broadcast.",
        isLimitError,
      },
      { status: isLimitError ? 403 : 500 }
    );
  }
}
