import React from "react";
import PhotoArch from "./ui/PhotoArch";
import SectionHead from "./ui/SectionHead";

export default function Levels() {
  const levelsData = [
    {
      tag: "Secundaria",
      title: "Descubre de qué se trata",
      desc: "Conoce qué hacen las mujeres que trabajan en ciencia y tecnología y prueba actividades para imaginar tu futuro.",
    },
    {
      tag: "Bachillerato",
      title: "Piensa qué quieres estudiar",
      desc: "Descubre qué carreras existen, cómo es la vida en la universidad y qué puedes hacer con la tecnología.",
    },
    {
      tag: "Licenciatura",
      title: "Da el siguiente paso",
      desc: "Escucha charlas técnicas de la industria y haz contactos que te ayuden a prepararte para trabajar.",
    },
  ];

  return (
    <section className="section alt" id="para-quien">
      <div className="wrap">
        <SectionHead
          eyebrow="Para quién"
          title="Hay un lugar para cada etapa"
          lead="Los talleres se dividen por nivel, para que cada quien aprenda a su ritmo y con gente de su edad."
        />
        <div className="levels">
          {levelsData.map((level, idx) => (
            <article className="level" key={idx}>
              <PhotoArch
                ariaLabel="Espacio reservado para una fotografía"
                style={{ aspectRatio: "4 / 3" }}
              >
                Foto por definir
              </PhotoArch>
              <span className="chip tag">{level.tag}</span>
              <h3>{level.title}</h3>
              <p>{level.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

