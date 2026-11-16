import React from "react";
import Link from "next/link";
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
          <Link className="brand" href="/#inicio">
            Quetzal-IA
          </Link>
          <p>
            Encuentro de mujeres en STEM. FES Acatlán, licenciatura en
            Matemáticas Aplicadas y Computación.
          </p>
          <p className="mt-4 text-xs opacity-75">
            © 2027 Quetzalia · Comité Organizador
          </p>
        </div>

        <div>
          <h3>Marco Legal y Privacidad</h3>
          <ul>
            <li>
              <Link href="/privacidad" className="hover:underline">
                Aviso de Privacidad Integral
              </Link>
            </li>
            <li>
              <Link href="/codigo-de-conducta" className="hover:underline">
                Código de Conducta
              </Link>
            </li>
            <li>
              <Link href="/derechos-arco" className="hover:underline">
                Derechos ARCO y Retiro (72h)
              </Link>
            </li>
            <li>
              <Link href="/asistentes" className="hover:underline">
                Términos para Asistentes
              </Link>
            </li>
          </ul>
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

