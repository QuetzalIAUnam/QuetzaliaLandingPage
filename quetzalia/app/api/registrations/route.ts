import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAuthUser } from "@/lib/server-auth";
import { Registration, RegistrationType, MAX_APPROVED } from "@/lib/types";
import { sendReceivedEmail } from "@/lib/email";

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

    const targetEmail = (email || authUser.email || "").trim();
    if (!targetEmail) {
      return NextResponse.json(
        { error: "El correo electrónico es obligatorio." },
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
    const regRecord: Registration = {
      id: authUser.uid,
      userId: authUser.uid,
      type,
      status: initialStatus,
      createdAt: now,
      updatedAt: now,
      email: targetEmail,
      fullName: (fullName || chosenName || legalName || authUser.name || "Participante").trim(),
      chosenName: chosenName?.trim(),
      legalName: legalName?.trim(),
      phone: phone?.trim(),
      organization: organization?.trim(),
      talkTitle: talkTitle?.trim(),
      talkMaterials: talkMaterials?.trim(),
      consent: {
        privacyNotice: Boolean(consent.privacyNotice),
        imageBasic: Boolean(consent.imageBasic),
        recording: Boolean(consent.recording),
        materials: Boolean(consent.materials),
        shareEmailWithSponsors: Boolean(consent.shareEmailWithSponsors),
        clips: Boolean(consent.clips),
        futureEditions: Boolean(consent.futureEditions),
      },
      consentVersion: consentVersion || "2027.1",
      consentTimestamp: now,
    };

    // Guardar en Firestore vía Admin SDK
    await adminDb.collection("registrations").doc(authUser.uid).set(regRecord);

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
