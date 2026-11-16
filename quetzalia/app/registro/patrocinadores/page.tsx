"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { saveRegistration } from "@/lib/firebase";
import { ConsentRecord, Registration } from "@/lib/types";
import ConsentSection, { CURRENT_CONSENT_VERSION } from "@/components/ConsentSection";
import Greca from "@/components/ui/Greca";

export default function RegistroPatrocinadoresPage() {
  const { user, loginWithGoogle, logout } = useAuth();

  const [organization, setOrganization] = useState(""); // Nombre comercial de la empresa
  const [legalName, setLegalName] = useState(""); // Razón social
  const [fullName, setFullName] = useState(""); // Representante
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [talkMaterials, setTalkMaterials] = useState(""); // Propuesta / notas de patrocinio

  const [consent, setConsent] = useState<ConsentRecord>({
    privacyNotice: false,
    imageBasic: false,
    recording: false,
    materials: false,
    shareEmailWithSponsors: false,
    clips: false,
    futureEditions: false,
  });

  const [submittedReg, setSubmittedReg] = useState<Registration | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [consentError, setConsentError] = useState(false);

  const displayEmail = email || user?.email || "";
  const displayFullName = fullName || user?.displayName || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setConsentError(false);

    if (!consent.privacyNotice) {
      setConsentError(true);
      setErrorMsg("Es obligatorio aceptar el Aviso de Privacidad Integral para continuar.");
      return;
    }

    let currentUser = user;
    if (!currentUser) {
      try {
        setSubmitting(true);
        currentUser = await loginWithGoogle();
      } catch (err: unknown) {
        console.error(err);
        setErrorMsg("Para validar el registro y generar tu folio de seguimiento, inicia sesión con Google.");
        setSubmitting(false);
        return;
      }
    }

    if (!currentUser) {
      setErrorMsg("Por seguridad, debes iniciar sesión con tu cuenta de Google antes de enviar el formulario.");
      setSubmitting(false);
      return;
    }

    const finalEmail = (email || currentUser.email || "").trim();
    const finalFullName = (fullName || currentUser.displayName || "").trim();

    if (!finalEmail || !finalFullName || !organization.trim() || !phone.trim()) {
      setErrorMsg("Por favor completa los campos requeridos.");
      setSubmitting(false);
      return;
    }

    try {
      setSubmitting(true);
      const reg = await saveRegistration(
        {
          userId: currentUser.uid,
          type: "sponsor",
          fullName: finalFullName,
          legalName: legalName.trim() || organization.trim(),
          email: finalEmail,
          phone: phone.trim(),
          organization: organization.trim(),
          talkMaterials: talkMaterials.trim(),
          consent,
          consentVersion: CURRENT_CONSENT_VERSION,
          consentTimestamp: new Date().toISOString(),
        },
        currentUser.uid
      );
      setSubmittedReg(reg);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Ocurrió un error al registrar la solicitud de patrocinio. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReg) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col">
        <header className="border-b border-[var(--rule)] py-4 px-6">
          <div className="max-w-[var(--maxw)] mx-auto flex items-center justify-between">
            <Link href="/" className="brand text-xl font-display text-[var(--head)]">
              ← Volver a Quetzal-IA
            </Link>
          </div>
        </header>
        <Greca />

        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
          <div className="border-2 border-[var(--head)] p-8 sm:p-12 bg-[var(--card)] shadow-xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl">
              ✓
            </div>
            <h1 className="text-3xl font-display text-[var(--head)]">
              ¡Propuesta de Patrocinio Registrada!
            </h1>
            <p className="lead text-sm">
              Agradecemos el compromiso de <strong>{submittedReg.organization}</strong> para impulsar el talento femenino en STEM en Quetzalia 2027.
            </p>

            <div className="p-4 bg-[var(--bg-alt)] border border-[var(--rule)] text-left text-sm space-y-2">
              <p><strong>Folio / ID:</strong> <span className="font-mono text-xs">{submittedReg.id}</span></p>
              <p><strong>Estatus:</strong> <span className="px-2 py-0.5 font-bold uppercase text-xs bg-amber-100 text-amber-900 border border-amber-300">Pendiente de revisión</span></p>
              <p><strong>Empresa:</strong> {submittedReg.organization}</p>
              <p><strong>Representante:</strong> {submittedReg.fullName} ({submittedReg.email})</p>
              <p><strong>Fecha y hora:</strong> {new Date(submittedReg.createdAt).toLocaleString("es-MX")}</p>
            </div>

            <div className="form-legal-box text-left text-xs space-y-2">
              <p className="font-bold text-[var(--head)]">Siguiente Paso Institucional:</p>
              <p>
                El comité organizador de la FES Acatlán revisará la solicitud y te contactará para formalizar el <strong>Convenio de patrocinio y licencia de uso de marca y logotipo (Formato 06)</strong>.
              </p>
              <p>
                <strong>Importante:</strong> Por política de protección legal, ningún logotipo se publica sin el convenio firmado previamente.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/mi-registro" className="btn btn-primary text-sm">
                Consultar Estatus en Mi Registro
              </Link>
              <Link href="/" className="btn btn-ghost text-sm">
                Regresar al Inicio
              </Link>
            </div>
          </div>
        </main>
        <Greca />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col">
      <header className="border-b border-[var(--rule)] py-4 px-6">
        <div className="max-w-[var(--maxw)] mx-auto flex items-center justify-between">
          <Link href="/" className="brand text-xl font-display text-[var(--head)]">
            ← Volver a Quetzal-IA
          </Link>
          <Link href="/mi-registro" className="text-xs uppercase tracking-wider font-semibold text-[var(--head)] hover:underline">
            Consultar Mi Registro
          </Link>
        </div>
      </header>
      <Greca />

      <main className="flex-1 w-[90%] md:w-[80%] mx-auto py-12">
        <div className="sec-head mb-8 mx-auto text-center">
          <p className="eyebrow">Alianzas y Patrocinios</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[var(--head)]">
            El valor estratégico de sumar fuerzas con la academia
          </h1>
        </div>

        {/* Información a lo largo de la página en layout centrado al 80% */}
        <div className="my-10 space-y-6 text-center max-w-4xl mx-auto">
          <p className="text-base sm:text-lg text-[var(--fg)] leading-relaxed">
            La transformación hacia una industria tecnológica más diversa y competitiva requiere la participación activa de empresas e instituciones comprometidas. Una alianza con Quetzalia trasciende el patrocinio tradicional: es una inversión directa en el futuro de las estudiantes de México, generando oportunidades palpables de mentoría, residencias profesionales y desarrollo de talento.
          </p>
          <blockquote className="my-6 p-5 sm:p-6 bg-[var(--bg-alt)]/60 border border-[var(--rule)] border-l-4 border-l-[var(--accent)] text-left shadow-xs">
            <p className="text-base sm:text-lg text-[var(--head)] font-medium leading-relaxed italic">
              “Para la FES Acatlán y el comité organizador de Quetzalia 2027, es un honor formalizar alianzas con organizaciones que eligen liderar con el ejemplo y co-construir un ecosistema STEM más equitativo.”
            </p>
          </blockquote>
        </div>

        {/* Banner de inicio de sesión con Google integrado */}
        {!user ? (
          <div className="p-4 bg-[var(--bg-alt)]/60 border border-[var(--rule)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left mb-8 max-w-3xl mx-auto shadow-xs">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[var(--head)]">
                ¿Prefieres autocompletar con Google?
              </p>
              <p className="text-xs text-[var(--fg)] opacity-85">
                Inicia sesión con tu cuenta corporativa o personal para autocompletar tus datos en un clic.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className="auth-btn-ghost text-xs py-2 px-4 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
              <span>Autocompletar con Google</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs flex flex-wrap items-center justify-between gap-2 mb-8 max-w-3xl mx-auto shadow-xs">
            <span>Conectado como <strong>{user.displayName || user.email}</strong> ({user.email})</span>
            <button
              type="button"
              onClick={() => logout()}
              className="underline text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer"
            >
              Cambiar cuenta
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          {/* Aviso de marca y protección de datos para patrocinadores */}
          <div className="form-legal-box text-sm">
            <p className="font-semibold text-[var(--head)] mb-1">
              📌 Términos de Vinculación y Protección de Datos:
            </p>
            <p className="opacity-90">
              No se publicará ningún logotipo sin el <strong>Convenio de patrocinio y licencia de uso de marca y logotipo (Formato 06)</strong> firmado previamente. Asimismo, por política estricta de privacidad, los patrocinadores no reciben bases de datos personales ni fotos privadas de speakers.
            </p>
          </div>

          <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4">
            <h2 className="text-lg font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              Datos de la Empresa o Institución
            </h2>

            <div>
              <label className="form-label" htmlFor="organization">
                Nombre de la Empresa u Organización *
              </label>
              <input
                id="organization"
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Ej. TechCorp México / Fundación STEM"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="legalName">
                Razón Social o Denominación Legal (para convenios)
              </label>
              <input
                id="legalName"
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Ej. Tecnologías Innovadoras S.A. de C.V."
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="fullName">
                  Nombre de la Representante / Enlace *
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={displayFullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nombre de contacto"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="email">
                  Correo Electrónico Corporativo / Contacto *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={displayEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contacto@empresa.com"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="phone">
                Teléfono de Contacto Directo *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 55 1234 5678"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="talkMaterials">
                Propuesta o Modalidad de Interés de Patrocinio
              </label>
              <textarea
                id="talkMaterials"
                rows={3}
                value={talkMaterials}
                onChange={(e) => setTalkMaterials(e.target.value)}
                placeholder="Indica si te interesa patrocinio de espacios, becas, mentorías, talleres técnicos, etc."
                className="form-textarea"
              />
            </div>
          </div>

          {/* Consentimientos */}
          <ConsentSection
            consent={consent}
            onChange={setConsent}
            requiredError={consentError}
          />

          {errorMsg && (
            <div className="p-4 bg-rose-50 text-rose-800 border border-rose-400 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full sm:w-auto cursor-pointer"
            >
              {submitting
                ? "Registrando..."
                : !user
                ? "Continuar Registro con Google →"
                : "Enviar Propuesta de Patrocinio →"}
            </button>
          </div>
        </form>
      </main>

      <Greca />
      <footer className="border-t border-[var(--rule)] py-6 text-center text-xs opacity-75">
        Quetzalia 2027 · Red de Patrocinadores y Alianzas STEM · FES Acatlán UNAM
      </footer>
    </div>
  );
}
