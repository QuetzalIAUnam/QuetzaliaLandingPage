import React from "react";

interface SectionHeadProps {
  eyebrow: string;
  title: string;
  lead?: string;
  titleId?: string;
  className?: string;
  eyebrowColor?: string;
}

export default function SectionHead({
  eyebrow,
  title,
  lead,
  titleId,
  className = "",
  eyebrowColor,
}: SectionHeadProps) {
  return (
    <div className={`sec-head ${className}`}>
      <p
        className="eyebrow"
        style={eyebrowColor ? { color: eyebrowColor } : undefined}
      >
        {eyebrow}
      </p>
      <h2 id={titleId}>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

