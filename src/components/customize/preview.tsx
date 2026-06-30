"use client";

import { PublicProfileView } from "@/components/public-profile/public-profile-view";
import type { AppUser, Link, UserThemeConfig } from "@/types/database";

export function CustomizePreview({
  user,
  links,
  theme,
  bio,
  embedded = false,
}: {
  user: AppUser;
  links: Link[];
  theme: UserThemeConfig;
  bio?: string;
  embedded?: boolean;
}) {
  return (
    <div
      className={
        embedded
          ? "h-full overflow-y-auto bg-slate-950 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "overflow-hidden rounded-[2rem] border border-white/60 shadow-2xl shadow-cyan-950/20"
      }
    >
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
