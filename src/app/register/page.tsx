import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Shield, Sparkles, Zap } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Criar conta",
  description:
    "Crie sua conta LinkWave com cadastro seguro usando Supabase Auth.",
};

const benefits = [
  {
    icon: Shield,
    text: "Proteção RLS e validação no servidor",
  },
  {
    icon: Zap,
    text: "Cadastro instantâneo com Supabase Auth",
  },
  {
    icon: Sparkles,
    text: "Perfil público grátis para seus links",
  },
];

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
      <div className="pointer-events-none absolute left-[-12rem] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-emerald-300/25 blur-[120px] dark:bg-emerald-500/12 animate-blob" />
      <div className="pointer-events-none absolute right-[-10rem] top-[20rem] h-[35rem] w-[35rem] rounded-full bg-sky-300/30 blur-[120px] dark:bg-sky-500/14 animate-blob-2" style={{ animationDelay: "-4s" }} />
      <div className="pointer-events-none absolute left-[40%] top-[10%] h-[25rem] w-[25rem] rounded-full bg-indigo-300/15 blur-[100px] dark:bg-indigo-500/10 animate-blob-3" style={{ animationDelay: "-8s" }} />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <header className="glass-nav mb-8 flex items-center justify-between rounded-full px-4 py-3 shadow-lg shadow-sky-950/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/brand/icon.png"
                alt="LinkWave"
                width={44}
                height={44}
                className="rounded-2xl"
                priority
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-50" />
            </div>
            <span className="text-lg font-black text-foreground">
              LinkWave
            </span>
          </Link>
          <Link
            href="/login"
            className="relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-gradient-to-b from-white/20 to-white/5 px-4 text-sm font-bold text-foreground shadow-lg shadow-black/5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/8 dark:from-white/8 dark:to-white/3"
          >
            <div className="pointer-events-none absolute inset-x-[15%] top-0 h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            Login
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 pb-8 lg:grid-cols-[1fr_30rem]">
          <div className="hidden lg:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/40 px-4 py-2 text-sm font-bold text-brand shadow-sm backdrop-blur-md">
              <Sparkles className="size-4" />
              Cadastro seguro com Supabase
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight text-foreground">
              Sua página de links começa com uma conta protegida de verdade.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              Validação no servidor, Auth moderno, perfis públicos e uma base
              pronta para crescer sem depender de JavaScript no navegador.
            </p>

            <div className="mt-10 flex flex-col gap-3">
              {benefits.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/40 px-5 py-3.5 text-sm font-semibold text-card-foreground shadow-sm backdrop-blur-md transition hover:bg-white/60 dark:bg-white/5 dark:hover:bg-white/8"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand shadow-sm backdrop-blur-sm">
                    <item.icon className="size-4" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <div className="mb-8 text-center">
                <div className="relative mx-auto mb-5 flex size-[4.5rem] items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-brand/20 to-accent/10 p-0 shadow-inner">
                  <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-b from-white/30 to-transparent opacity-50" />
                  <Image
                    src="/brand/icon.png"
                    alt="LinkWave"
                    width={56}
                    height={56}
                    className="relative drop-shadow-xl"
                    priority
                  />
                </div>
                <h2 className="text-3xl font-black text-foreground">
                  Criar conta
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Comece a surfar na sua onda de links
                </p>
              </div>

              <RegisterForm />
            </div>

            <footer className="mt-5 rounded-2xl border border-white/20 bg-white/30 p-4 text-center text-xs text-muted shadow-sm backdrop-blur-md dark:bg-white/5">
              © 2026 LinkWave. Todos os direitos reservados.
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
