"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import PhotoArch from "./ui/PhotoArch";
import SectionHead from "./ui/SectionHead";

import { SocialLinks } from "@/lib/types";

interface SpeakerItem {
  id: string;
  name: string;
  org: string;
  type: string;
  desc: string;
  talk: string;
  linkedin?: string;
  photoUrl?: string;
  tagline?: string;
  badges?: string[];
  inspirationQuote?: string;
  socials?: SocialLinks;
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
  communityMotto?: string;
  communityGoal?: string;
  socials?: SocialLinks;
}

function formatSocialUrl(
  url: string,
  platform: "linkedin" | "instagram" | "tiktok" | "twitter" | "website"
): string {
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  // Bloqueo preventivo de esquemas de scripting (XSS)
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return "#";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const clean = trimmed.replace(/^@/, "").replace(/['"<>\s]/g, "");
  switch (platform) {
    case "instagram":
      return `https://instagram.com/${clean}`;
    case "tiktok":
      return `https://tiktok.com/@${clean}`;
    case "linkedin":
      return clean.includes("company/") || clean.includes("in/")
        ? `https://linkedin.com/${clean}`
        : `https://linkedin.com/in/${clean}`;
    case "twitter":
      return `https://x.com/${clean}`;
    case "website":
    default:
      return `https://${clean}`;
  }
}

export default function Allies() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [expandedTalks, setExpandedTalks] = useState<Record<string, boolean>>({});
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerItem | null>(null);

  // Cerrar modales con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCommunity(null);
        setSelectedSpeaker(null);
      }
    };
    if (selectedCommunity || selectedSpeaker) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCommunity, selectedSpeaker]);

  // Los datos provienen estrictamente de la base de datos (Firestore)
  const [speakers, setSpeakers] = useState<SpeakerItem[]>([]);
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [communities, setCommunities] = useState<CommunityItem[]>([]);

  // Límite inicial de elementos visibles antes de desplegar "Ver más"
  const SHOWCASE_PAGE_SIZE = 6;
  const [showAllSpeakers, setShowAllSpeakers] = useState(false);
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  const [showAllSponsors, setShowAllSponsors] = useState(false);

  // Listas calculadas con paginación progresiva
  const visibleSpeakers = showAllSpeakers ? speakers : speakers.slice(0, SHOWCASE_PAGE_SIZE);
  const visibleCommunities = showAllCommunities ? communities : communities.slice(0, SHOWCASE_PAGE_SIZE);
  const visibleSponsors = showAllSponsors ? sponsors : sponsors.slice(0, SHOWCASE_PAGE_SIZE);

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

  // Cargar datos reales aprobados directamente desde la base de datos (Firestore)
  useEffect(() => {
    let isMounted = true;
    fetch("/api/public/showcase")
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching showcase");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setSpeakers(data.speakers || []);
        setSponsors(data.sponsors || []);
        setCommunities(data.communities || []);
      })
      .catch((err) => {
        console.warn("Showcase API en espera de datos aprobados:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Observador de visibilidad para animaciones de entrada
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

  const hasApprovedShowcase = speakers.length > 0 || sponsors.length > 0 || communities.length > 0;

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
        {/* Encabezado General: Alianzas y Colectivos */}
        <SectionHead
          eyebrow="Redes y Convocatorias"
          title="Alianzas y Colectivos"
          lead={
            hasApprovedShowcase
              ? "Conoce a las ponentes confirmadas de la industria y la academia, así como a las marcas e iniciativas STEM que impulsan el encuentro Quetzalia 2027 en la FES Acatlán de la UNAM."
              : "Quetzalia 2027 abre sus convocatorias oficiales para ponentes, marcas patrocinadoras y comunidades aliadas de todo el país."
          }
          className="text-center mx-auto items-center mb-8"
        />

        {/* Layout en Filas (Rows): Fila 1 Ponentes, Fila 2 Comunidades, Fila 3 Marcas Patrocinadoras */}
        <div className="space-y-16 py-4">
          {/* ================= FILA 1: VOCES Y PONENCIAS (PONENTES) ================= */}
          <div className="space-y-6 text-center">
            <div className="space-y-2 max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
                Voces y Ponencias
              </p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display text-[var(--head)] leading-snug">
                Mujeres que construyen el futuro
              </h3>
            </div>

            {speakers.length === 0 ? (
              <div className="p-5 sm:p-8 md:p-10 border border-[var(--rule)] bg-[var(--card)]/80 max-w-2xl mx-auto space-y-4 shadow-sm backdrop-blur-xs">
                <p className="text-sm sm:text-base text-[var(--fg)] opacity-90 leading-relaxed max-w-xl mx-auto">
                  El escenario de Quetzalia 2027 en la FES Acatlán de la UNAM está listo para amplificar tu trayectoria. Sé parte de las mujeres que lideran la vanguardia en ciencia y tecnología compartiendo tu ponencia o taller.
                </p>
                <div className="pt-2 flex justify-center">
                  <Link
                    href="/registro/speakers"
                    className="auth-btn-ghost auth-btn-lg inline-flex items-center justify-center text-center gap-2 cursor-pointer group max-w-full"
                  >
                    <span className="auth-btn-text text-xs sm:text-base text-center leading-relaxed whitespace-normal">
                      Postula tu propuesta como Ponente →
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className={`people ${inView ? "in-view" : ""} ${
                    speakers.length === 1
                      ? "flex justify-center"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center"
                  }`}
                >
                  {visibleSpeakers.map((person, idx) => (
                    <article
                      className="person group w-full max-w-[360px] mx-auto bg-[var(--card)] border border-[var(--rule)] hover:border-[var(--accent)] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                      key={person.id}
                      style={{ "--speaker-delay": `${idx * 260}ms` } as React.CSSProperties}
                    >
                      {/* Marco acotado y centrado para la foto con proporciones estrictas */}
                      <div
                        className="w-full flex justify-center mb-3 cursor-pointer group/photo"
                        onClick={() => setSelectedSpeaker(person)}
                        title="Clic para ver semblanza completa"
                      >
                        <PhotoArch
                          src={person.photoUrl}
                          alt={`Fotografía oficial de ${person.name}`}
                          ariaLabel={`Fotografía de ${person.name}`}
                          className="w-full max-w-[260px] aspect-square rounded-t-full overflow-hidden shadow-inner border border-[var(--rule)] group-hover:border-[var(--accent)] group-hover/photo:scale-102 transition-all"
                          style={{ aspectRatio: "1" }}
                        >
                          {!person.photoUrl && (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--accent)] p-4">
                              <span className="font-display text-4xl sm:text-5xl font-bold">
                                {person.name.charAt(0).toUpperCase()}
                              </span>
                              <span className="text-[10px] uppercase font-mono tracking-widest mt-1 opacity-75 font-semibold">
                                Ponente STEM
                              </span>
                            </div>
                          )}
                        </PhotoArch>
                      </div>

                      <div className="person-content flex-1 flex flex-col justify-between">
                        <div className="space-y-2.5">
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
                              <span>{expandedTalks[person.id] ? "Ocultar" : "Resumen"}</span>
                            </button>
                          </div>

                          <h4
                            onClick={() => setSelectedSpeaker(person)}
                            className="speaker-name text-lg font-bold text-[var(--head)] group-hover:text-[var(--accent-text)] transition-colors line-clamp-2 cursor-pointer"
                            title="Clic para ver semblanza completa"
                          >
                            {person.name}
                          </h4>

                          {/* Condecoraciones en la tarjeta */}
                          {person.badges && person.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {person.badges.slice(0, 2).map((b, bIdx) => (
                                <span
                                  key={bIdx}
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/30 flex items-center gap-1"
                                >
                                  <span>🏅</span>
                                  <span className="truncate max-w-[140px]">{b}</span>
                                </span>
                              ))}
                              {person.badges.length > 2 && (
                                <span className="text-[10px] opacity-70 self-center font-medium">
                                  +{person.badges.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Frase personal destacada */}
                          {person.tagline && (
                            <p className="text-xs italic text-[var(--accent-text)] line-clamp-1 border-l-2 border-[var(--accent)] pl-2 my-1 font-serif">
                              “{person.tagline}”
                            </p>
                          )}

                          <div
                            id={`talk-body-${person.id}`}
                            className={`speaker-talk-body ${expandedTalks[person.id] ? "is-expanded" : ""}`}
                          >
                            <p className="speaker-talk-title">“{person.talk}”</p>
                            <p className="speaker-desc line-clamp-4">{person.desc}</p>
                          </div>
                        </div>

                        {/* Botón Ver Ficha y Semblanza */}
                        <div className="pt-3">
                          <button
                            type="button"
                            onClick={() => setSelectedSpeaker(person)}
                            className="w-full py-2 px-3 rounded-xl border border-[var(--rule)] bg-[var(--bg-alt)]/60 hover:bg-[var(--accent)] hover:text-white text-xs font-semibold text-[var(--head)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs group/btn"
                          >
                            <span>Ver semblanza y charla</span>
                            <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
                          </button>
                        </div>

                        {/* Redes sociales de la ponente */}
                        {(() => {
                          const s = person.socials || {};
                          const li = s.linkedin || person.linkedin;
                          const ig = s.instagram;
                          const tt = s.tiktok;
                          const tw = s.twitter;
                          const web = s.website;

                          if (!li && !ig && !tt && !tw && !web) return null;

                          return (
                            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-[var(--rule)]/40">
                              {li && (
                                <a
                                  href={formatSocialUrl(li, "linkedin")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors"
                                  title="LinkedIn"
                                >
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                  </svg>
                                  <span>LinkedIn</span>
                                </a>
                              )}
                              {ig && (
                                <a
                                  href={formatSocialUrl(ig, "instagram")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-colors"
                                  title="Instagram"
                                >
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                  </svg>
                                  <span>Instagram</span>
                                </a>
                              )}
                              {tt && (
                                <a
                                  href={formatSocialUrl(tt, "tiktok")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/10 dark:bg-white/10 text-[var(--head)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                                  title="TikTok"
                                >
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                  </svg>
                                  <span>TikTok</span>
                                </a>
                              )}
                              {tw && (
                                <a
                                  href={formatSocialUrl(tw, "twitter")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--bg-alt)] text-[var(--head)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                                  title="X / Twitter"
                                >
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                  </svg>
                                  <span>X</span>
                                </a>
                              )}
                              {web && (
                                <a
                                  href={formatSocialUrl(web, "website")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent-text)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                                  title="Sitio Web o Portafolio"
                                >
                                  <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                  </svg>
                                  <span>Web</span>
                                </a>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </article>
                  ))}
                </div>

                {/* Botón Ver Más / Mostrar Menos Ponentes */}
                {speakers.length > SHOWCASE_PAGE_SIZE && (
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowAllSpeakers(!showAllSpeakers)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-[var(--accent)] text-[var(--head)] bg-[var(--card)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer group"
                    >
                      <span className="transition-transform duration-300 group-hover:scale-110">
                        {showAllSpeakers ? "▲" : "▼"}
                      </span>
                      <span>
                        {showAllSpeakers
                          ? "Mostrar menos ponentes"
                          : `Ver más ponentes (${speakers.length - SHOWCASE_PAGE_SIZE} restantes)`}
                      </span>
                    </button>
                  </div>
                )}

                <div className="pt-2 flex justify-center">
                  <Link
                    href="/registro/speakers"
                    className="auth-btn-ghost inline-flex items-center justify-center gap-2 cursor-pointer text-xs max-w-full text-center"
                  >
                    <span className="auth-btn-text text-center whitespace-normal leading-relaxed text-xs sm:text-sm">
                      ¿Deseas compartir una charla o taller? Postula tu propuesta →
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="w-full border-t border-[var(--rule)]/60" />

          {/* ================= FILA 2: COMUNIDADES Y COLECTIVOS STEM ================= */}
          <div className="space-y-6 text-center">
            <div className="space-y-2 max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
                Redes Universitarias
              </p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display text-[var(--head)] leading-snug">
                Comunidades y Colectivos STEM
              </h3>
            </div>

            {communities.length === 0 ? (
              <div className="p-5 sm:p-8 md:p-10 border border-[var(--rule)] bg-[var(--card)]/80 max-w-2xl mx-auto space-y-4 shadow-sm backdrop-blur-xs">
                <p className="text-sm sm:text-base text-[var(--fg)] opacity-90 leading-relaxed max-w-xl mx-auto">
                  Espacio reservado para clubes de robótica, capítulos IEEE, colectivos de mujeres tecnólogas y agrupaciones estudiantiles. Suma a tu colectivo para visibilizar sus causas y proyectos en el encuentro.
                </p>
                <div className="pt-2 flex justify-center">
                  <Link
                    href="/registro/comunidades"
                    className="auth-btn-ghost auth-btn-lg inline-flex items-center justify-center text-center gap-2 cursor-pointer group max-w-full"
                  >
                    <span className="auth-btn-text text-xs sm:text-base text-center leading-relaxed whitespace-normal">
                      Registra a tu Comunidad →
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 list-none p-0">
                  {visibleCommunities.map((c) => (
                    <li key={c.id} className="h-full">
                      <button
                        type="button"
                        onClick={() => setSelectedCommunity(c)}
                        className="group w-full h-full text-center p-5 bg-[var(--card)] border border-[var(--rule)] hover:border-[var(--accent)] hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                        aria-haspopup="dialog"
                        aria-label={`Ver ficha de la comunidad ${c.name}`}
                      >
                        {/* Marco bonito para el emblema / imagen */}
                        <div className="w-full flex justify-center mb-3">
                          <div className="relative w-28 h-28 sm:w-32 sm:h-32 p-3 bg-gradient-to-b from-[var(--bg-alt)]/80 to-[var(--bg)] border-2 border-[var(--rule)] group-hover:border-[var(--accent)] rounded-2xl shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(164,53,124,0.2)]">
                            {/* Esquinas Art Déco sutiles */}
                            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[var(--accent)] rounded-tl-sm pointer-events-none opacity-80" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[var(--accent)] rounded-tr-sm pointer-events-none opacity-80" />
                            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[var(--accent)] rounded-bl-sm pointer-events-none opacity-80" />
                            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[var(--accent)] rounded-br-sm pointer-events-none opacity-80" />

                            {c.logoUrl ? (
                              <img
                                src={c.logoUrl}
                                alt={c.name}
                                className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-[var(--accent)]">
                                <span className="font-display text-3xl font-bold">
                                  {c.name.charAt(0).toUpperCase()}
                                </span>
                                <span className="text-[10px] tracking-widest uppercase opacity-75 font-semibold">
                                  Aliada
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Nombre de la comunidad */}
                        <div className="text-center w-full flex-1 flex flex-col justify-center">
                          <h4 className="font-display text-base sm:text-lg font-bold text-[var(--head)] group-hover:text-[var(--accent-text)] transition-colors line-clamp-2">
                            {c.name}
                          </h4>
                        </div>

                        {/* Indicador de acción (reemplaza Coord) */}
                        <div className="mt-3 pt-2 w-full border-t border-[var(--rule)]/50 flex items-center justify-center text-xs font-semibold text-[var(--accent-text)] group-hover:underline gap-1">
                          <span>Conocer comunidad</span>
                          <span aria-hidden="true">→</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Botón Ver Más / Mostrar Menos Comunidades */}
                {communities.length > SHOWCASE_PAGE_SIZE && (
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowAllCommunities(!showAllCommunities)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-[var(--accent)] text-[var(--head)] bg-[var(--card)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer group"
                    >
                      <span className="transition-transform duration-300 group-hover:scale-110">
                        {showAllCommunities ? "▲" : "▼"}
                      </span>
                      <span>
                        {showAllCommunities
                          ? "Mostrar menos colectivos"
                          : `Ver más colectivos aliados (${communities.length - SHOWCASE_PAGE_SIZE} restantes)`}
                      </span>
                    </button>
                  </div>
                )}

                <div className="pt-2 flex justify-center">
                  <Link
                    href="/registro/comunidades"
                    className="auth-btn-ghost inline-flex items-center justify-center gap-2 cursor-pointer text-xs max-w-full text-center"
                  >
                    <span className="auth-btn-text text-center whitespace-normal leading-relaxed text-xs sm:text-sm">
                      ¿Representas un colectivo? Registra a tu Comunidad →
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="w-full border-t border-[var(--rule)]/60" />

          {/* ================= FILA 3: MARCAS PATROCINADORAS E INSTITUCIONES ================= */}
          <div className="space-y-6 text-center">
            <div className="space-y-2 max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
                Alianzas Estratégicas
              </p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display text-[var(--head)] leading-snug">
                Marcas Patrocinadoras e Instituciones
              </h3>
            </div>

            {sponsors.length === 0 ? (
              <div className="p-5 sm:p-8 md:p-10 border border-[var(--rule)] bg-[var(--card)]/80 max-w-2xl mx-auto space-y-4 shadow-sm backdrop-blur-xs">
                <p className="text-sm sm:text-base text-[var(--fg)] opacity-90 leading-relaxed max-w-xl mx-auto">
                  Espacio reservado para empresas, fundaciones e instituciones comprometidas con impulsar becas, mentorías y oportunidades profesionales para mujeres en ciencia y tecnología.
                </p>
                <div className="pt-2 flex justify-center">
                  <Link
                    href="/registro/patrocinadores"
                    className="auth-btn-ghost auth-btn-lg inline-flex items-center justify-center text-center gap-2 cursor-pointer group max-w-full"
                  >
                    <span className="auth-btn-text text-xs sm:text-base text-center leading-relaxed whitespace-normal">
                      Súmate como Patrocinador →
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <ul className="allies">
                  {visibleSponsors.map((s) => (
                    <li key={s.id} className="font-semibold text-sm flex flex-col items-center justify-center p-4">
                      {s.logoUrl ? (
                        <img
                          src={s.logoUrl}
                          alt={s.name}
                          className="max-h-16 max-w-full object-contain mb-2"
                        />
                      ) : null}
                      <span className="text-[var(--head)]">{s.name}</span>
                    </li>
                  ))}
                </ul>

                {/* Botón Ver Más / Mostrar Menos Patrocinadores */}
                {sponsors.length > SHOWCASE_PAGE_SIZE && (
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowAllSponsors(!showAllSponsors)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-[var(--accent)] text-[var(--head)] bg-[var(--card)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer group"
                    >
                      <span className="transition-transform duration-300 group-hover:scale-110">
                        {showAllSponsors ? "▲" : "▼"}
                      </span>
                      <span>
                        {showAllSponsors
                          ? "Mostrar menos patrocinadores"
                          : `Ver más marcas y alianzas (${sponsors.length - SHOWCASE_PAGE_SIZE} restantes)`}
                      </span>
                    </button>
                  </div>
                )}

                <div className="pt-2 flex justify-center">
                  <Link
                    href="/registro/patrocinadores"
                    className="auth-btn-ghost inline-flex items-center justify-center gap-2 cursor-pointer text-xs max-w-full text-center"
                  >
                    <span className="auth-btn-text text-center whitespace-normal leading-relaxed text-xs sm:text-sm">
                      ¿Te interesa una alianza corporativa? Sumar a mi Empresa →
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal / Ficha de la Comunidad */}
      {selectedCommunity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="community-modal-title"
          onClick={() => setSelectedCommunity(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[var(--card)] border-2 border-[var(--accent)] p-5 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setSelectedCommunity(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full border border-[var(--rule)] bg-[var(--bg-alt)] hover:bg-[var(--accent)] hover:text-white text-[var(--head)] flex items-center justify-center transition-colors cursor-pointer text-sm font-bold z-20 shadow-xs"
              aria-label="Cerrar ficha"
            >
              ✕
            </button>

            {/* Cabecera / Imagen con marco bonito */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 p-3 bg-gradient-to-b from-[var(--bg-alt)] to-[var(--bg)] border-2 border-[var(--accent)] rounded-2xl shadow-md flex items-center justify-center">
                <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[var(--head)]" />
                <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[var(--head)]" />
                <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[var(--head)]" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[var(--head)]" />
                {selectedCommunity.logoUrl ? (
                  <img
                    src={selectedCommunity.logoUrl}
                    alt={selectedCommunity.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                  />
                ) : (
                  <div className="text-center text-[var(--accent)]">
                    <span className="font-display text-4xl font-bold">
                      {selectedCommunity.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-[var(--accent)]">
                  Comunidad Aliada STEM
                </p>
                <h3
                  id="community-modal-title"
                  className="text-2xl sm:text-3xl font-display text-[var(--head)] font-bold mt-1"
                >
                  {selectedCommunity.name}
                </h3>
                {selectedCommunity.representative && (
                  <p className="text-xs text-[var(--fg)] opacity-80 mt-1 font-medium">
                    Coordinación / Representante: <strong className="text-[var(--head)]">{selectedCommunity.representative}</strong>
                  </p>
                )}

                {/* Grito de guerra o lema inspirador */}
                {selectedCommunity.communityMotto && (
                  <blockquote className="mt-2.5 py-1.5 px-3 bg-[var(--accent)]/10 border-l-2 border-[var(--accent)] text-xs italic text-[var(--head)] font-medium max-w-sm mx-auto">
                    “{selectedCommunity.communityMotto}”
                  </blockquote>
                )}
              </div>
            </div>

            {/* Propósito / Causa en Quetzalia */}
            {selectedCommunity.communityGoal && (
              <div className="border-t border-[var(--rule)] pt-4 space-y-1.5 text-left">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--accent)] flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Misión y Causa en Quetzalia:</span>
                </h4>
                <p className="text-xs sm:text-sm text-[var(--fg)] leading-relaxed bg-[var(--bg-alt)]/40 p-3 border border-[var(--rule)]">
                  {selectedCommunity.communityGoal}
                </p>
              </div>
            )}

            {/* Quiénes son y qué hacen */}
            <div className="border-t border-[var(--rule)] pt-4 space-y-2 text-left">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--head)]">
                Quiénes son y qué hacen:
              </h4>
              <div className="bg-[var(--bg-alt)]/40 p-4 border border-[var(--rule)] text-sm text-[var(--fg)] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedCommunity.desc || "Colectivo aliado comprometido con visibilizar y empoderar el liderazgo de las mujeres en ciencia y tecnología en Quetzalia 2027."}
              </div>
            </div>

            {/* Redes y Canales Oficiales */}
            <div className="border-t border-[var(--rule)] pt-4 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--head)] text-left">
                Redes y Canales Oficiales:
              </h4>
              {(() => {
                const s = selectedCommunity.socials || {};
                const li = s.linkedin;
                const ig = s.instagram;
                const tt = s.tiktok;
                const tw = s.twitter;
                const web = s.website;

                if (!li && !ig && !tt && !tw && !web) {
                  return (
                    <p className="text-xs text-[var(--fg)] opacity-70 italic text-left">
                      Esta comunidad no ha registrado enlaces externos aún.
                    </p>
                  );
                }

                return (
                  <div className="flex flex-wrap items-center gap-2">
                    {ig && (
                      <a
                        href={formatSocialUrl(ig, "instagram")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>Instagram</span>
                      </a>
                    )}
                    {li && (
                      <a
                        href={formatSocialUrl(li, "linkedin")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {tt && (
                      <a
                        href={formatSocialUrl(tt, "tiktok")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/10 dark:bg-white/10 text-[var(--head)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                        <span>TikTok</span>
                      </a>
                    )}
                    {tw && (
                      <a
                        href={formatSocialUrl(tw, "twitter")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--bg-alt)] text-[var(--head)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <span>X</span>
                      </a>
                    )}
                    {web && (
                      <a
                        href={formatSocialUrl(web, "website")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent-text)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span>Sitio Web</span>
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Pie de modal */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setSelectedCommunity(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[var(--rule)] bg-[var(--bg-alt)] hover:bg-[var(--head)] hover:text-[var(--bg)] text-xs font-semibold text-[var(--head)] transition-all cursor-pointer shadow-xs"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Ficha Oficial de Ponente */}
      {selectedSpeaker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="speaker-modal-title"
          onClick={() => setSelectedSpeaker(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[var(--card)] border-2 border-[var(--accent)] p-5 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full border border-[var(--rule)] bg-[var(--bg-alt)] hover:bg-[var(--accent)] hover:text-white text-[var(--head)] flex items-center justify-center transition-colors cursor-pointer text-sm font-bold z-20 shadow-xs"
              aria-label="Cerrar semblanza"
            >
              ✕
            </button>

            {/* Cabecera / Fotografía con PhotoArch */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-28 h-28 sm:w-36 sm:h-36">
                <PhotoArch
                  src={selectedSpeaker.photoUrl}
                  alt={`Fotografía oficial de ${selectedSpeaker.name}`}
                  ariaLabel={`Fotografía de ${selectedSpeaker.name}`}
                  className="w-full h-full aspect-square rounded-t-full overflow-hidden shadow-md border-2 border-[var(--accent)]"
                >
                  {!selectedSpeaker.photoUrl && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[var(--accent)] p-2">
                      <span className="font-display text-4xl font-bold">
                        {selectedSpeaker.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </PhotoArch>
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="speaker-chip chip-pink text-[11px] font-semibold">
                    {selectedSpeaker.type === "Taller" ? "🛠️ Taller Práctico" : "🎙️ Ponencia"}
                  </span>
                  <span className="speaker-chip chip-salmon text-[11px] font-semibold">
                    {selectedSpeaker.org}
                  </span>
                </div>
                <h3
                  id="speaker-modal-title"
                  className="text-2xl sm:text-3xl font-display text-[var(--head)] font-bold"
                >
                  {selectedSpeaker.name}
                </h3>
              </div>
            </div>

            {/* Condecoraciones e Insignias */}
            {selectedSpeaker.badges && selectedSpeaker.badges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {selectedSpeaker.badges.map((badge, bIdx) => (
                  <span
                    key={`modal-badge-${bIdx}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[var(--accent)]/15 to-amber-500/15 border border-[var(--accent)]/40 text-[var(--head)] shadow-xs"
                  >
                    <span>🏅</span>
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Frase / Lema Personal */}
            {selectedSpeaker.tagline && (
              <blockquote className="p-4 bg-[var(--accent)]/10 border-l-4 border-[var(--accent)] text-center text-sm italic font-serif text-[var(--head)] leading-relaxed rounded-r-lg">
                “{selectedSpeaker.tagline}”
              </blockquote>
            )}

            {/* Detalle de la Ponencia / Taller */}
            <div className="border-t border-[var(--rule)] pt-4 space-y-2 text-left">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--accent)]">
                Propuesta de Sesión:
              </h4>
              <p className="text-base sm:text-lg font-display text-[var(--head)] font-bold">
                “{selectedSpeaker.talk}”
              </p>
              <div className="bg-[var(--bg-alt)]/50 p-4 border border-[var(--rule)] text-xs sm:text-sm text-[var(--fg)] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedSpeaker.desc || "Información y semblanza en proceso de validación oficial ante el comité organizador."}
              </div>
            </div>

            {/* Mensaje de inspiración / Mujeres en STEM */}
            {selectedSpeaker.inspirationQuote && (
              <div className="border-t border-[var(--rule)] pt-4 space-y-1.5 text-left">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--head)] flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Mensaje para inspirar a más mujeres en STEM:</span>
                </h4>
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs sm:text-sm text-[var(--fg)] leading-relaxed italic">
                  “{selectedSpeaker.inspirationQuote}”
                </div>
              </div>
            )}

            {/* Redes Sociales y Enlaces Oficiales */}
            <div className="border-t border-[var(--rule)] pt-4 space-y-2.5">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--head)] text-left">
                Conecta con la Ponente:
              </h4>
              {(() => {
                const s = selectedSpeaker.socials || {};
                const li = s.linkedin || selectedSpeaker.linkedin;
                const ig = s.instagram;
                const tt = s.tiktok;
                const tw = s.twitter;
                const web = s.website;

                if (!li && !ig && !tt && !tw && !web) {
                  return (
                    <p className="text-xs text-[var(--fg)] opacity-70 italic text-left">
                      Esta ponente no ha registrado enlaces adicionales.
                    </p>
                  );
                }

                return (
                  <div className="flex flex-wrap items-center gap-2">
                    {li && (
                      <a
                        href={formatSocialUrl(li, "linkedin")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {ig && (
                      <a
                        href={formatSocialUrl(ig, "instagram")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>Instagram</span>
                      </a>
                    )}
                    {tt && (
                      <a
                        href={formatSocialUrl(tt, "tiktok")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/10 dark:bg-white/10 text-[var(--head)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                        <span>TikTok</span>
                      </a>
                    )}
                    {tw && (
                      <a
                        href={formatSocialUrl(tw, "twitter")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--bg-alt)] text-[var(--head)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <span>X</span>
                      </a>
                    )}
                    {web && (
                      <a
                        href={formatSocialUrl(web, "website")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent-text)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span>Sitio Web</span>
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Pie de modal */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setSelectedSpeaker(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[var(--rule)] bg-[var(--bg-alt)] hover:bg-[var(--head)] hover:text-[var(--bg)] text-xs font-semibold text-[var(--head)] transition-all cursor-pointer shadow-xs"
              >
                Cerrar Semblanza
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
