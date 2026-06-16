"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Link2, MousePointerClick } from "lucide-react";
import type { AppUser, Profile } from "@/types/database";
import { getBaseUrl } from "@/lib/utils/url";

export function ProfileCard({
  user,
  profile,
  totalLinks,
  totalClicks,
}: {
  user: AppUser;
  profile: Profile | null;
  totalLinks: number;
  totalClicks: number;
}) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${getBaseUrl()}/u/${user.username}`;

  function copyUrl() {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel rounded-[1.75rem] p-6"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="size-24 rounded-full bg-gradient-to-br from-brand via-accent to-brand-light p-[3px] shadow-lg shadow-brand/20">
            <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-slate-900">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-brand">
                  {user.username[0].toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 rounded-full bg-accent p-1.5 shadow-lg shadow-accent/30">
            <Check size={12} className="text-white" />
          </div>
        </div>

        <h2 className="mt-4 text-xl font-black">
          {user.name || user.username}
        </h2>
        <p className="text-sm font-semibold text-muted">@{user.username}</p>
        {profile?.bio ? (
          <p className="mt-2 max-w-xs text-sm font-medium text-muted/80">
            {profile.bio}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border/60 bg-white/30 p-1 backdrop-blur-sm dark:bg-white/5">
        <div className="min-w-0 flex-1 truncate px-3 py-2 text-sm font-medium text-muted">
          {publicUrl}
        </div>
        <button
          onClick={copyUrl}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/60 text-muted shadow-sm transition hover:bg-white hover:text-foreground dark:bg-white/10 dark:hover:bg-white/15"
          aria-label="Copiar URL"
        >
          {copied ? (
            <Check size={16} className="text-accent" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatBox
          icon={Link2}
          value={totalLinks}
          label="Links"
          accent="text-brand"
          bg="bg-brand/10"
        />
        <StatBox
          icon={MousePointerClick}
          value={totalClicks}
          label="Cliques"
          accent="text-accent"
          bg="bg-accent/10"
        />
      </div>
    </motion.section>
  );
}

function StatBox({
  icon: Icon,
  value,
  label,
  accent,
  bg,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  label: string;
  accent: string;
  bg: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border/40 ${bg} p-4 text-center backdrop-blur-sm`}
    >
      <Icon size={22} className={`mx-auto ${accent}`} />
      <div className={`mt-2 font-mono text-2xl font-black ${accent}`}>
        {value}
      </div>
      <div className="mt-0.5 text-xs font-semibold text-muted">{label}</div>
    </div>
  );
}
