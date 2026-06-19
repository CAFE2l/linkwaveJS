"use client";

import React from "react";

const ICONS = [
  "Discord", "Facebook", "Gmail", "Google", "Instagram", "Ko_Fi",
  "LinkedIn", "Notion", "Patreon", "PayPal", "Pinterest", "Reddit",
  "Snapchat", "SoundCloud", "Spotify", "Steam", "Telegram", "TikTok",
  "Twitch", "Twitter", "Whatsapp", "Youtube",
  "Amazon", "GitHub", "Netflix", "Slack", "Trello",
];

export default function IconGrid({
  onSelect,
  selectedKey,
}: {
  onSelect: (key: string) => void;
  selectedKey?: string;
}) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1">
      {ICONS.map((name) => {
        const isSel = selectedKey === name;
        return (
          <button
            key={name}
            type="button"
            title={name.replace(/_/g, " ")}
            onClick={() => onSelect(name)}
            className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
              isSel
                ? "ring-2 ring-brand bg-brand/10"
                : "hover:bg-surface-hover"
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
