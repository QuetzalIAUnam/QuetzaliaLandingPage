import React from "react";

export default function Navbar() {
  return (
    <nav className="top top-nav" aria-label="Principal">
      <a className="brand" href="#inicio">
        Quetzal-IA
      </a>
      <ul className="top-nav-list">
        <li>
          <a href="#evento">El evento</a>
        </li>
        <li>
          <a href="#agenda">Agenda</a>
        </li>
        <li>
          <a href="#aliadas">Aliadas</a>
        </li>
        <li>
          <a href="#inscripcion">Inscripción</a>
        </li>
      </ul>
    </nav>
  );
}

