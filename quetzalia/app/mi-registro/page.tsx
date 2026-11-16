"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Greca from "@/components/ui/Greca";

export default function MiRegistroPage() {
  const { user, registration, loading, loginWithGoogle, logout } = useAuth();
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
            {/* Ficha de identidad del usuario */}
            <div className="p-6 border border-[var(--rule)] bg-[var(--card)] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    width={56}
                    height={56}
                    className="rounded-full border-2 border-[var(--accent)]"
                    unoptimized
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[var(--head)] text-white flex items-center justify-center font-display text-2xl">
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-display text-[var(--head)]">
                    {user.displayName || "Participante"}
                  </h2>
                  <p className="text-sm text-[var(--fg)] opacity-80">{user.email}</p>
                  <p className="text-xs text-[var(--accent)] font-mono mt-1">
                    UID: {user.uid}
                  </p>
                </div>
              </div>
            </div>

            {/* Detalle del Registro en Firestore */}
            {!registration ? (
              <div className="border border-[var(--rule)] p-8 bg-[var(--bg-alt)] text-center">
                <h3 className="text-xl font-display text-[var(--head)] mb-2">
                  No hay registro activo asociado a esta cuenta
                </h3>
                <p className="mb-6 max-w-xl mx-auto text-[var(--fg)]">
                  Aún no has enviado una solicitud de registro para Quetzalia 2027. Selecciona una de las modalidades a continuación:
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/registro/asistentes" className="btn btn-primary text-sm">
                    Registro Asistente
                  </Link>
                  <Link href="/registro/speakers" className="btn btn-ghost text-sm">
                    Registro Ponente
                  </Link>
                  <Link href="/registro/patrocinadores" className="btn btn-ghost text-sm">
                    Registro Patrocinador
                  </Link>
                  <Link href="/registro/comunidades" className="btn btn-ghost text-sm">
                    Registro Comunidad
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
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
