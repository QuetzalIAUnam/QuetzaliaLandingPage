import React from "react";

interface SparkProps {
  variant: "s1" | "s2" | "s3" | "s4";
  className?: string;
}

export default function Spark({ variant, className = "" }: SparkProps) {
  const styles: Record<string, React.CSSProperties> = {
    s1: {
      top: "-34px",
      right: "6%",
      width: "18px",
      height: "18px",
      animationDelay: "0s",
    },
    s2: {
      top: "22%",
      left: "-48px",
      width: "12px",
      height: "12px",
      animationDelay: "1.2s",
    },
    s3: {
      bottom: "12%",
      right: "-50px",
      width: "14px",
      height: "14px",
      animationDelay: "2.1s",
    },
    s4: {
      bottom: "-30px",
      left: "14%",
      width: "22px",
      height: "22px",
      animationDelay: "0.6s",
    },
  };

  const responsiveClass =
    variant === "s2"
      ? "spark-s2"
      : variant === "s3"
      ? "spark-s3"
      : "";

  return (
    <span
      className={`spark ${responsiveClass} ${className}`}
      style={styles[variant]}
      aria-hidden="true"
    />
  );
}

