"use client";

import React from "react";
import { Link2, User } from "lucide-react";
import type { AppUser, Link as DbLink } from "@/types/database";

function PreviewLinkIcon({ link }: { link: Partial<DbLink> }) {
  if (link.is_custom_icon && link.icon_blob) {
    return <img src={link.icon_blob} className="w-5 h-5 object-contain" alt="" />;
  }
  const name = link.icon || link.icone;
  if (name && name !== "link") {
    return (
      <img
        src={`/imgs/icons/links/${name}.png`}
        className="w-5 h-5 object-contain"
        alt=""
        onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
      />
    );
  }
  return <Link2 size={13} className="text-white/60" />;
}

export default function PreviewCard({
  user,
  links,
  preview,
}: {
  user: AppUser | null;
  links: DbLink[];
  preview?: Partial<DbLink> | null;
}) {
  const previewLinks: Partial<DbLink>[] = preview?.title || preview?.url
    ? [preview, ...links]
    : links;

  return (
    <div className="glass-card p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ocean">Prévia</h3>
        <span className="glass-tag !text-[10px] !px-2 !py-0.5">ao vivo</span>
      </div>

      <div className="flex items-start justify-center">
        <div className="w-52 rounded-3xl overflow-hidden border-2 border-white/40 shadow-lg">
          {/* Banner */}
          {user?.banner_url ? (
            <div className="h-14 w-full overflow-hidden">
              <img src={user.banner_url} className="w-full h-full object-cover" alt="" />
            </div>
          ) : (
            <div className="h-14 w-full" style={{ background: "linear-gradient(135deg, #a8edcf 0%, #4ab8f5 100%)" }} />
          )}

          <div
            className="px-3 pb-4 pt-0 flex flex-col items-center gap-1.5"
            style={{ background: "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)" }}
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white/60 flex items-center justify-center -mt-5">
              {user?.avatar_url ? (
                <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <User size={18} className="text-slate-400" />
              )}
            </div>

            <p className="text-xs font-bold text-slate-800 truncate max-w-full px-2">
              {user?.name || user?.username || "username"}
            </p>
            <p className="text-[10px] text-slate-500 -mt-1">
              @{user?.username || "username"}
            </p>

            {/* Links */}
            <div className="w-full space-y-1 mt-1">
              {previewLinks.length === 0 && (
                <div className="text-center text-[10px] text-slate-400 py-2">Sem links ainda</div>
              )}
              {previewLinks.map((link, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/70 shadow-sm border border-white/60"
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <PreviewLinkIcon link={link} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 truncate">
                    {link.title || "Novo link"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
