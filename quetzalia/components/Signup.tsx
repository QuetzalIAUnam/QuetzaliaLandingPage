"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { saveRegistration } from "@/lib/firebase";
import { ConsentRecord, Registration } from "@/lib/types";
import ConsentSection, { CURRENT_CONSENT_VERSION } from "./ConsentSection";

export default function Signup() {
  const { user, registration, loading: authLoading, loginWithGoogle } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [academicLevel, setAcademicLevel] = useState("Licenciatura");
  const [majorOrArea, setMajorOrArea] = useState("");

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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [consentError, setConsentError] = useState(false);

  const displayEmail = email || user?.email || "";
  const displayFullName = fullName || user?.displayName || "";

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setErrorMsg(null);
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("No se pudo iniciar sesión con Google. Intenta nuevamente.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setConsentError(false);

    if (!consent.privacyNotice) {
      setConsentError(true);
      setErrorMsg("Es necesario aceptar el Aviso de Privacidad para reservar tu lugar.");
      return;
    }

    if (!user) {
      setErrorMsg("Debes iniciar sesión con tu cuenta de Google para completar tu registro.");
      return;
    }

    const finalEmail = (email || user.email || "").trim();
    const finalFullName = (fullName || user.displayName || "").trim();

    if (!finalEmail || !finalFullName || !organization.trim() || !majorOrArea.trim()) {
      setErrorMsg("Por favor completa los campos de tu escuela y carrera.");
      return;
    }

    try {
      setSubmitting(true);
      const reg = await saveRegistration(
        {
          userId: user.uid,
          type: "attendee",
          fullName: finalFullName,
          email: finalEmail,
          organization: organization.trim(),
          talkTitle: `${academicLevel} - ${majorOrArea.trim()}`,
          talkMaterials: `Nivel: ${academicLevel}. Carrera/Área: ${majorOrArea.trim()}`,
          consent,
          consentVersion: CURRENT_CONSENT_VERSION,
          consentTimestamp: new Date().toISOString(),
        },
        user.uid
      );
      setSubmittedReg(reg);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Ocurrió un problema al enviar tu registro. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeReg = submittedReg || registration;

  return (
    <section className="section" id="inscripcion">
      <div className="wrap stack signup">
        <div className="sec-head !mb-3">
          <p className="eyebrow">Inscripción y Convocatorias</p>
          <h2>Reserva tu lugar</h2>
          <p className="lead">
            Los registros oficiales para Quetzalia 2027 en la FES Acatlán ya están abiertos.
          </p>
        </div>

        {/* Recuadro estilo quote para otras modalidades de participación */}
        <blockquote className="w-full max-w-2xl mx-auto my-2 p-3.5 sm:p-4 bg-[var(--bg-alt)]/60 border border-[var(--rule)] border-l-4 border-l-[var(--accent)] text-center sm:text-left space-y-1.5">
          <p className="text-xs uppercase tracking-widest font-bold text-[var(--head)] flex items-center justify-center sm:justify-start gap-1.5">
            <span className="text-[var(--accent)]" aria-hidden="true">✦</span>
            ¿Buscas otra modalidad de participación?
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 text-sm text-[var(--fg)] leading-relaxed">
            <span>
              ¿Eres ponente?{" "}
              <Link
                href="/registro/speakers"
                className="underline underline-offset-4 decoration-[var(--accent)] font-semibold text-[var(--head)] hover:text-[var(--accent-text)] transition-colors"
              >
                Postula tu propuesta aquí
              </Link>
            </span>
            <span className="opacity-40 font-bold" aria-hidden="true">•</span>
            <span>
              ¿Quieres ser patrocinador?{" "}
              <Link
                href="/registro/patrocinadores"
                className="underline underline-offset-4 decoration-[var(--accent)] font-semibold text-[var(--head)] hover:text-[var(--accent-text)] transition-colors"
              >
                Convenio de marca aquí
              </Link>
            </span>
            <span className="opacity-40 font-bold" aria-hidden="true">•</span>
            <span>
              ¿Perteneces a una comunidad STEM?{" "}
              <Link
                href="/registro/comunidades"
                className="underline underline-offset-4 decoration-[var(--accent)] font-semibold text-[var(--head)] hover:text-[var(--accent-text)] transition-colors"
              >
                Suma a tu comunidad aquí
              </Link>
            </span>
          </div>
        </blockquote>

        {/* Flujo Principal: Registro de Asistente General sin salir de la página */}
        <div className="w-full max-w-2xl mx-auto text-center mt-2">
          {authLoading ? (
            <div className="py-6 text-center max-w-md mx-auto space-y-2">
              <div className="auth-spinner mx-auto" />
              <p className="text-xs text-[var(--fg)]">Verificando sesión...</p>
            </div>
          ) : !user ? (
            /* Estado 1: No autenticado -> Pide iniciar sesión con Google primero (centrado, integrado y sin separaciones excesivas) */
            <div className="my-2 py-2 text-center space-y-2.5 max-w-md mx-auto">
              <div className="space-y-1">
                <h4 className="text-xl sm:text-2xl font-display text-[var(--head)] leading-snug">
                  Inicia sesión para completar tu registro
                </h4>
                <p className="text-sm text-[var(--fg)] leading-relaxed opacity-90">
                  Para validar tu pase de acceso y vincular tu constancia digital oficial, ingresa con tu cuenta de Google:
                </p>
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="auth-btn-ghost auth-btn-lg cursor-pointer disabled:opacity-50"
                  aria-label="Acceder con Google"
                >
                  <svg className="google-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                  </svg>
                  <span className="auth-btn-text">
                    {isLoggingIn ? "Conectando..." : "Acceder con Google"}
                  </span>
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold pt-1">{errorMsg}</p>
              )}
            </div>
          ) : activeReg ? (
            /* Estado 2: Usuario autenticado con registro ya existente o recién enviado */
            <div className="w-full max-w-xl mx-auto p-8 border-2 border-[var(--head)] bg-[var(--card)] shadow-xl space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-display text-[var(--head)]">
                    ¡Lugar reservado con éxito!
                  </h4>
                  <p className="text-xs text-[var(--fg)] opacity-85">
                    Tu postulación está registrada para: <strong>{activeReg.fullName}</strong>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--rule)] text-xs space-y-1.5 font-mono text-left">
                <p><strong>Folio:</strong> {activeReg.id}</p>
                <p><strong>Modalidad:</strong> {activeReg.type === "attendee" ? "Asistente General" : activeReg.type}</p>
                <p>
                  <strong>Estatus:</strong>{" "}
                  <span className="px-2 py-0.5 font-sans font-bold uppercase text-xs bg-amber-100 text-amber-900 border border-amber-300">
                    {activeReg.status}
                  </span>
                </p>
                {activeReg.organization && <p><strong>Escuela / Inst.:</strong> {activeReg.organization}</p>}
                {activeReg.talkTitle && <p><strong>Carrera / Área:</strong> {activeReg.talkTitle}</p>}
              </div>

              <p className="text-xs text-[var(--fg)] opacity-85">
                Te notificaremos a <strong>{activeReg.email}</strong> en cuanto el comité confirme los pases de acceso.
              </p>

              <div className="pt-2 flex justify-center">
                <Link href="/mi-registro" className="btn btn-primary text-xs">
                  Consultar Mi Pase en &quot;Mi Registro&quot; →
                </Link>
              </div>
            </div>
          ) : (
            /* Estado 3: Usuario autenticado sin registro -> Muestra formulario inline sin salir de la página */
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 text-left">
              <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4">
                <h4 className="text-base font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
                  Tus Datos de Asistente
                </h4>

                <div>
                  <label className="form-label" htmlFor="attendee-name">
                    Nombre Completo *
                  </label>
                  <input
                    id="attendee-name"
                    type="text"
                    required
                    value={displayFullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Cómo aparecerá en tu gafete y constancia"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="attendee-email">
                    Correo Electrónico (vinculado a tu cuenta de Google) *
                  </label>
                  <input
                    id="attendee-email"
                    type="email"
                    required
                    value={displayEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input bg-[var(--bg-alt)]"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="attendee-org">
                    Escuela, Facultad o Institución *
                  </label>
                  <input
                    id="attendee-org"
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Ej. FES Acatlán UNAM / IPN / CCH Naucalpan / Otra"
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label" htmlFor="attendee-level">
                      Nivel de Estudios *
                    </label>
                    <select
                      id="attendee-level"
                      value={academicLevel}
                      onChange={(e) => setAcademicLevel(e.target.value)}
                      className="form-select"
                    >
                      <option value="Secundaria">Secundaria</option>
                      <option value="Bachillerato">Bachillerato / Preparatoria</option>
                      <option value="Licenciatura">Licenciatura</option>
                      <option value="Posgrado">Posgrado (Maestría / Doctorado)</option>
                      <option value="Egresada">Egresada / Profesional STEM</option>
                      <option value="Docente">Docente / Investigadora</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="attendee-major">
                      Licenciatura / Carrera o Área *
                    </label>
                    <input
                      id="attendee-major"
                      type="text"
                      required
                      value={majorOrArea}
                      onChange={(e) => setMajorOrArea(e.target.value)}
                      placeholder="Ej. Matemáticas Aplicadas y Computación"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Consentimiento expreso de tratamiento de datos personales */}
              <ConsentSection
                consent={consent}
                onChange={setConsent}
                requiredError={consentError}
                mode="attendee"
              />

              {errorMsg && (
                <div className="p-4 bg-rose-50 text-rose-800 border border-rose-400 text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-full sm:w-auto cursor-pointer"
                >
                  {submitting ? "Reservando tu lugar..." : "Confirmar Mi Registro de Asistente"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="pending text-xs text-[var(--fg)] opacity-85 mt-6">
          ¿Ya te registraste previamente? Consulta el estatus de tu postulación en cualquier momento en{" "}
          <Link href="/mi-registro" className="underline text-[var(--accent)] hover:text-[var(--head)] font-semibold">
            Mi Registro
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
