import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { ResetPasswordForm } from "@/components/shared/reset-password-form";
import { PublicPageLayout } from "@/components/shared/public-page-layout";

export const metadata: Metadata = {
  title: "Recuperar senha",
  description: "Receba um link seguro para redefinir sua senha no LinkWave.",
};

export default function ResetPasswordPage() {
  return (
    <PublicPageLayout isLoggedIn={false}>
      <div className="page-container flex flex-1 flex-col justify-center pb-8 pt-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1fr_28rem]">
          <div className="hidden lg:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/40 px-4 py-2 text-sm font-bold text-ocean shadow-sm backdrop-blur-md">
              <Sparkles className="size-4" />
              Recuperação segura
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight text-ocean" style={{ textShadow: "0 2px 0 rgba(255,255,255,0.5)" }}>
              Esqueceu sua senha?
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              Receba um link seguro no seu email para redefinir sua senha e
              voltar a surfar na sua onda de links.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="glass-card-strong p-8 sm:p-10">
              <div className="mb-8 text-center">
                <div className="relative mx-auto mb-5 flex size-[4.5rem] items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-cyan-300/40 to-blue-400/30 p-0 shadow-inner">
                  <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-b from-white/40 to-transparent opacity-60" />
                  <Image
                    src="/brand/icon.png"
                    alt="LinkWave"
                    width={56}
                    height={56}
                    className="relative drop-shadow-xl"
                    priority
                  />
                </div>
                <h2 className="text-3xl font-black text-ocean" style={{ textShadow: "0 1px 0 rgba(255,255,255,0.8)" }}>Recuperar senha</h2>
                <p className="mt-2 text-sm text-ocean/70">
                  Receba um link seguro para redefinir sua senha.
                </p>
              </div>

              <ResetPasswordForm />
            </div>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}
