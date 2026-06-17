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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sidebar */}
      <div className="lg:col-span-4">
        <div className="card p-6 flex flex-col items-center text-center">
          <Avatar src={user?.avatar_url} alt={user?.username} size="lg" />
          <h2 className="mt-4 text-xl font-bold text-foreground">{user?.name ?? user?.username}</h2>

          <div className="mt-5 flex w-full flex-col gap-2">
            <ButtonLink
              href={`/u/${user?.username}`}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              <ExternalLink size={14} /> Ver perfil público
            </ButtonLink>
            <ButtonLink href="/profile" variant="ghost" size="sm" className="w-full">
              <Settings size={14} /> Editar perfil
            </ButtonLink>
          </div>

          <div className="mt-5 w-full border-t border-border pt-4 text-center">
            <p className="text-xs font-medium text-fg-secondary uppercase tracking-wider">Total de cliques</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalClicks ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:col-span-8 space-y-6">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-bold text-foreground">Seus links</h3>
            <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-0.5 text-xs font-medium text-fg-secondary">
              {links?.length ?? 0} links
            </span>
          </div>
          <div className="card-body">
            <LinksManager links={links ?? []} onLinksChange={handleLinksChange} />
          </div>
        </div>

        <StatsCards totalLinks={links?.length ?? 0} totalClicks={totalClicks ?? 0} topLink={links?.[0]?.title} />
      </div>
    </div>
  );
}
