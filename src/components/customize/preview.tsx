"use client";

import { PublicProfileView } from "@/components/public-profile/public-profile-view";
import type { AppUser, Link, UserThemeConfig } from "@/types/database";

export function CustomizePreview({
  user,
  links,
  theme,
  bio,
}: {
  user: AppUser;
  links: Link[];
  theme: UserThemeConfig;
  bio?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/60 shadow-2xl shadow-cyan-950/20">
      <PublicProfileView
        user={user}
        links={links}
        theme={theme}
        bio={bio}
        mode="preview"
      />
    </div>
  );
}
