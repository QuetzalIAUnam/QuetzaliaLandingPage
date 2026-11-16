"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function AuthStatus() {
  const { user, registration, loading, loginWithGoogle, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setErrorMsg(null);
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("No se pudo iniciar sesión. Verifica tu conexión o intenta nuevamente.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-status-loading" aria-live="polite">
        <span className="auth-spinner" aria-hidden="true" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-status-container">
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="auth-btn-ghost"
          aria-label="Iniciar sesión con Google"
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span className="auth-btn-text">
            {isLoggingIn ? "Conectando..." : "Iniciar sesión"}
          </span>
        </button>
        {errorMsg && <p className="auth-err-tooltip">{errorMsg}</p>}
      </div>
    );
  }

  const statusBadge = () => {
    if (!registration) {
      return <span className="auth-tag tag-none">Sin registro</span>;
    }
    const statusMap: Record<string, { label: string; class: string }> = {
      pendiente: { label: "Pendiente", class: "tag-pending" },
      aprobado: { label: "Aprobado", class: "tag-approved" },
      lista_espera: { label: "Lista de espera", class: "tag-waitlist" },
      rechazado: { label: "Rechazado", class: "tag-rejected" },
    };
    const s = statusMap[registration.status] || {
      label: registration.status,
      class: "tag-pending",
    };
    return <span className={`auth-tag ${s.class}`}>{s.label}</span>;
  };

  return (
    <div className="auth-status-logged">
      <Link href="/mi-registro" className="auth-user-link" title="Ver mi registro">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || "Usuario"}
            width={28}
            height={28}
            className="auth-avatar"
            unoptimized
          />
        ) : (
          <div className="auth-avatar-fallback">
            {(user.displayName || user.email || "U")[0].toUpperCase()}
          </div>
        )}
        <span className="auth-user-name">
          {user.displayName?.split(" ")[0] || "Mi cuenta"}
        </span>
        {statusBadge()}
      </Link>
      {user.email?.toLowerCase() === "dr87152@gmail.com" && (
        <Link
          href="/admin"
          className="text-xs font-bold uppercase tracking-wider text-[var(--head)] bg-[var(--bg-alt)] px-2 py-1 border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors"
          title="Panel de Administración"
        >
          Admin
        </Link>
      )}
      <button
        type="button"
        onClick={() => logout()}
        className="auth-btn-logout"
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
      >
        Salir
      </button>
    </div>
  );
}
