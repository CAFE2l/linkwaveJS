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
      <div className="page-container flex flex-1 flex-col justify-center pb-8 pt-24">
        <section className="grid items-center gap-10 lg:grid-cols-[1fr_30rem]">
          <div className="hidden lg:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface/80 px-4 py-2 text-sm font-bold text-brand shadow-sm backdrop-blur-md">
              <Sparkles className="size-4" />
              Cadastro seguro com Supabase
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight text-foreground">
              Sua página de links começa com uma conta protegida de verdade.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-secondary">
              Validação no servidor, Auth moderno, perfis públicos e uma base
              pronta para crescer sem depender de JavaScript no navegador.
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
                <h2 className="text-3xl font-black text-foreground">Criar conta</h2>
                <p className="mt-2 text-sm text-fg-secondary">
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
