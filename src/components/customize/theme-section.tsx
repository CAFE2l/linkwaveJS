"use client";

import type { UserThemeConfig } from "@/types/database";

const galaxyBg: Record<string, string> = {
  milkyway: "#1e1b4b",
  andromeda: "#7c2d12",
  nebula: "#134e4a",
  blackhole: "#000000",
};

type ToggleProps = {
  selected: boolean; label: string; onClick: () => void;
};
function Toggle({ selected, label, onClick }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
        selected
          ? "bg-white/50 text-ocean shadow-sm border border-white/70 backdrop-blur-sm"
          : "bg-white/20 text-ocean/60 hover:text-ocean border border-transparent hover:bg-white/30"
      }`}
    >
      {label}
    </button>
  );
}

function SliderRow({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="text-xs font-bold text-ocean/60 w-28 shrink-0">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-cyan-500 h-1.5 cursor-pointer" />
      <span className="w-8 text-right text-xs font-bold text-ocean/60">{value}</span>
    </label>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="text-xs font-bold text-ocean/60 w-28 shrink-0">{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 w-8 cursor-pointer rounded-lg border border-white/50 bg-white/30 p-0.5" />
      <input type="text" value={value} onChange={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v); }} className="h-8 flex-1 rounded-lg border border-white/50 bg-white/30 px-2 text-xs font-bold text-ocean backdrop-blur-sm" maxLength={7} />
    </label>
  );
}

export function ThemeSection({
  theme,
  onUpdate,
}: {
  theme: UserThemeConfig;
  onUpdate: (partial: Partial<UserThemeConfig>) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Background type */}
      <div className="glass-card-strong p-5 space-y-3">
        <h3 className="text-sm font-black text-ocean">Background</h3>
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Toggle selected={theme.background_type === "solid"} label="Sólido" onClick={() => onUpdate({ background_type: "solid" })} />
            <Toggle selected={theme.background_type === "gradient"} label="Gradiente" onClick={() => onUpdate({ background_type: "gradient" })} />
            <Toggle selected={theme.background_type === "galaxy"} label="Galáxia" onClick={() => onUpdate({ background_type: "galaxy" })} />
          </div>
          {theme.background_type === "solid" && (
            <ColorRow label="Cor" value={theme.background_color} onChange={(v) => onUpdate({ background_color: v })} />
          )}
          {theme.background_type === "gradient" && (
            <>
              <ColorRow label="Início" value={theme.background_gradient_start} onChange={(v) => onUpdate({ background_gradient_start: v })} />
              <ColorRow label="Meio" value={theme.background_color} onChange={(v) => onUpdate({ background_color: v })} />
              <ColorRow label="Fim" value={theme.background_gradient_end} onChange={(v) => onUpdate({ background_gradient_end: v })} />
            </>
          )}
          {theme.background_type === "galaxy" && (
            <div className="flex gap-2 flex-wrap">
              {Object.keys(galaxyBg).map((g) => (
                <Toggle key={g} selected={theme.galaxy_theme === g} label={g} onClick={() => onUpdate({ galaxy_theme: g as UserThemeConfig["galaxy_theme"] })} />
              ))}
            </div>
          )}
          <div>
            <p className="mb-1 text-xs font-bold text-ocean/60">Efeito de fundo</p>
            <div className="flex gap-2 flex-wrap">
              <Toggle selected={theme.background_effect === "none"} label="Nenhum" onClick={() => onUpdate({ background_effect: "none" })} />
              <Toggle selected={theme.background_effect === "pulse"} label="Pulse" onClick={() => onUpdate({ background_effect: "pulse" })} />
              <Toggle selected={theme.background_effect === "shimmer"} label="Shimmer" onClick={() => onUpdate({ background_effect: "shimmer" })} />
            </div>
          </div>
        </div>
      </div>

      {/* Glass style */}
      <div className="glass-card-strong p-5 space-y-3">
        <h3 className="text-sm font-black text-ocean">Card</h3>
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {["dark", "light", "frosted", "neon"].map((g) => (
              <Toggle key={g} selected={theme.card_glass_style === g} label={g} onClick={() => onUpdate({ card_glass_style: g as UserThemeConfig["card_glass_style"] })} />
            ))}
          </div>
          <SliderRow label="Opacidade" value={theme.card_opacity} min={0} max={100} step={5} onChange={(v) => onUpdate({ card_opacity: v })} />
          <SliderRow label="Desfoque" value={theme.card_blur} min={0} max={40} step={2} onChange={(v) => onUpdate({ card_blur: v })} />
          <SliderRow label="Borda arred." value={theme.card_border_radius} min={0} max={48} step={4} onChange={(v) => onUpdate({ card_border_radius: v })} />
          <ColorRow label="Borda" value={theme.border_color} onChange={(v) => onUpdate({ border_color: v })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={theme.card_shadow} onChange={(e) => onUpdate({ card_shadow: e.target.checked })} className="size-4 accent-cyan-500" />
            <span className="text-sm font-bold text-ocean">Sombra no card</span>
          </label>
        </div>
      </div>

      {/* Colors */}
      <div className="glass-card-strong p-5 space-y-3">
        <h3 className="text-sm font-black text-ocean">Cores</h3>
        <div className="space-y-2">
          <ColorRow label="Texto principal" value={theme.text_color_primary} onChange={(v) => onUpdate({ text_color_primary: v })} />
          <ColorRow label="Texto secundário" value={theme.text_color_secondary} onChange={(v) => onUpdate({ text_color_secondary: v })} />
          <ColorRow label="Botão" value={theme.button_color} onChange={(v) => onUpdate({ button_color: v })} />
          <ColorRow label="Glow links" value={theme.link_glow_color} onChange={(v) => onUpdate({ link_glow_color: v })} />
        </div>
      </div>

      {/* Effects */}
      <div className="glass-card-strong p-5 space-y-3">
        <h3 className="text-sm font-black text-ocean">Efeitos</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-ocean/60 mb-1">Hover nos links</p>
            <div className="flex gap-2 flex-wrap">
              {["lift", "glow", "scale", "shake", "none"].map((e) => (
                <Toggle key={e} selected={theme.link_hover_effect === e} label={e} onClick={() => onUpdate({ link_hover_effect: e as UserThemeConfig["link_hover_effect"] })} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-ocean/60 mb-1">Transição</p>
            <div className="flex gap-2 flex-wrap">
              {["none", "fade", "slide", "zoom", "float"].map((t) => (
                <Toggle key={t} selected={theme.transition_effect === t} label={t} onClick={() => onUpdate({ transition_effect: t as UserThemeConfig["transition_effect"] })} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-ocean/60 mb-1">Ícones</p>
            <div className="flex gap-2 flex-wrap">
              <Toggle selected={theme.icon_style === "8bit"} label="8bit" onClick={() => onUpdate({ icon_style: "8bit" })} />
              <Toggle selected={theme.icon_style === "clay"} label="Clay" onClick={() => onUpdate({ icon_style: "clay" })} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-ocean/60 mb-1">Fonte</p>
            <div className="flex gap-2 flex-wrap">
              {["space", "nunito", "mono", "serif"].map((f) => (
                <Toggle key={f} selected={theme.font_style === f} label={f} onClick={() => onUpdate({ font_style: f as UserThemeConfig["font_style"] })} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-ocean/60 mb-1">Anel do avatar</p>
            <div className="flex gap-2 flex-wrap">
              <Toggle selected={theme.avatar_ring_style === "gradient"} label="Gradiente" onClick={() => onUpdate({ avatar_ring_style: "gradient" })} />
              <Toggle selected={theme.avatar_ring_style === "solid"} label="Sólido" onClick={() => onUpdate({ avatar_ring_style: "solid" })} />
              <Toggle selected={theme.avatar_ring_style === "none"} label="Nenhum" onClick={() => onUpdate({ avatar_ring_style: "none" })} />
            </div>
          </div>
          <ColorRow label="LED avatar" value={theme.avatar_led_color} onChange={(v) => onUpdate({ avatar_led_color: v })} />
          <ColorRow label="LED banner" value={theme.banner_led_color} onChange={(v) => onUpdate({ banner_led_color: v })} />
        </div>
      </div>

      {/* Toggles */}
      <div className="glass-card-strong p-5 space-y-3">
        <h3 className="text-sm font-black text-ocean">Extras</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={theme.enable_stars} onChange={(e) => onUpdate({ enable_stars: e.target.checked })} className="size-4 accent-cyan-500" />
            <span className="text-sm font-bold text-ocean">Estrelas animadas</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={theme.button_glow} onChange={(e) => onUpdate({ button_glow: e.target.checked })} className="size-4 accent-cyan-500" />
            <span className="text-sm font-bold text-ocean">Glow nos botões</span>
          </label>
        </div>
      </div>
    </div>
  );
}
