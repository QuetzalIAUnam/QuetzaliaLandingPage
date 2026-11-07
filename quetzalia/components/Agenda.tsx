"use client";

import React, { useEffect, useRef, useState } from "react";
import SectionHead from "./ui/SectionHead";

const agendaItems = [
  {
    time: "09:30",
    title: "Registro y bienvenida",
    desc: "Acreditación e ingreso de las asistentes.",
    soft: true,
  },
  {
    time: "10:00",
    title: "Conferencia de apertura",
    desc: "Ponencia inaugural y presentación del programa.",
    soft: false,
  },
  {
    time: "11:00",
    title: "Talleres por nivel",
    desc: "Tres talleres al mismo tiempo, cada uno pensado para su público. Los temas se anunciarán pronto.",
    chips: ["Secundaria", "Bachillerato", "Licenciatura"],
    soft: false,
  },
  {
    time: "12:00",
    title: "Coffee break y networking",
    desc: "Descanso, refrigerio y convivencia.",
    soft: true,
  },
  {
    time: "12:30",
    title: "Feria STEM y stands de comunidades",
    desc: "Colectivos y aliadas de la comunidad STEM presentan su trabajo y te invitan a probar, preguntar y conocer.",
    soft: false,
  },
  {
    time: "14:00",
    title: "Panel de mujeres en ciencia y tecnología",
    desc: "Conversatorio con especialistas sobre sus trayectorias, con espacio para tus preguntas.",
    soft: false,
  },
  {
    time: "15:00",
    title: "Conferencia magistral y clausura",
    desc: "Ponencia principal de cierre y palabras finales. La jornada termina a las 16:00.",
    soft: false,
  },
];

export default function Agenda() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  // Observador para detectar cuándo se entra o sale de la sección Agenda
  // Al salir y volver a entrar, se reinicia para que siempre se reproduzca
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          // Si el usuario sale de la sección, se apaga y reinicia para la próxima visita
          setInView(false);
          setRevealedCount(0);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Progresión paso a paso de los elementos de la agenda
  useEffect(() => {
    if (!inView) {
      setRevealedCount(0);
      return;
    }

    // Intervalo para revelar cada fila secuencialmente de izquierda a derecha
    const interval = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev < agendaItems.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 550); // cada 550ms avanza al siguiente paso

    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section ref={sectionRef} className="section" id="agenda">
      <div className="wrap">
        <SectionHead eyebrow="Agenda" title="Un día completo, de 9:30 a 16:00" />
        <ol className="agenda">
          {agendaItems.map((item, idx) => {
            const isVisible = idx < revealedCount;
            // La línea activa es únicamente la del elemento que se acaba de revelar
            const isCurrentActive = idx === revealedCount - 1;

            return (
              <li
                key={idx}
                className={`agenda-item ${item.soft ? "soft" : ""} ${
                  isVisible ? "is-visible" : ""
                } ${isCurrentActive ? "is-active-line" : ""}`}
              >
                <time dateTime={item.time}>{item.time}</time>
                <div className="body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  {item.chips && (
                    <div className="chips">
                      {item.chips.map((chip, cIdx) => (
                        <span className="chip" key={cIdx}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Línea inferior brillante que se prende sólo cuando aparece este paso */}
                <div className="agenda-line-tracker" aria-hidden="true" />
              </li>
            );
          })}
        </ol>
        <p className="note">
          Agenda preliminar: los horarios pueden ajustarse antes del evento.
        </p>
      </div>
    </section>
  );
}
