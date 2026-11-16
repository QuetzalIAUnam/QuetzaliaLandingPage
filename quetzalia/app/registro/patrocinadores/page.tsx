"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { saveRegistration } from "@/lib/firebase";
import { ConsentRecord, Registration } from "@/lib/types";
import { compressImage } from "@/lib/image-compressor";
import { uploadSponsorLogo } from "@/lib/storage-client";
import ConsentSection, { CURRENT_CONSENT_VERSION } from "@/components/ConsentSection";
import Greca from "@/components/ui/Greca";

export default function RegistroPatrocinadoresPage() {
  const { user, isAdmin, loginWithGoogle } = useAuth();

  const [organization, setOrganization] = useState("");
  const [fullName, setFullName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [talkMaterials, setTalkMaterials] = useState(""); // Propuesta / interés de patrocinio

  // Manejo de logotipo corporativo
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoStats, setLogoStats] = useState<string | null>(null);
  const [logoCompressing, setLogoCompressing] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

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

  // Selección y compresión en navegador del logotipo de patrocinador
  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setLogoStats(null);
    setLogoCompressing(true);

    try {
      const result = await compressImage(file);
      setLogoFile(result.file);
      setLogoPreview(URL.createObjectURL(result.file));
      setLogoStats(
        `Original: ${(result.originalSize / (1024 * 1024) > 1 ? (result.originalSize / (1024 * 1024)).toFixed(1) + " MB" : (result.originalSize / 1024).toFixed(0) + " KB")} → Optimizada: ${(
          result.compressedSize / 1024
        ).toFixed(0)} KB (${result.width}x${result.height}px)`
      );
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Error al procesar el logotipo corporativo.");
      e.target.value = "";
    } finally {
      setLogoCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setConsentError(false);

    if (!consent.privacyNotice) {
      setConsentError(true);
      setErrorMsg("Es obligatorio aceptar el Aviso de Privacidad Integral para continuar.");
      return;
    }

    if (!user) {
      setErrorMsg("Por seguridad, debes iniciar sesión con tu cuenta de Google antes de enviar el formulario.");
      return;
    }

    const finalEmail = displayEmail.trim();
    const finalFullName = displayFullName.trim();

    if (!finalEmail || !finalFullName || !organization.trim() || !phone.trim()) {
      setErrorMsg("Por favor completa los campos requeridos.");
      return;
    }

    try {
      setSubmitting(true);
      let uploadedLogoPath: string | undefined = undefined;

      // Subir logotipo a Storage si se adjuntó
      if (logoFile) {
        setUploadingLogo(true);
        const uploadRes = await uploadSponsorLogo(logoFile, user.uid);
        uploadedLogoPath = uploadRes.path;
      }

      const reg = await saveRegistration(
        {
          userId: user.uid,
          type: "sponsor",
          fullName: finalFullName,
          legalName: legalName.trim() || organization.trim(),
          email: finalEmail,
          phone: phone.trim(),
          organization: organization.trim(),
          talkMaterials: talkMaterials.trim(), // Notas / propuesta de patrocinio
          photoPath: uploadedLogoPath,
          consent,
          consentVersion: CURRENT_CONSENT_VERSION,
          consentTimestamp: new Date().toISOString(),
        },
        user.uid
      );
      setSubmittedReg(reg);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Ocurrió un error al registrar la solicitud de patrocinio. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
      setUploadingLogo(false);
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
              Agradecemos el interés de <strong>{submittedReg.organization}</strong> en impulsar a las mujeres en STEM en Quetzalia 2027.
            </p>

            <div className="p-4 bg-[var(--bg-alt)] border border-[var(--rule)] text-left text-sm space-y-2">
              <p><strong>Folio / ID:</strong> <span className="font-mono text-xs">{submittedReg.id}</span></p>
              <p><strong>Estatus:</strong> <span className="px-2 py-0.5 font-bold uppercase text-xs bg-amber-100 text-amber-900 border border-amber-300">Pendiente de revisión</span></p>
              <p><strong>Organización / Empresa:</strong> {submittedReg.organization}</p>
              <p><strong>Contacto registrado:</strong> {submittedReg.fullName} ({submittedReg.email})</p>
              {submittedReg.photoPath && (
                <p>
                  <strong>Logotipo corporativo:</strong>{" "}
                  <span className="text-emerald-700 font-semibold">Almacenado de forma segura (sponsors/logos/)</span>
                </p>
              )}
              <p><strong>Fecha y hora:</strong> {new Date(submittedReg.createdAt).toLocaleString("es-MX")}</p>
            </div>

            <div className="form-legal-box text-left text-xs space-y-2">
              <p className="font-bold text-[var(--head)]">Aviso Institucional sobre Marcas y Datos:</p>
              <p>
                Ningún logotipo comercial será publicado ni incorporado en materiales oficiales sin el <strong>Convenio de patrocinio y licencia de uso de marca y logotipo (Formato 06)</strong> debidamente firmado por las partes.
              </p>
              <p>
                Conforme a nuestras políticas de protección de datos, los patrocinadores por defecto <strong>NO</strong> reciben bases de datos personales de las asistentes ni fotografías de ponentes.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/mi-registro" className="btn btn-primary text-sm">
                Ver Estatus de la Alianza
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

        {isAdmin ? (
          <div className="border-2 border-[var(--head)] bg-[var(--card)] p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto shadow-xl">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              ★ Miembro del Comité Organizador
            </span>
            <h2 className="text-2xl font-display text-[var(--head)]">Acceso de Administración</h2>
            <p className="text-sm text-[var(--fg)] opacity-90 leading-relaxed">
              Tu cuenta (<strong>{user?.email}</strong>) forma parte del comité de Quetzalia. Los miembros del comité gestionan y revisan las alianzas y patrocinios desde el panel de administración.
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
          /* Autenticación SIN cuadros, con el botón idéntico al del header (solo icono y texto con destello hover) */
          <div className="my-14 py-4 text-center space-y-4 max-w-md mx-auto">
            <p className="text-sm sm:text-base text-[var(--fg)] opacity-90">
              Ingresa con una cuenta de Google para registrar y dar seguimiento a la propuesta de patrocinio:
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="auth-btn-ghost auth-btn-lg cursor-pointer"
                aria-label="Continuar con Google"
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span className="auth-btn-text">
                  Continuar con Google
                </span>
              </button>
            </div>
          </div>
        ) : (
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
                  placeholder="Ej. Tecnología y Desarrollo S.A. de C.V."
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="fullName">
                    Nombre del Representante o Contacto *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={displayFullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nombre y cargo"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="email">
                    Correo Corporativo de Contacto *
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
                  placeholder="+52 55 9876 5432"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="talkMaterials">
                  Propuesta de Apoyo, Nivel de Patrocinio o Notas
                </label>
                <textarea
                  id="talkMaterials"
                  rows={4}
                  value={talkMaterials}
                  onChange={(e) => setTalkMaterials(e.target.value)}
                  placeholder="Describe la modalidad de patrocinio de interés (financiero, en especie, mentoría, premios) y enlace o especificaciones del logotipo corporativo."
                  className="form-textarea"
                />
              </div>

              {/* Subida de Logotipo Corporativo */}
              <div className="border-t border-[var(--rule)] pt-4 mt-2">
                <label className="form-label" htmlFor="logoUpload">
                  Logotipo Corporativo Oficial (Opcional en registro inicial)
                </label>
                <p className="text-xs text-[var(--fg)] opacity-80 mb-2">
                  Formatos admitidos: JPG, PNG o WebP (hasta 15 MB). La imagen se optimiza al instante en tu navegador a máx 1200 px para reproducirse fielmente en cartelería, sitio web y acreditaciones. Su publicación está sujeta a la firma del Formato 06.
                </p>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  disabled={logoCompressing || submitting}
                  className="form-input text-xs cursor-pointer"
                />

                {logoCompressing && (
                  <div className="mt-2 text-xs font-semibold text-amber-800 animate-pulse">
                    ⚡ Optimizando logotipo corporativo...
                  </div>
                )}

                {logoPreview && !logoCompressing && (
                  <div className="mt-3 flex items-center gap-4 p-3 bg-[var(--bg-alt)] border border-[var(--rule)]">
                    <div className="relative w-20 h-16 rounded-md overflow-hidden border-2 border-[var(--accent)] shrink-0 bg-white p-1">
                      <Image
                        src={logoPreview}
                        alt="Vista previa del logotipo"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-[var(--head)]">Logotipo listo para subir</p>
                      <p className="text-[11px] opacity-75">{logoStats}</p>
                      <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                        🔒 Queda resguardado de forma privada hasta la formalización del Formato 06.
                      </p>
                    </div>
                  </div>
                )}
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
                disabled={submitting || uploadingLogo || logoCompressing}
                className="btn btn-primary w-full sm:w-auto cursor-pointer"
              >
                {uploadingLogo
                  ? "Subiendo logotipo y guardando..."
                  : submitting
                    ? "Registrando propuesta..."
                    : "Enviar Registro de Patrocinador"}
              </button>
            </div>
          </form>
        )}
      </main>

      <Greca />
      <footer className="border-t border-[var(--rule)] py-6 text-center text-xs opacity-75">
        Quetzalia STEM · Programa de Patrocinadores y Alianzas
      </footer>
    </div>
  );
}
