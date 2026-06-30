"use client";

import { type ReactNode, useEffect, useRef, useState, useTransition } from "react";
import {
  ChevronDown,
  Check,
  CheckCircle2,
  ExternalLink,
  LayoutTemplate,
  Loader2,
  Palette,
  Save,
  Sparkle,
  Square,
  TriangleAlert,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { updateProfileAction } from "@/lib/actions/profile";
import { updateThemeAction } from "@/lib/actions/theme";
import { mergeUserTheme } from "@/lib/profile-theme-presets";
import {
  type AppUser,
  type UserThemeConfig,
} from "@/types/database";
import { AvatarUpload } from "./avatar-upload";
import { BannerUpload } from "./banner-upload";
import { LivePreviewPanel } from "./LivePreviewPanel";
import { useCustomizeStore } from "./customize-store";
import type { Link } from "@/types/database";

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
    <div className="flex items-start gap-3">
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

function CollapsibleSection({
  icon,
  title,
  description,
  delay,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
  delay?: string;
  children: ReactNode;
}) {
  return (
    <details
      open
      className="group glass-card-strong animate-fade-in-up overflow-hidden p-0"
      style={{ animationDelay: delay }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 marker:hidden sm:px-7 [&::-webkit-details-marker]:hidden">
        <SectionHeader icon={icon} title={title} description={description} />
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/35 text-ocean shadow-sm backdrop-blur-xl transition group-open:rotate-180">
          <ChevronDown size={17} />
        </span>
      </summary>
      <div className="border-t border-white/35 px-5 py-5 sm:px-7 sm:py-6">
        {children}
      </div>
    </details>
  );
}

function ChoiceButton({
  selected,
  label,
  description,
  shape,
  onClick,
}: {
  selected: boolean;
  label: string;
  description?: string;
  shape?: "rounded" | "pill" | "glass" | "led";
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
      {shape && (
        <span
          aria-hidden="true"
          className={`mt-3 block h-7 border border-cyan-300/70 bg-gradient-to-r from-white/65 to-cyan-100/55 transition-all duration-200 ${
            shape === "pill" ? "rounded-full" : shape === "rounded" ? "rounded-lg" : "rounded-xl"
          } ${shape === "led" ? "shadow-[0_0_14px_rgba(34,211,238,.7)]" : ""}`}
        />
      )}
      {selected && (
        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-cyan-500 text-white shadow-sm">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function BannerStyleButton({
  selected,
  mode,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  mode: "card" | "gradient";
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition-all duration-200 ${
        selected
          ? "border-cyan-200 bg-white/70 shadow-lg ring-2 ring-cyan-200/70"
          : "border-white/55 bg-white/25 hover:bg-white/45"
      }`}
    >
      <span className="relative block h-20 overflow-hidden rounded-xl bg-gradient-to-br from-fuchsia-500 via-blue-500 to-slate-950">
        {mode === "gradient" ? (
          <span
            className="absolute inset-0 bg-[linear-gradient(135deg,#c026d3,#2563eb_50%,#061426)]"
            style={{
              maskImage: "linear-gradient(to bottom, black 25%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 25%, transparent 100%)",
            }}
          />
        ) : (
          <span className="absolute inset-2 rounded-lg border border-white/60 bg-white/15" />
        )}
        <span className="absolute bottom-2 left-1/2 size-7 -translate-x-1/2 rounded-full border-2 border-white bg-cyan-200 shadow-md" />
      </span>
      <span className="mt-2 block text-sm font-black text-ocean">{title}</span>
      <span className="mt-0.5 block text-xs font-semibold text-ocean/60">{description}</span>
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
  const [draftValue, setDraftValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = ((draftValue - min) / (max - min)) * 100;

  useEffect(() => setDraftValue(value), [value]);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  function handleChange(nextValue: number) {
    setDraftValue(nextValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(nextValue), 110);
  }

  return (
    <label className="space-y-1.5">
      <span className="flex justify-between text-xs font-bold text-ocean/60">
        <span>{label}</span>
        <span>{draftValue}{suffix}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={draftValue}
        onChange={(event) => handleChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full accent-cyan-500"
        style={{
          background: `linear-gradient(90deg, #06b6d4 0%, #38bdf8 ${progress}%, rgba(255,255,255,.35) ${progress}%, rgba(255,255,255,.35) 100%)`,
        }}
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
  const [draftValue, setDraftValue] = useState(value);
  const valid = /^#[0-9a-fA-F]{6}$/.test(draftValue);

  useEffect(() => setDraftValue(value), [value]);

  return (
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-ocean/60">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => {
            setDraftValue(event.target.value);
            onChange(event.target.value);
          }}
          className="h-12 w-12 cursor-pointer rounded-xl border border-white/70 bg-white/30 p-1"
        />
        <input
          type="text"
          value={draftValue}
          aria-invalid={!valid}
          onChange={(event) => {
            const nextValue = event.target.value;
            if (!/^#[0-9a-fA-F]{0,6}$/.test(nextValue)) return;
            setDraftValue(nextValue);
            if (/^#[0-9a-fA-F]{6}$/.test(nextValue)) onChange(nextValue);
          }}
          className={`h-12 flex-1 rounded-xl border bg-white/35 px-3 text-sm font-bold text-ocean outline-none backdrop-blur-sm ${
            valid ? "border-white/60 focus:ring-4 focus:ring-cyan-200/30" : "border-red-400 focus:ring-4 focus:ring-red-200/30"
          }`}
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
  const theme = useCustomizeStore((state) => state.theme);
  const patchTheme = useCustomizeStore((state) => state.patchTheme);
  const initializeTheme = useCustomizeStore((state) => state.initialize);
  const [saving, startSaving] = useTransition();
  const [message, setMessage] = useState<SaveMessage | null>(null);

  useEffect(() => {
    initializeTheme(
      mergeUserTheme(user.theme_json as Partial<UserThemeConfig> | null),
    );
  }, [initializeTheme, user.theme_json]);

  function updateTheme(partial: Partial<UserThemeConfig>) {
    patchTheme(partial);
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

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
        <div className="space-y-6">
          {/* ─── 1. Profile ─── */}
          <CollapsibleSection
              icon={UserRound}
              title="Perfil"
              description="Identidade e apresentação da sua página."
            >

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

            <div className="mt-5">
              <p className="mb-2 text-sm font-black text-ocean">Estilo do banner</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <BannerStyleButton
                  selected={theme.banner_style !== "gradient"}
                  mode="card"
                  title="Card"
                  description="Banner tradicional com bordas definidas."
                  onClick={() => updateTheme({ banner_style: "glass" })}
                />
                <BannerStyleButton
                  selected={theme.banner_style === "gradient"}
                  mode="gradient"
                  title="Degradê"
                  description="A imagem se dissolve no fundo do perfil."
                  onClick={() => updateTheme({ banner_style: "gradient" })}
                />
              </div>
            </div>

            {theme.banner_style === "gradient" && (
              <div className="mt-4 space-y-4 rounded-2xl border border-white/60 bg-white/25 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-ocean/65">
                  Ajustes do degradê
                </p>
                <Slider
                  label="Altura do banner"
                  value={theme.banner_height}
                  min={200}
                  max={500}
                  suffix="px"
                  onChange={(value) => updateTheme({ banner_height: value })}
                />
                <Slider
                  label="Início do fade"
                  value={theme.banner_fade_start}
                  min={0}
                  max={80}
                  suffix="%"
                  onChange={(value) => updateTheme({ banner_fade_start: value })}
                />
                <div>
                  <p className="mb-2 text-xs font-bold text-ocean/60">Intensidade do fade</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["subtle", "Suave"],
                      ["medium", "Médio"],
                      ["strong", "Forte"],
                    ].map(([value, label]) => (
                      <Toggle
                        key={value}
                        selected={theme.banner_fade_intensity === value}
                        label={label}
                        onClick={() =>
                          updateTheme({
                            banner_fade_intensity:
                              value as UserThemeConfig["banner_fade_intensity"],
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

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
          </CollapsibleSection>

          {/* ─── 2. Appearance ─── */}
          <CollapsibleSection
              icon={Palette}
              title="Aparência"
              description="Fundo, gradiente, efeitos e atmosfera da sua página."
              delay="80ms"
            >

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

              <SettingSwitch
                checked={theme.enable_stars}
                label="Estrelas animadas"
                description="Adiciona pontos de luz sutis ao fundo"
                onChange={(checked) => updateTheme({ enable_stars: checked })}
              />
            </div>
          </CollapsibleSection>

          {/* ─── 3. Cards ─── */}
          <CollapsibleSection
              icon={Square}
              title="Cards"
              description="Estilo, cor e efeitos dos cards de perfil e links."
              delay="120ms"
            >

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

              <SettingSwitch
                checked={theme.card_shadow}
                label="Sombra extra"
                description="Aumenta a profundidade dos cards"
                onChange={(checked) => updateTheme({ card_shadow: checked })}
              />
            </div>
          </CollapsibleSection>

          {/* ─── 4. Buttons ─── */}
          <CollapsibleSection
              icon={LayoutTemplate}
              title="Botões"
              description="Formato, cor e interação dos links da página."
              delay="160ms"
            >

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
                      shape={id as "rounded" | "pill" | "glass" | "led"}
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

              <SettingSwitch
                checked={theme.button_glow}
                label="Glow nos botões"
                description="Brilho suave ao redor dos links"
                onChange={(checked) => updateTheme({ button_glow: checked })}
              />
            </div>
          </CollapsibleSection>



          {/* ─── 6. Avatar ─── */}
          <CollapsibleSection
              icon={UserRound}
              title="Avatar"
              description="Anel decorativo e brilho ao redor da sua foto."
              delay="240ms"
            >

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
          </CollapsibleSection>

          {/* ─── 7. Animations ─── */}
          <CollapsibleSection
              icon={Sparkle}
              title="Animações"
              description="Movimento, transições e efeitos visuais."
              delay="280ms"
            >

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
          </CollapsibleSection>

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
        <LivePreviewPanel
          user={currentUser}
          links={links}
          bio={profile.bio}
          status={saving ? "saving" : message ? (message.ok ? "saved" : "error") : "idle"}
        />
      </div>
    </DashboardShell>
  );
}
