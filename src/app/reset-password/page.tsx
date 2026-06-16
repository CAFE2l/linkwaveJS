import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ResetPasswordForm } from "@/components/shared/reset-password-form";

export const metadata: Metadata = {
  title: "Recuperar senha",
  description: "Receba um link seguro para redefinir sua senha no LinkWave.",
};

export default function ResetPasswordPage() {
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
            href="/register"
            className="relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-gradient-to-b from-white/20 to-white/5 px-4 text-sm font-bold text-foreground shadow-lg shadow-black/5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/8 dark:from-white/8 dark:to-white/3"
          >
            <div className="pointer-events-none absolute inset-x-[15%] top-0 h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            Criar conta
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 pb-8 lg:grid-cols-[1fr_30rem]">
          <div className="hidden lg:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/40 px-4 py-2 text-sm font-bold text-brand shadow-sm backdrop-blur-md">
              <Sparkles className="size-4" />
              Recuperação segura
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight text-foreground">
              Esqueceu sua senha?
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              Receba um link seguro no seu email para redefinir sua senha e
              voltar a surfar na sua onda de links.
            </p>
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
                  Recuperar senha
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Receba um link seguro para redefinir sua senha.
                </p>
              </div>

              <ResetPasswordForm />
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
