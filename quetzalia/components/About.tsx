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
  const [inView, setInView] = useState(false);

  // Estados independientes para cada pilar (0: Inspírate, 1: Aprende, 2: Conecta)
  const [activeStep, setActiveStep] = useState<{
    showLabel: boolean[];
    showImage: boolean[];
    startType: boolean[];
  }>({
    showLabel: [false, false, false],
    showImage: [false, false, false],
    startType: [false, false, false],
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const checkAndTrigger = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowHeight * 0.85 && rect.bottom > 80) {
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
      {
        threshold: [0, 0.05, 0.1],
        rootMargin: "80px 0px -40px 0px",
      }
    );
    observer.observe(el);

    const onScrollOrResize = () => {
      if (checkAndTrigger()) {
        window.removeEventListener("scroll", onScrollOrResize);
        window.removeEventListener("resize", onScrollOrResize);
        observer.disconnect();
      }
    };
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  // Secuencia escalonada individual: Pilar 1 -> luego Pilar 2 -> luego Pilar 3
  useEffect(() => {
    if (!inView) return;

    // Horarios escalonados para cada pilar (en ms):
    // Pilar 0 (Inspírate): label en 500ms, icono en 900ms, texto en 1300ms
    // Pilar 1 (Aprende):   label en 3100ms, icono en 3500ms, texto en 3900ms
    // Pilar 2 (Conecta):   label en 5700ms, icono en 6100ms, texto en 6500ms
    const schedule = [
      { labelDelay: 500, imageDelay: 900, textDelay: 1300 },
      { labelDelay: 3100, imageDelay: 3500, textDelay: 3900 },
      { labelDelay: 5700, imageDelay: 6100, textDelay: 6500 },
    ];

    const timers: NodeJS.Timeout[] = [];

    schedule.forEach((s, idx) => {
      timers.push(
        setTimeout(() => {
          setActiveStep((prev) => {
            const next = [...prev.showLabel];
            next[idx] = true;
            return { ...prev, showLabel: next };
          });
        }, s.labelDelay)
      );

      timers.push(
        setTimeout(() => {
          setActiveStep((prev) => {
            const next = [...prev.showImage];
            next[idx] = true;
            return { ...prev, showImage: next };
          });
        }, s.imageDelay)
      );

      timers.push(
        setTimeout(() => {
          setActiveStep((prev) => {
            const next = [...prev.startType];
            next[idx] = true;
            return { ...prev, startType: next };
          });
        }, s.textDelay)
      );
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
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
                  {/* Icono del pilar (aparece después de su propio label) */}
                  <span
                    className={`pillar-icon-box ${
                      activeStep.showImage[idx] ? "is-shown" : "is-hidden"
                    }`}
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

                  {/* Nombre del pilar (Inspírate, Aprende, Conecta) */}
                  <span
                    className={`pillar-name-text ${
                      activeStep.showLabel[idx] ? "is-shown" : "is-hidden"
                    }`}
                  >
                    {p.label}
                  </span>
                </dt>

                {/* Mensaje descriptivo con máquina de escribir */}
                <dd>
                  <TypewriterText
                    text={p.desc}
                    start={activeStep.startType[idx]}
                    speed={16}
                  />
                </dd>
              </div>
            ))}
          </dl>

          {/* Tarjeta inferior con pluma flotante */}
          <div
            className={`name-note fade-in-el delay-3 ${
              inView ? "is-visible" : ""
            }`}
          >
            <div className="name-note-inner">
              <div className="floating-feather-wrap">
                <SkeletonImage
                  src="/pluma.png"
                  alt="Pluma sagrada de Quetzal"
                  width={58}
                  height={58}
                  unoptimized
                  className="name-note-icon floating-feather"
                />
              </div>
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
