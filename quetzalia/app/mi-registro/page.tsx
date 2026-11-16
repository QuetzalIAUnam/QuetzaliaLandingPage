"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Greca from "@/components/ui/Greca";
import BoardingPass from "@/components/BoardingPass";

export default function MiRegistroPage() {
  const { user, registration, loading, isAdmin, loginWithGoogle, logout } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteMyRegistration = async () => {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar tu postulación de la base de datos?\n\nEsto te permitirá volver a ingresar a las páginas de registro y probar el formulario desde cero con tu cuenta de Google."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      const token = await user?.getIdToken();
      if (!token) return;

      const res = await fetch("/api/registrations/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "No se pudo eliminar el registro.");
        return;
      }

      alert("Tu postulación ha sido eliminada. Ahora puedes volver a probar el registro.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al intentar eliminar tu postulación.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col">
      {/* Barra superior con navegación */}
      <header className="border-b border-[var(--rule)] py-4 px-6">
        <div className="max-w-[var(--maxw)] mx-auto flex items-center justify-between">
          <Link href="/" className="brand text-xl font-display text-[var(--head)]">
            ← Volver a Quetzal-IA
          </Link>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline text-[var(--head)]">
                {user.email}
              </span>
              <button
                onClick={() => logout()}
                className="text-xs uppercase tracking-wider font-semibold text-[var(--accent)] hover:underline"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <Greca />

      <main className="flex-1 max-w-[var(--maxw)] mx-auto w-full px-6 py-12">
        <div className="sec-head mb-8">
          <p className="eyebrow">Portal de Participantes</p>
          <h1 className="text-4xl font-display text-[var(--head)]">Mi Registro</h1>
          <p className="lead">
            Consulta en tiempo real el estatus de tu postulación y los datos registrados ante el comité organizador de Quetzalia.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center border border-[var(--rule)] bg-[var(--bg-alt)]">
            <p className="text-lg animate-pulse font-medium text-[var(--head)]">
              Verificando credenciales de acceso...
            </p>
          </div>
        ) : !user ? (
          <div className="border-2 border-[var(--accent)] p-8 sm:p-12 text-center bg-[var(--card)] shadow-lg max-w-xl mx-auto">
            <h2 className="text-2xl font-display text-[var(--head)] mb-4">
              Inicia sesión con Google
            </h2>
            <p className="mb-8 text-[var(--fg)]">
              Para proteger tu privacidad y evitar accesos no autorizados, debes ingresar con la cuenta de Google vinculada a tu registro.
            </p>
            <button
              onClick={() => loginWithGoogle()}
              className="btn btn-primary inline-flex items-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#ffffff"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#ffffff"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#ffffff"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#ffffff"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Acceder con Google</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Ficha de Identidad del Usuario */}
            <div className="border border-[var(--accent)] bg-[var(--card)] p-6 sm:p-8 relative overflow-hidden shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "Avatar"}
                      width={64}
                      height={64}
                      className="rounded-full border-2 border-[var(--accent)] shadow-sm shrink-0"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[var(--head)] text-white flex items-center justify-center font-display text-2xl border-2 border-[var(--accent)] shrink-0">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      {isAdmin ? (
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-400">
                          ★ Comité Organizador / Administrador
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300">
                          ✓ Sesión vinculada con Google
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display text-[var(--head)] mt-1.5">
                      {user.displayName || (isAdmin ? "Miembro del Comité" : "Participante")}
                    </h2>
                    <p className="text-sm text-[var(--fg)] opacity-85 font-medium mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="btn btn-primary text-xs px-4 py-2 text-center whitespace-nowrap font-bold"
                    >
                      Dashboard →
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="btn btn-ghost text-xs px-5 py-2.5 shrink-0"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>

            {/* Vista Exclusiva para Miembros del Comité */}
            {isAdmin ? (
              <div className="border-2 border-[var(--head)] bg-[var(--card)] p-8 sm:p-12 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[var(--rule)] pb-6">
                  <div>
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                      ★ Rol Administrativo Activo
                    </span>
                    <h2 className="text-3xl font-display text-[var(--head)] mt-2">
                      Panel de Control y Gestión Quetzalia
                    </h2>
                    <p className="text-sm text-[var(--fg)] opacity-85 mt-1">
                      Cuenta administrativa autorizada: <strong>{user.email}</strong>
                    </p>
                  </div>
                  <Link
                    href="/admin"
                    className="btn btn-primary text-xs px-6 py-3.5 text-center whitespace-nowrap shadow-md cursor-pointer font-bold inline-flex items-center gap-2"
                  >
                    <span>⚡ Ir al Dashboard de Administración</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="p-5 bg-[var(--bg-alt)] border border-[var(--rule)] space-y-3">
                  <h3 className="font-display text-lg text-[var(--head)]">
                    Acreditación Institucional Garantizada
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--fg)] opacity-90">
                    Como integrante del comité organizador de <strong>Quetzalia 2027</strong> en la FES Acatlán de la UNAM, tu acceso y acreditación oficial están garantizados por el Comité.
                  </p>
                  <p className="text-xs text-amber-900 bg-amber-50 dark:bg-amber-950/30 p-3 border border-amber-200 dark:border-amber-900 leading-relaxed">
                    ℹ️ <strong>Control de Cupo (400 Lugares):</strong> Por política organizativa, las cuentas del comité <strong>no deben ni requieren registrarse</strong> como asistentes o ponentes, preservando el cupo íntegro para las estudiantes y la comunidad universitaria.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-[var(--card)] border border-[var(--rule)]">
                      <p className="font-bold text-[var(--head)]">🛡️ Control de Cupo</p>
                      <p className="opacity-75 mt-0.5">Gestión de 400 lugares, lista de espera y promociones.</p>
                    </div>
                    <div className="p-3 bg-[var(--card)] border border-[var(--rule)]">
                      <p className="font-bold text-[var(--head)]">📋 Moderación</p>
                      <p className="opacity-75 mt-0.5">Revisión de ponencias, colectivos y convenios de patrocinio.</p>
                    </div>
                    <div className="p-3 bg-[var(--card)] border border-[var(--rule)]">
                      <p className="font-bold text-[var(--head)]">✉️ Comunicados Oficiales</p>
                      <p className="opacity-75 mt-0.5">Envío de plantillas y avisos a las asistentes.</p>
                    </div>
                  </div>
                </div>

                {/* Pase de Abordar Exclusivo del Comité Organizador */}
                <div className="pt-4 border-t border-[var(--rule)]">
                  <BoardingPass
                    passengerName={user.displayName || "Integrante del Comité"}
                    role="admin"
                    registrationId="QTZ-COMITE-01"
                    organization="UNAM FES Acatlán"
                    status="aprobado"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <Link
                    href="/admin"
                    className="btn btn-primary text-xs w-full sm:w-auto text-center font-bold"
                  >
                    Abrir Dashboard Administrativo →
                  </Link>
                  <Link
                    href="/"
                    className="text-xs text-[var(--accent)] font-semibold hover:underline"
                  >
                    ← Volver a la página principal de Quetzalia
                  </Link>
                </div>
              </div>
            ) : !registration ? (
              <div className="space-y-8">
                {/* Encabezado perfectamente centrado sin encuadre desfasado */}
                <div className="py-6 px-4 text-center max-w-2xl mx-auto space-y-3">
                  <p className="eyebrow text-xs uppercase tracking-widest text-[var(--accent-text)]">
                    Pase no vinculado
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-display text-[var(--head)]">
                    No hay un registro activo asociado a tu cuenta
                  </h3>
                  <p className="max-w-xl mx-auto text-sm sm:text-base text-[var(--fg)] opacity-90 leading-relaxed text-center">
                    Aún no has completado tu solicitud de participación para <strong>Quetzalia 2027</strong> en la FES Acatlán de la UNAM. Elige tu modalidad de participación a continuación para vincular tus datos y generar tu confirmación oficial:
                  </p>
                </div>

                {/* Cuadrícula de Modalidades de Participación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 1. Asistente General */}
                  <div className="border border-[var(--rule)] bg-[var(--card)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-colors shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
                          👩‍💻 Asistencia General
                        </span>
                        <span className="text-xs font-semibold text-[var(--accent)] font-mono">
                          Cupo: 400 lugares
                        </span>
                      </div>
                      <h4 className="text-xl font-display text-[var(--head)] mb-2">
                        Registro como Asistente
                      </h4>
                      <p className="text-xs text-[var(--fg)] opacity-85 leading-relaxed">
                        Reserva tu lugar presencial en el auditorio de la FES Acatlán. Incluye acceso completo a ponencias magnas, dinámicas de vinculación y constancia digital oficial de participación con valor curricular.
                      </p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-[var(--rule)]/40 flex items-center">
                      <Link
                        href="/registro/asistentes"
                        className="auth-btn-ghost group inline-flex items-center gap-2 cursor-pointer no-underline"
                      >
                        <span className="auth-btn-text text-xs sm:text-sm font-bold tracking-wider uppercase">
                          Completar Registro de Asistente
                        </span>
                        <span className="text-[var(--accent)] group-hover:translate-x-1.5 transition-transform duration-300 font-bold text-base">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* 2. Ponente */}
                  <div className="border border-[var(--rule)] bg-[var(--card)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-colors shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
                          🎙️ Convocatoria Académica
                        </span>
                        <span className="text-xs font-semibold text-purple-800 font-mono">
                          Charlas y Talleres
                        </span>
                      </div>
                      <h4 className="text-xl font-display text-[var(--head)] mb-2">
                        Postulación de Ponentes
                      </h4>
                      <p className="text-xs text-[var(--fg)] opacity-85 leading-relaxed">
                        Comparte tu trayectoria, investigaciones, talleres prácticos o proyectos de innovación en ciencia y tecnología ante la comunidad universitaria.
                      </p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-[var(--rule)]/40 flex items-center">
                      <Link
                        href="/registro/speakers"
                        className="auth-btn-ghost group inline-flex items-center gap-2 cursor-pointer no-underline"
                      >
                        <span className="auth-btn-text text-xs sm:text-sm font-bold tracking-wider uppercase">
                          Postular mi Propuesta
                        </span>
                        <span className="text-[var(--accent)] group-hover:translate-x-1.5 transition-transform duration-300 font-bold text-base">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* 3. Patrocinadores */}
                  <div className="border border-[var(--rule)] bg-[var(--card)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-colors shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                          🏢 Marcas e Industria
                        </span>
                        <span className="text-xs font-semibold text-amber-800 font-mono">
                          Alianzas Estratégicas
                        </span>
                      </div>
                      <h4 className="text-xl font-display text-[var(--head)] mb-2">
                        Patrocinadores e Instituciones
                      </h4>
                      <p className="text-xs text-[var(--fg)] opacity-85 leading-relaxed">
                        Súmate como empresa o institución aliada. Impulsa becas, visibiliza oportunidades profesionales de talento femenino y potencia tu presencia de marca en la UNAM.
                      </p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-[var(--rule)]/40 flex items-center">
                      <Link
                        href="/registro/patrocinadores"
                        className="auth-btn-ghost group inline-flex items-center gap-2 cursor-pointer no-underline"
                      >
                        <span className="auth-btn-text text-xs sm:text-sm font-bold tracking-wider uppercase">
                          Convenio de Patrocinio
                        </span>
                        <span className="text-[var(--accent)] group-hover:translate-x-1.5 transition-transform duration-300 font-bold text-base">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* 4. Comunidades STEM */}
                  <div className="border border-[var(--rule)] bg-[var(--card)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-colors shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                          🌐 Redes Universitarias
                        </span>
                        <span className="text-xs font-semibold text-emerald-800 font-mono">
                          Colectivos STEM
                        </span>
                      </div>
                      <h4 className="text-xl font-display text-[var(--head)] mb-2">
                        Comunidades y Colectivos
                      </h4>
                      <p className="text-xs text-[var(--fg)] opacity-85 leading-relaxed">
                        Registra a tu club de robótica, capítulo IEEE, colectivo de mujeres tecnólogas o grupo estudiantil para tejer una alianza interinstitucional duradera.
                      </p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-[var(--rule)]/40 flex items-center">
                      <Link
                        href="/registro/comunidades"
                        className="auth-btn-ghost group inline-flex items-center gap-2 cursor-pointer no-underline"
                      >
                        <span className="auth-btn-text text-xs sm:text-sm font-bold tracking-wider uppercase">
                          Registrar a mi Comunidad
                        </span>
                        <span className="text-[var(--accent)] group-hover:translate-x-1.5 transition-transform duration-300 font-bold text-base">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pase de Abordar Digital Oficial: SOLO VISIBLE SI ESTÁ ACEPTADO / APROBADO */}
                {registration.status === "aprobado" && (
                  <BoardingPass
                    passengerName={
                      registration.fullName ||
                      registration.chosenName ||
                      user.displayName ||
                      "Participante Quetzalia"
                    }
                    role={registration.type}
                    registrationId={registration.id || user.uid}
                    organization={registration.organization}
                    status={registration.status}
                    photoPath={registration.photoPath}
                  />
                )}

                <div className="border-2 border-[var(--head)] p-6 sm:p-8 bg-[var(--card)] shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4 mb-6">
                    <div>
                      <span className="eyebrow">Tipo de registro</span>
                      <h3 className="text-2xl font-display text-[var(--head)] capitalize">
                        {registration.type}
                      </h3>
                    </div>
                    <div>
                      <span className="eyebrow">Estado de la solicitud</span>
                      <div className="mt-1">
                        {registration.status === "pendiente" && (
                          <span className="px-4 py-1.5 font-bold uppercase tracking-wider text-xs bg-amber-100 text-amber-900 border border-amber-400">
                            Pendiente de revisión
                          </span>
                        )}
                        {registration.status === "aprobado" && (
                          <span className="px-4 py-1.5 font-bold uppercase tracking-wider text-xs bg-emerald-100 text-emerald-900 border border-emerald-400">
                            Aprobado
                          </span>
                        )}
                        {registration.status === "lista_espera" && (
                          <span className="px-4 py-1.5 font-bold uppercase tracking-wider text-xs bg-purple-100 text-purple-900 border border-purple-400">
                            En lista de espera
                          </span>
                        )}
                        {registration.status === "rechazado" && (
                          <span className="px-4 py-1.5 font-bold uppercase tracking-wider text-xs bg-rose-100 text-rose-900 border border-rose-400">
                            No aceptado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="font-semibold text-[var(--head)]">Nombre registrado:</p>
                      <p>{registration.fullName || registration.chosenName || "—"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--head)]">Organización / Afiliación:</p>
                      <p>{registration.organization || "—"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--head)]">Fecha de solicitud:</p>
                      <p>{new Date(registration.createdAt).toLocaleString("es-MX")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--head)]">Versión de consentimiento:</p>
                      <p className="font-mono text-xs">{registration.consentVersion || "v1.0"}</p>
                    </div>
                    {registration.type === "speaker" && registration.talkTitle && (
                      <div className="sm:col-span-2 pt-2 border-t border-[var(--rule)]/60">
                        <p className="font-semibold text-[var(--head)]">
                          {registration.talkType === "Taller" ? "🛠️ Taller Práctico Propuesto:" : "🎙️ Ponencia Propuesta:"}
                        </p>
                        <p className="text-sm font-medium mt-0.5">{registration.talkTitle}</p>
                        {registration.talkType && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--accent)]/15 text-[var(--accent-text)] rounded border border-[var(--accent)]/30">
                            {registration.talkType}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Zona de Pruebas: Eliminar Registro */}
                <div className="border border-red-300 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-red-900 dark:text-red-300">
                      Zona de Pruebas: Eliminar Postulación
                    </h3>
                    <p className="text-xs text-red-800 dark:text-red-400 mt-0.5">
                      ¿Deseas probar el flujo de registro desde cero? Puedes borrar tu postulación actual de la base de datos para volver a registrarte.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteMyRegistration}
                    disabled={deleting}
                    className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-red-800 hover:bg-red-900 text-white transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    {deleting ? "Eliminando..." : "🗑️ Eliminar mi registro"}
                  </button>

                  {registration.photoPath && (
                    <div className="sm:col-span-2 pt-2 border-t border-[var(--rule)] flex items-center gap-4">
                      <Image
                        src={registration.photoPath}
                        alt="Imagen o logotipo registrado"
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain rounded-md border border-[var(--accent)] bg-white p-1 shrink-0"
                        unoptimized
                      />
                      <div className="text-xs">
                        <p className="font-semibold text-[var(--head)]">
                          {registration.type === "sponsor"
                            ? "Logotipo corporativo registrado"
                            : registration.type === "community"
                            ? "Emblema de la comunidad registrado"
                            : "Fotografía de semblanza registrada"}
                        </p>
                        <p className="opacity-80">
                          Almacenado de forma segura y asociado a tu solicitud.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Greca />
      <footer className="border-t border-[var(--rule)] py-6 text-center text-xs opacity-75">
        Quetzalia STEM · Plataforma de Registro Seguro
      </footer>
    </div>
  );
}
