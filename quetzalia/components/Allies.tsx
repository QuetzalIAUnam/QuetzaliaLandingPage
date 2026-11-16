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

  // Los datos provienen estrictamente de la base de datos (Firestore)
  const [speakers, setSpeakers] = useState<SpeakerItem[]>([]);
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [communities, setCommunities] = useState<CommunityItem[]>([]);

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
              <div className="p-8 sm:p-10 border border-[var(--rule)] bg-[var(--card)]/80 max-w-2xl mx-auto space-y-4 shadow-sm backdrop-blur-xs">
                <p className="text-sm sm:text-base text-[var(--fg)] opacity-90 leading-relaxed max-w-xl mx-auto">
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
              <div className={`people ${inView ? "in-view" : ""} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
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
              <div className="p-8 sm:p-10 border border-[var(--rule)] bg-[var(--card)]/80 max-w-2xl mx-auto space-y-4 shadow-sm backdrop-blur-xs">
                <p className="text-sm sm:text-base text-[var(--fg)] opacity-90 leading-relaxed max-w-xl mx-auto">
                  Espacio reservado para clubes de robótica, capítulos IEEE, colectivos de mujeres tecnólogas y agrupaciones estudiantiles. Suma a tu colectivo para visibilizar sus causas y proyectos en el encuentro.
                </p>
                <div className="pt-2 flex justify-center">
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
              <div className="space-y-6">
                <ul className="allies">
                  {communities.map((c) => (
                    <li key={c.id} className="font-semibold text-sm flex flex-col items-center justify-center p-4">
                      {c.logoUrl ? (
                        <img
                          src={c.logoUrl}
                          alt={c.name}
                          className="max-h-14 max-w-full object-contain mb-2"
                        />
                      ) : null}
                      <span className="text-[var(--head)]">{c.name}</span>
                      {c.representative && (
                        <span className="text-xs text-[var(--fg)] opacity-75 mt-0.5">
                          Coord: {c.representative}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="pt-2 flex justify-center">
                  <Link
                    href="/registro/comunidades"
                    className="auth-btn-ghost inline-flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <span className="auth-btn-text">
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
              <div className="p-8 sm:p-10 border border-[var(--rule)] bg-[var(--card)]/80 max-w-2xl mx-auto space-y-4 shadow-sm backdrop-blur-xs">
                <p className="text-sm sm:text-base text-[var(--fg)] opacity-90 leading-relaxed max-w-xl mx-auto">
                  Espacio reservado para empresas, fundaciones e instituciones comprometidas con impulsar becas, mentorías y oportunidades profesionales para mujeres en ciencia y tecnología.
                </p>
                <div className="pt-2 flex justify-center">
                  <Link
                    href="/registro/patrocinadores"
                    className="auth-btn-ghost auth-btn-lg inline-flex items-center gap-2 cursor-pointer group"
                  >
                    <span className="auth-btn-text text-sm sm:text-base">
                      Súmate como Patrocinador →
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <ul className="allies">
                  {sponsors.map((s) => (
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
                <div className="pt-2 flex justify-center">
                  <Link
                    href="/registro/patrocinadores"
                    className="auth-btn-ghost inline-flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <span className="auth-btn-text">
                      ¿Te interesa una alianza corporativa? Sumar a mi Empresa →
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
