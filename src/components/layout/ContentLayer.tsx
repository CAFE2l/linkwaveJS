"use client";
import React from "react";

export default function ContentLayer({ children }: { children?: React.ReactNode }) {
  return <div className="content-layer">{children}</div>;
}
