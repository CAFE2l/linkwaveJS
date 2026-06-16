"use client";

import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
import type { Link } from "@/types/database";

export function PublicLinkButton({ link }: { link: Link }) {
  function trackClick() {
    const payload = JSON.stringify({ linkId: link.id, userId: link.user_id });
    const blob = new Blob([payload], { type: "application/json" });

    if (!navigator.sendBeacon?.("/api/click", blob)) {
      fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => null);
    }
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      onClick={trackClick}
      className="group flex min-h-16 items-center justify-between rounded-2xl border border-white/15 bg-white/80 px-5 py-4 font-bold text-slate-950 shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white">
          <LinkIcon size={18} />
        </span>
        <span className="truncate">{link.title}</span>
      </span>
      <ArrowUpRight size={19} className="shrink-0 text-sky-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
