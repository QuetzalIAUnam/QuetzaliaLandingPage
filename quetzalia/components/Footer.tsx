import React from "react";
import Greca from "./ui/Greca";

export default function Footer() {
  const team = [
    "Alyn Verónica Márquez Espinoza",
    "Jazmín Gil De Gaona",
    "Estefani Michalle Domínguez Lira",
    "Sitio web: Diego Romero Mora",
  ];

  return (
    <footer className="band">
      <Greca onBand />
      <div className="wrap foot">
        <div>
          <a className="brand" href="#inicio">
            Quetzal-IA
          </a>
          <p>
            Encuentro de mujeres en STEM. FES Acatlán, licenciatura en
            Matemáticas Aplicadas y Computación.
          </p>
        </div>
        <div>
          <h3>Equipo organizador</h3>
          <ul>
            {team.map((member, idx) => (
              <li key={idx}>{member}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

