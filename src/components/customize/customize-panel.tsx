"use client";

import { useState, useTransition } from "react";
import {
  Check,
  CheckCircle2,
  ExternalLink,
  Layers3,
  LayoutTemplate,
  Loader2,
  Palette,
  Save,
  Sparkle,
  Sparkles,
  Square,
  TriangleAlert,
  Type,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { updateProfileAction } from "@/lib/actions/profile";
import { updateThemeAction } from "@/lib/actions/theme";
import { mergeUserTheme, THEME_PRESETS } from "@/lib/profile-theme-presets";
import {
  type AppUser,
  type Link,
  type UserThemeConfig,
} from "@/types/database";
import { AvatarUpload } from "./avatar-upload";
import { BannerUpload } from "./banner-upload";
import { CustomizePreview } from "./preview";

const inputClass =
  "h-12 w-full rounded-2xl border border-white/75 bg-white/45 px-4 text-sm font-bold text-ocean outline-none backdrop-blur-xl transition focus:border-cyan-200 focus:bg-white/65 focus:ring-4 focus:ring-cyan-200/25";

type ProfileDraft = {
  name: string;
  username: string;
  bio: string;
};

type SaveMessage = {
  ok: boolean;
  text: string;
};

const galaxyBg: Record<string, string> = {
  milkyway: "#1e1b4b",
  andromeda: "#7c2d12",
  nebula: "#134e4a",
  blackhole: "#000000",
};

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/55 text-ocean shadow-sm backdrop-blur-xl">
        <Icon size={18} />
      </div>
      <div>
        <h2 className="text-lg font-black text-ocean">{title}</h2>
        <p className="mt-0.5 text-sm font-semibold text-ocean/60">{description}</p>
      </div>
    </div>
  );
}

function ChoiceButton({
  selected,
  label,
  description,
  onClick,
}: {
  selected: boolean;
  label: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`relative min-h-16 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
        selected
          ? "border-white bg-white/70 text-ocean shadow-lg shadow-cyan-900/10 ring-2 ring-cyan-200/70"
          : "border-white/55 bg-white/25 text-ocean/70 hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/45"
      }`}
    >
      <span className="block pr-5 text-sm font-black">{label}</span>
      {description && <span className="mt-0.5 block text-xs font-semibold opacity-65">{description}</span>}
      {selected && (
        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-cyan-500 text-white shadow-sm">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function SettingSwitch({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/55 bg-white/25 px-4 py-3 transition hover:bg-white/40">
      <span>
        <span className="block text-sm font-black text-ocean">{label}</span>
        <span className="mt-0.5 block text-xs font-semibold text-ocean/55">{description}</span>
      </span>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="relative h-7 w-12 shrink-0 rounded-full border border-white/80 bg-slate-300/70 shadow-inner transition peer-checked:bg-gradient-to-r peer-checked:from-emerald-400 peer-checked:to-cyan-500 peer-focus-visible:ring-4 peer-focus-visible:ring-cyan-200/60 after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow-md after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}

function Toggle({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
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

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="flex justify-between text-xs font-bold text-ocean/60">
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
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-cyan-500"
      />
    </label>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-ocean/60">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-lg border border-white/50 bg-white/30 p-0.5"
        />
        <input
          type="text"
          value={value}
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

export function CustomizePanel({
  user,
  links,
  initialBio,
}: {
  user: AppUser;
  links: Link[];
  initialBio: string;
}) {
  const [currentUser, setCurrentUser] = useState(user);
  const [profile, setProfile] = useState<ProfileDraft>({
    name: user.name ?? "",
    username: user.username,
    bio: initialBio,
  });
  const [theme, setTheme] = useState<UserThemeConfig>(
    mergeUserTheme(user.theme_json as Partial<UserThemeConfig> | null),
  );
  const [saving, startSaving] = useTransition();
  const [message, setMessage] = useState<SaveMessage | null>(null);

  function updateTheme(partial: Partial<UserThemeConfig>) {
    setTheme((current) => ({ ...current, ...partial }));
    setMessage(null);
  }

  function saveCustomization() {
    setMessage(null);
    startSaving(async () => {
      const profileResult = await updateProfileAction({
        username: profile.username,
        name: profile.name,
        avatarUrl: currentUser.avatar_url ?? "",
        bannerUrl: currentUser.banner_url ?? "",
        bio: profile.bio,
        theme: "wave",
      });

      if (!profileResult.ok) {
        setMessage({ ok: false, text: profileResult.message });
        return;
      }

      const themeResult = await updateThemeAction(theme);
      setMessage({
        ok: themeResult.ok,
        text: themeResult.ok ? "Personalização salva e publicada." : themeResult.message,
      });
      if (profileResult.profile) {
        setCurrentUser((current) => ({
          ...current,
          name: profileResult.profile?.name ?? current.name,
          username: profileResult.profile?.username ?? current.username,
        }));
      }
    });
  }

  return (
    <DashboardShell user={currentUser}>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/35 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-ocean/65 backdrop-blur-xl">
            <WandSparkles size={13} />
            Editor visual
          </div>
          <h1 className="text-3xl font-black tracking-tight text-ocean sm:text-4xl">
            Customizar página
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-ocean/60 sm:text-base">
            Personalize cada detalhe da sua página — aparência, cards, botões, tipografia e muito mais.
          </p>
        </div>
        <a
          href={`/u/${currentUser.username}`}
          target="_blank"
          rel="noreferrer"
          className="glass-button-outline inline-flex h-11 items-center justify-center gap-2 px-5 text-sm"
        >
          <ExternalLink size={15} />
          Abrir página pública
        </a>
      </div>

      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-6">
          {/* ─── 1. Profile ─── */}
          <section className="glass-card-strong animate-fade-in-up p-5 sm:p-7">
            <SectionHeader
              icon={UserRound}
              title="1. Perfil"
              description="Identidade e apresentação da sua página."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <AvatarUpload
                user={currentUser}
                onUpdate={(url) =>
                  setCurrentUser((current) => ({ ...current, avatar_url: url }))
                }
              />
              <BannerUpload
                user={currentUser}
                onUpdate={(url) =>
                  setCurrentUser((current) => ({ ...current, banner_url: url }))
                }
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-ocean/65">
                Foco do banner:
              </span>
              {["top", "center", "bottom"].map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => updateTheme({ banner_position: pos as UserThemeConfig["banner_position"] })}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    theme.banner_position === pos
                      ? "bg-white/60 text-ocean shadow-sm border border-white/80 backdrop-blur-sm"
                      : "bg-white/20 text-ocean/60 hover:text-ocean border border-transparent hover:bg-white/30"
                  }`}
                >
                  {pos === "top" ? "Topo" : pos === "center" ? "Centro" : "Base"}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-ocean/65">
                  Nome
                </span>
                <input
                  className={inputClass}
                  value={profile.name}
                  maxLength={60}
                  onChange={(event) => {
                    setProfile((current) => ({ ...current, name: event.target.value }));
                    setCurrentUser((current) => ({ ...current, name: event.target.value }));
                    setMessage(null);
                  }}
                />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-ocean/65">
                  Username
                </span>
                <div className="flex h-12 items-center rounded-2xl border border-white/75 bg-white/45 px-4 backdrop-blur-xl transition focus-within:border-cyan-200 focus-within:bg-white/65 focus-within:ring-4 focus-within:ring-cyan-200/25">
                  <span className="font-black text-ocean/50">@</span>
                  <input
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm font-bold text-ocean outline-none"
                    value={profile.username}
                    autoCapitalize="none"
                    autoComplete="username"
                    onChange={(event) => {
                      setProfile((current) => ({ ...current, username: event.target.value }));
                      setCurrentUser((current) => ({ ...current, username: event.target.value }));
                      setMessage(null);
                    }}
                  />
                </div>
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-ocean/65">
                  Bio
                  <span>{profile.bio.length}/180</span>
                </span>
                <textarea
                  className={`${inputClass} min-h-24 resize-none py-3`}
                  value={profile.bio}
                  maxLength={180}
                  placeholder="Conte rapidamente quem você é..."
                  onChange={(event) => {
                    setProfile((current) => ({ ...current, bio: event.target.value }));
                    setMessage(null);
                  }}
                />
              </label>
            </div>
          </section>

          {/* ─── 2. Appearance ─── */}
          <section
            className="glass-card-strong animate-fade-in-up p-5 sm:p-7"
            style={{ animationDelay: "80ms" }}
          >
            <SectionHeader
              icon={Palette}
              title="2. Aparência"
              description="Fundo, gradiente, efeitos e atmosfera da sua página."
            />

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-black text-ocean">Estilo do fundo</p>
                <div className="flex gap-2">
                  <Toggle selected={theme.background_type === "gradient"} label="Gradiente" onClick={() => updateTheme({ background_type: "gradient" })} />
                  <Toggle selected={theme.background_type === "solid"} label="Sólido" onClick={() => updateTheme({ background_type: "solid" })} />
                  <Toggle selected={theme.background_type === "galaxy"} label="Galáxia" onClick={() => updateTheme({ background_type: "galaxy" })} />
                </div>
              </div>

              {theme.background_type === "galaxy" && (
                <div>
                  <p className="mb-2 text-xs font-bold text-ocean/60">Tema da galáxia</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.keys(galaxyBg).map((g) => (
                      <Toggle key={g} selected={theme.galaxy_theme === g} label={g} onClick={() => updateTheme({ galaxy_theme: g as UserThemeConfig["galaxy_theme"] })} />
                    ))}
                  </div>
                </div>
              )}

              {theme.background_type === "gradient" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <ColorPicker label="Início" value={theme.background_gradient_start} onChange={(v) => updateTheme({ theme_id: "default_aero", background_gradient_start: v })} />
                  <ColorPicker label="Meio" value={theme.background_color} onChange={(v) => updateTheme({ theme_id: "default_aero", background_color: v })} />
                  <ColorPicker label="Fim" value={theme.background_gradient_end} onChange={(v) => updateTheme({ theme_id: "default_aero", background_gradient_end: v })} />
                </div>
              )}

              {theme.background_type === "solid" && (
                <ColorPicker label="Cor de fundo" value={theme.background_color} onChange={(v) => updateTheme({ background_color: v })} />
              )}

              <div>
                <p className="mb-2 text-xs font-bold text-ocean/60">Efeito de fundo</p>
                <div className="flex gap-2 flex-wrap">
                  <Toggle selected={theme.background_effect === "none"} label="Nenhum" onClick={() => updateTheme({ background_effect: "none" })} />
                  <Toggle selected={theme.background_effect === "pulse"} label="Pulse" onClick={() => updateTheme({ background_effect: "pulse" })} />
                  <Toggle selected={theme.background_effect === "shimmer"} label="Shimmer" onClick={() => updateTheme({ background_effect: "shimmer" })} />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme.enable_stars}
                  onChange={(e) => updateTheme({ enable_stars: e.target.checked })}
                  className="size-4 accent-cyan-500"
                />
                <span className="text-sm font-bold text-ocean">Estrelas animadas</span>
              </label>
            </div>
          </section>

          {/* ─── 3. Cards ─── */}
          <section
            className="glass-card-strong animate-fade-in-up p-5 sm:p-7"
            style={{ animationDelay: "120ms" }}
          >
            <SectionHeader
              icon={Square}
              title="3. Cards"
              description="Estilo, cor e efeitos dos cards de perfil e links."
            />

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-black text-ocean">Estilo do vidro</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "light", label: "Claro" },
                    { id: "dark", label: "Escuro" },
                    { id: "frosted", label: "Fosco" },
                    { id: "neon", label: "Neon" },
                  ].map(({ id, label }) => (
                    <Toggle
                      key={id}
                      selected={theme.card_glass_style === id}
                      label={label}
                      onClick={() => updateTheme({ card_glass_style: id as UserThemeConfig["card_glass_style"] })}
                    />
                  ))}
                </div>
              </div>

              <ColorPicker label="Cor do card" value={theme.card_color} onChange={(v) => updateTheme({ card_color: v })} />

              <div className="space-y-3">
                <Slider label="Opacidade" value={theme.card_opacity} min={5} max={100} suffix="%" onChange={(v) => updateTheme({ card_opacity: v })} />
                <Slider label="Desfoque" value={theme.card_blur} min={0} max={40} suffix="px" onChange={(v) => updateTheme({ card_blur: v })} />
                <Slider label="Bordas arredondadas" value={theme.card_border_radius} min={0} max={48} suffix="px" onChange={(v) => updateTheme({ card_border_radius: v })} />
              </div>

              <ColorPicker label="Cor da borda" value={theme.border_color} onChange={(v) => updateTheme({ border_color: v })} />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme.card_shadow}
                  onChange={(e) => updateTheme({ card_shadow: e.target.checked })}
                  className="size-4 accent-cyan-500"
                />
                <span className="text-sm font-bold text-ocean">Sombra extra nos cards</span>
              </label>
            </div>
          </section>

          {/* ─── 4. Buttons ─── */}
          <section
            className="glass-card-strong animate-fade-in-up p-5 sm:p-7"
            style={{ animationDelay: "160ms" }}
          >
            <SectionHeader
              icon={LayoutTemplate}
              title="4. Botões"
              description="Formato, cor e interação dos links da página."
            />

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-black text-ocean">Formato dos links</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["rounded", "Rounded", "Card moderno com cantos suaves"],
                    ["pill", "Pill", "Formato cápsula minimalista"],
                    ["glass", "Glass", "Vidro translúcido LinkWave"],
                    ["led", "LED Glow", "Contorno com iluminação colorida"],
                  ].map(([id, label, description]) => (
                    <ChoiceButton
                      key={id}
                      selected={theme.link_style === id}
                      label={label}
                      description={description}
                      onClick={() =>
                        updateTheme({
                          link_style: id as UserThemeConfig["link_style"],
                          button_glow: id === "led" ? true : theme.button_glow,
                          enable_led_glow: id === "led" ? true : theme.enable_led_glow,
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ColorPicker label="Cor do botão" value={theme.button_color} onChange={(v) => updateTheme({ button_color: v })} />
                <ColorPicker label="Glow dos links" value={theme.link_glow_color} onChange={(v) => updateTheme({ link_glow_color: v })} />
              </div>

              <div>
                <p className="mb-2 text-xs font-bold text-ocean/60">Efeito hover</p>
                <div className="flex gap-2 flex-wrap">
                  {["lift", "glow", "scale", "shake", "none"].map((e) => (
                    <Toggle key={e} selected={theme.link_hover_effect === e} label={e} onClick={() => updateTheme({ link_hover_effect: e as UserThemeConfig["link_hover_effect"] })} />
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme.button_glow}
                  onChange={(e) => updateTheme({ button_glow: e.target.checked })}
                  className="size-4 accent-cyan-500"
                />
                <span className="text-sm font-bold text-ocean">Glow nos botões</span>
              </label>
            </div>
          </section>

          {/* ─── 5. Typography ─── */}
          <section
            className="glass-card-strong animate-fade-in-up p-5 sm:p-7"
            style={{ animationDelay: "200ms" }}
          >
            <SectionHeader
              icon={Type}
              title="5. Tipografia"
              description="Fonte e cores dos textos da sua página."
            />

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-black text-ocean">Fonte</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "space", label: "Space Grotesk" },
                    { id: "nunito", label: "Nunito" },
                    { id: "mono", label: "Mono" },
                    { id: "serif", label: "Serif" },
                  ].map(({ id, label }) => (
                    <Toggle key={id} selected={theme.font_style === id} label={label} onClick={() => updateTheme({ font_style: id as UserThemeConfig["font_style"] })} />
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ColorPicker label="Texto principal" value={theme.text_color_primary} onChange={(v) => updateTheme({ text_color_primary: v })} />
                <ColorPicker label="Texto secundário" value={theme.text_color_secondary} onChange={(v) => updateTheme({ text_color_secondary: v })} />
              </div>
            </div>
          </section>

          {/* ─── 6. Avatar ─── */}
          <section
            className="glass-card-strong animate-fade-in-up p-5 sm:p-7"
            style={{ animationDelay: "240ms" }}
          >
            <SectionHeader
              icon={UserRound}
              title="6. Avatar"
              description="Anel decorativo e brilho ao redor da sua foto."
            />

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-bold text-ocean/60">Anel do avatar</p>
                <div className="flex gap-2">
                  <Toggle selected={theme.avatar_ring_style === "gradient"} label="Gradiente" onClick={() => updateTheme({ avatar_ring_style: "gradient" })} />
                  <Toggle selected={theme.avatar_ring_style === "solid"} label="Sólido" onClick={() => updateTheme({ avatar_ring_style: "solid" })} />
                  <Toggle selected={theme.avatar_ring_style === "none"} label="Nenhum" onClick={() => updateTheme({ avatar_ring_style: "none" })} />
                </div>
              </div>
              <ColorPicker label="Cor do LED do avatar" value={theme.avatar_led_color} onChange={(v) => updateTheme({ avatar_led_color: v })} />
              <ColorPicker label="Cor do LED do banner" value={theme.banner_led_color} onChange={(v) => updateTheme({ banner_led_color: v })} />
            </div>
          </section>

          {/* ─── 7. Animations ─── */}
          <section
            className="glass-card-strong animate-fade-in-up p-5 sm:p-7"
            style={{ animationDelay: "280ms" }}
          >
            <SectionHeader
              icon={Sparkle}
              title="7. Animações"
              description="Movimento, transições e efeitos visuais."
            />

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-bold text-ocean/60">Transição dos links</p>
                <div className="flex gap-2 flex-wrap">
                  {["none", "fade", "slide", "zoom", "float"].map((t) => (
                    <Toggle key={t} selected={theme.transition_effect === t} label={t} onClick={() => updateTheme({ transition_effect: t as UserThemeConfig["transition_effect"] })} />
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <SettingSwitch
                  checked={theme.enable_animations}
                  label="Animação fade in"
                  description="Entrada suave do conteúdo"
                  onChange={(checked) =>
                    updateTheme({
                      enable_animations: checked,
                      transition_effect: checked ? "fade" : "none",
                    })
                  }
                />
                <SettingSwitch
                  checked={theme.enable_background_bubbles}
                  label="Background bubbles"
                  description="Bolhas de luz no plano de fundo"
                  onChange={(checked) =>
                    updateTheme({ enable_background_bubbles: checked })
                  }
                />
                <SettingSwitch
                  checked={theme.enable_particles}
                  label="Partículas"
                  description="Estrelas sutis no plano de fundo"
                  onChange={(checked) =>
                    updateTheme({ enable_particles: checked, enable_stars: checked })
                  }
                />
              </div>
            </div>
          </section>

          {/* ─── Save ─── */}
          <div className="sticky bottom-4 z-20 rounded-3xl border border-white/80 bg-white/55 p-3 shadow-2xl shadow-cyan-950/15 backdrop-blur-2xl">
            <button
              type="button"
              disabled={saving}
              onClick={saveCustomization}
              className="glass-button flex h-13 w-full items-center justify-center gap-2 px-6 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
              {saving ? "Salvando e publicando..." : "Salvar personalização"}
            </button>
            {message && (
              <p
                role="status"
                className={`mt-2 flex items-center justify-center gap-2 text-sm font-black ${
                  message.ok ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {message.ok ? <CheckCircle2 size={16} /> : <TriangleAlert size={16} />}
                {message.text}
              </p>
            )}
          </div>
        </div>

        <aside className="order-last xl:sticky xl:top-24">
          <div
            className="animate-fade-in-up rounded-[2rem] border border-white/75 bg-white/30 p-3 shadow-2xl shadow-cyan-950/15 backdrop-blur-2xl"
            style={{ animationDelay: "120ms" }}
          >
            <div className="mb-3 flex items-center justify-between px-2">
              <div>
                <div className="flex items-center gap-2 text-sm font-black text-ocean">
                  <Sparkles size={15} />
                  8. Preview ao vivo
                </div>
                <p className="mt-0.5 text-xs font-semibold text-ocean/55">
                  Mesma experiência da página pública
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-100/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                Ao vivo
              </span>
            </div>
            <CustomizePreview
              user={currentUser}
              links={links}
              theme={theme}
              bio={profile.bio}
            />
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/55 bg-white/25 px-3 py-2 text-xs font-semibold text-ocean/55">
              <Layers3 size={14} className="shrink-0" />
              Alterações aparecem aqui antes de salvar.
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
