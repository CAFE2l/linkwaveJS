import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Shield, Sparkles, Zap } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { createClient } from "@/lib/supabase/server";
import { PublicPageLayout } from "@/components/shared/public-page-layout";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta LinkWave com cadastro seguro usando Supabase Auth.",
};

const benefits = [
  { icon: Shield, text: "Proteção RLS e validação no servidor" },
  { icon: Zap, text: "Cadastro instantâneo com Supabase Auth" },
  { icon: Sparkles, text: "Perfil público grátis para seus links" },
];

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <PublicPageLayout isLoggedIn={false}>
      <div className="page-container flex flex-1 flex-col justify-center pb-8 pt-6">
        <section className="grid items-center gap-12 lg:grid-cols-[1fr_28rem]">
          <div className="hidden lg:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/40 px-4 py-2 text-sm font-bold text-ocean shadow-sm backdrop-blur-md">
              <Sparkles className="size-4" />
              Cadastro seguro com Supabase
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight text-ocean" style={{ textShadow: "0 2px 0 rgba(255,255,255,0.5)" }}>
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
                  className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/40 px-5 py-3.5 text-sm font-semibold text-ocean shadow-sm backdrop-blur-md transition hover:bg-white/60"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/60 text-ocean shadow-sm">
                    <item.icon className="size-4" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
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
                <h2 className="text-3xl font-black text-ocean" style={{ textShadow: "0 1px 0 rgba(255,255,255,0.8)" }}>Criar conta</h2>
                <p className="mt-2 text-sm text-ocean/70">
                  Comece a surfar na sua onda de links
                </p>
              </div>

              <RegisterForm />
            </div>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}
