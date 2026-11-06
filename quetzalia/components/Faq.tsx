import React from "react";
import SectionHead from "./ui/SectionHead";

export default function Faq() {
  const faqItems = [
    {
      q: "¿Quién puede asistir?",
      a: "Estudiantes de secundaria, bachillerato y licenciatura de la FES Acatlán y de otras escuelas y universidades. También estamos abiertas a docentes, mamás, papás y tutores que quieran acompañar.",
    },
    {
      q: "¿Cuándo y dónde es?",
      a: "Está planeado para un día hábil de abril de 2027 en el CEMM de la FES Acatlán. Publicaremos aquí la fecha y la sede en cuanto estén confirmadas.",
    },
    {
      q: "¿Necesito saber programar?",
      a: "No. Hay actividades para quien apenas empieza y charlas técnicas para quien ya tiene experiencia. Si tu taller requiere computadora y no tienes una, se avisará con tiempo para apoyarte.",
    },
    {
      q: "¿Habrá constancia?",
      a: "Estamos trabajando en entregar constancias de participación. Compartiremos aquí cómo solicitarla.",
    },
    {
      q: "Soy menor de edad, ¿qué necesito?",
      a: "El consentimiento de tu mamá, papá o tutor y el aviso de privacidad del registro. Te lo explicaremos paso a paso en el formulario.",
    },
  ];

  return (
    <section className="section alt" id="preguntas">
      <div className="wrap">
        <SectionHead
          eyebrow="Preguntas frecuentes"
          title="Lo que quizá te preguntas"
        />
        <div className="faq">
          {faqItems.map((item, idx) => (
            <details key={idx}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

