"use client";

import { MotionReveal } from "@/components/shared/motion-reveal";
import { ArrowRight, CheckCircle2, UserPlus } from "lucide-react";
import type { LandingStats } from "@/types/database";
import Image from "next/image";

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k+`;
  return `${n}+`;
}

export function HeroSection({
  isLoggedIn,
  stats,
}: {
  isLoggedIn: boolean;
  stats: LandingStats;
}) {
  return (
    <section className="relative px-5 pb-24 pt-8 md:pb-32 md:pt-12">
      <MotionReveal>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6">
            <span className="glass-tag">✦ LinkWave v1.0 — Crie sua onda</span>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="animate-logo-float">
              <Image
                src="/brand/icon.png"
                alt="LinkWave"
                width={112}
                height={112}
                className="h-28 w-28 md:h-36 md:w-36"
                style={{ filter: "drop-shadow(0 8px 24px rgba(80,200,240,0.5)) drop-shadow(0 2px 8px rgba(255,255,255,0.6))" }}
              />
            </div>
          </div>

          <h1
            className="text-balance text-5xl font-black leading-tight md:text-7xl text-ocean"
            style={{ textShadow: "0 2px 0 rgba(255,255,255,0.88)" }}
          >
            Sua onda de<br />
            <span
              style={{
                background: "linear-gradient(135deg, #2aa8e0, #28b060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              links pessoais
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed md:text-xl text-muted">
            Uma página única e compartilhável com todos os seus links. Simples de
            criar, impossível de ignorar.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {isLoggedIn ? (
              <a href="/dashboard" className="glass-button-green px-8 py-3">
                <ArrowRight size={19} /> Acessar dashboard
              </a>
            ) : (
              <>
                <a href="/register" className="glass-button-green px-8 py-3">
                  <UserPlus size={19} /> Pegar minha onda
                </a>
                <a href="/login" className="glass-button-outline px-7 py-3">
                  Já tenho conta <ArrowRight size={17} />
                </a>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-muted">
            <CheckCircle2 size={15} className="mr-1 inline" style={{ color: "#28b060" }} />
            Gratuito · Sem cartão de crédito
          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {[
              { label: "Usuários", value: formatNumber(stats.totalUsers) },
              { label: "Cliques", value: formatNumber(stats.totalClicks) },
              { label: "Personalizável", value: "100%" },
            ].map((s) => (
              <div key={s.label} className="glass-stat">
                <p className="text-2xl font-black text-ocean-light">{s.value}</p>
                <p className="mt-1 text-xs font-bold text-muted uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}
