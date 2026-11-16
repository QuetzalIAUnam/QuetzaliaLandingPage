"use client";

import React from "react";
import Link from "next/link";
import { Registration, RegistrationType } from "@/lib/types";

interface ExistingRegistrationNoticeProps {
  registration: Registration;
  requestedType: RegistrationType;
  onLogout?: () => Promise<void> | void;
}

const TYPE_NAMES: Record<RegistrationType, string> = {
  speaker: "Ponente / Tallerista",
  community: "Comunidad o Colectivo STEM",
  sponsor: "Marca Patrocinadora o Alianza",
  attendee: "Asistente General",
};

const TYPE_ICONS: Record<RegistrationType, string> = {
  speaker: "🎙️",
  community: "🌐",
  sponsor: "💼",
  attendee: "🎟️",
};

export default function ExistingRegistrationNotice({
  registration,
  requestedType,
  onLogout,
}: ExistingRegistrationNoticeProps) {
  const currentTypeName = TYPE_NAMES[registration.type] || registration.type;
  const currentTypeIcon = TYPE_ICONS[registration.type] || "📋";
  const requestedTypeName = TYPE_NAMES[requestedType] || requestedType;

  const isSameType = registration.type === requestedType;

  return (
    <div className="border-2 border-[var(--accent)] bg-[var(--card)] p-6 sm:p-10 shadow-2xl space-y-6 text-center max-w-2xl mx-auto rounded-2xl relative overflow-hidden">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--accent)]/15 rounded-full blur-[50px] pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[var(--accent-text)]/15 rounded-full blur-[50px] pointer-events-none" />

      {/* Badge de Registro Existente */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
        <span>⚠️</span>
        <span>Registro Único Activo</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-display text-[var(--head)]">
          {isSameType
            ? `Ya enviaste tu registro como ${currentTypeName}`
            : `Ya cuentas con un registro activo como ${currentTypeName}`}
        </h2>
        <p className="text-sm text-[var(--fg)] opacity-90 leading-relaxed max-w-lg mx-auto">
          Tu cuenta de Google ya tiene una postulación vinculada para el encuentro <strong>Quetzalia 2027</strong>.
        </p>
      </div>

      {/* Ficha Resumen del Registro Actual */}
      <div className="p-4 sm:p-5 bg-[var(--bg-alt)]/70 border border-[var(--rule)] rounded-xl text-left text-xs sm:text-sm space-y-2 shadow-inner">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--rule)]/60 pb-2 mb-2">
          <span className="font-semibold text-[var(--head)] flex items-center gap-1.5">
            <span>{currentTypeIcon}</span>
            <span>Modalidad Registrada:</span>
          </span>
          <span className="font-bold text-[var(--accent-text)]">{currentTypeName}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <p>
            <strong>Folio ID:</strong>{" "}
            <span className="font-mono text-[11px] opacity-80">{registration.id}</span>
          </p>
          <p>
            <strong>Estatus:</strong>{" "}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                registration.status === "aprobado"
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : registration.status === "lista_espera"
                  ? "bg-purple-100 text-purple-900 border border-purple-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}
            >
              {registration.status === "aprobado"
                ? "Aprobado"
                : registration.status === "lista_espera"
                ? "En lista de espera"
                : "Pendiente de revisión"}
            </span>
          </p>
          <p className="sm:col-span-2">
            <strong>Nombre registrado:</strong>{" "}
            {registration.chosenName || registration.fullName || registration.legalName}
          </p>
          {registration.talkTitle && (
            <p className="sm:col-span-2">
              <strong>{registration.talkType === "Taller" ? "Taller:" : "Ponencia:"}</strong>{" "}
              {registration.talkTitle}
            </p>
          )}
          {registration.organization && !registration.talkTitle && (
            <p className="sm:col-span-2">
              <strong>Organización / Colectivo:</strong> {registration.organization}
            </p>
          )}
          <p className="sm:col-span-2 text-[11px] opacity-75">
            <strong>Correo vinculado:</strong> {registration.email}
          </p>
        </div>
      </div>

      {/* Regla de Negocio Explicada Claramente */}
      <div className="p-4 bg-[var(--card)] border-l-4 border-l-[var(--accent)] border border-[var(--rule)] text-left text-xs space-y-2 rounded-r-xl">
        <p className="font-bold text-[var(--head)] flex items-center gap-1.5 text-sm">
          <span>⚖️</span>
          <span>Regla de negocio: Un registro por cuenta</span>
        </p>
        <p className="text-[var(--fg)] opacity-90 leading-relaxed">
          Por políticas de aforo y acreditación oficial de la UNAM FES Acatlán, <strong>cada cuenta de Google admite un solo registro o postulación</strong>. No es posible asociar múltiples roles simultáneos a la misma cuenta.
        </p>
        <div className="pt-1 border-t border-[var(--rule)]/50 text-[11px] text-[var(--accent-text)] font-medium">
          💡 <strong>¿Deseas postularte como {requestedTypeName} o registrar otro colectivo?</strong>
          <br />
          Para registrar una modalidad diferente o postular una segunda iniciativa, debes hacerlo <strong>iniciando sesión con una cuenta de Google distinta</strong>.
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Link
          href="/mi-registro"
          className="btn btn-primary text-xs w-full sm:w-auto font-bold px-6 py-2.5 shadow-md"
        >
          🎟️ Ver y Gestionar Mi Registro Actual →
        </Link>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="btn btn-ghost text-xs w-full sm:w-auto font-semibold cursor-pointer border border-[var(--rule)] hover:border-[var(--accent)]"
          >
            🔄 Usar otra cuenta de Google
          </button>
        )}

        <Link
          href="/"
          className="text-xs text-[var(--accent)] hover:underline font-semibold"
        >
          ← Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
