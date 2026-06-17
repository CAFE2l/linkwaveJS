"use client";
import React from "react";

export default function UILayer({ children }: { children?: React.ReactNode }) {
  return <div className="ui-layer" aria-hidden>{children}</div>;
}
