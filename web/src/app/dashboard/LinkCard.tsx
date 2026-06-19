"use client";
import React from "react";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
}

interface Props {
  link: Link;
}

export default function LinkCard({ link }: Props) {
  return (
    <div className="glass p-4 flex items-center justify-between rounded-md shadow-sm">
      <div className="flex items-center gap-2">
        <img
          src={link.icon ?? "/default-icon.png"}
          alt="Icon"
          className="w-6 h-6"
        />
        <span className="font-medium">{link.title}</span>
      </div>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500"
      >
        Abrir
      </a>
    </div>
  );
}
