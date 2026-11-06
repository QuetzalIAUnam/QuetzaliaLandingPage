import React from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import DecoButton from "./ui/DecoButton";
import Greca from "./ui/Greca";
import Spark from "./ui/Spark";

export default function Hero() {
  return (
    <header className="hero" id="inicio">
      <div className="rays" aria-hidden="true" />
      <div className="wrap hero-in">
        <Navbar />

        <div className="emblem">
          <div className="orbit" aria-hidden="true" />
          <Image
            className="logo"
            src="/QuetzaliaLogo.jpeg"
            width={400}
            height={400}
            alt="Logo de Quetzal-IA: una mujer de perfil que mira una estrella, rodeada por una serpiente emplumada"
            priority
          />
          <Spark variant="s1" />
          <Spark variant="s2" />
          <Spark variant="s3" />
          <Spark variant="s4" />
        </div>

        <h1>Quetzal-IA</h1>
        <p className="eyebrow">Encuentro de mujeres en STEM · FES Acatlán</p>
        <p className="lema">
          Donde la lógica echa raíces y la innovación emprende el vuelo: el
          encuentro de mujeres que construyen el futuro.
        </p>

        <div className="cta">
          <DecoButton variant="ghost" href="#agenda">
            Ver agenda
          </DecoButton>
          <DecoButton variant="primary" href="#inscripcion">
            Inscribirme
          </DecoButton>
        </div>

        <p className="meta">
          <span>Abril de 2027</span>
          <span>FES Acatlán · CEMM</span>
          <span>Fecha y sede por confirmar</span>
        </p>
      </div>
      <Greca />
    </header>
  );
}

