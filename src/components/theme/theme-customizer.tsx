"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { updateThemeAction } from "@/lib/actions/theme";
import { type UserThemeConfig, DEFAULT_USER_THEME } from "@/types/database";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 255, g: 255, b: 255 };
  return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) };
}

const glassStyles: Record<string, { bg: string; border: string }> = {
  dark:    { bg: "rgba(4,12,30,0.5)",     border: "rgba(50,100,220,0.25)" },
  light:   { bg: "rgba(255,255,255,0.15)", border: "rgba(255,255,255,0.5)" },
  frosted: { bg: "rgba(200,230,255,0.12)", border: "rgba(150,200,255,0.35)" },
  neon:    { bg: "rgba(0,20,40,0.65)",     border: "rgba(0,245,212,0.5)" },
};

const galaxyBg: Record<string, string> = {
  milkyway:  "linear-gradient(135deg,#1e1b4b,#3730a3,#3b82f6)",
  andromeda: "linear-gradient(135deg,#7c2d12,#dc2626,#fb923c)",
  nebula:    "linear-gradient(135deg,#134e4a,#0d9488,#14b8a6)",
  blackhole: "linear-gradient(135deg,#000,#1f2937,#7c2d12)",
};

type ToggleBtnProps = {
  selected: boolean; label: string; onClick: () => void;
};
function ToggleBtn({ selected, label, onClick }: ToggleBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
        selected
          ? "bg-white/50 text-ocean shadow-sm border border-white/70 backdrop-blur-sm"
          : "bg-white/30 text-ocean/50 hover:text-ocean hover:bg-white/40 border border-transparent"
      }`}
    >
      {label}
    </button>
  );
}

export function ThemeCustomizer({ initial }: { initial: UserThemeConfig | null }) {
  const [cfg, setCfg] = useState<UserThemeConfig>(initial ?? DEFAULT_USER_THEME);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function update<K extends keyof UserThemeConfig>(key: K, value: UserThemeConfig[K]) {
    setCfg((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    setMsg(null);
    startTransition(async () => {
      const result = await updateThemeAction(cfg);
      setMsg(result.message);
    });
  }

  function reset() {
    setCfg(DEFAULT_USER_THEME);
  }

  const cardRgb = hexToRgb(cfg.card_color);
  const bgRgb = hexToRgb(cfg.background_color);
  const cardBg = `rgba(${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}, ${cfg.card_opacity / 100})`;

  let bgStyle: string;
  if (cfg.background_type === "galaxy") {
    bgStyle = galaxyBg[cfg.galaxy_theme] ?? galaxyBg.milkyway;
  } else if (cfg.background_type === "gradient") {
    bgStyle = `linear-gradient(160deg, ${cfg.background_gradient_start} 0%, ${cfg.background_color} 35%, ${cfg.background_gradient_end} 60%, ${cfg.background_gradient_start} 100%)`;
  } else {
    bgStyle = cfg.background_color;
  }

  const glass = glassStyles[cfg.card_glass_style] ?? glassStyles.dark;
  const btnGlow = cfg.button_glow ? `0 0 20px ${cfg.button_color}40` : "none";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="glass-card-strong p-6 space-y-6">
        <h3 className="text-lg font-black text-ocean">Personalizar tema</h3>

        <div className="space-y-5">
          {/* Background */}
          <Section title="Background">
            <div className="flex gap-2 mb-3">
              <ToggleBtn selected={cfg.background_type === "gradient"} label="Gradiente" onClick={() => update("background_type", "gradient")} />
              <ToggleBtn selected={cfg.background_type === "solid"} label="Sólido" onClick={() => update("background_type", "solid")} />
              <ToggleBtn selected={cfg.background_type === "galaxy"} label="Galáxia" onClick={() => update("background_type", "galaxy")} />
            </div>
            {cfg.background_type === "galaxy" && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {Object.keys(galaxyBg).map((g) => (
                  <ToggleBtn key={g} selected={cfg.galaxy_theme === g} label={g} onClick={() => update("galaxy_theme", g as UserThemeConfig["galaxy_theme"])} />
                ))}
              </div>
            )}
            {cfg.background_type === "gradient" && (
              <div className="grid grid-cols-2 gap-3">
                <ColorPicker label="Início" value={cfg.background_gradient_start} onChange={(v) => update("background_gradient_start", v)} />
                <ColorPicker label="Meio" value={cfg.background_color} onChange={(v) => update("background_color", v)} />
                <ColorPicker label="Fim" value={cfg.background_gradient_end} onChange={(v) => update("background_gradient_end", v)} className="col-span-2" />
              </div>
            )}
            {cfg.background_type === "solid" && (
              <ColorPicker label="Cor" value={cfg.background_color} onChange={(v) => update("background_color", v)} />
            )}
            <div className="mt-3">
              <p className="text-xs font-bold text-ocean/60 mb-2">Efeito</p>
              <div className="flex gap-2">
                <ToggleBtn selected={cfg.background_effect === "none"} label="Nenhum" onClick={() => update("background_effect", "none")} />
                <ToggleBtn selected={cfg.background_effect === "pulse"} label="Pulse" onClick={() => update("background_effect", "pulse")} />
                <ToggleBtn selected={cfg.background_effect === "shimmer"} label="Shimmer" onClick={() => update("background_effect", "shimmer")} />
              </div>
            </div>
            <label className="mt-3 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cfg.enable_stars}
                onChange={(e) => update("enable_stars", e.target.checked)}
                className="size-4 accent-cyan-500"
              />
              <span className="text-xs font-bold text-ocean">Estrelas animadas</span>
            </label>
          </Section>

          {/* Card */}
          <Section title="Card principal">
            <ColorPicker label="Cor do card" value={cfg.card_color} onChange={(v) => update("card_color", v)} />
            <p className="text-xs font-bold text-ocean/60 mt-3 mb-2">Estilo do vidro</p>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(glassStyles).map((g) => (
                <ToggleBtn key={g} selected={cfg.card_glass_style === g} label={g} onClick={() => update("card_glass_style", g as UserThemeConfig["card_glass_style"])} />
              ))}
            </div>
            <div className="mt-3 space-y-3">
              <Slider label="Opacidade" value={cfg.card_opacity} min={5} max={100} suffix="%" onChange={(v) => update("card_opacity", v)} />
              <Slider label="Blur" value={cfg.card_blur} min={0} max={30} suffix="px" onChange={(v) => update("card_blur", v)} />
              <Slider label="Bordas" value={cfg.card_border_radius} min={0} max={48} suffix="px" onChange={(v) => update("card_border_radius", v)} />
            </div>
            <label className="mt-3 flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={cfg.card_shadow} onChange={(e) => update("card_shadow", e.target.checked)} className="size-4 accent-cyan-500" />
              <span className="text-xs font-bold text-ocean">Sombra extra</span>
            </label>
          </Section>

          {/* Colors */}
          <Section title="Cores">
            <div className="grid grid-cols-2 gap-3">
              <ColorPicker label="Texto principal" value={cfg.text_color_primary} onChange={(v) => update("text_color_primary", v)} />
              <ColorPicker label="Texto secundário" value={cfg.text_color_secondary} onChange={(v) => update("text_color_secondary", v)} />
              <ColorPicker label="Cor do botão" value={cfg.button_color} onChange={(v) => update("button_color", v)} />
              <ColorPicker label="Borda" value={cfg.border_color} onChange={(v) => update("border_color", v)} />
              <ColorPicker label="Glow dos links" value={cfg.link_glow_color} onChange={(v) => update("link_glow_color", v)} />
            </div>
            <label className="mt-3 flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={cfg.button_glow} onChange={(e) => update("button_glow", e.target.checked)} className="size-4 accent-cyan-500" />
              <span className="text-xs font-bold text-ocean">Glow nos botões</span>
            </label>
          </Section>

          {/* Effects */}
          <Section title="Efeitos & Estilo">
            <p className="text-xs font-bold text-ocean/60 mb-2">Hover nos links</p>
            <div className="flex gap-2 flex-wrap">
              {["lift", "glow", "scale", "shake", "none"].map((e) => (
                <ToggleBtn key={e} selected={cfg.link_hover_effect === e} label={e} onClick={() => update("link_hover_effect", e as UserThemeConfig["link_hover_effect"])} />
              ))}
            </div>
            <p className="text-xs font-bold text-ocean/60 mt-3 mb-2">Transição</p>
            <div className="flex gap-2 flex-wrap">
              {["none", "fade", "slide", "zoom", "float"].map((e) => (
                <ToggleBtn key={e} selected={cfg.transition_effect === e} label={e} onClick={() => update("transition_effect", e as UserThemeConfig["transition_effect"])} />
              ))}
            </div>
            <p className="text-xs font-bold text-ocean/60 mt-3 mb-2">Fonte</p>
            <div className="flex gap-2 flex-wrap">
              {["space", "nunito", "mono", "serif"].map((f) => (
                <ToggleBtn key={f} selected={cfg.font_style === f} label={f} onClick={() => update("font_style", f as UserThemeConfig["font_style"])} />
              ))}
            </div>
            <p className="text-xs font-bold text-ocean/60 mt-3 mb-2">Ícone</p>
            <div className="flex gap-2">
              <ToggleBtn selected={cfg.icon_style === "8bit"} label="8-bit" onClick={() => update("icon_style", "8bit")} />
              <ToggleBtn selected={cfg.icon_style === "clay"} label="Clay" onClick={() => update("icon_style", "clay")} />
            </div>
          </Section>

          {/* Avatar */}
          <Section title="Avatar">
            <ColorPicker label="Cor do LED" value={cfg.avatar_led_color} onChange={(v) => update("avatar_led_color", v)} />
            <p className="text-xs font-bold text-ocean/60 mt-2 mb-2">Anel</p>
            <div className="flex gap-2">
              <ToggleBtn selected={cfg.avatar_ring_style === "gradient"} label="Gradiente" onClick={() => update("avatar_ring_style", "gradient")} />
              <ToggleBtn selected={cfg.avatar_ring_style === "solid"} label="Sólido" onClick={() => update("avatar_ring_style", "solid")} />
              <ToggleBtn selected={cfg.avatar_ring_style === "none"} label="Nenhum" onClick={() => update("avatar_ring_style", "none")} />
            </div>
          </Section>

          {/* Banner */}
          <Section title="Banner LED">
            <ColorPicker label="Cor do LED" value={cfg.banner_led_color} onChange={(v) => update("banner_led_color", v)} />
          </Section>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 h-12 flex-1 rounded-xl bg-gradient-to-b from-cyan-400 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-300/40 transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50 active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Salvar tema
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 h-12 rounded-xl border border-white/70 bg-white/40 text-ocean font-bold text-sm backdrop-blur-md transition hover:bg-white/60 disabled:opacity-50"
          >
            Reset
          </button>
        </div>

        {msg ? <p className="text-center text-sm font-bold text-ocean/60">{msg}</p> : null}
      </div>

      {/* Preview */}
      <div
        className="overflow-hidden rounded-[1.75rem] p-6"
        style={{
          background: bgStyle,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: cfg.text_color_secondary }}>
          Preview ao vivo
        </p>
        <div
          className="mx-auto max-w-xs p-5 text-center"
          style={{
            background: glass.bg,
            backdropFilter: `blur(${cfg.card_blur}px)`,
            borderRadius: `${cfg.card_border_radius}px`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            border: `1px solid ${glass.border}`,
            color: cfg.text_color_primary,
            fontFamily: cfg.font_style === "space" ? "'Space Grotesk', sans-serif" : cfg.font_style === "nunito" ? "'Nunito', sans-serif" : cfg.font_style === "mono" ? "monospace" : "Georgia, serif",
          }}
        >
          <div
            className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-[calc(var(--ut-card-radius,2rem)-4px)] flex items-center justify-center text-3xl"
            style={{
              boxShadow: cfg.avatar_ring_style !== "none" ? `0 0 14px ${cfg.avatar_led_color}` : "none",
              border: cfg.avatar_ring_style !== "none" ? `3px solid ${cfg.avatar_led_color}` : "none",
            }}
          >
            🧑
          </div>
          <p className="text-xl font-black">@usuario</p>
          <p className="mt-1 text-sm" style={{ color: cfg.text_color_secondary }}>Preview ao vivo</p>
          <div className="mt-5 space-y-2">
            {["Instagram", "YouTube", "TikTok"].map((name) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition hover:-translate-y-0.5"
                style={{
                  background: cardBg,
                  backdropFilter: `blur(${cfg.card_blur}px)`,
                  color: cfg.text_color_primary,
                  border: `1px solid ${cfg.border_color}30`,
                  borderRadius: `${Math.max(cfg.card_border_radius - 8, 8)}px`,
                }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/40 text-xs">🌐</span>
                {name}
              </div>
            ))}
          </div>
          <div
            className="mt-5 rounded-xl py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            style={{
              background: cfg.button_color,
              boxShadow: btnGlow,
              borderRadius: `${Math.max(cfg.card_border_radius - 8, 8)}px`,
            }}
          >
            Seguir
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/20 pt-4">
      <p className="text-sm font-bold text-ocean mb-3">{title}</p>
      {children}
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, suffix = "", onChange }: {
  label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (v: number) => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="flex justify-between text-xs font-bold text-ocean/60">
        <span>{label}</span>
        <span>{value}{suffix}</span>
      </span>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-cyan-500"
      />
    </label>
  );
}

function ColorPicker({ label, value, onChange, className }: {
  label: string; value: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <label className={`space-y-1.5 ${className ?? ""}`}>
      <span className="text-xs font-bold text-ocean/60">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color" value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-lg border border-white/50 bg-white/30 p-0.5"
        />
        <input
          type="text" value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          className="h-9 flex-1 rounded-lg border border-white/50 bg-white/30 px-2 text-xs font-bold text-ocean backdrop-blur-sm"
          maxLength={7}
        />
      </div>
    </label>
  );
}