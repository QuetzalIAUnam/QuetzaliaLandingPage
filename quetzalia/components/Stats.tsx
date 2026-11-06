import React from "react";

export default function Stats() {
  const statsData = [
    {
      value: "54%",
      label: "de la matrícula universitaria en México son mujeres.",
    },
    {
      value: "33%",
      label: "de las estudiantes de carreras STEM son mujeres: una de cada tres.",
    },
    {
      value: "26%",
      label:
        "de quienes estudian Matemáticas Aplicadas y Computación en la UNAM son mujeres.",
    },
    {
      value: "25%",
      label: "de los puestos de trabajo STEM los ocupan mujeres.",
    },
  ];

  return (
    <section className="section band" aria-labelledby="cifras-t">
      <div className="wrap">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <p className="eyebrow">Por qué existe</p>
          <h2 id="cifras-t">
            Muchas mujeres llegan a la universidad, pocas eligen carreras STEM
          </h2>
        </div>
        <ul className="stats">
          {statsData.map((stat, idx) => (
            <li key={idx}>
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
        <p className="src">
          Fuentes: IMCO, <em>Mujeres en STEM: Panorama de México 2026</em>, y
          oferta académica de la UNAM.
        </p>
      </div>
    </section>
  );
}

