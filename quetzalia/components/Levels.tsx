import React from "react";
import PhotoArch from "./ui/PhotoArch";
import SectionHead from "./ui/SectionHead";

export default function Levels() {
  const levelsData = [
    {
      tag: "Secundaria",
      title: "Descubre de qué se trata",
      desc: "Conoce qué hacen las mujeres que trabajan en ciencia y tecnología y prueba actividades para imaginar tu futuro.",
      src: "/secundaria.jpg",
      alt: "Estudiantes de nivel secundaria en Quetzal-IA explorando actividades interactivas en STEM",
    },
    {
      tag: "Bachillerato",
      title: "Piensa qué quieres estudiar",
      desc: "Descubre qué carreras existen, cómo es la vida en la universidad y qué puedes hacer con la tecnología.",
      src: "/preparatoria.jpg",
      alt: "Estudiantes de preparatoria y bachillerato en talleres prácticos de Quetzal-IA",
    },
    {
      tag: "Licenciatura",
      title: "Da el siguiente paso",
      desc: "Escucha charlas técnicas de la industria y haz contactos que te ayuden a prepararte para trabajar.",
      src: "/universidad.jpg",
      alt: "Estudiantes universitarias de licenciatura en ponencias magistrales y vinculación profesional",
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
                src={level.src}
                alt={level.alt}
                ariaLabel={`Fotografía de la etapa de ${level.tag}`}
                style={{ aspectRatio: "4 / 3" }}
              />
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
