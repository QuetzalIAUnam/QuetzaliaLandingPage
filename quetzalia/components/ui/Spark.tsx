import React from "react";

interface SparkProps {
  variant: "s1" | "s2" | "s3" | "s4";
  className?: string;
}

export default function Spark({ variant, className = "" }: SparkProps) {
  return (
    <span
      className={`spark ${variant} ${className}`}
      aria-hidden="true"
    />
  );
}
