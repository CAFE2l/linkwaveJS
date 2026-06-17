"use client";
import React from "react";

export default function ModalLayer({ children }: { children?: React.ReactNode }) {
  return <div className="modal-layer">{children}</div>;
}
