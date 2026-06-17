"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Avatar } from "@/components/ui/avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatsCards } from "./stats-cards";
import { LinksManager } from "./links-manager";
import type { AppUser, Link as DbLink } from "@/types/database";
import { ExternalLink, Plus, Settings } from "lucide-react";

export default function DashboardConverted({ user, links: initialLinks, totalClicks: initialClicks }: {
  user: AppUser;
  links: DbLink[];
  totalClicks: number;
}) {
  const [links, setLinks] = useState(initialLinks ?? []);
  const [totalClicks, setTotalClicks] = useState(initialClicks ?? 0);

  useEffect(() => {
    setLinks(initialLinks ?? []);
  }, [initialLinks]);

  async function handleLinksChange(nextLinks: DbLink[]) {
    setLinks(nextLinks);
    try {
      const res = await supabase.from('clicks').select('id', { count: 'exact', head: true });
      setTotalClicks(res.count ?? 0);
    } catch (e) {}
  }

  const assetsUrl = typeof window !== 'undefined' ? (window as any).ASSETS_URL : '';

  return (
    <div className="content fade-in">
      {/* Decorative blobs (from PHP design) */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <style jsx global>{`
        * { font-family: 'Nunito', sans-serif; margin: 0; padding: 0; box-sizing: border-box; }

        body { background: linear-gradient(160deg, #a8edcf 0%, #78d4f0 35%, #4ab8f5 60%, #6ec6f7 100%); }

        .blob { position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.45; animation: blobFloat 10s ease-in-out infinite alternate; pointer-events: none; z-index: 0; }
        .blob-1 { width:600px;height:600px;background:radial-gradient(circle,#a0f0d0,#4dd9f5);top:-100px;left:-150px;animation-delay:0s; }
        .blob-2 { width:500px;height:500px;background:radial-gradient(circle,#b8eaff,#72c8f8);bottom:-100px;right:-100px;animation-delay:3s; }
        .blob-3 { width:350px;height:350px;background:radial-gradient(circle,#d0f8e8,#8de8f5);top:40%;left:50%;transform:translate(-50%,-50%);animation-delay:1.5s; }
        @keyframes blobFloat { 0% { transform: scale(1) translate(0,0); } 100% { transform: scale(1.12) translate(20px,-20px); } }

        .glass { background: rgba(255,255,255,0.38); backdrop-filter: blur(18px) saturate(180%); border: 1.5px solid rgba(255,255,255,0.7); border-radius: 28px; box-shadow: 0 8px 32px rgba(80,180,220,0.18), inset 0 1px 0 rgba(255,255,255,0.8); }
        .glass-sm { background: rgba(255,255,255,0.32); backdrop-filter: blur(14px); border: 1.5px solid rgba(255,255,255,0.65); border-radius: 20px; box-shadow: 0 4px 16px rgba(80,180,220,0.14), inset 0 1px 0 rgba(255,255,255,0.8); }
        .glass-card { background: rgba(255,255,255,0.42); backdrop-filter: blur(14px); border: 1.5px solid rgba(255,255,255,0.72); border-radius: 24px; box-shadow: 0 8px 28px rgba(80,180,220,0.15), inset 0 1px 0 rgba(255,255,255,0.9); transition: all 0.25s; }

        .avatar-ring { border: 3px solid rgba(255,255,255,0.85); box-shadow: 0 4px 16px rgba(80,180,220,0.3), 0 0 0 2px rgba(91,200,245,0.4); }

        .icon-bubble { width: 2.8rem; height: 2.8rem; border-radius: 50% !important; flex-shrink: 0; background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(230,245,255,0.8)); border: 2px solid rgba(255,255,255,0.95); box-shadow: 0 4px 12px rgba(80,180,220,0.2); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .icon-bubble img { width: 100% !important; height: 100% !important; max-width: 100%; max-height: 100%; border-radius: 50% !important; object-fit: cover !important; display: block; }

        /* Layout helpers */
        .container { max-width: 96rem; margin: 0 auto; padding: 0 1rem; }
        .card { background: rgba(255,255,255,0.48); border-radius: 16px; padding: 1rem; box-shadow: 0 8px 24px rgba(80,180,220,0.08); }

        .fade-in { animation: fadeIn 0.6s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* Responsive grid similar to original layout */
        .dashboard-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 1024px) { .dashboard-grid { grid-template-columns: 340px 1fr; } }

      `}</style>

      <div className="container">
        <nav className="nav-inner glass-sm p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/icons/icon.png" alt="LinkWave" className="w-9 h-9" />
            <span className="font-black text-xl text-ocean">LinkWave</span>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/u/${user?.username}`} className="btn-ghost">Ver página</a>
            <a href="/api/auth/logout" className="btn-ghost">Sair</a>
          </div>
        </nav>

        <main className="dashboard-grid">
          {/* Left: profile card */}
          <aside>
            <div className="glass p-6 flex flex-col items-center text-center">
              <div className="relative">
                <Avatar src={user?.avatar_url} alt={user?.username} size="xl" className="avatar-ring" />
                <a href="/profile" className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-blue-200 flex items-center justify-center shadow-md"> 
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-ocean" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                </a>
              </div>

              <h2 className="mt-4 text-2xl font-black text-foreground">@{user?.username}</h2>
              <p className="text-sm mb-3 text-ocean font-semibold">{user?.name ?? 'Seu nome'}</p>

              <div className="mt-5 w-full flex flex-col gap-2">
                <a href={`/u/${user?.username}`} className="btn-blue text-center py-2 rounded-md text-white">Ver perfil público</a>
                <a href="/profile" className="btn-ghost text-center py-2 rounded-md">Editar perfil</a>
              </div>

              <div className="mt-5 w-full border-t border-white/40 pt-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Total de cliques</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalClicks ?? 0}</p>
              </div>
            </div>

            <div className="mt-6 glass-card p-4">
              <h3 className="font-bold mb-2">Stats rápidas</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-black text-lg">{links.length}</div>
                  <div className="text-xs text-muted">Links</div>
                </div>
                <div>
                  <div className="font-black text-lg">{totalClicks}</div>
                  <div className="text-xs text-muted">Cliques</div>
                </div>
                <div>
                  <div className="font-black text-lg">{links.length ? Math.round((totalClicks / (links.length||1)) * 100) : 0}%</div>
                  <div className="text-xs text-muted">CTR</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: links manager and stats */}
          <section>
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground">Seus links</h3>
                <span className="aero-tag">{links.length} links</span>
              </div>
              <LinksManager links={links ?? []} onLinksChange={handleLinksChange} />
            </div>

            <div className="mt-6">
              <StatsCards totalLinks={links?.length ?? 0} totalClicks={totalClicks ?? 0} topLink={links?.[0]?.title} />
            </div>
          </section>
        </main>

        <footer className="container mt-8">
          <div className="glass-sm p-4 flex items-center justify-between text-muted text-sm">
            <div className="flex items-center gap-2">
              <img src="/assets/icons/icon.png" alt="LinkWave" className="w-5 h-5 opacity-60" />
              <span className="font-bold text-ocean-light">LinkWave</span>
            </div>
            <div className="text-xs">Dashboard v1.0</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
