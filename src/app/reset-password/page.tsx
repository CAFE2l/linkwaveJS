import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ResetPasswordForm } from "@/components/shared/reset-password-form";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Recuperar senha",
  description: "Receba um link seguro para redefinir sua senha no LinkWave.",
};

export default function ResetPasswordPage() {
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
              Recuperação segura
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight text-foreground">
              Esqueceu sua senha?
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-secondary">
              Receba um link seguro no seu email para redefinir sua senha e
              voltar a surfar na sua onda de links.
            </p>
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
                <h2 className="text-3xl font-black text-foreground">Recuperar senha</h2>
                <p className="mt-2 text-sm text-fg-secondary">
                  Receba um link seguro para redefinir sua senha.
                </p>
              </div>

              <ResetPasswordForm />
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
