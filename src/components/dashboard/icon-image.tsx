"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

const ICON_BASE = "/imgs/icons/links";

export function IconImage({
  name,
  className,
  fallback,
}: {
  name: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const [errored, setErrored] = useState(false);

  if (errored || !name) {
    return <>{fallback ?? null}</>;
  }

  return (
    <Image
      src={`${ICON_BASE}/${name}.png`}
      alt={name}
      width={40}
      height={40}
      className={className}
      onError={() => setErrored(true)}
      unoptimized
    />
  );
}
