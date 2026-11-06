import React from "react";
import PhotoArch from "./ui/PhotoArch";
import SectionHead from "./ui/SectionHead";

export default function Allies() {
  const peopleData = [
    {
      name: "Fer Osorio · Ixalli",
      desc: "Ponencia confirmada y enlace con la red de mujeres de la industria tecnológica.",
      placeholderText: "Foto por definir",
    },
    {
      name: "Brenda Olivas",
      desc: "Arquitecta de Soluciones Senior en NVIDIA. Aliada de la industria.",
      placeholderText: "Foto por definir",
    },
    {
      name: "Más ponentes por anunciar",
      desc: "Estamos armando el programa de charlas, talleres y panel.",
      placeholderText: "Próximamente",
    },
  ];

  const alliesList = ["Ixalli", "NVIDIA", "Oracle"];

  return (
    <section className="section alt" id="aliadas">
      <div className="wrap">
        <SectionHead
          eyebrow="Voces y aliadas"
          title="Mujeres que ya están construyendo el futuro"
          lead="Estas son las primeras voces confirmadas. Pronto sumaremos más."
        />
        <div className="people">
          {peopleData.map((person, idx) => (
            <article className="person" key={idx}>
              <PhotoArch
                ariaLabel="Espacio reservado para una fotografía"
                style={{ aspectRatio: "1" }}
              >
                {person.placeholderText}
              </PhotoArch>
              <h3>{person.name}</h3>
              <p>{person.desc}</p>
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

