"use client";

import React from "react";
import { Link2, User } from "lucide-react";
import type { AppUser, Link as DbLink } from "@/types/database";

function PreviewLinkIcon({ link }: { link: Partial<DbLink> }) {
  if (link.is_custom_icon && link.icon_blob) {
    return <img src={link.icon_blob} className="w-6 h-6 object-contain" alt="" />;
  }
  const name = link.icon || link.icone;
  if (name && name !== "link") {
    return (
      <img
        src={`/imgs/icons/links/${name}.png`}
        className="w-6 h-6 object-contain"
        alt=""
        onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
      />
    );
  }
  return <Link2 size={14} className="text-white/60" />;
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
    ? [preview, ...links.slice(0, 4)]
    : links.slice(0, 5);

  return (
    <div className="card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-fg">Prévia</h3>
        <span className="text-xs text-fg-secondary bg-bg-subtle px-2 py-0.5 rounded-full">ao vivo</span>
      </div>

      {/* Phone mockup */}
      <div className="flex-1 flex items-start justify-center">
        <div
          className="w-48 rounded-3xl overflow-hidden border-2 border-border"
          style={{ background: "linear-gradient(160deg, #a8edcf 0%, #78d4f0 50%, #4ab8f5 100%)" }}
        >
          <div className="p-4 flex flex-col items-center gap-2">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/60 bg-white/30 flex items-center justify-center">
              {user?.avatar_url ? (
                <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <User size={20} className="text-white/70" />
              )}
            </div>
            <p className="text-xs font-bold text-white/90" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
              @{user?.username || "username"}
            </p>

            {/* Links */}
            <div className="w-full space-y-1.5 mt-1">
              {previewLinks.length === 0 && (
                <div className="text-center text-xs text-white/60 py-3">Sem links ainda</div>
              )}
              {previewLinks.map((link, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(10px)" }}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <PreviewLinkIcon link={link} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 truncate">
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
