import React from "react";

interface PhotoArchProps {
  children?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function PhotoArch({
  children,
  ariaLabel = "Espacio reservado para una fotografía",
  className = "",
  style,
}: PhotoArchProps) {
  return (
    <figure
      className={`ph arch ${className}`}
      role="img"
      aria-label={ariaLabel}
      style={style}
    >
      {children || (
        <>
          Foto del evento
          <br />
          por definir
        </>
      )}
    </figure>
  );
}

