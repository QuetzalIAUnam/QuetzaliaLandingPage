import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAuthUser } from "@/lib/server-auth";
import { Registration, RegistrationType, MAX_APPROVED } from "@/lib/types";
import { sendReceivedEmail } from "@/lib/email";

function sanitizeField(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function sanitizeUrl(url?: unknown): string | undefined {
  if (typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return undefined;
  }
  return trimmed.slice(0, 500);
}

export async function POST(req: Request) {
  try {
    const authUser = await verifyAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión con Google para enviar el registro." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      type,
      fullName,
      chosenName,
      legalName,
      email,
      phone,
      organization,
      talkTitle,
      talkMaterials,
      consent,
      consentVersion,
    } = body;

    // Validación de campos obligatorios en el servidor
    const validTypes: RegistrationType[] = ["speaker", "sponsor", "community", "attendee"];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Tipo de registro inválido (speaker, sponsor, community, attendee)." },
        { status: 400 }
      );
    }

    if (!consent || !consent.privacyNotice) {
      return NextResponse.json(
        { error: "Es obligatorio aceptar el Aviso de Privacidad Integral." },
        { status: 400 }
      );
    }

    const targetEmail = sanitizeField(email || authUser.email || "", 120);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!targetEmail || !emailRegex.test(targetEmail)) {
      return NextResponse.json(
        { error: "El correo electrónico proporcionado no tiene un formato válido." },
        { status: 400 }
      );
    }

    // Verificar cupo actual de aprobados
    const approvedSnapshot = await adminDb
      .collection("registrations")
      .where("status", "==", "aprobado")
      .count()
      .get();
    const currentApproved = approvedSnapshot.data().count;

    // Si ya se superó MAX_APPROVED, entra directo a lista_espera, de lo contrario a pendiente
    const initialStatus = currentApproved >= MAX_APPROVED ? "lista_espera" : "pendiente";

    const now = new Date().toISOString();
    const rawSocials = {
      linkedin: sanitizeUrl(body.socials?.linkedin || body.linkedin),
      instagram: sanitizeUrl(body.socials?.instagram || body.instagram),
      tiktok: sanitizeUrl(body.socials?.tiktok || body.tiktok),
      twitter: sanitizeUrl(body.socials?.twitter || body.twitter),
      website: sanitizeUrl(body.socials?.website || body.website),
    };
    const safeSocials: Record<string, string> = {};
    for (const [k, v] of Object.entries(rawSocials)) {
      if (typeof v === "string" && v.trim()) {
        safeSocials[k] = v.trim();
      }
    }

    const regRecord: Registration = {
      id: authUser.uid,
      userId: authUser.uid,
      type,
      status: initialStatus,
      createdAt: now,
      updatedAt: now,
      email: targetEmail,
      fullName: sanitizeField(fullName || chosenName || legalName || authUser.name || "Participante", 120),
      chosenName: sanitizeField(chosenName, 120) || undefined,
      legalName: sanitizeField(legalName, 120) || undefined,
      phone: sanitizeField(phone, 30) || undefined,
      organization: sanitizeField(organization, 200) || undefined,
      talkTitle: sanitizeField(talkTitle, 250) || undefined,
      talkMaterials: sanitizeField(talkMaterials, 4000) || undefined,
      photoPath: typeof body.photoPath === "string" ? sanitizeField(body.photoPath, 500) : undefined,
      logoPath: typeof body.logoPath === "string" ? sanitizeField(body.logoPath, 500) : undefined,
      ...(Object.keys(safeSocials).length > 0 ? { socials: safeSocials } : {}),
      ...(safeSocials.linkedin ? { linkedin: safeSocials.linkedin } : {}),
      ...(safeSocials.instagram ? { instagram: safeSocials.instagram } : {}),
      ...(safeSocials.tiktok ? { tiktok: safeSocials.tiktok } : {}),
      ...(safeSocials.twitter ? { twitter: safeSocials.twitter } : {}),
      ...(safeSocials.website ? { website: safeSocials.website } : {}),
      consent: {
        privacyNotice: Boolean(consent.privacyNotice),
        imageBasic: Boolean(consent.imageBasic),
        recording: Boolean(consent.recording),
        materials: Boolean(consent.materials),
        shareEmailWithSponsors: Boolean(consent.shareEmailWithSponsors),
        clips: Boolean(consent.clips),
        futureEditions: Boolean(consent.futureEditions),
      },
      consentVersion: sanitizeField(consentVersion || "2027.1", 20),
      consentTimestamp: now,
    };

    // Guardar en Firestore vía Admin SDK (usando merge para preservar fotos u otros datos)
    await adminDb.collection("registrations").doc(authUser.uid).set(regRecord, { merge: true });

    // Enviar correo de confirmación de recibido en segundo plano
    sendReceivedEmail(
      regRecord.email,
      regRecord.chosenName || regRecord.fullName,
      regRecord.id,
      regRecord.type
    ).catch((err) => console.error("Error al enviar email de confirmación:", err));

    return NextResponse.json({ success: true, registration: regRecord }, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/registrations] Error:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el registro." },
      { status: 500 }
    );
  }
}
