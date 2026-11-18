"use client";

import React, { useEffect, useRef, useState } from "react";
import SectionHead from "./ui/SectionHead";

interface CommitteeMember {
  name: string;
  role: string;
  badge: string;
  institution: string;
  bio: string;
  linkedin: string;
}

const COMMITTEE_MEMBERS: CommitteeMember[] = [
  {
    name: "Jazmín Gil de Gaona",
    role: "Comité Organizador · Inteligencia Artificial y Educación",
    badge: "Google Student Ambassador · MAC UNAM",
    institution: "FES Acatlán, UNAM",
    bio: "Estudiante de Matemáticas Aplicadas y Computación (MAC) en la FES Acatlán y seleccionada en la 1.ª generación de Estudiantes Embajadores de Google en México. Apasionada por la intersección entre matemáticas, educación e inteligencia artificial ética y pedagógica, impulsando el liderazgo de más mujeres en STEM.",
    linkedin: "https://www.linkedin.com/in/jazmin-gil-de-gaona-88b5712a1/",
  },
  {
    name: "Alyn Márquez",
    role: "Comité Organizador · Coordinación y Comunidad STEM",
    badge: "Comunidad STEM · FES Acatlán",
    institution: "FES Acatlán, UNAM",
    bio: "Líder universitaria comprometida con la articulación, logística e integración comunitaria en Quetzal-IA. Dedicada a crear espacios de aprendizaje seguros, dinámicos e inspiradores donde cada participante encuentre acompañamiento, herramientas prácticas y confianza para su crecimiento.",
    linkedin: "https://www.linkedin.com/in/alynmarquez/",
  },
  {
    name: "Estefani Lira",
    role: "Comité Organizador · Vinculación y Alianzas Estratégicas",
    badge: "Vinculación y Difusión · FES Acatlán",
    institution: "FES Acatlán, UNAM",
    bio: "Impulsora de la divulgación científica y tecnológica en la comunidad universitaria. Dedicada a tender puentes con aliadas, patrocinadores y colectivos del sector tecnológico, visibilizando el talento femenino y abriendo oportunidades reales para futuras científicas e ingenieras.",
    linkedin: "https://www.linkedin.com/in/estefani-lira-53764a3b1/",
  },
];

export default function Committee() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section relative overflow-hidden"
      id="comite"
    >
      <div className="wrap">
        <SectionHead
          eyebrow="Comité Organizador"
          title="Las mentes y corazones detrás de Quetzal-IA"
          lead="Detrás de este encuentro hay un equipo de jóvenes estudiantes comprometidas con abrir caminos, tender redes y demostrar que el futuro de la ciencia y la tecnología también se escribe en femenino."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">
          {/* Columna Izquierda: Fotografía oficial del comité */}
          <div
            className={`lg:col-span-5 flex flex-col gap-4 fade-in-el delay-1 ${
              inView ? "is-visible" : ""
            }`}
          >
            <div className="border border-[var(--rule)] bg-[var(--card)] p-3 sm:p-4 rounded-2xl shadow-sm hover:border-[var(--accent)] transition-all duration-300">
              {/* Arco contenedor de la foto */}
              <div className="relative overflow-hidden rounded-t-full rounded-b-xl aspect-[3/4] bg-[var(--bg-alt)] border border-[var(--rule)]/60 group">
                <img
                  src="/Comite.png"
                  alt="Comité organizador de Quetzal-IA: Jazmín Gil de Gaona, Alyn Márquez y Estefani Lira"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Insignia decorativa sobre la foto */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[var(--card)]/90 backdrop-blur-sm border border-[var(--rule)] px-3 py-1 rounded-full shadow-sm text-center">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[var(--accent-text)] font-mono">
                    ✦ Comité Quetzal-IA ✦
                  </span>
                </div>
              </div>

              {/* Pie de foto / Cita inspiradora */}
              <div className="pt-4 px-1 text-center space-y-1.5">
                <p className="text-xs sm:text-sm font-serif italic text-[var(--head)] font-medium leading-relaxed">
                  «Creamos Quetzal-IA con la convicción de que ver a mujeres liderando en ciencia y tecnología inspira a las próximas generaciones a soñar sin límites.»
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[var(--fg)] opacity-75 font-semibold">
                  FES Acatlán · UNAM
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjetas individuales de presentación */}
          <div
            className={`lg:col-span-7 flex flex-col gap-4 fade-in-el delay-2 ${
              inView ? "is-visible" : ""
            }`}
          >
            {COMMITTEE_MEMBERS.map((member) => (
              <article
                key={member.name}
                className="border border-[var(--rule)] bg-[var(--card)] p-5 sm:p-6 rounded-xl shadow-sm hover:border-[var(--accent)] transition-all duration-300 hover:shadow-md flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-block px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[var(--bg-alt)] text-[var(--accent-text)] border border-[var(--rule)] rounded-full">
                      {member.badge}
                    </span>
                    <span className="text-[11px] text-[var(--fg)] opacity-70 font-mono">
                      {member.institution}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-bold text-[var(--head)] group-hover:text-[var(--accent)] transition-colors">
                    {member.name}
                  </h3>

                  <p className="text-xs font-semibold text-[var(--accent-text)] uppercase tracking-wide">
                    {member.role}
                  </p>

                  <p className="text-xs sm:text-sm text-[var(--fg)] opacity-90 leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>

                {/* Enlace a LinkedIn */}
                <div className="pt-3 mt-1 border-t border-[var(--rule)]/50 flex items-center justify-between">
                  <span className="text-[11px] text-[var(--fg)] opacity-70">
                    Red profesional:
                  </span>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all duration-200 border border-[#0A66C2]/20"
                    title={`Ver perfil de LinkedIn de ${member.name}`}
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-current shrink-0"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span>LinkedIn</span>
                    <span className="text-xs opacity-75">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
