"use client";

import { AtSign, Link2, UserRoundPlus } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

const steps = [
  { number: "1", title: "Crie sua conta", description: "Cadastre-se com email e senha em segundos. Sem compromisso, sem cartão.", icon: UserRoundPlus },
  { number: "2", title: "Escolha seu username", description: "Um link único e memorável — suadominio.com/voce.", icon: AtSign },
  { number: "3", title: "Adicione seus links", description: "Instagram, YouTube, site, portfólio — tudo em um lugar só.", icon: Link2 },
];

export function NewHowItWorksSection() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 md:py-28" id="como-funciona">
      <MotionReveal className="text-center">
        <span className="glass-tag">Como funciona</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl text-ocean">
          3 passos para surfar
        </h2>
        <p className="mt-3 text-base text-muted max-w-md mx-auto">
          Do zero até sua página pronta em menos de 2 minutos.
        </p>
      </MotionReveal>

      <div className="relative mt-14 grid gap-8 md:grid-cols-3">
        <div className="absolute top-12 left-[16%] right-[16%] h-0.5 hidden md:block bg-gradient-to-r from-cyan-300/40 via-blue-300/40 to-green-300/40" />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <MotionReveal key={step.title} delay={index * 0.12} className="relative">
              <div className="glass-card p-8 text-center group hover:scale-[1.02] transition-transform duration-300">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full text-base font-black text-white relative z-10"
                  style={{
                    background: "linear-gradient(180deg, #5bc8f5, #2aa8e0)",
                    border: "2px solid rgba(255,255,255,0.7)",
                    boxShadow: "0 4px 16px rgba(42,168,224,0.4), inset 0 1px 0 rgba(255,255,255,0.6)",
                  }}
                >
                  {step.number}
                </div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px]"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(210,240,255,0.7))",
                    border: "1.5px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 4px 12px rgba(80,180,220,0.2), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                  <Icon size={22} style={{ color: "#2a8abf" }} />
                </div>
                <h3 className="text-lg font-black text-ocean">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
