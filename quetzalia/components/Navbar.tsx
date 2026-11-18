"use client";

import React from "react";
import AuthStatus from "./AuthStatus";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className={`top top-nav ${user ? "has-session" : ""}`} aria-label="Principal">
      <a className={`brand ${user ? "hidden sm:inline-block" : ""}`} href="#inicio">
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
          <a href="#comite">Comité</a>
        </li>
        <li>
          <a href="#inscripcion">Inscripción</a>
        </li>
      </ul>
      <div className={`top-nav-auth ${user ? "is-logged" : ""}`}>
        <AuthStatus />
      </div>
    </nav>
  );
}
