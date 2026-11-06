import React from "react";

interface GrecaProps {
  onBand?: boolean;
  className?: string;
}

export default function Greca({ onBand = false, className = "" }: GrecaProps) {
  return (
    <div
      className={`greca w-full ${onBand ? "on-band" : ""} ${className}`}
      aria-hidden="true"
    />
  );
}

