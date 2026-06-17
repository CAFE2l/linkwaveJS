'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Link de login enviado para seu e-mail.');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erro ao tentar entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Entrar</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <label className="block text-sm">E-mail</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded bg-slate-700" />
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 rounded" disabled={loading}>{loading ? 'Enviando...' : 'Enviar link'}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
