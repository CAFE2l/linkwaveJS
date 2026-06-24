"use client";

import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { useThemeContext } from "@/hooks/use-theme-context";
import type { Link } from "@/types/database";

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return true;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128;
}



export function PublicLinkButton({ link }: { link: Link }) {
  const ctx = useThemeContext();

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
  const hoverEffect = ctx?.link_hover_effect ?? "lift";
  const isShake = hoverEffect === "shake";
  const textColor = ctx?.text_color_primary ?? "#0b1829";
  const isLight = isLightColor(textColor);

  const glowShadow = ctx?.button_glow
    ? `0 0 16px ${ctx.link_glow_color}40`
    : "none";

  function renderIcon() {
    if (link.is_custom_icon && link.icon_blob) {
      return (
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl backdrop-blur-md transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5"
          style={{
            background: isLight ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.1)",
          }}
        >
          <img src={link.icon_blob} alt="" className="h-5 w-5 object-contain" />
        </span>
      );
    }

    if (iconName && iconName !== "link") {
      return (
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl backdrop-blur-md transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5"
          style={{
            background: isLight ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.1)",
          }}
        >
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
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl backdrop-blur-md transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5"
        style={{
          background: isLight ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.1)",
        }}
      >
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
      onMouseEnter={(e) => {
        if (isShake) return;
        const el = e.currentTarget;
        if (hoverEffect === "lift") {
          el.style.transform = "translateY(-3px)";
          el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
        } else if (hoverEffect === "glow") {
          el.style.transform = "translateY(-1px)";
          el.style.boxShadow = `0 0 20px var(--ut-link-glow, rgba(0,150,255,0.3)), 0 4px 12px rgba(0,0,0,0.06)`;
        } else if (hoverEffect === "scale") {
          el.style.transform = "scale(1.03)";
          el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
        }
        el.style.borderColor = "rgba(255,255,255,0.45)";
      }}
      onMouseLeave={(e) => {
        if (isShake) return;
        const el = e.currentTarget;
        el.style.transform = "";
        el.style.boxShadow = "";
        el.style.borderColor = "var(--ut-card-glass-border, rgba(255,255,255,0.2))";
      }}
      className={`group relative flex items-center gap-3 px-4 py-3.5 transition-all duration-300 ${
        isShake ? "hover:animate-ut-shake" : ""
      }`}
      style={{
        background: "var(--ut-link-bg, rgba(255,255,255,0.1))",
        backdropFilter: "blur(14px) saturate(160%)",
        WebkitBackdropFilter: "blur(14px) saturate(160%)",
        borderRadius: "calc(var(--ut-card-radius, 1rem) - 4px)",
        border: "1px solid var(--ut-card-glass-border, rgba(255,255,255,0.2))",
        boxShadow: `0 4px 12px rgba(0,0,0,0.06), ${glowShadow}`,
        color: "var(--ut-text-primary, #0b1829)",
      }}
    >
      {renderIcon()}

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold leading-tight">
          {link.title}
        </span>
        <span
          className="mt-0.5 block truncate text-xs leading-tight"
          style={{ color: "var(--ut-text-secondary, rgba(0,0,0,0.5))", opacity: 0.65 }}
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
        size={15}
        className="shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{ color: "var(--ut-btn-bg, #0ea5e9)", opacity: isLight ? 0.5 : 0.7 }}
      />
    </a>
  );
}
