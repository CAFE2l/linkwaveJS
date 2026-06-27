"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

const items = [
  { q: "O que é o LinkWave?", a: "É uma plataforma que permite criar uma página única e compartilhável com todos os seus links. Ideal para perfis do Instagram, TikTok, cartões de visita digitais e muito mais." },
  { q: "É gratuito mesmo?", a: "Sim! O plano gratuito inclui tudo que você precisa para começar. Sem cartão de crédito, sem surpresas." },
  { q: "Posso personalizar a aparência?", a: "Com certeza. Você pode escolher cores, temas, fontes, posição do banner e muito mais. Sua página fica com a sua cara." },
  { q: "Funciona no celular?", a: "Sim! O LinkWave é 100% responsivo e otimizado para todos os dispositivos — celular, tablet e desktop." },
  { q: "Como compartilhar meus links?", a: "Você recebe um link único (suadominio.com/seuusername) para colocar na bio do Instagram, WhatsApp, email, cartão de visita ou onde quiser." },
  { q: "Meus dados estão seguros?", a: "Sim. Utilizamos Supabase como banco de dados, com autenticação segura e criptografia. Seus dados são seus." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-5 py-20 md:py-28" id="faq">
      <MotionReveal className="text-center">
        <span className="glass-tag">FAQ</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl text-ocean">
          Dúvidas frequentes
        </h2>
        <p className="mt-3 text-base text-muted max-w-md mx-auto">
          Tudo que você precisa saber antes de começar.
        </p>
      </MotionReveal>

      <div className="mt-12 space-y-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <MotionReveal key={i} delay={i * 0.04} variant="none">
              <div className="glass-card overflow-hidden transition-all duration-300">
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-bold text-ocean text-sm md:text-base">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-ocean-light transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className={`faq-answer ${isOpen ? "open" : ""}`}
                >
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
