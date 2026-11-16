"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { saveRegistration } from "@/lib/firebase";
import { ConsentRecord, Registration } from "@/lib/types";
import ConsentSection, { CURRENT_CONSENT_VERSION } from "@/components/ConsentSection";
import Greca from "@/components/ui/Greca";

export default function RegistroAsistentesPage() {
  const { user, loginWithGoogle, logout } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState(""); // Escuela / Institución
  const [academicLevel, setAcademicLevel] = useState("Licenciatura");
  const [majorOrArea, setMajorOrArea] = useState(""); // Licenciatura / Carrera o área

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
      setErrorMsg("Es necesario aceptar el Aviso de Privacidad para reservar tu lugar.");
      return;
    }

    let currentUser = user;
    if (!currentUser) {
      try {
        setSubmitting(true);
        currentUser = await loginWithGoogle();
      } catch (err: unknown) {
        console.error(err);
        setErrorMsg("Para registrar tu pase de asistencia, por favor inicia sesión con tu cuenta de Google.");
        setSubmitting(false);
        return;
      }
    }

    if (!currentUser) {
      setErrorMsg("Para registrar tu pase de asistencia, por favor inicia sesión con tu cuenta de Google.");
      setSubmitting(false);
      return;
    }

    const finalEmail = (email || currentUser.email || "").trim();
    const finalFullName = (fullName || currentUser.displayName || "").trim();

    if (!finalEmail || !finalFullName || !organization.trim() || !majorOrArea.trim()) {
      setErrorMsg("Por favor completa los campos de tu escuela y carrera.");
      setSubmitting(false);
      return;
    }

    try {
      setSubmitting(true);
      const reg = await saveRegistration(
        {
          userId: currentUser.uid,
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
        currentUser.uid
      );
      setSubmittedReg(reg);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Ocurrió un error al procesar tu registro. Por favor intenta de nuevo.");
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
              ¡Lugar Reservado con Éxito!
            </h1>
            <p className="lead text-sm">
              Tu solicitud de registro para asistir a Quetzalia 2027 ha sido recibida y está en proceso de asignación de pase.
            </p>

            <div className="p-4 bg-[var(--bg-alt)] border border-[var(--rule)] text-left text-sm space-y-2 font-mono">
              <p><strong>Folio / ID:</strong> {submittedReg.id}</p>
              <p><strong>Estatus:</strong> <span className="px-2 py-0.5 font-bold uppercase text-xs bg-amber-100 text-amber-900 border border-amber-300">Pendiente de confirmación</span></p>
              <p><strong>Nombre:</strong> {submittedReg.fullName}</p>
              <p><strong>Correo:</strong> {submittedReg.email}</p>
              <p><strong>Institución:</strong> {submittedReg.organization}</p>
              <p><strong>Fecha y hora:</strong> {new Date(submittedReg.createdAt).toLocaleString("es-MX")}</p>
            </div>

            <p className="text-xs text-[var(--fg)] opacity-85">
              Te avisaremos por correo electrónico en cuanto tu lugar sea confirmado. Podrás descargar tu pase de acceso y gafete en &quot;Mi Registro&quot;.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/mi-registro" className="btn btn-primary text-sm">
                Ir a Mi Portal de Registro
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

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        <div className="sec-head mb-8">
          <p className="eyebrow">Asistencia General</p>
          <h1 className="text-3xl sm:text-4xl font-display text-[var(--head)]">
            Registro de Asistentes
          </h1>
          <p className="lead">
            Aparta tu lugar para asistir a las conferencias, talleres y paneles del encuentro Quetzalia 2027 en la FES Acatlán.
          </p>
        </div>

        {/* Banner de inicio de sesión con Google integrado */}
        {!user ? (
          <div className="p-4 bg-[var(--bg-alt)]/60 border border-[var(--rule)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left mb-8 shadow-xs">
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
          <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs flex flex-wrap items-center justify-between gap-2 mb-8 shadow-xs">
            <span>Conectada como <strong>{user.displayName || user.email}</strong> ({user.email})</span>
            <button
              type="button"
              onClick={() => logout()}
              className="underline text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer"
            >
              Cambiar cuenta
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4">
            <h2 className="text-lg font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
              Datos de la Asistente
            </h2>

            <div>
              <label className="form-label" htmlFor="fullName">
                Nombre Completo *
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={displayFullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Cómo aparecerá en tu gafete y constancia"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="email">
                Correo Electrónico *
              </label>
              <input
                id="email"
                type="email"
                required
                value={displayEmail}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu-correo@ejemplo.com"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="organization">
                Escuela, Facultad o Institución *
              </label>
              <input
                id="organization"
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Ej. FES Acatlán UNAM / IPN / CCH Naucalpan"
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="academicLevel">
                  Nivel de Estudios *
                </label>
                <select
                  id="academicLevel"
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
                <label className="form-label" htmlFor="majorOrArea">
                  Licenciatura / Carrera o Área *
                </label>
                <input
                  id="majorOrArea"
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

          {/* Consentimientos */}
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
              {submitting
                ? "Reservando tu lugar..."
                : !user
                ? "Reservar Lugar con Google →"
                : "Confirmar Mi Registro de Asistente →"}
            </button>
          </div>
        </form>
      </main>

      <Greca />
      <footer className="border-t border-[var(--rule)] py-6 text-center text-xs opacity-75">
        Quetzalia 2027 · Encuentro de Mujeres en STEM · FES Acatlán UNAM
      </footer>
    </div>
  );
}
