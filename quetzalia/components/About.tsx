import React from "react";
import PhotoArch from "./ui/PhotoArch";

export default function About() {
  return (
    <section className="section" id="evento">
      <div className="wrap about">
        <div className="stack">
          <p className="eyebrow">El evento</p>
          <h2>Un día para ver que tú también puedes</h2>
          <p className="lead">
            Quetzal-IA reúne a niñas y mujeres jóvenes de secundaria,
            bachillerato y licenciatura, junto con mujeres que ya trabajan en
            ciencia y tecnología. Son cerca de seis horas en la FES Acatlán, con
            charlas, talleres y mucha plática.
          </p>
          <dl className="pillars">
            <div>
              <dt>Inspírate</dt>
              <dd>
                Escucha a mujeres que ya recorrieron el camino y descubre que
                esa trayectoria también puede ser la tuya.
              </dd>
            </div>
            <div>
              <dt>Aprende</dt>
              <dd>
                Participa en talleres pensados para tu nivel y conoce la carrera
                de Matemáticas Aplicadas y Computación.
              </dd>
            </div>
            <div>
              <dt>Conecta</dt>
              <dd>
                Conoce a otras estudiantes, comunidades y empresas del sector
                tecnológico.
              </dd>
            </div>
          </dl>
          <div className="name-note">
            <h3>¿Por qué Quetzal-IA?</h3>
            <p>
              El quetzal era un ave sagrada en Mesoamérica y sus plumas se
              guardaban para lo más valioso. El nombre une <em>quetzalli</em>,
              la pluma preciosa, con IA, un campo donde todavía hacen falta más
              voces de mujeres.
            </p>
          </div>
        </div>
        <PhotoArch ariaLabel="Espacio reservado para una fotografía del evento">
          Foto del evento
          <br />
          por definir
        </PhotoArch>
      </div>
    </section>
  );
}

