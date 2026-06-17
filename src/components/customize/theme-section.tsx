"use client";

import type { UserThemeConfig } from "@/types/database";
import { Card, CardHeader, CardBody } from "@/components/ui/card";

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
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        selected
          ? "bg-brand text-white shadow-sm"
          : "bg-surface-hover text-fg-secondary hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="text-xs font-medium text-fg-secondary w-28 shrink-0">{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-8 w-8 cursor-pointer rounded-lg border border-border p-0.5" />
      <input type="text" value={value} onChange={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v); }} className="h-8 flex-1 rounded-lg border border-border bg-surface px-2 text-xs font-mono" maxLength={7} />
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
      <Card>
        <CardHeader><h3 className="font-bold text-foreground text-sm">Background</h3></CardHeader>
        <CardBody className="space-y-3">
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
        </CardBody>
      </Card>

      {/* Glass style */}
      <Card>
        <CardHeader><h3 className="font-bold text-foreground text-sm">Card</h3></CardHeader>
        <CardBody className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {["dark", "light", "frosted", "neon"].map((g) => (
              <Toggle key={g} selected={theme.card_glass_style === g} label={g} onClick={() => onUpdate({ card_glass_style: g as UserThemeConfig["card_glass_style"] })} />
            ))}
          </div>
          <ColorRow label="Borda" value={theme.border_color} onChange={(v) => onUpdate({ border_color: v })} />
        </CardBody>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader><h3 className="font-bold text-foreground text-sm">Cores</h3></CardHeader>
        <CardBody className="space-y-2">
          <ColorRow label="Texto principal" value={theme.text_color_primary} onChange={(v) => onUpdate({ text_color_primary: v })} />
          <ColorRow label="Texto secundário" value={theme.text_color_secondary} onChange={(v) => onUpdate({ text_color_secondary: v })} />
          <ColorRow label="Botão" value={theme.button_color} onChange={(v) => onUpdate({ button_color: v })} />
          <ColorRow label="Glow links" value={theme.link_glow_color} onChange={(v) => onUpdate({ link_glow_color: v })} />
        </CardBody>
      </Card>

      {/* Effects */}
      <Card>
        <CardHeader><h3 className="font-bold text-foreground text-sm">Efeitos</h3></CardHeader>
        <CardBody className="space-y-3">
          <div>
            <p className="text-xs font-medium text-fg-secondary mb-1">Hover nos links</p>
            <div className="flex gap-2 flex-wrap">
              {["lift", "glow", "scale", "shake", "none"].map((e) => (
                <Toggle key={e} selected={theme.link_hover_effect === e} label={e} onClick={() => onUpdate({ link_hover_effect: e as UserThemeConfig["link_hover_effect"] })} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-fg-secondary mb-1">Fonte</p>
            <div className="flex gap-2 flex-wrap">
              {["space", "nunito", "mono", "serif"].map((f) => (
                <Toggle key={f} selected={theme.font_style === f} label={f} onClick={() => onUpdate({ font_style: f as UserThemeConfig["font_style"] })} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-fg-secondary mb-1">Anel do avatar</p>
            <div className="flex gap-2 flex-wrap">
              <Toggle selected={theme.avatar_ring_style === "gradient"} label="Gradiente" onClick={() => onUpdate({ avatar_ring_style: "gradient" })} />
              <Toggle selected={theme.avatar_ring_style === "solid"} label="Sólido" onClick={() => onUpdate({ avatar_ring_style: "solid" })} />
              <Toggle selected={theme.avatar_ring_style === "none"} label="Nenhum" onClick={() => onUpdate({ avatar_ring_style: "none" })} />
            </div>
          </div>
          <ColorRow label="LED avatar" value={theme.avatar_led_color} onChange={(v) => onUpdate({ avatar_led_color: v })} />
          <ColorRow label="LED banner" value={theme.banner_led_color} onChange={(v) => onUpdate({ banner_led_color: v })} />
        </CardBody>
      </Card>

      {/* Toggles */}
      <Card>
        <CardHeader><h3 className="font-bold text-foreground text-sm">Extras</h3></CardHeader>
        <CardBody className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={theme.enable_stars} onChange={(e) => onUpdate({ enable_stars: e.target.checked })} className="size-4 accent-brand" />
            <span className="text-sm text-foreground">Estrelas animadas</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={theme.button_glow} onChange={(e) => onUpdate({ button_glow: e.target.checked })} className="size-4 accent-brand" />
            <span className="text-sm text-foreground">Glow nos botões</span>
          </label>
        </CardBody>
      </Card>
    </div>
  );
}
