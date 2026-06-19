"use client";

import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import NewLinkForm from './NewLinkForm';
import LinkList from './LinkList';
import PreviewCard from './PreviewCard';
import Toast, { ToastObj } from './Toast';
import type { AppUser, Link as DbLink } from '@/types/database';

export default function FullDashboard({ initialUser, initialLinks, initialClicks }: {
  initialUser: AppUser;
  initialLinks: DbLink[];
  initialClicks?: number;
}) {
  const [user, setUser] = useState<AppUser | null>(initialUser ?? null);
  const [links, setLinks] = useState<DbLink[]>(initialLinks ?? []);
  const [clicks, setClicks] = useState<number>(initialClicks ?? 0);
  const [toasts, setToasts] = useState<ToastObj[]>([]);
  const [preview, setPreview] = useState<Partial<DbLink> | null>(null);

  function pushToast(t: ToastObj) {
    setToasts((s) => [...s, t]);
    setTimeout(() => setToasts((s) => s.filter(x => x.id !== t.id)), 3500);
  }

  async function handleAddLink(p: Partial<DbLink>) {
    try {
      const payload: any = {
        title: p.titulo || p.title || 'Untitled',
        url: p.url || p.url || '#',
        icon: (p as any).icone || (p as any).icon || null,
        is_custom_icon: (p as any).is_custom_icon ? 1 : 0,
        icon_blob: (p as any).icon_blob || null,
      };
      // basic duplicate check (client-side)
      if (links.some(l => String(l.url).toLowerCase() === String(payload.url).toLowerCase())) {
        pushToast({ id: String(Date.now()), type: 'error', msg: 'URL já existe' });
        return;
      }

      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) {
        pushToast({ id: String(Date.now()), type: 'error', msg: data.message || 'Erro ao criar link' });
        return;
      }
      setLinks(s => [data.link, ...s]);
      pushToast({ id: String(Date.now()), type: 'success', msg: 'Link criado' });
    } catch (e) {
      console.error(e);
      pushToast({ id: String(Date.now()), type: 'error', msg: 'Erro ao criar link' });
    }
  }

  function handleReorder(newOrder: DbLink[]) {
    setLinks(newOrder);
    pushToast({ id: String(Date.now()), type: 'success', msg: 'Ordem atualizada' });
  }

  function handleDelete(id: string | number) {
    setLinks(s => s.filter(l => String(l.id) !== String(id)));
    pushToast({ id: String(Date.now()), type: 'success', msg: 'Link removido' });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border" style={{ borderColor: 'var(--color-brand)' }}>
            {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-[var(--color-brand)] text-white">@</div>}
          </div>
          <div className="font-bold">@{user?.username ?? 'you'}</div>
        </div>
        <div className="flex items-center gap-3">
          <a href={`/u/${user?.username}`} className="px-3 py-1 rounded-md bg-[var(--color-brand)] text-white hover:opacity-95">Ver página</a>
          <a href="/api/auth/logout" className="px-3 py-1 rounded-md border" style={{ borderColor: 'var(--color-border)' }}>Sair</a>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4">
          <ProfileCard user={user} setUser={setUser} linksCount={links.length} clicks={clicks} pushToast={pushToast} />
        </aside>

        <main className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <NewLinkForm onAdd={handleAddLink} pushToast={pushToast} onPreviewChange={(p)=>setPreview(p)} />
            {/* Live preview card */}
            <div>
              <PreviewCard user={user} links={links} preview={preview ?? undefined} />
            </div>
          </div>

          <LinkList links={links} onReorder={handleReorder} onDelete={handleDelete} />
        </main>
      </div>

      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map(t => <Toast key={t.id} {...t} />)}
      </div>
    </div>
  );
}
