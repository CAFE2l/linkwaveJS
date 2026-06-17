'use client';
import React, { useState } from 'react';
import Avatar from '@/components/Avatar';
import Banner from '@/components/Banner';

type Profile = {
  id?: string;
  username?: string;
  name?: string;
  bio?: string;
  avatar_url?: string | null;
  banner_url?: string | null;
};

export default function ClientCustomize({ initialProfile }: { initialProfile: Profile | null }) {
  const [name, setName] = useState(initialProfile?.name ?? '');
  const [bio, setBio] = useState(initialProfile?.bio ?? '');
  const [loading, setLoading] = useState(false);

  // Placeholder handlers: real save will call server actions or API routes
  async function handleSave() {
    setLoading(true);
    try {
      // TODO: call API route to persist profile
      await new Promise((r) => setTimeout(r, 700));
      alert('Perfil salvo (mock). Implementar rota /api/profile para persistir.');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Painel de Personalização</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-1">
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="text-center">
                <Banner src={initialProfile?.banner_url ?? null} height={120} />
                <div className="-mt-10 mx-auto w-24 h-24">
                  <Avatar src={initialProfile?.avatar_url ?? null} alt={initialProfile?.name ?? 'Usuário'} size={96} />
                </div>
                <h3 className="mt-3 font-semibold">{name || initialProfile?.username || 'Seu nome'}</h3>
                <p className="text-sm text-slate-300 mt-2">{bio || 'Sua bio aparecerá aqui'}</p>
              </div>
            </div>
          </section>

          <section className="md:col-span-2">
            <div className="bg-slate-800 p-6 rounded-lg space-y-4">
              <label className="block">Nome</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 rounded bg-slate-700 text-white" />

              <label className="block">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 rounded bg-slate-700 text-white" />

              <div className="flex gap-2">
                <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-blue-600 rounded">
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button className="px-4 py-2 bg-slate-700 rounded">Cancelar</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
