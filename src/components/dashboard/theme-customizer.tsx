"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { updateUserThemeAction } from "@/lib/actions/dashboard";
import { type UserThemeConfig, DEFAULT_USER_THEME } from "@/types/database";
import { Button } from "@/components/ui/button";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 255, g: 255, b: 255 };
  return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) };
}

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
};

function Slider({ label, value, min, max, step = 1, suffix = "", onChange }: SliderProps) {
  return (
    <label className="space-y-1.5">
      <span className="flex justify-between text-xs font-bold text-muted">
        <span>{label}</span>
        <span>{value}{suffix}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-brand dark:bg-[rgba(0,180,255,0.1)]"
      />
    </label>
  );
}

type ColorPickerProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

function ColorPicker({ label, value, onChange, className }: ColorPickerProps) {
  return (
    <label className={`space-y-1.5 ${className ?? ""}`}>
      <span className="text-xs font-bold text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-lg border border-white/20 bg-transparent p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          className="h-9 flex-1 rounded-lg border border-white/20 bg-white/20 px-2 text-xs font-mono text-foreground backdrop-blur-sm dark:bg-[rgba(0,180,255,0.04)]"
          maxLength={7}
        />
      </div>
    </label>
  );
}

export function ThemeCustomizer({
  initial,
}: {
  initial: UserThemeConfig | null;
}) {
  const [cfg, setCfg] = useState<UserThemeConfig>(initial ?? DEFAULT_USER_THEME);
  const [preview, setPreview] = useState(false);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function update<K extends keyof UserThemeConfig>(key: K, value: UserThemeConfig[K]) {
    setCfg((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    setMsg(null);
    startTransition(async () => {
      const result = await updateUserThemeAction(cfg);
      setMsg(result.message);
    });
  }

  function reset() {
    setCfg(DEFAULT_USER_THEME);
  }

  const cardRgb = hexToRgb(cfg.card_color);
  const cardBg = `rgba(${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}, ${cfg.card_opacity / 100})`;
  const bgStyle = cfg.background_type === "gradient"
    ? `linear-gradient(160deg, ${cfg.background_gradient_start} 0%, ${cfg.background_color} 35%, ${cfg.background_gradient_end} 60%, ${cfg.background_gradient_start} 100%)`
    : cfg.background_color;
  const btnGlow = cfg.button_glow ? `0 0 20px ${cfg.button_color}40` : "none";
  const shadow = cfg.card_shadow ? `0 8px 32px rgba(0,0,0,0.1)` : "none";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="glass-panel rounded-[1.75rem] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">Personalizar tema</h3>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-white/30 hover:text-foreground dark:hover:bg-[rgba(0,180,255,0.08)]"
            title={preview ? "Editar" : "Preview"}
          >
            {preview ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {preview ? (
          <div className="flex flex-col items-center py-6">
            <div
              className="w-full max-w-xs rounded-2xl p-5 text-center"
              style={{
                background: cardBg,
                backdropFilter: `blur(${cfg.card_blur}px)`,
                borderRadius: `${cfg.card_border_radius}px`,
                boxShadow: shadow,
                border: `1px solid ${cfg.border_color}40`,
                color: cfg.text_color_primary,
              }}
            >
              <div className="mx-auto mb-3 h-16 w-16 rounded-2xl bg-white/60 flex items-center justify-center text-2xl">
                🧑
              </div>
              <p className="text-lg font-black">@usuario</p>
              <p className="text-sm" style={{ color: cfg.text_color_secondary }}>Preview do seu tema</p>
              <div
                className="mt-4 rounded-xl py-2.5 text-sm font-bold text-white transition"
                style={{
                  background: cfg.button_color,
                  boxShadow: btnGlow,
                  borderRadius: `${Math.max(cfg.card_border_radius - 8, 8)}px`,
                }}
              >
                Link de exemplo
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-bold mb-3">Background</p>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => update("background_type", "gradient")}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                    cfg.background_type === "gradient"
                      ? "bg-brand text-white shadow-md"
                      : "bg-white/30 text-muted hover:bg-white/50 dark:bg-[rgba(0,180,255,0.04)] dark:hover:bg-[rgba(0,180,255,0.1)]"
                  }`}
                >
                  Gradiente
                </button>
                <button
                  type="button"
                  onClick={() => update("background_type", "solid")}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                    cfg.background_type === "solid"
                      ? "bg-brand text-white shadow-md"
                      : "bg-white/30 text-muted hover:bg-white/50 dark:bg-[rgba(0,180,255,0.04)] dark:hover:bg-[rgba(0,180,255,0.1)]"
                  }`}
                >
                  Sólido
                </button>
              </div>
              {cfg.background_type === "gradient" ? (
                <div className="grid grid-cols-2 gap-3">
                  <ColorPicker label="Início" value={cfg.background_gradient_start} onChange={(v) => update("background_gradient_start", v)} />
                  <ColorPicker label="Meio" value={cfg.background_color} onChange={(v) => update("background_color", v)} />
                  <ColorPicker label="Fim" value={cfg.background_gradient_end} onChange={(v) => update("background_gradient_end", v)} className="col-span-2" />
                </div>
              ) : (
                <ColorPicker label="Cor" value={cfg.background_color} onChange={(v) => update("background_color", v)} />
              )}
            </div>

            <div>
              <p className="text-sm font-bold mb-3">Card principal</p>
              <ColorPicker label="Cor do card" value={cfg.card_color} onChange={(v) => update("card_color", v)} />
              <div className="mt-3 space-y-3">
                <Slider label="Opacidade" value={cfg.card_opacity} min={5} max={100} suffix="%" onChange={(v) => update("card_opacity", v)} />
                <Slider label="Blur" value={cfg.card_blur} min={0} max={30} suffix="px" onChange={(v) => update("card_blur", v)} />
                <Slider label="Bordas" value={cfg.card_border_radius} min={0} max={48} suffix="px" onChange={(v) => update("card_border_radius", v)} />
              </div>
              <label className="mt-3 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cfg.card_shadow}
                  onChange={(e) => update("card_shadow", e.target.checked)}
                  className="size-4 accent-brand"
                />
                <span className="text-xs font-bold text-muted">Sombra</span>
              </label>
            </div>

            <div>
              <p className="text-sm font-bold mb-3">Cores</p>
              <div className="grid grid-cols-2 gap-3">
                <ColorPicker label="Texto principal" value={cfg.text_color_primary} onChange={(v) => update("text_color_primary", v)} />
                <ColorPicker label="Texto secundário" value={cfg.text_color_secondary} onChange={(v) => update("text_color_secondary", v)} />
                <ColorPicker label="Cor do botão" value={cfg.button_color} onChange={(v) => update("button_color", v)} />
                <ColorPicker label="Borda" value={cfg.border_color} onChange={(v) => update("border_color", v)} />
              </div>
              <label className="mt-3 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cfg.button_glow}
                  onChange={(e) => update("button_glow", e.target.checked)}
                  className="size-4 accent-brand"
                />
                <span className="text-xs font-bold text-muted">Glow nos botões</span>
              </label>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="accent" onClick={save} disabled={pending} className="flex-1">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Salvar tema
          </Button>
          <Button type="button" variant="ghost" onClick={reset} disabled={pending}>
            Reset
          </Button>
        </div>

        {msg ? (
          <p className="text-center text-sm font-semibold text-muted">{msg}</p>
        ) : null}
      </div>

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
            background: cardBg,
            backdropFilter: `blur(${cfg.card_blur}px)`,
            borderRadius: `${cfg.card_border_radius}px`,
            boxShadow: shadow,
            border: `1px solid ${cfg.border_color}40`,
            color: cfg.text_color_primary,
          }}
        >
          <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-2xl bg-white/60 shadow-md flex items-center justify-center text-3xl">
            🧑
          </div>
          <p className="text-xl font-black">@usuario</p>
          <p className="mt-1 text-sm" style={{ color: cfg.text_color_secondary }}>Preview do seu tema personalizado</p>
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
