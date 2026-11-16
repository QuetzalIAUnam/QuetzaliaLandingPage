"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import PhotoArch from "./ui/PhotoArch";
import SectionHead from "./ui/SectionHead";

interface SpeakerItem {
  id: string;
  name: string;
  org: string;
  type: string;
  desc: string;
  talk: string;
  linkedin?: string;
  photoUrl?: string;
}

interface SponsorItem {
  id: string;
  name: string;
  legalName?: string;
  logoUrl?: string;
}

interface CommunityItem {
  id: string;
  name: string;
  representative?: string;
  desc?: string;
  logoUrl?: string;
}

export default function Allies() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [expandedTalks, setExpandedTalks] = useState<Record<string, boolean>>({});

  const [speakers, setSpeakers] = useState<SpeakerItem[]>([]);
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [communities, setCommunities] = useState<CommunityItem[]>([]);

  // Estrellas y estrellas fugaces distribuidas armónicamente por toda la sección
  const stars = useMemo(
    () => [
      { top: "8%", left: "6%", size: 2.5, delay: "0s", duration: "2.8s" },
      { top: "18%", left: "94%", size: 3, delay: "1.2s", duration: "3.4s" },
      { top: "45%", left: "3%", size: 2, delay: "0.5s", duration: "2.5s" },
      { top: "75%", left: "96%", size: 2.5, delay: "1.8s", duration: "4.1s" },
      { top: "88%", left: "10%", size: 3, delay: "0.9s", duration: "3.1s" },
      { top: "14%", left: "48%", size: 2, delay: "2.2s", duration: "2.9s" },
      { top: "25%", left: "70%", size: 2.5, delay: "1.5s", duration: "3.7s" },
      { top: "60%", left: "84%", size: 2, delay: "0.3s", duration: "2.6s" },
      { top: "78%", left: "35%", size: 2.5, delay: "2.5s", duration: "3.5s" },
      { top: "35%", left: "18%", size: 2, delay: "1.1s", duration: "3.2s" },
    ],
    []
  );

  const shootingStars = useMemo(
    () => [
      { top: "12%", right: "6%", width: 140, delay: "0s", duration: "4.5s" },
      { top: "38%", right: "32%", width: 160, delay: "2.1s", duration: "5.5s" },
      { top: "65%", right: "12%", width: 120, delay: "3.6s", duration: "4.8s" },
      { top: "18%", right: "65%", width: 130, delay: "1.5s", duration: "6.2s" },
    ],
    []
  );

  const toggleTalk = (id: string) => {
    setExpandedTalks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Cargar datos reales aprobados desde la base de datos
  useEffect(() => {
    let isMounted = true;
    fetch("/api/public/showcase")
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching showcase");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setSpeakers(data.speakers || []);
          setSponsors(data.sponsors || []);
          setCommunities(data.communities || []);
        }
      })
      .catch((err) => {
        console.error("Error al cargar showcase de la base de datos:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Observador de visibilidad para animaciones
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top < windowHeight * 0.85 && rect.bottom > 80;

      if (isVisible) {
        setInView(true);
      } else {
        if (rect.bottom < 0 || rect.top > windowHeight) {
          setInView(false);
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          } else {
            const rect = el.getBoundingClientRect();
            const windowHeight =
              window.innerHeight || document.documentElement.clientHeight;
            if (rect.bottom < 0 || rect.top > windowHeight) {
              setInView(false);
            }
          }
        });
      },
      {
        threshold: [0, 0.05, 0.1],
        rootMargin: "80px 0px -40px 0px",
      }
    );

    observer.observe(el);
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });
    checkVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  return (
    <section className="section alt relative overflow-hidden" id="aliadas" ref={sectionRef}>
      {/* Fondo de Grafo de Constelaciones y Estrellas al 100% de ancho de toda la sección */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Estrellas titilantes */}
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
          />
        ))}

        {/* Estrellas fugaces */}
        {shootingStars.map((ss, idx) => (
          <span
            key={`shooting-${idx}`}
            className="shooting-star-line"
            style={{
              top: ss.top,
              right: ss.right,
              width: `${ss.width}px`,
              animationDelay: ss.delay,
              animationDuration: ss.duration,
            }}
          />
        ))}
      </div>

      <div className="wrap relative z-10">
        {/* Encabezado General: Alianzas y Colectivos */}
        <SectionHead
          eyebrow="Redes y Convocatorias"
          title="Alianzas y Colectivos"
          lead="Quetzalia 2027 abre sus convocatorias oficiales para ponentes, marcas patrocinadoras y comunidades aliadas de todo el país."
          className="text-center mx-auto items-center mb-8"
        />

        {/* Layout en 2 Columnas Balanceadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start text-center py-4">
          {/* ================= COLUMNA 1: PONENTES ================= */}
          <div className="space-y-4 px-2 sm:px-6">
            <p className="text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
              Voces y Ponencias
            </p>
            <h3 className="text-2xl sm:text-3xl font-display text-[var(--head)] leading-snug">
              Mujeres que construyen el futuro
            </h3>

            {speakers.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-[var(--fg)] opacity-90 leading-relaxed max-w-md mx-auto">
                  El escenario de Quetzalia 2027 en la FES Acatlán de la UNAM está listo para amplificar tu trayectoria. Sé parte de las mujeres que lideran la vanguardia en ciencia y tecnología compartiendo tu ponencia o taller.
                </p>
                <div className="pt-2 flex justify-center">
                  <Link
                    href="/registro/speakers"
                    className="auth-btn-ghost auth-btn-lg inline-flex items-center gap-2 cursor-pointer group"
                  >
                    <span className="auth-btn-text text-sm sm:text-base">
                      Postula tu propuesta como Ponente →
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className={`people ${inView ? "in-view" : ""} !grid-cols-1 gap-4`}>
                {speakers.map((person, idx) => (
                  <article
                    className="person"
                    key={person.id}
                    style={{ "--speaker-delay": `${idx * 260}ms` } as React.CSSProperties}
                  >
                    <PhotoArch ariaLabel={`Fotografía de ${person.name}`} style={{ aspectRatio: "1" }}>
                      {person.photoUrl ? (
                        <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{person.name.charAt(0)}</span>
                      )}
                    </PhotoArch>

                    <div className="person-content">
                      <div className="speaker-chips-row">
                        <div className="speaker-chips">
                          <span className="speaker-chip chip-pink">{person.type || "Ponencia"}</span>
                          <span className="speaker-chip chip-salmon">{person.org}</span>
                        </div>

                        <button
                          type="button"
                          className="mobile-talk-toggle"
                          onClick={() => toggleTalk(person.id)}
                          aria-expanded={!!expandedTalks[person.id]}
                          aria-controls={`talk-body-${person.id}`}
                        >
                          <span>{expandedTalks[person.id] ? "Ocultar" : "Ver charla"}</span>
                        </button>
                      </div>

                      <h4 className="speaker-name text-lg font-bold">{person.name}</h4>

                      <div
                        id={`talk-body-${person.id}`}
                        className={`speaker-talk-body ${expandedTalks[person.id] ? "is-expanded" : ""}`}
                      >
                        <p className="speaker-talk-title">“{person.talk}”</p>
                        <p className="speaker-desc">{person.desc}</p>
                      </div>

                      {person.linkedin && (
                        <a
                          href={person.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="speaker-linkedin-btn mt-2"
                        >
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* ================= COLUMNA 2: MARCAS Y COMUNIDADES ================= */}
          <div className="space-y-4 px-2 sm:px-6 md:border-l md:border-[var(--rule)]">
            <p className="text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
              Alianzas y Colectivos
            </p>
            <h3 className="text-2xl sm:text-3xl font-display text-[var(--head)] leading-snug">
              Marcas Patrocinadoras y Comunidades STEM
            </h3>

            {sponsors.length === 0 && communities.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-[var(--fg)] opacity-90 leading-relaxed max-w-md mx-auto">
                  Abrimos este espacio para sumar fuerzas: invitamos tanto a empresas e instituciones que apuesten por el talento femenino en STEM, como a colectivos estudiantiles y clubes de ciencia que construyen en comunidad.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/registro/patrocinadores"
                    className="auth-btn-ghost auth-btn-lg inline-flex items-center gap-2 cursor-pointer group"
                  >
                    <span className="auth-btn-text text-sm sm:text-base">
                      Súmate como Patrocinador →
                    </span>
                  </Link>
                  <Link
                    href="/registro/comunidades"
                    className="auth-btn-ghost auth-btn-lg inline-flex items-center gap-2 cursor-pointer group"
                  >
                    <span className="auth-btn-text text-sm sm:text-base">
                      Registra a tu Comunidad →
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-left">
                {sponsors.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--accent)] mb-3 text-center">
                      Marcas Patrocinadoras
                    </h4>
                    <ul className="allies !grid-cols-2">
                      {sponsors.map((s) => (
                        <li key={s.id} className="font-semibold text-sm">
                          {s.logoUrl ? (
                            <img src={s.logoUrl} alt={s.name} className="max-h-10 max-w-full object-contain mx-auto" />
                          ) : (
                            <span>{s.name}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {communities.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--accent)] mb-3 text-center">
                      Comunidades STEM
                    </h4>
                    <ul className="allies !grid-cols-2">
                      {communities.map((c) => (
                        <li key={c.id} className="font-semibold text-sm">
                          <span>{c.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
