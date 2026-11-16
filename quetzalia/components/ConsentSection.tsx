"use client";

import React from "react";
import Link from "next/link";
import { ConsentRecord } from "@/lib/types";

interface ConsentSectionProps {
  consent: ConsentRecord;
  onChange: (updated: ConsentRecord) => void;
  requiredError?: boolean;
  mode?: "full" | "attendee";
}

export const CURRENT_CONSENT_VERSION = "2027.1";

export default function ConsentSection({
  consent,
  onChange,
  requiredError = false,
  mode = "full",
}: ConsentSectionProps) {
  const handleToggle = (key: keyof ConsentRecord) => {
    onChange({
      ...consent,
      [key]: !consent[key],
    });
  };

  if (mode === "attendee") {
    return (
      <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4">
        <div className="border-b border-[var(--rule)] pb-3">
          <h3 className="text-lg font-display text-[var(--head)]">
            Aviso de Privacidad y Consentimiento de Asistencia
          </h3>
          <p className="text-xs text-[var(--fg)] opacity-80 mt-1">
            Versión: <span className="font-mono">{CURRENT_CONSENT_VERSION}</span> · Tratamiento seguro de datos para asistentes.
          </p>
        </div>

        {/* 1. Aviso de Privacidad - OBLIGATORIO */}
        <div
          className={`p-4 border ${
            requiredError ? "border-rose-500 bg-rose-50/20" : "border-[var(--accent)] bg-[var(--bg-alt)]/40"
          } transition-colors`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.privacyNotice}
              onChange={() => handleToggle("privacyNotice")}
              className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
              required
            />
            <span className="text-sm font-medium leading-relaxed">
              <strong className="text-[var(--head)] font-semibold">
                * He leído y acepto el{" "}
                <Link
                  href="/privacidad"
                  target="_blank"
                  className="underline text-[var(--accent)] hover:text-[var(--head)]"
                >
                  Aviso de Privacidad
                </Link>
              </strong>
              . Mis datos serán tratados por el comité organizador exclusivamente para la emisión de mi pase de acceso y constancia de participación.{" "}
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                (Obligatorio)
              </span>
            </span>
          </label>
          {requiredError && (
            <p className="text-xs text-rose-600 font-semibold mt-2 pl-7">
              Debes aceptar el Aviso de Privacidad para reservar tu lugar.
            </p>
          )}
        </div>

        {/* Opciones simplificadas para asistentes */}
        <div className="space-y-3 pt-2 text-sm text-[var(--fg)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-text)]">
            Preferencias adicionales (Opcionales):
          </p>

          <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[var(--bg-alt)]/30 transition-colors">
            <input
              type="checkbox"
              checked={consent.recording}
              onChange={() => handleToggle("recording")}
              className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
            />
            <span className="leading-snug">
              <strong>Grabación y tomas generales:</strong> Entiendo que durante el evento se realizarán tomas panorámicas y transmisiones del auditorio.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[var(--bg-alt)]/30 transition-colors">
            <input
              type="checkbox"
              checked={consent.shareEmailWithSponsors}
              onChange={() => handleToggle("shareEmailWithSponsors")}
              className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
            />
            <span className="leading-snug">
              <strong>Oportunidades y vacantes:</strong> Acepto compartir mi correo con las empresas y organizaciones patrocinadoras para recibir vacantes y becas STEM.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[var(--bg-alt)]/30 transition-colors">
            <input
              type="checkbox"
              checked={consent.futureEditions}
              onChange={() => handleToggle("futureEditions")}
              className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
            />
            <span className="leading-snug">
              <strong>Próximas ediciones:</strong> Deseo recibir notificaciones para las siguientes ediciones de Quetzalia.
            </span>
          </label>
        </div>
      </div>
    );
  }

  // Modo Completo (Speakers / Patrocinadores / Comunidades)
  return (
    <div className="border border-[var(--rule)] bg-[var(--card)] p-6 space-y-4">
      <div className="border-b border-[var(--rule)] pb-3">
        <h3 className="text-lg font-display text-[var(--head)]">
          Consentimientos y Privacidad de Datos
        </h3>
        <p className="text-xs text-[var(--fg)] opacity-80 mt-1">
          Versión del aviso: <span className="font-mono">{CURRENT_CONSENT_VERSION}</span>. Cada casilla es una autorización independiente.
        </p>
      </div>

      {/* 1. Aviso de Privacidad Integral - OBLIGATORIO */}
      <div
        className={`p-4 border ${
          requiredError ? "border-rose-500 bg-rose-50/20" : "border-[var(--accent)] bg-[var(--bg-alt)]/40"
        } transition-colors`}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent.privacyNotice}
            onChange={() => handleToggle("privacyNotice")}
            className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
            required
          />
          <span className="text-sm font-medium leading-relaxed">
            <strong className="text-[var(--head)] font-semibold">
              * He leído y acepto el{" "}
              <Link
                href="/privacidad"
                target="_blank"
                className="underline text-[var(--accent)] hover:text-[var(--head)]"
              >
                Aviso de Privacidad Integral
              </Link>
            </strong>
            . Entiendo que mis datos personales serán tratados conforme a la legislación aplicable por el comité organizador de Quetzalia como particulares.{" "}
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              (Obligatorio)
            </span>
          </span>
        </label>
        {requiredError && (
          <p className="text-xs text-rose-600 font-semibold mt-2 pl-7">
            Debes aceptar el Aviso de Privacidad para poder registrarte.
          </p>
        )}
      </div>

      {/* Casillas Opt-in Adicionales e Independientes (SIN PREMARCAR) */}
      <div className="space-y-3 pt-2 text-sm text-[var(--fg)]">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-text)]">
          Autorizaciones adicionales (Opcionales y separadas):
        </p>

        {/* 2. Imagen básica */}
        <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[var(--bg-alt)]/30 transition-colors">
          <input
            type="checkbox"
            checked={consent.imageBasic}
            onChange={() => handleToggle("imageBasic")}
            className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
          />
          <span className="leading-snug">
            <strong>Uso de imagen básica:</strong> Autorizo la publicación de mi fotografía de semblanza y nombre en el sitio web y programa del evento por un periodo de hasta 12 meses.
          </span>
        </label>

        {/* 3. Grabación */}
        <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[var(--bg-alt)]/30 transition-colors">
          <input
            type="checkbox"
            checked={consent.recording}
            onChange={() => handleToggle("recording")}
            className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
          />
          <span className="leading-snug">
            <strong>Grabación audiovisual:</strong> Autorizo la grabación en video y transmisión en vivo de mi participación en las sesiones de Quetzalia.
          </span>
        </label>

        {/* 4. Materiales */}
        <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[var(--bg-alt)]/30 transition-colors">
          <input
            type="checkbox"
            checked={consent.materials}
            onChange={() => handleToggle("materials")}
            className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
          />
          <span className="leading-snug">
            <strong>Distribución de materiales:</strong> Autorizo la puesta a disposición de las diapositivas o recursos digitales de mi ponencia para consulta de las asistentes.
          </span>
        </label>

        {/* 5. Patrocinadores */}
        <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[var(--bg-alt)]/30 transition-colors">
          <input
            type="checkbox"
            checked={consent.shareEmailWithSponsors}
            onChange={() => handleToggle("shareEmailWithSponsors")}
            className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
          />
          <span className="leading-snug">
            <strong>Vínculo con patrocinadores:</strong> Acepto que mi correo de contacto sea compartido con los patrocinadores oficiales para convocatorias y vacantes laborales o académicas.
          </span>
        </label>

        {/* 6. Clips / Testimonios */}
        <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[var(--bg-alt)]/30 transition-colors">
          <input
            type="checkbox"
            checked={consent.clips}
            onChange={() => handleToggle("clips")}
            className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
          />
          <span className="leading-snug">
            <strong>Clips y testimonios:</strong> Autorizo la edición y difusión de fragmentos destacados o testimonios en las redes sociales de difusión del encuentro.
          </span>
        </label>

        {/* 7. Futuras ediciones */}
        <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[var(--bg-alt)]/30 transition-colors">
          <input
            type="checkbox"
            checked={consent.futureEditions}
            onChange={() => handleToggle("futureEditions")}
            className="mt-1 h-4 w-4 accent-[var(--accent)] cursor-pointer"
          />
          <span className="leading-snug">
            <strong>Futuras ediciones:</strong> Deseo recibir noticias y recordatorios de registro para próximas ediciones del encuentro Quetzalia.
          </span>
        </label>
      </div>
    </div>
  );
}
