import React from "react";
import Image from "next/image";

interface PhotoArchProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  unoptimized?: boolean;
}

export default function PhotoArch({
  src,
  alt = "Fotografía oficial de Quetzalia",
  children,
  ariaLabel = "Fotografía oficial de Quetzalia",
  className = "",
  style,
  unoptimized = true,
}: PhotoArchProps) {
  const hasVisual = Boolean(src || children);

  return (
    <figure
      className={`ph arch overflow-hidden relative group max-w-full ${className}`}
      role="img"
      aria-label={ariaLabel}
      style={{ padding: hasVisual ? 0 : undefined, ...style }}
    >
      {src ? (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="w-full h-full max-w-full max-h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : children ? (
        children
      ) : (
        <>
          Foto del evento
          <br />
          por definir
        </>
      )}
    </figure>
  );
}
