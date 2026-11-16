"use client";

import React, { useMemo } from "react";
import Link from "next/link";

export interface ActionItem {
  text: string;
  href: string;
}

interface ShootingStarsCardProps {
  badge?: string;
  title: string;
  message: string;
  actionText?: string;
  actionHref?: string;
  actions?: ActionItem[];
}

export default function ShootingStarsCard({
  badge = "✦ Convocatoria Abierta",
  title = "Te estamos esperando",
  message,
  actionText,
  actionHref,
  actions,
}: ShootingStarsCardProps) {
  // Generar puntos de estrellas fijas con posiciones armónicas
  const stars = useMemo(
    () => [
      { top: "12%", left: "15%", size: 2.5, delay: "0s", duration: "2.8s" },
      { top: "22%", left: "80%", size: 3, delay: "1.2s", duration: "3.4s" },
      { top: "45%", left: "8%", size: 2.5, delay: "0.5s", duration: "2.5s" },
      { top: "70%", left: "25%", size: 2, delay: "1.8s", duration: "4.1s" },
      { top: "85%", left: "75%", size: 3, delay: "0.9s", duration: "3.1s" },
      { top: "30%", left: "48%", size: 2, delay: "2.2s", duration: "2.9s" },
      { top: "15%", left: "60%", size: 2.5, delay: "1.5s", duration: "3.7s" },
      { top: "60%", left: "88%", size: 2, delay: "0.3s", duration: "2.6s" },
      { top: "78%", left: "50%", size: 2.5, delay: "2.5s", duration: "3.5s" },
      { top: "38%", left: "92%", size: 2, delay: "1.1s", duration: "3.2s" },
    ],
    []
  );

  // Estrellas fugaces con diferentes trayectorias y tiempos desfasados
  const shootingStars = useMemo(
    () => [
      { top: "18%", right: "12%", width: 120, delay: "0s", duration: "4.5s" },
      { top: "35%", right: "35%", width: 150, delay: "1.8s", duration: "5.2s" },
      { top: "65%", right: "20%", width: 110, delay: "3.2s", duration: "4.8s" },
      { top: "10%", right: "55%", width: 130, delay: "2.4s", duration: "6.0s" },
    ],
    []
  );

  const renderedActions: ActionItem[] = actions && actions.length > 0
    ? actions
    : actionText && actionHref
    ? [{ text: actionText, href: actionHref }]
    : [];

  return (
    <div className="shooting-star-canvas my-8 w-full max-w-4xl mx-auto rounded-lg px-6 py-10 sm:py-14 text-center text-[var(--fg)] relative">
      {/* Estrellas titilantes en el fondo */}
      {stars.map((s, idx) => (
        <span
          key={`star-${idx}`}
          className="star-point"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Estrellas fugaces cruzando */}
      {shootingStars.map((ss, idx) => (
        <span
          key={`shooting-star-${idx}`}
          className="shooting-star-line"
          style={{
            top: ss.top,
            right: ss.right,
            width: `${ss.width}px`,
            animationDelay: ss.delay,
            animationDuration: ss.duration,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Contenido en primer plano */}
      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs uppercase tracking-widest font-bold text-[var(--accent)] border border-[var(--accent)]/35 rounded-full bg-[var(--bg-alt)] shadow-xs">
            {badge}
          </div>
        )}

        <h3 className="text-2xl sm:text-3xl font-display text-[var(--head)] leading-snug">
          {title}
        </h3>

        <p className="text-sm sm:text-base text-[var(--fg)] opacity-90 leading-relaxed max-w-xl mx-auto">
          {message}
        </p>

        {renderedActions.length > 0 && (
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            {renderedActions.map((act, idx) => (
              <Link
                key={`act-${idx}`}
                href={act.href}
                className="auth-btn-ghost auth-btn-lg inline-flex items-center gap-2 cursor-pointer group"
              >
                <span className="auth-btn-text text-sm sm:text-base">
                  {act.text} →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
