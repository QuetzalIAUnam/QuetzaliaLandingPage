import React from "react";
import DecoButton from "./ui/DecoButton";

export default function Signup() {
  const requirements = [
    "Tu escuela y tu nivel: secundaria, bachillerato o licenciatura.",
    "Si eres menor de edad, el consentimiento de tu mamá, papá o tutor.",
    "Una encuesta corta antes del evento y otra después, para saber qué te dejó la jornada.",
  ];

  return (
    <section className="section" id="inscripcion">
      <div className="wrap stack signup">
        <div className="sec-head">
          <p className="eyebrow">Inscripción</p>
          <h2>Reserva tu lugar</h2>
          <p className="lead">
            El registro abre pronto. Esto es lo que te pediremos cuando llegue
            el momento.
          </p>
        </div>
        <ul className="need">
          {requirements.map((req, idx) => (
            <li key={idx}>
              <span>{req}</span>
            </li>
          ))}
        </ul>
        <DecoButton variant="primary" href="#inscripcion" disabled tabIndex={-1}>
          Registro próximamente
        </DecoButton>
        <p className="pending">El enlace de registro se publicará aquí.</p>
      </div>
    </section>
  );
}

