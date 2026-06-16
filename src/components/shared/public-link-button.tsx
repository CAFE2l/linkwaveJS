"use client";

import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import type { Link } from "@/types/database";

export function PublicLinkButton({ link }: { link: Link }) {
  function trackClick() {
    const payload = JSON.stringify({ linkId: link.id, userId: link.user_id });
    const blob = new Blob([payload], { type: "application/json" });

    if (!navigator.sendBeacon?.("/api/click", blob)) {
      fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => null);
    }
  }

  const iconName = link.icone || link.icon;

  function renderIcon() {
    if (link.is_custom_icon && link.icon_blob) {
      return (
        <img
          src={link.icon_blob}
          alt=""
          className="h-10 w-10 shrink-0 rounded-xl object-contain"
        />
      );
    }

    if (iconName && iconName !== "link") {
      return (
        <Image
          src={`/imgs/icons/links/${iconName}.png`}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-xl object-contain"
          unoptimized
        />
      );
    }

    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-cyan text-white shadow-sm">
        <LinkIcon size={18} />
      </span>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      onClick={trackClick}
      className="group flex min-h-16 items-center justify-between px-5 py-4 font-bold transition hover:-translate-y-0.5"
      style={{
        background: "var(--ut-link-bg, rgba(255,255,255,0.8))",
        borderRadius: "calc(var(--ut-card-radius, 1rem) - 4px)",
        border: "var(--ut-card-border, 1px solid rgba(255,255,255,0.15))",
        boxShadow: "var(--ut-card-shadow, 0 4px 16px rgba(0,0,0,0.05))",
        color: "var(--ut-text-primary, #0b1829)",
      }}
    >
      <span className="flex min-w-0 items-center gap-3">
        {renderIcon()}
        <span className="truncate">{link.title}</span>
      </span>
      <ArrowUpRight size={19} className="shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "var(--ut-btn-bg, #0ea5e9)" }} />
    </a>
  );
}
