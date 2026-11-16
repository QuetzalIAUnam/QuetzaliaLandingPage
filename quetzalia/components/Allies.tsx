"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import PhotoArch from "./ui/PhotoArch";
import SectionHead from "./ui/SectionHead";
import rawSpeakers from "@/data/speakers.json";

interface SpeakerItem {
  id: string;
  name: string;
  org: string;
  type: string;
  desc: string;
  talk: string;
  linkedin?: string;
  photoUrl?: string;
  placeholderText?: string;
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

const DEFAULT_SPONSORS: SponsorItem[] = [
  { id: "sp-1", name: "Ixalli" },
  { id: "sp-2", name: "NVIDIA" },
  { id: "sp-3", name: "Oracle Cloud" },
  { id: "sp-4", name: "UNAM - MAC" },
];

const DEFAULT_COMMUNITIES: CommunityItem[] = [
  { id: "com-1", name: "Club de Algoritmia UNAM" },
  { id: "com-2", name: "Mujeres en STEM FES" },
  { id: "com-3", name: "IEEE WIE México" },
  { id: "com-4", name: "Colectivo Código Rosa" },
];

export default function Allies() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [expandedTalks, setExpandedTalks] = useState<Record<string, boolean>>({});

  // Carga inicial con los datos oficiales garantizados para que nunca quede vacía
  const [speakers, setSpeakers] = useState<SpeakerItem[]>(rawSpeakers as SpeakerItem[]);
  const [sponsors, setSponsors] = useState<SponsorItem[]>(DEFAULT_SPONSORS);
  const [communities, setCommunities] = useState<CommunityItem[]>(DEFAULT_COMMUNITIES);

  // Estrellas fijas titilantes al 100% de ancho de la sección
  const stars = useMemo(
    () => [
      { top: "6%", left: "4%", size: 3, delay: "0s", duration: "2.8s" },
      { top: "14%", left: "93%", size: 3.5, delay: "1.2s", duration: "3.4s" },
      { top: "28%", left: "2%", size: 2.5, delay: "0.5s", duration: "2.5s" },
      { top: "42%", left: "96%", size: 3, delay: "1.8s", duration: "4.1s" },
      { top: "58%", left: "5%", size: 3.5, delay: "0.9s", duration: "3.1s" },
      { top: "72%", left: "92%", size: 2.5, delay: "2.2s", duration: "2.9s" },
      { top: "86%", left: "8%", size: 3, delay: "1.5s", duration: "3.7s" },
      { top: "94%", left: "88%", size: 2.5, delay: "0.3s", duration: "2.6s" },
      { top: "20%", left: "48%", size: 3, delay: "2.5s", duration: "3.5s" },
      { top: "50%", left: "52%", size: 2.5, delay: "1.1s", duration: "3.2s" },
      { top: "82%", left: "46%", size: 3, delay: "0.7s", duration: "3.8s" },
      { top: "34%", left: "25%", size: 2.5, delay: "1.9s", duration: "3.0s" },
      { top: "66%", left: "76%", size: 3, delay: "2.0s", duration: "3.6s" },
    ],
    []
  );

  // Destellos Art Déco de 4 puntas distribuidos armoniosamente
  const sparks = useMemo(
    () => [
      { top: "10%", left: "12%", size: 16, delay: "0.3s", duration: "3.8s" },
      { top: "18%", left: "84%", size: 20, delay: "1.6s", duration: "4.2s" },
      { top: "38%", left: "48%", size: 14, delay: "2.1s", duration: "3.4s" },
      { top: "62%", left: "14%", size: 18, delay: "0.9s", duration: "4.0s" },
      { top: "76%", left: "82%", size: 16, delay: "2.7s", duration: "3.6s" },
      { top: "90%", left: "40%", size: 15, delay: "1.4s", duration: "3.9s" },
    ],
    []
  );

  // Estrellas fugaces cruzando diagonalmente
  const shootingStars = useMemo(
    () => [
      { top: "12%", right: "8%", width: 140, delay: "0s", duration: "4.5s" },
      { top: "35%", right: "36%", width: 160, delay: "2.2s", duration: "5.5s" },
      { top: "60%", right: "16%", width: 130, delay: "3.8s", duration: "4.8s" },
      { top: "78%", right: "62%", width: 150, delay: "1.5s", duration: "6.0s" },
    ],
    []
  );

  const toggleTalk = (id: string) => {
    setExpandedTalks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Cargar datos reales aprobados desde la base de datos sin romper los predeterminados
  useEffect(() => {
    let isMounted = true;
    fetch("/api/public/showcase")
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching showcase");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;

        // Combinar datos aprobados de la BD con los predeterminados
        if (data.speakers && data.speakers.length > 0) {
          const dbIds = new Set(data.speakers.map((s: SpeakerItem) => s.id));
          const fallbackFiltered = (rawSpeakers as SpeakerItem[]).filter((s) => !dbIds.has(s.id));
          setSpeakers([...data.speakers, ...fallbackFiltered]);
        }

        if (data.sponsors && data.sponsors.length > 0) {
          const dbSponsorIds = new Set(data.sponsors.map((s: SponsorItem) => s.id));
          const fallbackSponsors = DEFAULT_SPONSORS.filter((s) => !dbSponsorIds.has(s.id));
          setSponsors([...data.sponsors, ...fallbackSponsors]);
        }

        if (data.communities && data.communities.length > 0) {
          const dbComIds = new Set(data.communities.map((c: CommunityItem) => c.id));
          const fallbackCom = DEFAULT_COMMUNITIES.filter((c) => !dbComIds.has(c.id));
          setCommunities([...data.communities, ...fallbackCom]);
        }
      })
      .catch((err) => {
        console.warn("Showcase API usando catálogo oficial:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Observador de visibilidad para activar las animaciones de las tarjetas y nombres
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top < windowHeight * 0.88 && rect.bottom > 60;

      if (isVisible) {
        setInView(true);
      } else if (rect.bottom < 0 || rect.top > windowHeight) {
        setInView(false);
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
      {/* Fondo de Estrellas y Estrellas Fugaces al 100% de ancho de toda la sección */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Puntos de estrellas titilantes con halo */}
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
              boxShadow: "0 0 8px var(--accent), 0 0 14px rgba(244, 179, 217, 0.6)",
            }}
          />
        ))}

        {/* Destellos Art Déco de 4 puntas */}
        {sparks.map((sp, idx) => (
          <span
            key={`spark-${idx}`}
            className="allies-spark"
            style={{
              position: "absolute",
              top: sp.top,
              left: sp.left,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              backgroundColor: "var(--accent)",
              clipPath: "polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%)",
              animation: `twinkle ${sp.duration} ease-in-out infinite`,
              animationDelay: sp.delay,
              opacity: 0.8,
              filter: "drop-shadow(0 0 6px var(--accent))",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Estrellas fugaces cruzando */}
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
        {/* Encabezado General Centrado */}
        <SectionHead
          eyebrow="Voces, Alianzas y Colectivos"
          title="Mujeres que ya están construyendo el futuro"
          lead="Conoce a las ponentes confirmadas de la industria y la academia, así como a las marcas e iniciativas STEM que impulsan el encuentro Quetzalia 2027 en la FES Acatlán de la UNAM."
          className="text-center mx-auto items-center mb-12"
        />

        {/* Layout en 2 Columnas Balanceadas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================= COLUMNA 1: PONENTES (7 columnas en desktop) ================= */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="text-center mb-6">
              <p className="eyebrow mb-1">Voces y Ponencias</p>
              <h3 className="text-2xl sm:text-3xl font-display text-[var(--head)] leading-snug">
                Ponentes Confirmadas
              </h3>
            </div>

            <div className={`people ${inView ? "in-view" : ""} !grid-cols-1 sm:!grid-cols-2 gap-6`}>
              {speakers.map((person, idx) => (
                <article
                  className="person"
                  key={person.id}
                  style={{ "--speaker-delay": `${idx * 220}ms` } as React.CSSProperties}
                >
                  <PhotoArch
                    ariaLabel={`Fotografía de ${person.name}`}
                    style={{ aspectRatio: "1" }}
                  >
                    {person.photoUrl ? (
                      <img
                        src={person.photoUrl}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{person.placeholderText || person.name.charAt(0)}</span>
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
                        <span>
                          {expandedTalks[person.id] ? "Ocultar" : "Ver charla"}
                        </span>
                        <svg
                          className={`toggle-chevron ${
                            expandedTalks[person.id] ? "rotated" : ""
                          }`}
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>

                    <h4 className="speaker-name">{person.name}</h4>

                    <div
                      id={`talk-body-${person.id}`}
                      className={`speaker-talk-body ${
                        expandedTalks[person.id] ? "is-expanded" : ""
                      }`}
                    >
                      <p className="speaker-talk-title">“{person.talk}”</p>
                      <p className="speaker-desc">{person.desc}</p>
                    </div>

                    {person.linkedin && (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="speaker-linkedin-btn"
                        aria-label={`LinkedIn de ${person.name}`}
                        title={`LinkedIn de ${person.name}`}
                      >
                        <svg
                          className="linkedin-icon"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.66 1.66 0 1 0 0 3.32 1.66 1.66 0 0 0 0-3.32Z" />
                        </svg>
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Convocatoria Ponentes */}
            <div className="mt-8 pt-5 border-t border-[var(--rule)] text-center">
              <p className="text-sm text-[var(--fg)] opacity-90 mb-3 max-w-md mx-auto">
                ¿Tienes una investigación, proyecto o taller que quieras compartir en Quetzalia 2027?
              </p>
              <Link
                href="/registro/speakers"
                className="btn btn-ghost text-xs tracking-widest uppercase inline-flex items-center gap-2"
              >
                Postula tu propuesta como Ponente →
              </Link>
            </div>
          </div>

          {/* ================= COLUMNA 2: ALIANZAS Y COLECTIVOS (5 columnas en desktop) ================= */}
          <div className="lg:col-span-5 flex flex-col lg:border-l lg:border-[var(--rule)] lg:pl-10">
            <div className="text-center mb-6">
              <p className="eyebrow mb-1">Alianzas y Colectivos</p>
              <h3 className="text-2xl sm:text-3xl font-display text-[var(--head)] leading-snug">
                Patrocinadores y STEM
              </h3>
            </div>

            <p className="text-sm text-[var(--fg)] opacity-90 leading-relaxed text-center mb-6 max-w-sm mx-auto">
              Sumamos a instituciones, empresas comprometidas con la equidad en tecnología y colectivos estudiantiles que fortalecen la comunidad.
            </p>

            {/* Marcas Patrocinadoras */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--accent)] mb-3 text-center">
                Marcas e Instituciones
              </h4>
              <ul className="allies !grid-cols-2">
                {sponsors.map((s) => (
                  <li key={s.id} className="font-semibold text-sm">
                    {s.logoUrl ? (
                      <img
                        src={s.logoUrl}
                        alt={s.name}
                        className="max-h-10 max-w-full object-contain mx-auto"
                      />
                    ) : (
                      <span>{s.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Comunidades STEM */}
            <div className="mb-8">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--accent)] mb-3 text-center">
                Comunidades y Colectivos STEM
              </h4>
              <ul className="allies !grid-cols-2">
                {communities.map((c) => (
                  <li key={c.id} className="font-semibold text-sm">
                    {c.logoUrl ? (
                      <img
                        src={c.logoUrl}
                        alt={c.name}
                        className="max-h-10 max-w-full object-contain mx-auto"
                      />
                    ) : (
                      <span>{c.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Convocatorias Patrocinadores y Comunidades */}
            <div className="pt-5 border-t border-[var(--rule)] flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/registro/patrocinadores"
                className="btn btn-primary text-xs tracking-widest uppercase inline-flex items-center gap-1.5"
              >
                Súmate como Patrocinador →
              </Link>
              <Link
                href="/registro/comunidades"
                className="btn btn-ghost text-xs tracking-widest uppercase inline-flex items-center gap-1.5"
              >
                Registra a tu Comunidad →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
