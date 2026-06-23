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

  // Full icon list (ported from PHP page)
  const iconesDisponiveis: Record<string, string> = {
    airbnb: 'Airbnb',
    discord: 'Discord',
    duolingo: 'Duolingo',
    'facebook-messenger': 'Messenger',
    facebook: 'Facebook',
    gmail: 'Gmail',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    netflix: 'Netflix',
    notion: 'Notion',
    paypal: 'PayPal',
    pinterest: 'Pinterest',
    reddit: 'Reddit',
    skype: 'Skype',
    snapchat: 'Snapchat',
    soundcloud: 'SoundCloud',
    spotify: 'Spotify',
    steam: 'Steam',
    telegram: 'Telegram',
    tiktok: 'TikTok',
    tinder: 'Tinder',
    twitch: 'Twitch',
    twitter: 'Twitter',
    whatsapp: 'WhatsApp',
    youtube: 'YouTube'
  };

  // icon filename candidates & progressive loader
  const specialIconNames: Record<string,string> = {
    airbnb: 'AirBnB.png',
    github: 'GitHub.png',
    linkedin: 'LinkedIn.png',
    paypal: 'PayPal.png',
    soundcloud: 'SoundCloud.png',
    tiktok: 'TikTok.png',
    youtube: 'Youtube.png',
  };
  function makeIconCandidates(key: string){
    const parts = String(key).split(/[^a-zA-Z0-9]+/).filter(Boolean);
    const pascalUnderscore = parts.map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join('_') + '.png';
    const pascal = parts.map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join('') + '.png';
    const simple = (key.charAt(0).toUpperCase()+key.slice(1)) + '.png';
    const lower = key.toLowerCase() + '.png';
    const candidates: string[] = [];
    if (specialIconNames[key]) candidates.push(specialIconNames[key]);
    candidates.push(pascalUnderscore, pascal, simple, lower);
    return Array.from(new Set(candidates));
  }
  function IconImg({name, className, alt}: {name:string, className?:string, alt?:string}){
    const [idx, setIdx] = useState(0);
    const [failed, setFailed] = useState(false);
    const cands = makeIconCandidates(name);
    if (!name) return null;
    const src = `/imgs/icons/links/${cands[idx]}`;
    if (failed) return <i className="fa-solid fa-link text-muted" style={{width: '2rem', height: '2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}} />;
    return (
      <img src={src} alt={alt||name} className={className} onError={(e)=>{ if (idx+1 < cands.length) setIdx(i=>i+1); else setFailed(true); }} />
    );
  }

  const [iconMode, setIconMode] = useState<'predefined' | 'custom'>('predefined');
  const [customIconDataUrl, setCustomIconDataUrl] = useState<string | null>(null);
  const [createTitle, setCreateTitle] = useState('');
  const [createUrl, setCreateUrl] = useState('');
  const [createIcon, setCreateIcon] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editingLink, setEditingLink] = useState<DbLink | null>(null);
  const [editCustomIconDataUrl, setEditCustomIconDataUrl] = useState<string | null>(null);
  const [editSelectedIcon, setEditSelectedIcon] = useState<string>('');

  // Toast system
  const [toasts, setToasts] = useState<Array<{ id: string; msg: string; type?: 'success'|'error' }>>([]);
  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    const id = String(Date.now()) + Math.random().toString(36).slice(2,6);
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), 3000);
  }

  // Name / Bio modals
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState<string>(user?.name ?? '');
  const [bioInput, setBioInput] = useState<string>((user as { bio?: string })?.bio ?? '');

  async function saveName() {
    if (!nameInput || nameInput.trim().length === 0) { showToast('❌ O nome não pode estar vazio', 'error'); return; }
    if (nameInput.length > 60) { showToast('❌ Nome muito longo (máx 60)', 'error'); return; }
    try {
      const { error, data } = await supabase.from('users').update({ name: nameInput }).eq('id', user.id).select().single();
      if (error) throw error;
      showToast('✅ Nome atualizado!', 'success');
      setNameModalOpen(false);
      // update local user object (best-effort)
      (user as Record<string, unknown>).name = nameInput;
    } catch (e) { console.error(e); showToast('❌ Erro ao salvar', 'error'); }
  }

  async function saveBio() {
    if (bioInput.length > 160) { showToast('❌ Bio muito longa (máx 160)', 'error'); return; }
    try {
      const { error, data } = await supabase.from('users').update({ bio: bioInput }).eq('id', user.id).select().single();
      if (error) throw error;
      showToast('✅ Bio atualizada!', 'success');
      setBioModalOpen(false);
      (user as Record<string, unknown>).bio = bioInput;
    } catch (e) { console.error(e); showToast('❌ Erro ao salvar', 'error'); }
  }

  async function copyToClipboard(text: string) {
    if (!text) { showToast('❌ Sem texto para copiar', 'error'); return; }
    try {
      await navigator.clipboard.writeText(text);
      showToast('✅ Link copiado!', 'success');
    } catch (e) { console.error(e); showToast('❌ Erro ao copiar', 'error'); }
  }

  const linksRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLinks(initialLinks ?? []);
  }, [initialLinks]);

  useEffect(() => {
    // init sortable if available
    if (!linksRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let Sortable: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      Sortable = require('sortablejs');
    } catch (e) {
      Sortable = (window as unknown as Record<string, unknown>).Sortable;
    }
    if (!Sortable) return;
    const instance = Sortable.create(linksRef.current, {
      handle: '.drag-handle',
      animation: 200,
      ghostClass: 'sortable-ghost',
      onEnd: async () => {
        // update order locally and persist to Supabase
        const newOrderEls = Array.from(linksRef.current!.querySelectorAll('.link-card'));
        const newOrder: DbLink[] = newOrderEls.map((el) => {
          const id = el.getAttribute('data-id');
          return links.find(l => String(l.id) === String(id))!;
        }).filter(Boolean);
        setLinks(newOrder);

        try {
          // persist positions: update each link order_position to its index
          await Promise.all(newOrder.map((l, idx) => supabase.from('links').update({ order_position: idx }).eq('id', l.id)));
          showToast('✅ Ordem salva', 'success');
        } catch (e) {
          console.error('persist order err', e);
          showToast('❌ Erro ao salvar ordem', 'error');
        }
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

    const payload: Record<string, unknown> = {
      user_id: user.id,
      title: createTitle,
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
    setEditSelectedIcon(String(link.icone || ''));
    // prefill select value after render
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

    const payload: Record<string, unknown> = {
      title: novoTitulo,
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

      <style jsx global>{`
        * { font-family: 'Nunito', sans-serif; margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: linear-gradient(160deg, #a8edcf 0%, #78d4f0 35%, #4ab8f5 60%, #6ec6f7 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .blob {
            position: fixed; border-radius: 50%; filter: blur(80px);
            opacity: 0.45; animation: blobFloat 10s ease-in-out infinite alternate;
            pointer-events: none; z-index: 0;
        }
        .blob-1 { width:600px;height:600px;background:radial-gradient(circle,#a0f0d0,#4dd9f5);top:-100px;left:-150px;animation-delay:0s; }
        .blob-2 { width:500px;height:500px;background:radial-gradient(circle,#b8eaff,#72c8f8);bottom:-100px;right:-100px;animation-delay:3s; }
        .blob-3 { width:350px;height:350px;background:radial-gradient(circle,#d0f8e8,#8de8f5);top:40%;left:50%;transform:translate(-50%,-50%);animation-delay:1.5s; }
        
        @keyframes blobFloat {
            0% { transform: scale(1) translate(0,0); }
            100% { transform: scale(1.12) translate(20px,-20px); }
        }

        .content { position: relative; z-index: 1; }

        .glass {
            background: rgba(255,255,255,0.38);
            backdrop-filter: blur(18px) saturate(180%);
            border: 1.5px solid rgba(255,255,255,0.7);
            border-radius: 28px;
            box-shadow: 0 8px 32px rgba(80,180,220,0.18), inset 0 1px 0 rgba(255,255,255,0.8);
        }
        
        .glass-sm {
            background: rgba(255,255,255,0.32);
            backdrop-filter: blur(14px);
            border: 1.5px solid rgba(255,255,255,0.65);
            border-radius: 20px;
            box-shadow: 0 4px 16px rgba(80,180,220,0.14), inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .glass-card {
            background: rgba(255,255,255,0.42);
            backdrop-filter: blur(14px);
            border: 1.5px solid rgba(255,255,255,0.72);
            border-radius: 24px;
            box-shadow: 0 8px 28px rgba(80,180,220,0.15), inset 0 1px 0 rgba(255,255,255,0.9);
            transition: all 0.25s;
        }
        .glass-card:hover {
            background: rgba(255,255,255,0.52);
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(80,180,220,0.22), inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .modal-dialog {
            background: rgba(255, 255, 255, 0.96);
            border: 1px solid rgba(190, 210, 255, 0.9);
            box-shadow: 0 16px 40px rgba(15, 50, 105, 0.45);
            color: #1d355d;
        }

        /* Navbar */
        nav { position: sticky; top: 0; z-index: 50; padding: 0.75rem 0; }
        .nav-inner {
            background: rgba(255,255,255,0.5);
            backdrop-filter: blur(20px);
            border: 1.5px solid rgba(255,255,255,0.75);
            border-radius: 999px;
            padding: 0.6rem 1.5rem;
            display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 4px 20px rgba(80,180,220,0.15), inset 0 1px 0 rgba(255,255,255,0.9);
        }

        /* Buttons */
        .btn-blue {
            background: linear-gradient(180deg, #5bc8f5 0%, #2aa8e0 100%);
            border: 1.5px solid rgba(255,255,255,0.6);
            border-radius: 999px; padding: 0.55rem 1.4rem;
            color: white; font-weight: 700; font-size: 0.9rem;
            text-shadow: 0 1px 2px rgba(0,0,0,0.15);
            box-shadow: 0 4px 14px rgba(42,168,224,0.4), inset 0 1px 0 rgba(255,255,255,0.5);
            transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .btn-blue:hover { background: linear-gradient(180deg,#72d4f8,#3ab8f0); transform: translateY(-1px); }

        .btn-green {
            background: linear-gradient(180deg, #5ed490 0%, #28b060 100%);
            border: 1.5px solid rgba(255,255,255,0.6);
            border-radius: 999px; padding: 0.7rem 1.6rem;
            color: white; font-weight: 800;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            box-shadow: 0 4px 16px rgba(40,176,96,0.4), inset 0 1px 0 rgba(255,255,255,0.5);
            transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.5rem;
            width: 100%; justify-content: center;
        }
        .btn-green:hover { background: linear-gradient(180deg,#72e0a0,#38c070); transform: translateY(-1px); }

        .btn-ghost {
            background: rgba(255,255,255,0.35);
            border: 1.5px solid rgba(255,255,255,0.7);
            border-radius: 999px; padding: 0.5rem 1.2rem;
            color: #1a6a9a; font-weight: 700; font-size: 0.85rem;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
            transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.55); transform: translateY(-1px); }

        .btn-red {
            background: rgba(255,255,255,0.3);
            border: 1.5px solid rgba(255,100,100,0.3);
            border-radius: 999px; padding: 0.5rem 1.1rem;
            color: #c0392b; font-weight: 700; font-size: 0.85rem;
            transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .btn-red:hover { background: rgba(255,80,80,0.12); transform: translateY(-1px); }

        /* Text */
        .text-ocean { color: #1a6a9a; }
        .text-ocean-light { color: #2a8abf; }
        .text-muted { color: rgba(30,80,120,0.55); }

        /* Float logo */
        .float-logo {
            animation: floatLogo 4s ease-in-out infinite;
            filter: drop-shadow(0 3px 8px rgba(80,180,220,0.35));
        }
        @keyframes floatLogo {
            0%,100% { transform: translateY(0) rotate(-1deg); }
            50% { transform: translateY(-6px) rotate(1deg); }
        }

        /* Avatar ring */
        .avatar-ring {
            border: 3px solid rgba(255,255,255,0.85);
            box-shadow: 0 4px 16px rgba(80,180,220,0.3), 0 0 0 2px rgba(91,200,245,0.4);
        }

        /* Stat card */
        .stat-card {
            background: rgba(255,255,255,0.45);
            border: 1.5px solid rgba(255,255,255,0.8);
            border-radius: 20px; padding: 1rem 1.2rem; text-align: center;
            box-shadow: 0 4px 16px rgba(80,180,220,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
        }

        /* Input */
        .aero-input {
            background: rgba(255,255,255,0.45);
            backdrop-filter: blur(10px);
            border: 1.5px solid rgba(255,255,255,0.75);
            border-radius: 16px; padding: 0.7rem 1rem;
            color: #1a4a6a; width: 100%; font-size: 0.95rem; font-weight: 500;
            box-shadow: inset 0 1px 3px rgba(80,160,200,0.1), inset 0 -1px 0 rgba(255,255,255,0.6);
            transition: all 0.25s;
        }
        .aero-input:focus {
            outline: none;
            border-color: rgba(91,200,245,0.8);
            background: rgba(255,255,255,0.6);
            box-shadow: 0 0 0 3px rgba(91,200,245,0.2), inset 0 1px 3px rgba(80,160,200,0.1);
        }
        .aero-input::placeholder { color: rgba(30,80,120,0.4); }

        /* Select */
        .aero-select {
            background: rgba(255,255,255,0.45);
            backdrop-filter: blur(10px);
            border: 1.5px solid rgba(255,255,255,0.75);
            border-radius: 16px; padding: 0.7rem 1rem;
            color: #1a4a6a; width: 100%; font-size: 0.95rem; font-weight: 500;
            cursor: pointer;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
        }
        .aero-select option { background: #d0eef8; color: #1a4a6a; }

        /* Toast notifications */
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(400px);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .toast.show {
            transform: translateX(0);
        }
        .toast.success {
            background: rgba(40, 176, 96, 0.9);
            box-shadow: 0 4px 20px rgba(40, 176, 96, 0.3);
        }
        .toast.error {
            background: rgba(192, 57, 43, 0.9);
            box-shadow: 0 4px 20px rgba(192, 57, 43, 0.3);
        }

        /* Enhanced animations */
        .fade-in {
            animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .slide-in-left {
            animation: slideInLeft 0.5s ease-out forwards;
        }
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .bounce-in {
            animation: bounceIn 0.6s ease-out forwards;
        }
        @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
        }

        /* Loading states */
        .loading-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            z-index: 10;
        }

        /* Enhanced link cards */
        .link-card {
            background: rgba(255,255,255,0.42);
            backdrop-filter: blur(14px);
            border: 1.5px solid rgba(255,255,255,0.72);
            border-radius: 20px; padding: 1rem 1.2rem; display: flex; align-items: center; gap: 1rem;
            box-shadow: 0 4px 16px rgba(80,180,220,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: move;
            position: relative;
            overflow: hidden;
        }
        .link-card::before {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.5s;
        }
        .link-card:hover::before {
            left: 100%;
        }
        .link-card:hover {
            background: rgba(255,255,255,0.58);
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 32px rgba(80,180,220,0.25), inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .link-card:active {
            transform: translateY(-1px) scale(0.98);
        }

        /* SortableJS drag and drop styles */
        .link-card.sortable-ghost {
            opacity: 0.4;
            background: rgba(255, 255, 255, 0.2);
            border: 2px dashed rgba(91, 200, 245, 0.8);
            box-shadow: 0 4px 12px rgba(80, 180, 220, 0.2) inset;
        }

        .link-card.sortable-drag {
            opacity: 1;
            background: rgba(255, 255, 255, 0.85);
            box-shadow: 0 12px 40px rgba(80, 180, 220, 0.4);
            transform: scale(1.02) rotate(2deg) !important;
        }

        .link-card.sortable-chosen {
            background: rgba(255, 255, 255, 0.65);
            border-color: rgba(91, 200, 245, 1);
        }

        /* Drag handle */
        .drag-handle {
            cursor: grab;
            padding: 0.5rem;
            color: rgba(26, 106, 154, 0.5);
            transition: all 0.2s ease;
            min-width: 1.2rem;
        }

        .drag-handle:hover {
            color: rgba(26, 106, 154, 0.9);
            transform: scale(1.1);
        }

        .link-card.sortable-drag .drag-handle {
            cursor: grabbing;
            color: rgba(26, 106, 154, 1);
        }

        /* Sortable container visual feedback */
        #linksContainer.sortable-active {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 0.5rem;
        }

        /* Icon bubble para PNGs - CORRIGIDO PARA BORDAS ARREDONDADAS */
        .icon-bubble {
            width: 2.8rem; height: 2.8rem; 
            border-radius: 50% !important; /* ⭐ FORÇA borda arredondada */
            flex-shrink: 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(230,245,255,0.8));
            border: 2px solid rgba(255,255,255,0.95);
            box-shadow: 0 4px 12px rgba(80,180,220,0.2);
            display: flex; 
            align-items: center; 
            justify-content: center;
            overflow: hidden; /* ⭐ CRÍTICO: Impede vazamento de imagem */
        }
        
        /* TODAS as imagens dentro do icon-bubble */
        .icon-bubble img {
            width: 100% !important;
            height: 100% !important;
            max-width: 100%;
            max-height: 100%;
            border-radius: 50% !important; /* ⭐ GARANTE borda redonda */
            object-fit: cover !important; /* ⭐ PREENCHE o círculo sem distorcer */
            display: block;
        }
        
        /* Para ícones padrão (PNG 8-bit) que devem manter proporção */
        .icon-bubble img.default-icon-img,
        .icon-bubble img[src*="/icons/8-bit/"] {
            object-fit: contain !important;
            padding: 0.25rem;
        }
        
        /* Para ícones customizados (uploads do usuário) */
        .icon-bubble img.custom-icon-img,
        .icon-bubble img[src*="data:image"] {
            object-fit: cover !important;
            border-radius: 50% !important;
        }

        /* Drag hint */
        .drag-hint {
            background: rgba(255,255,255,0.25);
            border: 1.5px dashed rgba(255,255,255,0.6);
            border-radius: 16px;
        }

        /* Tag */
        .aero-tag {
            background: rgba(255,255,255,0.55);
            border: 1.5px solid rgba(255,255,255,0.8);
            border-radius: 999px; padding: 0.25rem 0.9rem;
            font-size: 0.78rem; color: #2a7aaf; font-weight: 700;
            display: inline-block;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
        }

        /* Section label */
        .section-label {
            font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
            letter-spacing: 0.08em; color: rgba(30,80,120,0.45);
        }

        /* Empty state */
        .empty-state {
            background: rgba(255,255,255,0.25);
            border: 2px dashed rgba(255,255,255,0.6);
            border-radius: 24px; padding: 3rem; text-align: center;
        }

        /* ========== CUSTOM TOGGLE STYLES ========== */
        
        /* Toggle Radio Label */
        .icon-mode-toggle input[type="radio"] {
            display: none;
        }

        .icon-mode-toggle input[type="radio"]:checked + .icon-mode-label {
            border-color: #2563eb;
            background: linear-gradient(135deg, rgb(219, 234, 254), rgb(224, 242, 254));
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
            transform: translateY(-2px);
        }

        .icon-mode-toggle input[type="radio"]:checked + .icon-mode-label i {
            color: #1e40af;
        }

        .icon-mode-label {
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .icon-mode-label:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Section show/hide with animation */
        #predefined_icon_section.hidden,
        #custom_icon_section.hidden {
            display: none !important;
        }

        #predefined_icon_section,
        #custom_icon_section {
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Upload button enhanced */
        #custom_icon_btn {
            border-color: rgba(37, 99, 235, 0.4);
        }

        #custom_icon_btn:hover {
            border-color: rgba(37, 99, 235, 0.8);
            background-color: rgba(59, 130, 246, 0.05);
        }

        #custom_icon_btn:active {
            transform: scale(0.98);
        }

        /* Preview container */
        #custom_icon_preview.hidden {
            display: none !important;
        }
      `}</style>

      <div className="container">
        <nav className="nav-inner mb-6">
          <div className="flex items-center gap-3">
            <img src="/brand/icon.png" alt="LinkWave" className="w-9 h-9 rounded-md" />
            <div className="flex flex-col leading-tight">
              <span className="font-black text-lg">LinkWave</span>
              <span className="text-xs text-muted">@{user?.username}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={`/u/${user?.username}`} className="btn-blue text-sm py-1 px-3">Ver página</a>
            <a href="/api/auth/logout" className="btn-ghost text-sm py-1 px-3">Sair</a>
          </div>
        </nav>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="glass p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
              <div className="relative">
                <Avatar src={user?.avatar_url} alt={user?.username} size="lg" className="avatar-ring" />
                <a href="/profile" className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-blue-200 flex items-center justify-center shadow-md"> 
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-ocean" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                </a>
              </div>

              <h2 className="mt-4 text-2xl font-black">@{user?.username}</h2>

              <div className="mt-2 mb-3 text-center md:text-left">
                <p className="text-sm mb-2 text-ocean font-semibold inline-flex items-center gap-2">
                  <span id="nomeText">{user?.name ?? 'Seu nome'}</span>
                  <button onClick={() => setNameModalOpen(true)} className="ml-1 w-6 h-6 rounded-full bg-white/60 inline-flex items-center justify-center hover:bg-white transition text-ocean text-xs" title="Editar nome">✎</button>
                </p>
                <p className="text-muted text-sm mb-1 inline-flex items-center gap-2">
                  <span id="bioText">{(user as { bio?: string })?.bio ?? 'Sem bio ainda'}</span>
                  <button onClick={() => setBioModalOpen(true)} className="ml-1 w-6 h-6 rounded-full bg-white/60 inline-flex items-center justify-center hover:bg-white transition text-ocean text-xs" title="Editar bio">✎</button>
                </p>
              </div>

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
                  <input value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} className="aero-input w-full mb-2" placeholder="Ex: Meu Instagram" required />
                </div>
                <div>
                  <label className="block text-xs mb-1.5">URL</label>
                  <input value={createUrl} onChange={(e) => setCreateUrl(e.target.value)} className="aero-input w-full mb-2" placeholder="https://..." required />
                </div>

                <div>
                  <label className="block text-xs mb-2">Como adicionar o ícone?</label>
                  <div className="flex gap-3">
                    <label className={`px-3 py-2 rounded-md cursor-pointer ${iconMode==='predefined' ? 'bg-white/20 ring-2 ring-blue-300' : 'bg-white/6'}`}>
                      <input type="radio" name="icon_mode" checked={iconMode==='predefined'} onChange={() => setIconMode('predefined')} className="mr-2" /> Predefinido
                    </label>
                    <label className={`px-3 py-2 rounded-md cursor-pointer ${iconMode==='custom' ? 'bg-white/20 ring-2 ring-blue-300' : 'bg-white/6'}`}>
                      <input type="radio" name="icon_mode" checked={iconMode==='custom'} onChange={() => setIconMode('custom')} className="mr-2" /> Customizado
                    </label>
                  </div>
                </div>

                {iconMode === 'predefined' ? (
                  <div>
                    <label className="block text-xs mb-1.5">Selecione um ícone</label>
                    <select value={createIcon} onChange={(e) => setCreateIcon(e.target.value)} className="aero-select w-full mb-2" aria-label="Selecionar ícone">
                      <option value="">-- Escolha um --</option>
                    {Object.entries(iconesDisponiveis).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                    </select>

                    {/* Preview grid with clickable icons */}
                    <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-auto pr-2">
                    {Object.entries(iconesDisponiveis).map(([key, name]) => {
                      const filename = key.split(/[^a-zA-Z0-9]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('_') + '.png';
                      const src = `/imgs/icons/links/${filename}`;
                      const isSelected = createIcon === key;
                      return (
                        <button type="button" key={key} onClick={() => setCreateIcon(key)} className={`flex flex-col items-center p-2 rounded-lg ${isSelected ? 'ring-2 ring-blue-300 bg-white/10' : 'bg-white/6'} hover:ring-2 hover:ring-blue-200`} title={name}>
                          <IconImg name={key} alt={name} className="w-8 h-8 object-contain mb-1" />
                        </button>
                      );
                    })}
                    </div>
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
                        <img src={link.icon_blob || ''} alt={link.title || ''} />
                      ) : link.icone ? (
                        <IconImg name={String(link.icone)} className="w-8 h-8" alt={link.title || ''} />
                      ) : (
                        <i className="fa-solid fa-link" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-ocean truncate">{link.title}</h4>
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

        {/* Name & Bio modals and toasts */}
        {nameModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="modal-dialog glass p-6 rounded-3xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-ocean">Editar Nome</h3>
                <button onClick={() => setNameModalOpen(false)} className="text-muted">✕</button>
              </div>
              <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} type="text" maxLength={60} className="aero-input w-full mb-3" />
              <div className="flex gap-3">
                <button onClick={() => setNameModalOpen(false)} className="btn-ghost flex-1">Cancelar</button>
                <button onClick={() => saveName()} className="btn-green flex-1">Salvar</button>
              </div>
            </div>
          </div>
        )}

        {bioModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="modal-dialog glass p-6 rounded-3xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-ocean">Editar Bio</h3>
                <button onClick={() => setBioModalOpen(false)} className="text-muted">✕</button>
              </div>
              <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value)} maxLength={160} rows={3} className="aero-input w-full mb-3 resize-none" />
              <div className="flex gap-3">
                <button onClick={() => setBioModalOpen(false)} className="btn-ghost flex-1">Cancelar</button>
                <button onClick={() => saveBio()} className="btn-green flex-1">Salvar</button>
              </div>
            </div>
          </div>
        )}

        <div aria-live="polite" className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type === 'success' ? 'success' : 'error'}`}>
              {t.msg}
            </div>
          ))}
        </div>

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
                  <input id="edit_title" defaultValue={editingLink.title} className="aero-input w-full" required />
                </div>
                <div>
                  <label className="block text-xs mb-2">URL</label>
                  <input id="edit_url" defaultValue={editingLink.url} className="aero-input w-full" required />
                </div>
                <div>
                  <label className="block text-xs mb-2">Ícone Padrão</label>
                  <select id="edit_icon" className="aero-select w-full default" value={editSelectedIcon} onChange={(e)=>{ setEditSelectedIcon(e.target.value); }}>
                    <option value="">-- Sem ícone padrão --</option>
                    {Object.entries(iconesDisponiveis).map(([k,n]) => <option key={k} value={k}>{n}</option>)}
                  </select>

                  {/* Preview grid for edit modal */}
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {Object.entries(iconesDisponiveis).map(([key, name]) => {
                      const filename = key.split(/[^a-zA-Z0-9]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('_') + '.png';
                      const src = `/imgs/icons/links/${filename}`;
                      const isSelected = editSelectedIcon === key;
                      return (
                        <button key={key} type="button" onClick={() => { setEditSelectedIcon(key); setEditCustomIconDataUrl(null); const sel = document.getElementById('edit_icon') as HTMLSelectElement | null; if (sel) sel.value = key; }} className={`flex flex-col items-center p-1 rounded ${isSelected ? 'ring-2 ring-blue-300' : 'bg-white/5'}`} title={name}>
                          <IconImg name={key} alt={name} className="w-8 h-8 object-contain mb-1" />
                        </button>
                      );
                    })}
                  </div>
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
