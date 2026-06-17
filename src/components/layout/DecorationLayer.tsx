"use client";
import React from "react";

export default function DecorationLayer({ children }: { children?: React.ReactNode }) {
  return <div className="decoration-layer" aria-hidden>{children}</div>;
}
