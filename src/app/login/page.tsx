import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { LoginForm } from "@/components/shared/login-form";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse seu painel LinkWave para editar perfil, links e estatísticas.",
};

const benefits = [
  { icon: ShieldCheck, text: "Autenticação segura com Supabase Auth" },
  { icon: Zap, text: "Acesso instantâneo ao seu painel" },
  { icon: Lock, text: "Seus links protegidos com RLS" },
];

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="bg-bg min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed left-[-12rem] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-emerald-300/25 blur-[120px] dark:bg-emerald-500/12 animate-blob" />
      <div className="pointer-events-none fixed right-[-10rem] top-[20rem] h-[35rem] w-[35rem] rounded-full bg-sky-300/30 blur-[120px] dark:bg-sky-500/14 animate-blob-2" style={{ animationDelay: "-4s" }} />
      <div className="pointer-events-none fixed left-[40%] top-[10%] h-[25rem] w-[25rem] rounded-full bg-indigo-300/15 blur-[100px] dark:bg-indigo-500/10 animate-blob-3" style={{ animationDelay: "-8s" }} />

      <div className="page-container flex min-h-screen flex-col">
        <header className="border-b border-border/50 bg-surface/80 backdrop-blur-xl rounded-xl mb-8 flex items-center justify-between px-4 py-3">
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
            <span className="text-lg font-black text-foreground">LinkWave</span>
          </Link>
          <ButtonLink href="/register" variant="secondary" size="sm">
            Criar conta
            <ArrowRight className="size-4" />
          </ButtonLink>
        </header>

        <section className="grid flex-1 items-center gap-10 pb-8 lg:grid-cols-[1fr_30rem]">
          <div className="hidden lg:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface/80 px-4 py-2 text-sm font-bold text-brand shadow-sm backdrop-blur-md">
              <Sparkles className="size-4" />
              Login seguro com Supabase
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight text-foreground">
              Bem-vindo de volta à sua onda de links.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-secondary">
              Acesse seu painel para gerenciar seus links, acompanhar estatísticas e personalizar sua página.
            </p>

            <div className="mt-10 flex flex-col gap-3">
              {benefits.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface/80 px-5 py-3.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition hover:bg-surface"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand shadow-sm">
                    <item.icon className="size-4" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="card p-6 sm:p-8">
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
                <h2 className="text-3xl font-black text-foreground">Entrar</h2>
                <p className="mt-2 text-sm text-fg-secondary">
                  Acesse seu painel para editar perfil, links e estatísticas.
                </p>
              </div>

              <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-surface-hover" />}>
                <LoginForm />
              </Suspense>
            </div>

            <footer className="mt-5 rounded-2xl border border-border/50 bg-surface/80 p-4 text-center text-xs text-fg-secondary shadow-sm backdrop-blur-md">
              © 2026 LinkWave. Todos os direitos reservados.
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
