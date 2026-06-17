"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Avatar } from "@/components/ui/avatar";
import { StatsCards } from "./stats-cards";
import type { AppUser, Link as DbLink } from "@/types/database";

export default function DashboardConverted({ user, links: initialLinks, totalClicks: initialClicks }: {
  user: AppUser;
  links: DbLink[];
  totalClicks: number;
}) {
  const [links, setLinks] = useState<DbLink[]>(initialLinks ?? []);
  const [totalClicks, setTotalClicks] = useState<number>(initialClicks ?? 0);

  const [iconMode, setIconMode] = useState<'predefined' | 'custom'>('predefined');
  const [customIconDataUrl, setCustomIconDataUrl] = useState<string | null>(null);
  const [createTitle, setCreateTitle] = useState('');
  const [createUrl, setCreateUrl] = useState('');
  const [createIcon, setCreateIcon] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editingLink, setEditingLink] = useState<DbLink | null>(null);
  const [editCustomIconDataUrl, setEditCustomIconDataUrl] = useState<string | null>(null);

  const linksRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLinks(initialLinks ?? []);
  }, [initialLinks]);

  useEffect(() => {
    // init sortable if available
    if (!linksRef.current) return;
    let Sortable: any;
    try { Sortable = require('sortablejs'); } catch (e) { Sortable = (window as any).Sortable; }
    if (!Sortable) return;
    const instance = Sortable.create(linksRef.current, {
      handle: '.drag-handle',
      animation: 200,
      ghostClass: 'sortable-ghost',
      onEnd: async () => {
        // update order locally (server persistence omitted for brevity)
        const newOrder: DbLink[] = Array.from(linksRef.current!.querySelectorAll('.link-card')).map((el) => {
          const id = el.getAttribute('data-id');
          return links.find(l => String(l.id) === String(id))!;
        }).filter(Boolean);
        setLinks(newOrder);
      }
    });

    return () => instance.destroy();
  }, [linksRef.current]);

  function resetCreateForm() {
    setCreateTitle('');
    setCreateUrl('');
    setCreateIcon('');
    setCustomIconDataUrl(null);
    setIconMode('predefined');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function dataUrlFromFile(file: File, cb: (dataUrl: string) => void) {
    const reader = new FileReader();
    reader.onload = (e) => cb(String(e.target?.result));
    reader.readAsDataURL(file);
  }

  async function handleCreateSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!createTitle || !createUrl) return;

    const urlFinal = createUrl.match(/^https?:\/\//) ? createUrl : `https://${createUrl}`;

    const payload: any = {
      user_id: user.id,
      titulo: createTitle,
      url: urlFinal,
      icone: iconMode === 'predefined' ? createIcon : null,
      is_custom_icon: iconMode === 'custom' ? 1 : 0,
      icon_blob: iconMode === 'custom' ? customIconDataUrl : null,
      order_position: links.length,
    };

    try {
      const { data, error } = await supabase.from('links').insert(payload).select().single();
      if (error) throw error;
      setLinks([data, ...links]);
      resetCreateForm();
    } catch (err) {
      console.error('create link err', err);
    }
  }

  function openEditModal(link: DbLink) {
    setIsEditing(true);
    setEditingLink(link);
    setEditCustomIconDataUrl(link.icon_blob ?? null);
    // prefill select value by manipulating DOM after render is acceptable in small scope
    setTimeout(() => {
      const sel = document.getElementById('edit_icon') as HTMLSelectElement | null;
      if (sel) sel.value = String(link.icone || '');
    }, 0);
  }

  async function handleEditSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!editingLink) return;
    const novoTitulo = (document.getElementById('edit_title') as HTMLInputElement).value.trim();
    const novaUrl = (document.getElementById('edit_url') as HTMLInputElement).value.trim();
    const novoIcone = (document.getElementById('edit_icon') as HTMLSelectElement).value;

    const payload: any = {
      titulo: novoTitulo,
      url: novaUrl.match(/^https?:\/\//) ? novaUrl : `https://${novaUrl}`,
      icone: novoIcone || null,
      is_custom_icon: editCustomIconDataUrl ? 1 : 0,
      icon_blob: editCustomIconDataUrl || null,
    };

    try {
      const { data, error } = await supabase.from('links').update(payload).eq('id', editingLink.id).select().single();
      if (error) throw error;
      setLinks(links.map(l => (l.id === data.id ? data : l)));
      setIsEditing(false);
      setEditingLink(null);
    } catch (err) {
      console.error('edit err', err);
    }
  }

  async function handleDelete(id: string | number) {
    if (!confirm('Tem certeza que deseja excluir este link?')) return;
    try {
      const { error } = await supabase.from('links').delete().eq('id', id);
      if (error) throw error;
      setLinks(links.filter(l => l.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="content fade-in">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <style jsx>{`
        .container { max-width: 96rem; margin: 0 auto; padding: 0 1rem; }
        .nav-inner { background: rgba(255,255,255,0.5); backdrop-filter: blur(20px); border-radius: 999px; padding: 0.6rem 1.5rem; display:flex; justify-content:space-between; align-items:center; }
        .btn-ghost{ background: rgba(255,255,255,0.35); padding:0.5rem 0.9rem; border-radius:999px; }
        .btn-blue{ background:linear-gradient(180deg,#5bc8f5 0%,#2aa8e0 100%); color:white; padding:0.6rem 1rem; border-radius:999px; }
        .aero-tag{ background: rgba(255,255,255,0.55); border-radius:999px; padding:0.25rem 0.9rem; font-size:0.78rem; }
        .link-card{ background: rgba(255,255,255,0.42); border-radius:12px; padding:0.8rem; display:flex; gap:1rem; align-items:center; }
      `}</style>

      <div className="container">
        <nav className="nav-inner mb-6">
          <div className="flex items-center gap-3">
            <img src="/brand/icon.png" alt="LinkWave" className="w-9 h-9" />
            <span className="font-black text-xl">LinkWave</span>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/u/${user?.username}`} className="btn-ghost">Ver página</a>
            <a href="/api/auth/logout" className="btn-ghost">Sair</a>
          </div>
        </nav>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="glass p-6 flex flex-col items-center text-center">
              <div className="relative">
                <Avatar src={user?.avatar_url} alt={user?.username} size="xl" className="avatar-ring" />
                <a href="/profile" className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-blue-200 flex items-center justify-center shadow-md"> 
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-ocean" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                </a>
              </div>

              <h2 className="mt-4 text-2xl font-black">@{user?.username}</h2>
              <p className="text-sm mb-3 font-semibold">{user?.name ?? 'Seu nome'}</p>

              <div className="mt-5 w-full flex flex-col gap-2">
                <button onClick={() => window.open(`/u/${user?.username}`, '_blank')} className="btn-blue">Ver perfil público</button>
                <a href="/profile" className="btn-ghost text-center py-2 rounded-md">Editar perfil</a>
              </div>

              <div className="mt-5 w-full border-t border-white/40 pt-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Total de cliques</p>
                <p className="text-2xl font-bold mt-1">{totalClicks ?? 0}</p>
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
          </div>

          <div className="lg:col-span-8">
            <div className="glass p-6 mb-6">
              <h3 className="font-black text-lg mb-4">Novo link</h3>
              <form onSubmit={(e) => handleCreateSubmit(e)} className="space-y-4">
                <div>
                  <label className="block text-xs mb-1.5">Título</label>
                  <input value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} className="aero-input w-full" placeholder="Ex: Meu Instagram" required />
                </div>
                <div>
                  <label className="block text-xs mb-1.5">URL</label>
                  <input value={createUrl} onChange={(e) => setCreateUrl(e.target.value)} className="aero-input w-full" placeholder="https://..." required />
                </div>

                <div>
                  <label className="block text-xs mb-2">Como adicionar o ícone?</label>
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input type="radio" name="icon_mode" checked={iconMode==='predefined'} onChange={() => setIconMode('predefined')} /> Predefinido
                    </label>
                    <label className="flex-1">
                      <input type="radio" name="icon_mode" checked={iconMode==='custom'} onChange={() => setIconMode('custom')} /> Customizado
                    </label>
                  </div>
                </div>

                {iconMode === 'predefined' ? (
                  <div>
                    <label className="block text-xs mb-1.5">Selecione um ícone</label>
                    <select value={createIcon} onChange={(e) => setCreateIcon(e.target.value)} className="aero-select w-full">
                      <option value="">-- Escolha um --</option>
                      {/* minimal list - reuse some public icons */}
                      <option value="instagram">Instagram</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs mb-1.5">Carregue sua imagem</label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => {
                      const f = e.target.files?.[0]; if (!f) return; if (!f.type.startsWith('image/')) return;
                      if (f.size > 2*1024*1024) { alert('Máx 2MB'); e.currentTarget.value = ''; return; }
                      dataUrlFromFile(f, (d) => setCustomIconDataUrl(d));
                    }} />
                    {customIconDataUrl && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-300 rounded-lg flex items-center gap-3">
                        <img src={customIconDataUrl} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <div className="text-xs font-bold">Imagem carregada</div>
                          <button onClick={(ev) => { ev.preventDefault(); setCustomIconDataUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-xs text-red-600">Remover</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <button type="submit" className="btn-green w-full">Adicionar link</button>
                </div>
              </form>
            </div>

            <div className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-xl">Seus links</h3>
                <span className="aero-tag">{links.length} links</span>
              </div>

              <div className="space-y-3" ref={linksRef} id="linksContainer">
                {links.length === 0 && (
                  <div className="empty-state p-6 text-center">
                    <img src="/brand/icon.png" className="w-14 h-14 mx-auto mb-4 opacity-40" />
                    <p className="font-bold">Nenhum link ainda</p>
                    <p className="text-sm text-muted">Crie seu primeiro link no painel ao lado</p>
                  </div>
                )}

                {links.map((link, index) => (
                  <div className="link-card" data-id={String(link.id)} key={link.id}>
                    <div className="drag-handle cursor-grab pr-2">☰</div>
                    <div className="icon-bubble">
                      {link.is_custom_icon ? (
                        <img src={link.icon_blob || ''} alt={link.titulo || ''} />
                      ) : link.icone ? (
                        <img src={`/imgs/icons/links/${String(link.icone).charAt(0).toUpperCase()+String(link.icone).slice(1)}.png`} alt={link.titulo || ''} />
                      ) : (
                        <i className="fa-solid fa-link" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-ocean truncate">{link.titulo}</h4>
                      <p className="text-muted text-xs truncate mt-0.5">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(link)} className="btn-ghost">Editar</button>
                      <button onClick={() => handleDelete(link.id)} className="btn-red">Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>

        <footer className="container mt-8">
          <div className="glass-sm p-4 flex items-center justify-between text-muted text-sm">
            <div className="flex items-center gap-2">
              <img src="/brand/icon.png" alt="LinkWave" className="w-5 h-5 opacity-60" />
              <span className="font-bold">LinkWave</span>
            </div>
            <div className="text-xs">Dashboard v1.0</div>
          </div>
        </footer>

        {/* Edit modal */}
        {isEditing && editingLink && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="modal-dialog glass p-6 rounded-3xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Editar Link</h3>
                <button onClick={() => { setIsEditing(false); setEditingLink(null); }} className="text-muted">✕</button>
              </div>

              <form id="editLinkForm" onSubmit={(e) => handleEditSubmit(e)} className="space-y-4">
                <div>
                  <label className="block text-xs mb-2">Título</label>
                  <input id="edit_title" defaultValue={editingLink.titulo} className="aero-input w-full" required />
                </div>
                <div>
                  <label className="block text-xs mb-2">URL</label>
                  <input id="edit_url" defaultValue={editingLink.url} className="aero-input w-full" required />
                </div>
                <div>
                  <label className="block text-xs mb-2">Ícone Padrão</label>
                  <select id="edit_icon" className="aero-select w-full default">
                    <option value="">-- Sem ícone padrão --</option>
                    <option value="instagram">Instagram</option>
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-2">Ou imagem customizada</label>
                  <input ref={editFileInputRef} type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0]; if(!f) return; dataUrlFromFile(f,(d)=>setEditCustomIconDataUrl(d));}} />
                  {editCustomIconDataUrl && <div className="mt-3 flex items-center gap-3"><img src={editCustomIconDataUrl} className="w-12 h-12" /><button onClick={(ev)=>{ev.preventDefault(); setEditCustomIconDataUrl(null); if(editFileInputRef.current) editFileInputRef.current.value='';}} className="text-xs text-red-600">Remover</button></div>}
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={()=>{ setIsEditing(false); setEditingLink(null); }} className="btn-ghost flex-1">Cancelar</button>
                  <button type="submit" className="btn-green flex-1">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
