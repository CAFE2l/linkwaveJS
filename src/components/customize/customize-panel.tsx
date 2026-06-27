"use client";

import { useState, useTransition } from "react";
import {
  Check,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Layers3,
  LayoutTemplate,
  Loader2,
  Save,
  Sparkles,
  TriangleAlert,
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
            Ajuste o essencial e acompanhe o resultado real antes de publicar.
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

          <section
            className="glass-card-strong animate-fade-in-up p-5 sm:p-7"
            style={{ animationDelay: "80ms" }}
          >
            <SectionHeader
              icon={ImageIcon}
              title="2. Aparência"
              description="Escolha um ponto de partida e ajuste o gradiente."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={theme.theme_id === preset.id}
                  onClick={() => updateTheme(preset.values)}
                  className={`group relative overflow-hidden rounded-2xl border p-2 text-left transition-all duration-300 ${
                    theme.theme_id === preset.id
                      ? "border-white bg-white/65 shadow-xl ring-2 ring-cyan-200/70"
                      : "border-white/55 bg-white/25 hover:-translate-y-1 hover:bg-white/45"
                  }`}
                >
                  <span
                    className="block h-20 rounded-xl border border-white/70 shadow-inner transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{ background: preset.gradient }}
                  />
                  <span className="block px-2 pb-1 pt-2 text-sm font-black text-ocean">
                    {preset.label}
                  </span>
                  <span className="block px-2 pb-1 text-xs font-semibold text-ocean/55">
                    {preset.description}
                  </span>
                  {theme.theme_id === preset.id && (
                    <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-white text-cyan-600 shadow-lg">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 rounded-2xl border border-white/55 bg-white/20 p-4 sm:grid-cols-2">
              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-black text-ocean">Cor inicial</span>
                <input
                  type="color"
                  value={theme.background_gradient_start}
                  onChange={(event) =>
                    updateTheme({
                      theme_id: "default_aero",
                      background_gradient_start: event.target.value,
                    })
                  }
                  className="h-10 w-16 cursor-pointer rounded-xl border border-white/80 bg-white/50 p-1"
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-black text-ocean">Cor final</span>
                <input
                  type="color"
                  value={theme.background_gradient_end}
                  onChange={(event) =>
                    updateTheme({
                      theme_id: "default_aero",
                      background_gradient_end: event.target.value,
                    })
                  }
                  className="h-10 w-16 cursor-pointer rounded-xl border border-white/80 bg-white/50 p-1"
                />
              </label>
            </div>

            <h3 className="mb-3 mt-6 text-sm font-black text-ocean">Card do perfil</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["light", "Glass claro", "Translúcido e luminoso"],
                ["dark", "Glass escuro", "Contraste elegante"],
                ["aero", "Aero premium", "Vidro com profundidade"],
                ["neon", "Neon soft", "Brilho sutil nas bordas"],
              ].map(([id, label, description]) => (
                <ChoiceButton
                  key={id}
                  selected={theme.profile_card_style === id}
                  label={label}
                  description={description}
                  onClick={() =>
                    updateTheme({
                      profile_card_style: id as UserThemeConfig["profile_card_style"],
                      card_glass_style:
                        id === "aero"
                          ? "frosted"
                          : (id as UserThemeConfig["card_glass_style"]),
                    })
                  }
                />
              ))}
            </div>
          </section>

          <section
            className="glass-card-strong animate-fade-in-up p-5 sm:p-7"
            style={{ animationDelay: "160ms" }}
          >
            <SectionHeader
              icon={LayoutTemplate}
              title="3. Estilo dos links"
              description="Formato, interação e efeitos dos seus botões."
            />

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

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
                checked={theme.link_hover_effect === "lift"}
                label="Hover lift"
                description="Eleva o link ao passar o mouse"
                onChange={(checked) =>
                  updateTheme({ link_hover_effect: checked ? "lift" : "none" })
                }
              />
              <SettingSwitch
                checked={theme.enable_led_glow}
                label="LED glow"
                description="Brilho suave nos cards de link"
                onChange={(checked) =>
                  updateTheme({ button_glow: checked, enable_led_glow: checked })
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
          </section>

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
                  4. Preview ao vivo
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
