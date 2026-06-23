"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export type ToastObj = { id: string; type: "success" | "error"; msg: string };

export default function Toast({ type, msg }: ToastObj) {
  const isSuccess = type === "success";
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in-up glass-card !p-3 text-ocean">
      {isSuccess ? (
        <CheckCircle2 size={16} className="text-ocean flex-shrink-0" />
      ) : (
        <XCircle size={16} className="text-ocean flex-shrink-0" />
      )}
      <span>{msg}</span>
    </div>
  );
}
