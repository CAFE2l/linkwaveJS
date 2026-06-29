"use client";

import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { CustomLinkIcon } from "@/components/shared/custom-link-icon";
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
    const iconClass =
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/10 backdrop-blur-md transition-all duration-200 group-hover:scale-105 group-hover:bg-white/15";

    if (link.is_custom_icon && link.icon_blob) {
      return (
        <CustomLinkIcon
          src={link.icon_blob}
          alt={`Ícone de ${link.title}`}
          className="size-10 border-white/12 bg-white/10 shadow-none transition-transform duration-200 group-hover:scale-105"
        />
      );
    }

    if (iconName && iconName !== "link") {
      return (
        <span className={iconClass}>
          <Image
            src={`/imgs/icons/links/${iconName}.png`}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 object-contain"
            unoptimized
          />
        </span>
      );
    }

    return (
      <span className={iconClass}>
        <LinkIcon size={16} />
      </span>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      onClick={trackClick}
      className="group relative flex min-h-[4.25rem] items-center gap-3 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-left shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.11] hover:shadow-[0_8px_32px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
      style={{
        color: "var(--ut-text-primary, #0b1829)",
      }}
    >
      <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70" />
      {renderIcon()}

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.95rem] font-black leading-tight tracking-normal">
          {link.title}
        </span>
        <span
          className="mt-1 block truncate text-xs font-semibold leading-tight"
          style={{
            color: "var(--ut-text-secondary, rgba(0,0,0,0.5))",
            opacity: 0.72,
          }}
        >
          {(() => {
            try {
              return new URL(link.url).hostname.replace("www.", "");
            } catch {
              return link.url;
            }
          })()}
        </span>
      </span>

      <ArrowUpRight
        size={16}
        className="shrink-0 opacity-55 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-90"
        style={{
          color: "var(--ut-btn-bg, #0ea5e9)",
        }}
      />
    </a>
  );
}
