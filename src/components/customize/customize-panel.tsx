"use client";

import { useState, useTransition, useCallback } from "react";
import { Loader2, Save } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AvatarUpload } from "./avatar-upload";
import { BannerUpload } from "./banner-upload";
import { ProfileForm } from "./profile-form";
import { ThemeSection } from "./theme-section";
import { CustomizePreview } from "./preview";
import { updateThemeAction } from "@/lib/actions/theme";
import { updateProfileAction } from "@/lib/actions/profile";
import { type UserThemeConfig, DEFAULT_USER_THEME, type AppUser, type Link } from "@/types/database";

type Section = "avatar" | "banner" | "profile" | "links" | "theme";

export function CustomizePanel({
  user,
  links,
}: {
  user: AppUser;
  links: Link[];
}) {
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [theme, setTheme] = useState<UserThemeConfig>(
    (user.theme_json as UserThemeConfig | null) ?? DEFAULT_USER_THEME,
  );
  const [bio, setBio] = useState<string>("");
  const [saving, startSave] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const bubbleUpdate = useCallback((partial: Partial<UserThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...partial }));
  }, []);

  function saveTheme() {
    setMsg(null);
    startSave(async () => {
      const r = await updateThemeAction(theme);
      setMsg(r.message);
    });
  }

  const tabs: { id: Section; label: string }[] = [
    { id: "avatar", label: "Avatar" },
    { id: "banner", label: "Banner" },
    { id: "profile", label: "Perfil" },
    { id: "links", label: "Links" },
    { id: "theme", label: "Tema" },
  ];

  return (
    <DashboardShell user={user}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left: Customization panels */}
        <div className="space-y-6">
          <div className="flex gap-1 overflow-x-auto rounded-2xl bg-white/20 p-1 backdrop-blur-sm border border-white/50">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveSection(t.id)}
                className={`shrink-0 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                  activeSection === t.id
                    ? "bg-white/60 text-ocean shadow-sm border border-white/70"
                    : "text-ocean/50 hover:text-ocean hover:bg-white/20 border border-transparent"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeSection === "avatar" && (
            <AvatarUpload
              user={user}
              onUpdate={(url) => {
                user.avatar_url = url;
              }}
            />
          )}

          {activeSection === "banner" && (
            <BannerUpload
              user={user}
              onUpdate={(url) => {
                user.banner_url = url;
              }}
            />
          )}

          {activeSection === "profile" && (
            <ProfileForm user={user} bio={bio} onBioChange={setBio} />
          )}

          {activeSection === "links" && (
            <div className="glass-card-strong p-6">
              <h3 className="font-bold text-ocean">Links</h3>
              <p className="mt-1 text-sm font-bold text-ocean/60">
                Gerencie seus links na{" "}
                <a href="/dashboard" className="text-ocean underline">
                  página de links
                </a>
                .
              </p>
            </div>
          )}

          {activeSection === "theme" && (
            <div className="space-y-5">
              <ThemeSection theme={theme} onUpdate={bubbleUpdate} />
              <button
                type="button"
                onClick={saveTheme}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-gradient-to-b from-cyan-400 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-300/40 transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Salvar tema
              </button>
              {msg && (
                <p className="text-center text-sm font-bold text-ocean/60">{msg}</p>
              )}
            </div>
          )}
        </div>

        {/* Right: Live preview */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-ocean/60">
              Preview ao vivo
            </h4>
            <CustomizePreview user={user} links={links} theme={theme} bio={bio} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
