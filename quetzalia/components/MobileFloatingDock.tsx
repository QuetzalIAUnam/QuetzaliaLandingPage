"use client";

import React, { useEffect, useState } from "react";

interface NavSection {
  id: string;
  label: string;
  isCta?: boolean;
}

const SECTIONS: NavSection[] = [
  { id: "inicio", label: "Inicio" },
  { id: "evento", label: "El evento" },
  { id: "agenda", label: "Agenda" },
  { id: "aliadas", label: "Aliadas" },
  { id: "preguntas", label: "Preguntas" },
  { id: "inscripcion", label: "Inscripción", isCta: true },
];

export default function MobileFloatingDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  // Detección precisa de la sección actual usando getBoundingClientRect
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const focusPoint = windowHeight * 0.4;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focusPoint && rect.bottom >= focusPoint) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const activeLabel =
    SECTIONS.find((s) => s.id === activeSection)?.label || "Navegar";

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // En móviles, scrollIntoView programático a veces pausa los IntersectionObserver.
      // Emitimos eventos periódicos durante y al finalizar el desplazamiento
      // para despertar inmediatamente a todos los observadores y animaciones.
      const syncDelays = [80, 180, 350, 550, 800, 1100];
      syncDelays.forEach((delay) => {
        setTimeout(() => {
          window.dispatchEvent(new Event("scroll"));
        }, delay);
      });
    }
  };

  return (
    <div className="mobile-dock-wrapper" aria-label="Navegación móvil flotante">
      {/* Telón traslúcido para cerrar al tocar fuera */}
      {isOpen && (
        <div
          className="mobile-dock-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="mobile-dock-container">
        {/* Panel emergente hacia arriba con las secciones */}
        {isOpen && (
          <nav
            className="mobile-dock-menu"
            aria-label="Menú de secciones"
            role="dialog"
            aria-modal="true"
          >
            <div className="mobile-dock-menu-header">
              <span className="mobile-dock-menu-title">Secciones</span>
              <span className="mobile-dock-deco-line" aria-hidden="true" />
            </div>

            <ul className="mobile-dock-list">
              {SECTIONS.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(sec.id);
                    }}
                    className={`mobile-dock-item ${
                      sec.isCta ? "is-cta" : ""
                    } ${activeSection === sec.id ? "is-active" : ""}`}
                  >
                    <span className="dock-item-label">{sec.label}</span>
                    {activeSection === sec.id && !sec.isCta && (
                      <span className="dock-active-dot" aria-label="Sección actual" />
                    )}
                    {sec.isCta && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Botón flotante tipo cápsula dock */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`mobile-dock-trigger ${isOpen ? "is-open" : ""}`}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={
            isOpen
              ? "Cerrar menú de navegación"
              : `Menú de navegación. Sección actual: ${activeLabel}`
          }
        >
          {/* Icono Brújula Neo-Déco */}
          <span className="dock-trigger-icon" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </span>

          <span className="dock-trigger-text">
            {isOpen ? "Cerrar" : activeLabel}
          </span>

          {/* Flecha indicadora */}
          <span className="dock-trigger-chevron" aria-hidden="true">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
