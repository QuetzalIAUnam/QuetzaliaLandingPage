"use client";

import React from "react";
import Image from "next/image";
import { useCountUp } from "react-countup";

const statsData = [
  {
    numericValue: 54,
    id: "stat-0",
    label: "de la matrícula universitaria en México son mujeres.",
    image: "/1erStat.jpg",
    alt: "Icono mesoamericano de matrícula universitaria de mujeres",
  },
  {
    numericValue: 33,
    id: "stat-1",
    label: "de las estudiantes de carreras STEM son mujeres: una de cada tres.",
    image: "/2erStat.jpg",
    alt: "Icono mesoamericano de proporción una de cada tres en STEM",
  },
  {
    numericValue: 26,
    id: "stat-2",
    label:
      "de quienes estudian Matemáticas Aplicadas y Computación en la UNAM son mujeres.",
    image: "/3erStat.jpg",
    alt: "Icono mesoamericano de Matemáticas Aplicadas y Computación",
  },
  {
    numericValue: 25,
    id: "stat-3",
    label: "de los puestos de trabajo STEM los ocupan mujeres.",
    image: "/4erStat.jpg",
    alt: "Icono mesoamericano de liderazgo y puestos de trabajo en STEM",
  },
];

function StatCard({
  id,
  numericValue,
  label,
  image,
  alt,
}: (typeof statsData)[number]) {
  // useCountUp busca el elemento por `id` en el DOM y escribe el número ahí.
  useCountUp({
    ref: id,
    start: 0,
    end: numericValue,
    duration: 2,
    suffix: "%",
    enableScrollSpy: true,
    scrollSpyDelay: 200,
    scrollSpyOnce: true,
  });

  return (
    <li className="stat-card">
      <div className="stat-media">
        <Image
          src={image}
          alt={alt}
          width={500}
          height={500}
          className="stat-card-img"
          unoptimized
        />
      </div>
      <div className="stat-body">
        <div className="stat-line" aria-hidden="true" />
        {/* react-countup inyecta el número contado directamente aquí */}
        <b id={id}>0%</b>
        <span>{label}</span>
      </div>
    </li>
  );
}

export default function Stats() {
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
          {statsData.map((stat) => (
            <StatCard key={stat.id} {...stat} />
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
