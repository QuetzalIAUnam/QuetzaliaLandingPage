"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { saveRegistration } from "@/lib/firebase";
import { ConsentRecord, Registration } from "@/lib/types";
import ConsentSection, { CURRENT_CONSENT_VERSION } from "@/components/ConsentSection";
import ExistingRegistrationNotice from "@/components/ExistingRegistrationNotice";
import Greca from "@/components/ui/Greca";

export default function RegistroAsistentesPage() {
  const { user, registration, isAdmin, loginWithGoogle, logout } = useAuth();

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

    if (!user) {
      setErrorMsg("Para registrar tu pase de asistencia, por favor inicia sesión con tu cuenta de Google.");
      return;
    }

    const finalEmail = displayEmail.trim();
    const finalFullName = displayFullName.trim();

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
          organization: organization.trim(), // Escuela / Facultad
          talkTitle: `${academicLevel} - ${majorOrArea.trim()}`, // Nivel y Carrera
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
      setErrorMsg("Ocurrió un problema al enviar tu registro. Por favor verifica tu conexión e intenta de nuevo.");
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
              ¡Muchas gracias, <strong>{submittedReg.fullName}</strong>! Tu registro de asistencia para <strong>Quetzalia 2027</strong> ha sido recibido.
            </p>

            <div className="p-4 bg-[var(--bg-alt)] border border-[var(--rule)] text-left text-sm space-y-2">
              <p><strong>Folio de registro:</strong> <span className="font-mono text-xs">{submittedReg.id}</span></p>
              <p><strong>Estatus:</strong> <span className="px-2 py-0.5 font-bold uppercase text-xs bg-amber-100 text-amber-900 border border-amber-300">Pendiente de confirmación</span></p>
              <p><strong>Escuela / Institución:</strong> {submittedReg.organization}</p>
              <p><strong>Nivel y Carrera:</strong> {submittedReg.talkTitle}</p>
              <p><strong>Correo de confirmación:</strong> {submittedReg.email}</p>
              <p><strong>Fecha y hora:</strong> {new Date(submittedReg.createdAt).toLocaleString("es-MX")}</p>
            </div>

            <p className="text-xs text-[var(--fg)] opacity-85">
              Te enviaremos los detalles del programa y tu pase de acceso a tu correo conforme se acerque la fecha del encuentro en la FES Acatlán.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/mi-registro" className="btn btn-primary text-sm">
                Ver Mi Pase en &quot;Mi Registro&quot;
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

        {isAdmin ? (
          <div className="border-2 border-[var(--head)] bg-[var(--card)] p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto shadow-xl">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              ★ Miembro del Comité Organizador
            </span>
            <h2 className="text-2xl font-display text-[var(--head)]">Acceso de Administración</h2>
            <p className="text-sm text-[var(--fg)] opacity-90 leading-relaxed">
              Tu cuenta (<strong>{user?.email}</strong>) forma parte del comité de Quetzalia. Los miembros del comité no deben registrarse como asistentes para no ocupar los 400 lugares de cupo estudiantil.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/admin" className="btn btn-primary text-xs">
                Ir al Dashboard de Administración →
              </Link>
              <Link href="/mi-registro" className="btn btn-ghost text-xs">
                Ver Mi Perfil de Comité
              </Link>
            </div>
          </div>
        ) : !user ? (
          <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center p-8 sm:p-10 border-2 border-[var(--accent)] bg-[var(--card)] shadow-lg space-y-5 my-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-[var(--bg-alt)] border-2 border-[var(--accent)] flex items-center justify-center shadow-xs">
              <svg className="google-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-display text-[var(--head)]">
                Inicia Sesión para Registrarte
              </h2>
              <p className="text-sm text-[var(--fg)] leading-relaxed opacity-90">
                Para validar tu pase de acceso y que puedas consultar tu constancia en línea, ingresa con tu cuenta de Google:
              </p>
            </div>

            <div className="w-full flex justify-center pt-2">
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="btn btn-primary text-sm inline-flex items-center justify-center gap-3 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <svg className="google-icon flex-shrink-0" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>Acceder con Google</span>
              </button>
            </div>
          </div>
        ) : registration && !submittedReg ? (
          <ExistingRegistrationNotice
            registration={registration}
            requestedType="attendee"
            onLogout={logout}
          />
        ) : (
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
                  placeholder="Ej. FES Acatlán UNAM / CCH Naucalpan / IPN / Otra"
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

            {/* Aviso de Privacidad Simplificado para Asistentes */}
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

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full sm:w-auto cursor-pointer"
              >
                {submitting ? "Reservando lugar..." : "Completar Registro de Asistencia"}
              </button>
            </div>
          </form>
        )}
      </main>

      <Greca />
      <footer className="border-t border-[var(--rule)] py-6 text-center text-xs opacity-75">
        Quetzalia STEM · Encuentro de Mujeres en Ciencia y Tecnología
      </footer>
    </div>
  );
}
