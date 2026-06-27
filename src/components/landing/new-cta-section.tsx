"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";
import Image from "next/image";

export function NewCTASection({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20">
      <MotionReveal variant="scale">
        <div className="glass-card-strong p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="mb-5 flex justify-center">
            <div className="animate-logo-float">
              <Image
                src="/brand/icon.png"
                alt="LinkWave"
                width={72}
                height={72}
                className="h-20 w-20"
                style={{ filter: "drop-shadow(0 8px 24px rgba(80,200,240,0.5)) drop-shadow(0 2px 8px rgba(255,255,255,0.6))" }}
              />
            </div>
          </div>

          <h2 className="text-3xl font-black tracking-tight md:text-4xl text-ocean relative z-10">
            Pronto para criar sua página?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted relative z-10">
            Junte-se a milhares de pessoas que já estão surfando a onda dos links personalizados.
          </p>
          <div className="mt-8 flex justify-center relative z-10">
            {isLoggedIn ? (
              <a href="/dashboard" className="glass-button-green px-8 py-3 text-base">
                <ArrowRight size={19} /> Acessar Dashboard
              </a>
            ) : (
              <a href="/register" className="glass-button-green px-8 py-3 text-base">
                <Sparkles size={19} /> Começar agora &mdash; grátis
              </a>
            )}
          </div>
          <p className="mt-4 text-xs text-muted/60 relative z-10">
            Sem cartão de crédito · 2 minutos · Cancele quando quiser
          </p>
        </div>
      </MotionReveal>
    </section>
  );
}
