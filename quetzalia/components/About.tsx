"use client";

import React, { useEffect, useRef, useState } from "react";
import SkeletonImage from "./ui/SkeletonImage";
import PhotoArch from "./ui/PhotoArch";

// Animación de escritura carácter por carácter (Typewriter)
function TypewriterText({
  text,
  start,
  speed = 18,
}: {
  text: string;
  start: boolean;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [start, text, speed]);

  return (
    <span className="typewriter-line">
      {displayed}
      {start && displayed.length < text.length && (
        <span className="typewriter-cursor" aria-hidden="true" />
      )}
    </span>
  );
}

const pillarsData = [
  {
    label: "Inspírate",
    src: "/Discover.png",
    alt: "Icono de Inspírate",
    desc: "Escucha a mujeres que ya recorrieron el camino y descubre que esa trayectoria también puede ser la tuya.",
  },
  {
    label: "Aprende",
    src: "/Learn.png",
    alt: "Icono de Aprende",
    desc: "Participa en talleres pensados para tu nivel y conoce la carrera de Matemáticas Aplicadas y Computación.",
  },
  {
    label: "Conecta",
    src: "/Connect.png",
    alt: "Icono de Conecta",
    desc: "Conoce a otras estudiantes, comunidades y empresas del sector tecnológico.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  // Estados de la secuencia coreografiada
  const [inView, setInView] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [startTypewriter, setStartTypewriter] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const checkAndTrigger = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
        setInView(true);
        return true;
      }
      return false;
    };

    if (checkAndTrigger()) return;

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

    const onScroll = () => {
      if (checkAndTrigger()) {
        window.removeEventListener("scroll", onScroll);
        observer.disconnect();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Secuencia temporal coordinada
  useEffect(() => {
    if (!inView) return;

    // 1. Títulos de los pilares aparecen (Inspírate, Aprende, Conecta)
    const t1 = setTimeout(() => {
      setShowLabels(true);
    }, 450);

    // 2. Luego aparecen las imágenes/iconos correspondientes
    const t2 = setTimeout(() => {
      setShowImages(true);
    }, 1100);

    // 3. Y poco a poco se empiezan a escribir los textos que los representan
    const t3 = setTimeout(() => {
      setStartTypewriter(true);
    }, 1750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [inView]);

  return (
    <section ref={sectionRef} className="section" id="evento">
      <div className="wrap about">
        <div className="stack">
          {/* Título general y descripción con fade-in */}
          <p className={`eyebrow fade-in-el ${inView ? "is-visible" : ""}`}>
            El evento
          </p>
          <h2 className={`fade-in-el delay-1 ${inView ? "is-visible" : ""}`}>
            Un día para ver que tú también puedes
          </h2>
          <p className={`lead fade-in-el delay-2 ${inView ? "is-visible" : ""}`}>
            Quetzal-IA reúne a niñas y mujeres jóvenes de secundaria,
            bachillerato y licenciatura, junto con mujeres que ya trabajan en
            ciencia y tecnología. Son cerca de seis horas en la FES Acatlán, con
            charlas, talleres y mucha plática.
          </p>

          <dl className="pillars">
            {pillarsData.map((p, idx) => (
              <div key={p.label}>
                <dt className="pillar-dt-row">
                  {/* PASO 2: La imagen aparece después del label */}
                  <span
                    className={`pillar-icon-box ${
                      showImages ? "is-shown" : "is-hidden"
                    }`}
                    style={{ transitionDelay: `${idx * 160}ms` }}
                  >
                    <SkeletonImage
                      src={p.src}
                      alt={p.alt}
                      width={44}
                      height={44}
                      unoptimized
                      className="pillar-icon"
                    />
                  </span>

                  {/* PASO 1: Primero aparece el nombre (Inspírate, Aprende, Conecta) */}
                  <span
                    className={`pillar-name-text ${
                      showLabels ? "is-shown" : "is-hidden"
                    }`}
                    style={{ transitionDelay: `${idx * 140}ms` }}
                  >
                    {p.label}
                  </span>
                </dt>

                {/* PASO 3: Los mensajes se escriben poco a poco */}
                <dd>
                  <TypewriterText
                    text={p.desc}
                    start={startTypewriter}
                    speed={16}
                  />
                </dd>
              </div>
            ))}
          </dl>

          {/* Tarjeta inferior con fade in */}
          <div
            className={`name-note fade-in-el delay-3 ${
              inView ? "is-visible" : ""
            }`}
          >
            <div className="name-note-inner">
              <SkeletonImage
                src="/pluma.png"
                alt="Pluma sagrada de Quetzal"
                width={58}
                height={58}
                unoptimized
                className="name-note-icon"
              />
              <div>
                <h3>¿Por qué Quetzal-IA?</h3>
                <p>
                  El quetzal era un ave sagrada en Mesoamérica y sus plumas se
                  guardaban para lo más valioso. El nombre une <em>quetzalli</em>,
                  la pluma preciosa, con IA, un campo donde todavía hacen falta más
                  voces de mujeres.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Foto de la columna derecha con fade in */}
        <div
          className={`about-photo-wrap fade-in-el delay-2 ${
            inView ? "is-visible" : ""
          }`}
        >
          <PhotoArch ariaLabel="Espacio reservado para una fotografía del evento">
            Foto del evento
            <br />
            por definir
          </PhotoArch>
        </div>
      </div>
    </section>
  );
}
