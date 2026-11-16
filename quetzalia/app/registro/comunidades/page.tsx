"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { saveRegistration } from "@/lib/firebase";
import { ConsentRecord, Registration } from "@/lib/types";
import ConsentSection, { CURRENT_CONSENT_VERSION } from "@/components/ConsentSection";
import Greca from "@/components/ui/Greca";

export default function RegistroComunidadesPage() {
  const { user, loginWithGoogle, logout } = useAuth();

  const [organization, setOrganization] = useState(""); // Nombre de la comunidad
  const [fullName, setFullName] = useState(""); // Representante
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [memberCount, setMemberCount] = useState(""); // Número aproximado de integrantes
  const [talkMaterials, setTalkMaterials] = useState(""); // Descripción / actividades

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

    if (!finalEmail || !finalFullName || !organization.trim() || !phone.trim() || !talkMaterials.trim()) {
      setErrorMsg("Por favor completa los campos requeridos.");
      setSubmitting(false);
      return;
    }

    try {
      setSubmitting(true);
      const reg = await saveRegistration(
        {
          userId: currentUser.uid,
          type: "community",
          fullName: finalFullName,
          organization: organization.trim(),
          email: finalEmail,
          phone: phone.trim(),
          talkTitle: memberCount ? `Comunidad (~${memberCount} integrantes)` : "Comunidad STEM",
          talkMaterials: `Número aproximado de integrantes: ${memberCount || "No especificado"}.\nDescripción y actividades: ${talkMaterials.trim()}`,
          consent,
          consentVersion: CURRENT_CONSENT_VERSION,
          consentTimestamp: new Date().toISOString(),
        },
        currentUser.uid
      );
      setSubmittedReg(reg);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Ocurrió un error al registrar la comunidad. Intenta de nuevo.");
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
              ¡Comunidad Registrada con Éxito!
            </h1>
            <p className="lead text-sm">
              Hemos recibido el registro de <strong>{submittedReg.organization}</strong> para ser parte de las redes aliadas de Quetzalia 2027.
            </p>

            <div className="p-4 bg-[var(--bg-alt)] border border-[var(--rule)] text-left text-sm space-y-2">
              <p><strong>Folio / ID:</strong> <span className="font-mono text-xs">{submittedReg.id}</span></p>
              <p><strong>Estatus:</strong> <span className="px-2 py-0.5 font-bold uppercase text-xs bg-amber-100 text-amber-900 border border-amber-300">Pendiente de revisión</span></p>
              <p><strong>Comunidad:</strong> {submittedReg.organization}</p>
              <p><strong>Representante:</strong> {submittedReg.fullName} ({submittedReg.email})</p>
              <p><strong>Fecha y hora:</strong> {new Date(submittedReg.createdAt).toLocaleString("es-MX")}</p>
            </div>

            <div className="form-legal-box text-left text-xs space-y-2">
              <p className="font-bold text-[var(--head)]">Próximos pasos:</p>
              <p>
                El comité organizador revisará la postulación para coordinar la asignación de espacios de difusión, dinámicas conjuntas y gafetes de acreditación para las integrantes del colectivo.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/mi-registro" className="btn btn-primary text-sm">
                Consultar Estatus
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
          <p className="eyebrow">Redes y Colectivos</p>
        </div>

        {/* Información a lo largo de la página en layout centrado al 80% */}
        <div className="my-10 space-y-6 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display text-[var(--head)] leading-snug">
            La fuerza viva de construir en colectivo
          </h2>
          <p className="text-base sm:text-lg text-[var(--fg)] leading-relaxed">
            Las redes estudiantiles, grupos de robótica, clubes de ciencia y colectivos de mujeres tecnólogas son el corazón más activo de la equidad en nuestras universidades. Son los espacios donde la duda se transforma en proyecto compartido, donde se derriban barreras y donde florecen vocaciones científicas que cambian vidas.
          </p>
          <blockquote className="my-6 p-5 sm:p-6 bg-[var(--bg-alt)]/60 border border-[var(--rule)] border-l-4 border-l-[var(--accent)] text-left shadow-xs">
            <p className="text-base sm:text-lg text-[var(--head)] font-medium leading-relaxed italic">
              “Para Quetzalia 2027 y la FES Acatlán de la UNAM, es un honor inmenso abrir las puertas a su comunidad para visibilizar sus causas, compartir proyectos y tejer una alianza interinstitucional que perdure en el tiempo.”
            </p>
          </blockquote>
        </div>

        {/* Banner de inicio de sesión / autocompletado */}
        {!user ? (
          <div className="p-4 bg-[var(--bg-alt)]/60 border border-[var(--rule)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left mb-8 max-w-3xl mx-auto shadow-xs">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-[var(--head)]">
                ¿Prefieres autocompletar con Google?
              </p>
              <p className="text-xs text-[var(--fg)] opacity-85">
                Inicia sesión para vincular tu nombre y correo oficial en un solo clic.
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
          <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs flex flex-wrap items-center justify-between gap-2 mb-8 max-w-3xl mx-auto">
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
          <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4">
            <h2 className="text-lg font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              Datos de la Comunidad
            </h2>

            <div>
              <label className="form-label" htmlFor="organization">
                Nombre de la Comunidad o Colectivo *
              </label>
              <input
                id="organization"
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Ej. Mujeres en IA FES Acatlán / Club de Robótica STEM"
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="fullName">
                  Nombre de la Representante / Coordinadora *
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={displayFullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nombre completo"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="memberCount">
                  Número Aproximado de Integrantes *
                </label>
                <input
                  id="memberCount"
                  type="number"
                  min="1"
                  required
                  value={memberCount}
                  onChange={(e) => setMemberCount(e.target.value)}
                  placeholder="Ej. 25"
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="email">
                  Correo Electrónico de Contacto *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={displayEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="phone">
                  Teléfono Móvil (WhatsApp de contacto) *
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
            </div>

            <div>
              <label className="form-label" htmlFor="talkMaterials">
                Breve Semblanza y Actividades de la Comunidad *
              </label>
              <textarea
                id="talkMaterials"
                rows={4}
                required
                value={talkMaterials}
                onChange={(e) => setTalkMaterials(e.target.value)}
                placeholder="Misión del grupo, redes sociales o proyectos en los que trabajan."
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
                ? "Registrando comunidad..."
                : !user
                ? "Registrar Comunidad con Google →"
                : "Confirmar Registro de Comunidad →"}
            </button>
          </div>
        </form>
      </main>

      <Greca />
      <footer className="border-t border-[var(--rule)] py-6 text-center text-xs opacity-75">
        Quetzalia STEM · Red de Comunidades Aliadas
      </footer>
    </div>
  );
}
