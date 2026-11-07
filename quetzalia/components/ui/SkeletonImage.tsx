"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SkeletonImageProps extends Omit<ImageProps, "onLoad"> {
  skeletonClassName?: string;
}

export default function SkeletonImage({
  className = "",
  skeletonClassName = "",
  ...props
}: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className="sk-wrap">
      {/* Skeleton shimmer visible mientras la imagen carga */}
      {!loaded && (
        <span
          className={`sk-shimmer ${skeletonClassName}`}
          aria-hidden="true"
        />
      )}
      <Image
        {...props}
        className={`${className} ${loaded ? "sk-visible" : "sk-hidden"}`}
        onLoad={() => setLoaded(true)}
      />
    </span>
  );
}

