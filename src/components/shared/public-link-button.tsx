"use client";

import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { useThemeContext } from "@/hooks/use-theme-context";
import { CustomLinkIcon } from "@/components/shared/custom-link-icon";
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
  const linkStyle = ctx?.link_style ?? "glass";
  const isShake = hoverEffect === "shake";
  const textColor = ctx?.text_color_primary ?? "#0b1829";
  const isLight = isLightColor(textColor);

  const glowEnabled = ctx?.enable_led_glow ?? ctx?.button_glow;
  const glowShadow = glowEnabled
    ? `0 0 20px ${ctx?.link_glow_color ?? "#38bdf8"}50`
    : "none";
  const borderRadius =
    linkStyle === "pill"
      ? "999px"
      : linkStyle === "rounded"
        ? "16px"
        : "calc(var(--ut-card-radius, 1rem) - 4px)";
  const linkBackground =
    linkStyle === "rounded"
      ? "color-mix(in srgb, var(--ut-btn-bg, #0ea5e9) 18%, rgba(255,255,255,0.72))"
      : "var(--ut-link-bg, rgba(255,255,255,0.1))";
  const styleGlow =
    linkStyle === "led" && glowEnabled
      ? `0 0 28px ${ctx?.link_glow_color ?? "#38bdf8"}73, 0 4px 12px rgba(0,0,0,0.08)`
      : `0 4px 16px rgba(0,0,0,0.06), ${glowShadow}`;

  function renderIcon() {
    const iconClass =
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:shadow-lg";
    const iconBg = isLight
      ? "rgba(255,255,255,0.65)"
      : "rgba(255,255,255,0.12)";

    if (link.is_custom_icon && link.icon_blob) {
      return (
        <CustomLinkIcon
          src={link.icon_blob}
          alt={`Ícone de ${link.title}`}
          className="size-9 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5"
        />
      );
    }

    if (iconName && iconName !== "link") {
      return (
        <span className={iconClass} style={{ background: iconBg }}>
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
      <span className={iconClass} style={{ background: iconBg }}>
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
          el.style.boxShadow = `0 0 24px var(--ut-link-glow, rgba(0,150,255,0.3)), 0 4px 12px rgba(0,0,0,0.06)`;
        } else if (hoverEffect === "scale") {
          el.style.transform = "scale(1.03)";
          el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
        }
        el.style.borderColor = "rgba(255,255,255,0.55)";
        el.style.background =
          "color-mix(in srgb, var(--ut-link-bg, rgba(255,255,255,0.1)) 80%, rgba(255,255,255,0.3))";
      }}
      onMouseLeave={(e) => {
        if (isShake) return;
        const el = e.currentTarget;
        el.style.transform = "";
        el.style.boxShadow = "";
        el.style.borderColor =
          "var(--ut-card-glass-border, rgba(255,255,255,0.2))";
        el.style.background = "";
      }}
      className={`group relative flex items-center gap-3 px-4 py-3 transition-all duration-300 ease-out ${
        isShake ? "hover:animate-ut-shake" : ""
      }`}
      style={{
        background: `${linkBackground}`,
        backdropFilter: "blur(12px) saturate(150%)",
        WebkitBackdropFilter: "blur(12px) saturate(150%)",
        borderRadius,
        border: "1px solid var(--ut-card-glass-border, rgba(255,255,255,0.2))",
        boxShadow: styleGlow,
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
          style={{
            color: "var(--ut-text-secondary, rgba(0,0,0,0.5))",
            opacity: 0.65,
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
        size={15}
        className="shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{
          color: "var(--ut-btn-bg, #0ea5e9)",
          opacity: isLight ? 0.5 : 0.7,
        }}
      />
    </a>
  );
}
