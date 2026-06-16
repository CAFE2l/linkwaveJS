import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta LinkWave com cadastro seguro usando Supabase Auth.",
};

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="aurora-shell relative min-h-screen overflow-hidden px-4 py-6">
      <div className="mesh-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/12" />
      <div className="pointer-events-none absolute -right-24 top-72 h-96 w-96 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-500/16" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/12" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <header className="mb-8 flex items-center justify-between rounded-full border border-white/55 bg-white/50 px-4 py-3 shadow-lg shadow-sky-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/icon.png" alt="LinkWave" width={44} height={44} className="rounded-2xl" priority />
            <span className="text-lg font-black text-slate-900 dark:text-white">LinkWave</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/60 bg-white/55 px-4 text-sm font-bold text-sky-800 transition hover:-translate-y-0.5 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-sky-200"
          >
            Login
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 pb-8 lg:grid-cols-[1fr_30rem]">
          <div className="hidden lg:block">
            <div className="mb-5 inline-flex rounded-full border border-white/55 bg-white/45 px-4 py-2 text-sm font-bold text-sky-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-sky-200">
              Cadastro seguro com Supabase
            </div>
            <h1 className="max-w-2xl text-5xl font-black tracking-normal text-slate-950 dark:text-white">
              Sua página de links começa com uma conta protegida de verdade.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Validação no servidor, Auth moderno, perfis públicos e uma base pronta para crescer sem depender de regras frágeis no navegador.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {["RLS ativo", "OAuth Google", "Rate limit"].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/45 bg-white/35 p-4 text-sm font-bold text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="glass-panel rounded-[2rem] p-6 shadow-2xl shadow-sky-950/10 sm:p-8">
              <div className="mb-8 text-center">
                <Image
                  src="/brand/icon.png"
                  alt="LinkWave"
                  width={76}
                  height={76}
                  className="mx-auto mb-4 rounded-3xl drop-shadow-xl"
                  priority
                />
                <h2 className="text-3xl font-black text-slate-950 dark:text-white">Criar conta</h2>
                <p className="mt-2 text-sm text-muted">Comece a surfar na sua onda de links</p>
              </div>
              <RegisterForm />
            </div>
            <footer className="mt-5 rounded-3xl border border-white/45 bg-white/35 p-4 text-center text-xs text-muted backdrop-blur dark:border-white/10 dark:bg-white/5">
              © 2026 LinkWave. Todos os direitos reservados.
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
