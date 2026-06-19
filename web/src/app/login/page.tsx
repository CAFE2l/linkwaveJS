"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Lo"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Link de login enviado para seu e-mail.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao tentar entrar");
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
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-slate-700"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar link"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
ginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard"); // Redireciona para o dashboard
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a8edcf] via-[#78d4f0] to-[#6ec6f7]">
      <div className="glass-strong p-8 md:p-10 rounded-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-ocean mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-600">Entre com sua conta LinkWave</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-4 text-center">
          Não tem conta?{" "}
          <a href="/register" className="text-blue-600">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}
