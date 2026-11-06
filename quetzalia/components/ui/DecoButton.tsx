"use client";

import React from "react";

interface DecoButtonProps {
  variant?: "primary" | "ghost";
  href?: string;
  disabled?: boolean;
  tabIndex?: number;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function DecoButton({
  variant = "primary",
  href,
  disabled = false,
  tabIndex,
  className = "",
  children,
  onClick,
}: DecoButtonProps) {
  const variantClass = variant === "primary" ? "btn-primary" : "btn-ghost";
  const disabledProps = disabled
    ? { "aria-disabled": true, tabIndex: tabIndex ?? -1 }
    : { tabIndex };

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={`btn ${variantClass} ${className}`}
        onClick={onClick}
        {...disabledProps}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href || "#"}
      className={`btn ${variantClass} ${className}`}
      onClick={(e) => {
        if (disabled) e.preventDefault();
        if (onClick) onClick();
      }}
      {...disabledProps}
    >
      {children}
    </a>
  );
}
