"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { saveRegistration } from "@/lib/firebase";
import { ConsentRecord, Registration } from "@/lib/types";
import { uploadPrivateSpeakerPhoto } from "@/lib/storage-client";
import { compressImage } from "@/lib/image-compressor";
import ConsentSection, { CURRENT_CONSENT_VERSION } from "@/components/ConsentSection";
import ExistingRegistrationNotice from "@/components/ExistingRegistrationNotice";
import Greca from "@/components/ui/Greca";

const PRESET_BADGES = [
  "Google Student Ambassador",
  "Google AI Fellow",
  "Canva Ambassador",
  "Canva Educator",
  "GitHub Campus Expert",
  "Women Techmakers",
  "Microsoft Student Ambassador",
  "Investigadora / Posgrado",
  "Mención Honorífica UNAM",
];

export default function RegistroSpeakersPage() {
  const { user, registration, isAdmin, loginWithGoogle, logout } = useAuth();

  const [legalName, setLegalName] = useState("");
  const [chosenName, setChosenName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [talkType, setTalkType] = useState<"Ponencia" | "Taller">("Ponencia");
  const [talkTitle, setTalkTitle] = useState("");
  const [talkMaterials, setTalkMaterials] = useState("");

  // Ficha enriquecida / Cuéntanos más sobre ti
  const [tagline, setTagline] = useState("");
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [customBadge, setCustomBadge] = useState("");
  const [inspirationQuote, setInspirationQuote] = useState("");

  // Redes sociales y perfiles profesionales (opcionales)
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [website, setWebsite] = useState("");

  // Foto de semblanza
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoStats, setPhotoStats] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
  const [photoCompressing, setPhotoCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [consentError, setConsentError] = useState(false);

  const displayEmail = email || user?.email || "";
  const displayChosenName = chosenName || user?.displayName || "";

  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleAddCustomBadge = () => {
    const trimmed = customBadge.trim();
    if (trimmed && !selectedBadges.includes(trimmed)) {
      setSelectedBadges([...selectedBadges, trimmed]);
      setCustomBadge("");
    }
  };

  const removeBadge = (badgeToRemove: string) => {
    setSelectedBadges((prev) => prev.filter((b) => b !== badgeToRemove));
  };

  // Manejo y compresión de fotografía en el cliente
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setPhotoStats(null);
    setPhotoCompressing(true);

    try {
      // 1. Validar límite de 15 MB sin comprimir y redimensionar a máx 1200 px en milisegundos
      const result = await compressImage(file);
      setPhotoFile(result.file);
      setPhotoPreview(URL.createObjectURL(result.file));
      setPhotoStats(
        `Original: ${(result.originalSize / (1024 * 1024) > 1 ? (result.originalSize / (1024 * 1024)).toFixed(1) + " MB" : (result.originalSize / 1024).toFixed(0) + " KB")} → Optimizada: ${(
          result.compressedSize / 1024
        ).toFixed(0)} KB (${result.width}x${result.height}px)`
      );
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Error al procesar la fotografía.");
      e.target.value = "";
    } finally {
      setPhotoCompressing(false);
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
    const finalChosenName = displayChosenName.trim();

    if (!finalEmail || !legalName.trim() || !phone.trim() || !organization.trim() || !talkTitle.trim() || !talkMaterials.trim()) {
      setErrorMsg("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      setSubmitting(true);
      let uploadedPhotoPath: string | undefined = undefined;

      // Si seleccionó foto, subir a carpeta privada 'speakers/private/{userId}/photo.jpg'
      if (photoFile) {
        setUploadingPhoto(true);
        const uploadRes = await uploadPrivateSpeakerPhoto(photoFile, user.uid);
        uploadedPhotoPath = uploadRes.path;
      }

      // Filtrar redes sociales no vacías
      const cleanSocials: Record<string, string> = {};
      if (linkedin.trim()) cleanSocials.linkedin = linkedin.trim();
      if (instagram.trim()) cleanSocials.instagram = instagram.trim();
      if (tiktok.trim()) cleanSocials.tiktok = tiktok.trim();
      if (website.trim()) cleanSocials.website = website.trim();

      const reg = await saveRegistration(
        {
          userId: user.uid,
          type: "speaker",
          fullName: finalChosenName || legalName,
          chosenName: finalChosenName,
          legalName: legalName.trim(),
          email: finalEmail,
          phone: phone.trim(),
          organization: organization.trim(),
          talkType,
          talkTitle: talkTitle.trim(),
          talkMaterials: talkMaterials.trim(),
          photoPath: uploadedPhotoPath,
          tagline: tagline.trim() || undefined,
          badges: selectedBadges.length > 0 ? selectedBadges : undefined,
          inspirationQuote: inspirationQuote.trim() || undefined,
          ...(Object.keys(cleanSocials).length > 0 ? { socials: cleanSocials } : {}),
          ...(cleanSocials.linkedin ? { linkedin: cleanSocials.linkedin } : {}),
          ...(cleanSocials.instagram ? { instagram: cleanSocials.instagram } : {}),
          ...(cleanSocials.tiktok ? { tiktok: cleanSocials.tiktok } : {}),
          ...(cleanSocials.website ? { website: cleanSocials.website } : {}),
          consent,
          consentVersion: CURRENT_CONSENT_VERSION,
          consentTimestamp: new Date().toISOString(),
        },
        user.uid
      );
      setSubmittedReg(reg);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Ocurrió un error al guardar tu registro. Por favor verifica tu conexión y vuelve a intentarlo.");
    } finally {
      setSubmitting(false);
      setUploadingPhoto(false);
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
              ¡Postulación Recibida con Éxito!
            </h1>
            <p className="lead text-sm">
              Tu postulación como Ponente para <strong>Quetzalia 2027</strong> ha sido registrada y guardada en el sistema.
            </p>

            <div className="p-4 bg-[var(--bg-alt)] border border-[var(--rule)] text-left text-sm space-y-2">
              <p><strong>Folio / ID:</strong> <span className="font-mono text-xs">{submittedReg.id}</span></p>
              <p><strong>Estatus:</strong> <span className="px-2 py-0.5 font-bold uppercase text-xs bg-amber-100 text-amber-900 border border-amber-300">Pendiente de revisión</span></p>
              <p><strong>Nombre registrado:</strong> {submittedReg.chosenName || submittedReg.legalName}</p>
              <p><strong>Formato propuesto:</strong> <span className="font-semibold text-emerald-800">{submittedReg.talkType || "Ponencia"}</span></p>
              <p><strong>{submittedReg.talkType === "Taller" ? "Taller propuesto:" : "Ponencia propuesta:"}</strong> {submittedReg.talkTitle}</p>
              <p>
                <strong>Fotografía de semblanza:</strong>{" "}
                {submittedReg.photoPath ? (
                  <span className="text-emerald-700 font-semibold">
                    Almacenada de forma privada (speakers/private/)
                  </span>
                ) : (
                  <span className="opacity-70">No adjuntada en este paso</span>
                )}
              </p>
              <p><strong>Fecha y hora de registro:</strong> {new Date(submittedReg.createdAt).toLocaleString("es-MX")}</p>
              <p><strong>Versión de consentimiento:</strong> {submittedReg.consentVersion}</p>
            </div>

            <div className="form-legal-box text-left text-xs space-y-2">
              <p className="font-bold text-[var(--head)]">Garantía de Privacidad y Retiro:</p>
              <p>
                Tu fotografía permanecerá en almacenamiento privado y <strong>NO</strong> será visible públicamente en la web hasta que el comité apruebe tu ponencia y se formalice el <strong>Formato 01 (Autorización de imagen)</strong> y el <strong>Formato 02 (Licencia de ponencia)</strong>.
              </p>
              <p>
                Asimismo, cuentas con el derecho reforzado de solicitar el retiro de tu fotografía y materiales en cualquier momento, el cual se hace efectivo en un plazo máximo de <strong>72 horas</strong>.
              </p>
            </div>

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

      <main className="flex-1 w-[90%] md:w-[80%] mx-auto py-12">
        <div className="sec-head mb-8 mx-auto text-center">
          <p className="eyebrow">Convocatoria de Ponentes</p>
        </div>

        {/* Información a lo largo de la página en layout centrado al 80% */}
        <div className="my-10 space-y-6 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display text-[var(--head)] leading-snug">
            El poder transformador de compartir tu trayectoria
          </h2>
          <p className="text-base sm:text-lg text-[var(--fg)] leading-relaxed">
            La presencia de investigadoras, tecnólogas, científicas y profesionistas en el escenario es mucho más que una charla: es la prueba viva y cercana de que las mujeres lideran la vanguardia en inteligencia artificial, desarrollo de software, ciencias exactas e ingeniería.
          </p>
          <blockquote className="my-6 p-5 sm:p-6 bg-[var(--bg-alt)]/60 border border-[var(--rule)] border-l-4 border-l-[var(--accent)] text-left shadow-xs">
            <p className="text-base sm:text-lg text-[var(--head)] font-medium leading-relaxed italic">
              “Para Quetzalia 2027 y la FES Acatlán de la UNAM, es un honor invaluable recibir tu propuesta. Tu voz y experiencia tienen el poder tangible de encender vocaciones y transformar el futuro de cientos de estudiantes.”
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
              Tu cuenta (<strong>{user?.email}</strong>) forma parte del comité de Quetzalia. Los miembros del comité revisan y aprueban las propuestas de ponencias desde el panel administrativo.
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
              Ingresa con tu cuenta de Google para postular tu propuesta y dar seguimiento:
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="auth-btn-ghost auth-btn-lg cursor-pointer"
                aria-label="Postular con Google"
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span className="auth-btn-text">
                  Postular con Google
                </span>
              </button>
            </div>
          </div>
        ) : registration && !submittedReg ? (
          <ExistingRegistrationNotice
            registration={registration}
            requestedType="speaker"
            onLogout={logout}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            {/* Nota legal reforzada para Speakers */}
            <div className="form-legal-box text-sm">
              <p className="font-semibold text-[var(--head)] mb-1">
                ⚖️ Aviso Relevante para Ponentes:
              </p>
              <p className="opacity-90">
                Conforme al marco de protección legal del evento, antes de publicar tu fotografía o los contenidos de tu ponencia en los canales oficiales de Quetzalia, deberá quedar formalmente firmado el <strong>Formato 01 (Autorización de imagen, voz y nombre)</strong> y el <strong>Formato 02 (Licencia de ponencia y materiales)</strong>. El comité organizador coordina y gestiona directamente este proceso.
              </p>
            </div>
            <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4">
              <h2 className="text-lg font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
                Datos de la Ponente
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="chosenName">
                    Nombre Elegido / Profesional *
                  </label>
                  <input
                    id="chosenName"
                    type="text"
                    required
                    value={displayChosenName}
                    onChange={(e) => setChosenName(e.target.value)}
                    placeholder="Cómo deseas ser llamada y anunciada"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="legalName">
                    Nombre Legal Completo *
                  </label>
                  <input
                    id="legalName"
                    type="text"
                    required
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="Para efectos de convenios y formatos"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="form-label" htmlFor="phone">
                    Teléfono Móvil (con lada) *
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
                <label className="form-label" htmlFor="organization">
                  Institución, Universidad o Empresa *
                </label>
                <input
                  id="organization"
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Ej. UNAM / Empresa de tecnología / Proyecto personal"
                  className="form-input"
                />
              </div>

              {/* Subida de Fotografía para semblanza con compresión en navegador */}
              <div className="border-t border-[var(--rule)] pt-4 mt-2">
                <label className="form-label" htmlFor="photoUpload">
                  Fotografía de Semblanza (Opcional en postulación inicial)
                </label>
                <p className="text-xs text-[var(--fg)] opacity-80 mb-2">
                  Formatos admitidos: JPG, PNG o WebP (hasta 15 MB). La imagen se optimiza al instante en tu navegador a máx 1200 px (~180 KB) para subirse rápidamente y protegerse de forma privada.
                </p>
                <input
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  disabled={photoCompressing || submitting}
                  className="form-input text-xs cursor-pointer"
                />

                {photoCompressing && (
                  <div className="mt-2 text-xs font-semibold text-amber-800 animate-pulse">
                    ⚡ Optimizando fotografía en tu navegador...
                  </div>
                )}

                {photoPreview && !photoCompressing && (
                  <div className="mt-3 flex items-center gap-4 p-3 bg-[var(--bg-alt)] border border-[var(--rule)]">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--accent)] shrink-0">
                      <Image
                        src={photoPreview}
                        alt="Vista previa"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-[var(--head)]">Foto lista para subir</p>
                      <p className="text-[11px] opacity-75">{photoStats}</p>
                      <p className="text-[10px] text-amber-800 font-semibold mt-0.5">
                        🔒 Quedará en carpeta privada hasta la firma del Formato 01.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4">
              <h2 className="text-lg font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
                Propuesta de Ponencia o Taller
              </h2>

              {/* Selector de Modalidad: Ponencia o Taller */}
              <div>
                <label className="form-label mb-2 block">
                  Formato de la Actividad *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      talkType === "Ponencia"
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-sm"
                        : "border-[var(--rule)] bg-[var(--bg-alt)]/40 hover:border-[var(--accent)]/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="talkType"
                      value="Ponencia"
                      checked={talkType === "Ponencia"}
                      onChange={() => setTalkType("Ponencia")}
                      className="mt-1 text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    <div>
                      <p className="font-bold text-sm text-[var(--head)] flex items-center gap-1.5">
                        <span className="text-base">🎙️</span>
                        <span>Ponencia / Conferencia</span>
                      </p>
                      <p className="text-xs text-[var(--fg)] opacity-80 mt-1 leading-relaxed">
                        Charla expositiva o magistral sobre tu investigación, desarrollo o experiencia en STEM (30 a 45 min).
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      talkType === "Taller"
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-sm"
                        : "border-[var(--rule)] bg-[var(--bg-alt)]/40 hover:border-[var(--accent)]/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="talkType"
                      value="Taller"
                      checked={talkType === "Taller"}
                      onChange={() => setTalkType("Taller")}
                      className="mt-1 text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    <div>
                      <p className="font-bold text-sm text-[var(--head)] flex items-center gap-1.5">
                        <span className="text-base">🛠️</span>
                        <span>Taller Práctico / Workshop</span>
                      </p>
                      <p className="text-xs text-[var(--fg)] opacity-80 mt-1 leading-relaxed">
                        Sesión interactiva o de programación práctica donde las asistentes desarrollan un ejercicio guiado (60 a 90 min).
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="talkTitle">
                  {talkType === "Taller" ? "Título del Taller *" : "Título de la Ponencia *"}
                </label>
                <input
                  id="talkTitle"
                  type="text"
                  required
                  value={talkTitle}
                  onChange={(e) => setTalkTitle(e.target.value)}
                  placeholder={
                    talkType === "Taller"
                      ? "Ej. Taller Práctico: Construcción de Agentes de IA con Python"
                      : "Ej. Inteligencia Artificial aplicada a la Genómica y Biomedicina"
                  }
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="talkMaterials">
                  {talkType === "Taller"
                    ? "Resumen del Taller, Temario y Requerimientos de Software *"
                    : "Resumen de la Ponencia y Necesidades Técnicas *"}
                </label>
                <textarea
                  id="talkMaterials"
                  rows={4}
                  required
                  value={talkMaterials}
                  onChange={(e) => setTalkMaterials(e.target.value)}
                  placeholder={
                    talkType === "Taller"
                      ? "Describe los objetivos del taller, prerrequisitos para las asistentes (laptop, software preinstalado) y dinámicas a realizar."
                      : "Breve semblanza, objetivos de la charla, y requerimientos técnicos (proyector, audio, internet, diapositivas)."
                  }
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Ficha Enriquecida: Tu Esencia Quetzalia */}
            <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <h3 className="text-lg font-display text-[var(--head)]">
                    Tu Esencia · Cuéntanos más sobre ti
                  </h3>
                </div>
                <p className="text-xs text-[var(--fg)] opacity-85 mt-1 leading-relaxed">
                  En Quetzalia buscamos que las asistentes conecten con la persona detrás de la ciencia. Esta información dará vida a tu semblanza interactiva cuando hagan clic en tu ponencia.
                </p>
              </div>

              {/* Frase / Lema Personal */}
              <div className="space-y-1.5">
                <label className="form-label flex items-center justify-between" htmlFor="tagline">
                  <span>Una frase que te describa o inspire como mujer en STEM</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">Recomendado</span>
                </label>
                <input
                  id="tagline"
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Ej. “No llegué sola: abro camino para que volemos todas”"
                  maxLength={180}
                  className="form-input italic"
                />
                <p className="text-[11px] text-[var(--fg)] opacity-70">
                  Aparecerá destacada entre comillas en tu tarjeta de ponente. ({tagline.length}/180 caracteres)
                </p>
              </div>

              {/* Insignias y Condecoraciones */}
              <div className="space-y-2.5 pt-2 border-t border-[var(--rule)]">
                <label className="form-label block">
                  Condecoraciones, Distinciones o Embajadas (Opcionales)
                </label>
                <p className="text-xs text-[var(--fg)] opacity-75">
                  Selecciona las que apliquen a tu trayectoria para mostrarlas como insignias de honor en tu perfil:
                </p>

                {/* Chips predefinidos */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {PRESET_BADGES.map((b) => {
                    const isSelected = selectedBadges.includes(b);
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => toggleBadge(b)}
                        aria-pressed={isSelected}
                        className={`text-xs px-3 py-1.5 min-h-[36px] rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs font-semibold scale-102"
                            : "bg-[var(--bg-alt)] text-[var(--fg)] border-[var(--rule)] hover:border-[var(--accent)]/60"
                        }`}
                      >
                        <span aria-hidden="true" className="font-bold text-sm leading-none">{isSelected ? "✓" : "+"}</span>
                        <span>{b}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Agregar insignia personalizada - Responsive & accesible en mobile */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 w-full max-w-md">
                    <input
                      type="text"
                      value={customBadge}
                      onChange={(e) => setCustomBadge(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomBadge();
                        }
                      }}
                      placeholder="Otra distinción (ej. ACM Fellow)"
                      className="form-input text-xs sm:text-sm py-2 px-3 flex-1 min-w-0"
                      aria-label="Nombre de otra condecoración o insignia"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomBadge}
                      disabled={!customBadge.trim()}
                      className="shrink-0 h-10 px-3.5 sm:px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--head)] text-[var(--bg)] hover:bg-[var(--accent)] hover:text-white active:scale-95 shadow-xs whitespace-nowrap"
                      aria-label="Añadir condecoración personalizada"
                    >
                      <span className="font-bold text-sm leading-none">+</span>
                      <span>Añadir</span>
                    </button>
                  </div>
                </div>

                {/* Lista de insignias personalizadas seleccionadas */}
                {selectedBadges.filter((b) => !PRESET_BADGES.includes(b)).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                    <span className="text-[11px] text-[var(--head)] font-semibold w-full sm:w-auto mr-1">
                      Tus insignias añadidas:
                    </span>
                    {selectedBadges
                      .filter((b) => !PRESET_BADGES.includes(b))
                      .map((cb) => (
                        <span
                          key={cb}
                          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--head)] border border-[var(--accent)]/30 font-medium max-w-full"
                        >
                          <span className="truncate max-w-[200px]">🏅 {cb}</span>
                          <button
                            type="button"
                            onClick={() => removeBadge(cb)}
                            className="w-5 h-5 rounded-full hover:bg-[var(--accent)]/20 flex items-center justify-center text-rose-700 dark:text-rose-400 font-bold cursor-pointer transition-colors"
                            aria-label={`Eliminar insignia ${cb}`}
                            title={`Eliminar ${cb}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Consejo a tu yo más joven / mujeres en STEM */}
              <div className="space-y-1.5 pt-2 border-t border-[var(--rule)]">
                <label className="form-label" htmlFor="inspirationQuote">
                  Un mensaje o consejo para tu “yo” más joven o para inspirar a más mujeres en STEM
                </label>
                <textarea
                  id="inspirationQuote"
                  rows={3}
                  value={inspirationQuote}
                  onChange={(e) => setInspirationQuote(e.target.value)}
                  placeholder="Ej. “Atrévete a preguntar y no permitas que nadie defina el límite de lo que puedes construir. Tu curiosidad y tu voz merecen estar en la mesa de decisiones.”"
                  className="form-textarea text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Redes Sociales y Perfiles Profesionales (Opcionales) */}
            <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4">
              <div>
                <h3 className="text-lg font-display text-[var(--head)] border-b border-[var(--rule)] pb-2">
                  Presencia Digital y Redes Profesionales (Opcionales)
                </h3>
                <p className="text-xs text-[var(--fg)] opacity-80 mt-1">
                  Comparte tus enlaces para que la comunidad y las asistentes puedan conocer tu trayectoria e interactuar con tu trabajo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="linkedin">
                    LinkedIn (Perfil o Página)
                  </label>
                  <input
                    id="linkedin"
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/tu-perfil"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="instagram">
                    Instagram (Usuario o URL)
                  </label>
                  <input
                    id="instagram"
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Ej. @tu_usuario o https://instagram.com/..."
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="tiktok">
                    TikTok
                  </label>
                  <input
                    id="tiktok"
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="Ej. @tu_usuario o https://tiktok.com/@..."
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="website">
                    Sitio Web / Portafolio / GitHub
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://tudominio.com"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Bloque de Consentimientos Independientes */}
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
                disabled={submitting || uploadingPhoto}
                className="btn btn-primary w-full sm:w-auto cursor-pointer"
              >
                {uploadingPhoto
                  ? "Subiendo fotografía..."
                  : submitting
                    ? "Enviando postulación..."
                    : "Enviar Postulación de Ponente"}
              </button>
            </div>
          </form>
        )}
      </main>

      <Greca />
      <footer className="border-t border-[var(--rule)] py-6 text-center text-xs opacity-75">
        Quetzalia STEM · FES Acatlán · Convocatoria Oficial
      </footer>
    </div>
  );
}
