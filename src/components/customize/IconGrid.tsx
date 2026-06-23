"use client";

import React from "react";

export default function IconGrid({
  icons,
  onSelect,
  selectedKey,
}: {
  icons: string[];
  onSelect: (key: string) => void;
  selectedKey?: string;
}) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1">
      {icons.map((name) => {
        const isSel = selectedKey === name;
        return (
          <button
            key={name}
            type="button"
            title={name.replace(/_/g, " ")}
            onClick={() => onSelect(name)}
            className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
              isSel
                ? "ring-2 ring-white/80 bg-white/40 backdrop-blur-sm"
                : "hover:bg-white/20"
            }`}
          >
            <img
              src={`/imgs/icons/links/${name}.png`}
              alt={name}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0.3";
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
