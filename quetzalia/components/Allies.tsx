"use client";

import React, { useEffect, useRef, useState } from "react";
import PhotoArch from "./ui/PhotoArch";
import SectionHead from "./ui/SectionHead";
import rawSpeakers from "@/data/speakers.json";

interface Speaker {
  id: string;
  name: string;
  role: string;
  desc: string;
  talk: string;
  linkedin: string;
  placeholderText: string;
}

const speakersData: Speaker[] = rawSpeakers as Speaker[];

export default function Allies() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          } else {
            // Permite reiniciar la animación cuando el usuario vuelve a pasar por la sección
            setInView(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const alliesList = ["Ixalli", "NVIDIA", "Oracle", "UNAM - MAC"];

  return (
    <section className="section alt" id="aliadas" ref={sectionRef}>
      <div className="wrap">
        <SectionHead
          eyebrow="Voces y aliadas"
          title="Mujeres que ya están construyendo el futuro"
          lead="Conoce a las primeras ponentes confirmadas de la industria y la academia. Pronto sumaremos más."
        />

        <div className={`people ${inView ? "in-view" : ""}`}>
          {speakersData.map((person, idx) => (
            <article
              className="person"
              key={person.id}
              style={
                {
                  "--speaker-delay": `${idx * 200}ms`,
                } as React.CSSProperties
              }
            >
              <PhotoArch
                ariaLabel={`Fotografía de ${person.name}`}
                style={{ aspectRatio: "1" }}
              >
                {person.placeholderText}
              </PhotoArch>

              <div className="person-content">
                <span className="speaker-role">{person.role}</span>
                <h3 className="speaker-name">{person.name}</h3>

                <p className="speaker-talk">
                  <span className="talk-badge">Charla</span>
                  <span className="talk-title">“{person.talk}”</span>
                </p>

                <p className="speaker-desc">{person.desc}</p>

                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="speaker-linkedin"
                  aria-label={`Perfil de LinkedIn de ${person.name}`}
                >
                  <svg
                    className="linkedin-icon"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.66 1.66 0 1 0 0 3.32 1.66 1.66 0 0 0 0-3.32Z" />
                  </svg>
                  <span>Conectar en LinkedIn</span>
                  <svg
                    className="external-arrow"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        <h3 className="allies-title">Nos acompañan</h3>
        <ul className="allies">
          {alliesList.map((ally, idx) => (
            <li key={idx}>{ally}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
