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
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
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
          <div className="flex gap-1 border-b border-border overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveSection(t.id)}
                className={`shrink-0 px-4 py-2.5 text-sm font-medium transition border-b-2 ${
                  activeSection === t.id
                    ? "border-brand text-foreground"
                    : "border-transparent text-fg-secondary hover:text-foreground"
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
            <Card>
              <CardHeader>
                <h3 className="font-bold text-foreground">Links</h3>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-fg-secondary">
                  Gerencie seus links na{" "}
                  <a href="/dashboard" className="text-brand hover:underline">
                    página de links
                  </a>
                  .
                </p>
              </CardBody>
            </Card>
          )}

          {activeSection === "theme" && (
            <div className="space-y-5">
              <ThemeSection theme={theme} onUpdate={bubbleUpdate} />
              <Button
                type="button"
                variant="primary"
                onClick={saveTheme}
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Salvar tema
              </Button>
              {msg && (
                <p className="text-center text-sm font-medium text-fg-secondary">{msg}</p>
              )}
            </div>
          )}
        </div>

        {/* Right: Live preview */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-secondary">
              Preview ao vivo
            </h4>
            <CustomizePreview user={user} links={links} theme={theme} bio={bio} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
