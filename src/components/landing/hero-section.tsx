import type React from "react";
import { CheckCircle2, UserPlus, ArrowRight } from "lucide-react";
import type { LandingStats } from "@/types/database";
import { MotionReveal } from "@/components/shared/motion-reveal";
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
    <section className="relative px-4 pb-20 pt-24 md:pb-28 md:pt-32">
      <div className="hero-deco aero-blob aero-blob-1 left-[-150px] top-[-100px]" />
      <div className="hero-deco aero-blob aero-blob-2 bottom-[-100px] right-[-100px]" />
      <div className="hero-deco aero-blob aero-blob-3 left-1/2 top-2/4 -translate-x-1/2 -translate-y-1/2" />

      <MotionReveal>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-5">
            <span className="aero-tag">✦ LinkWave v1.0 &mdash; Crie sua onda</span>
          </div>

          <div className="mb-8 flex justify-center">
            <Image
              src="/brand/icon.png"
              alt="LinkWave"
              width={112}
              height={112}
              className="logo-hero h-28 w-28 md:h-36 md:w-36"
            />
          </div>

          <h1 className="text-balance text-5xl font-black leading-tight tracking-tight md:text-7xl hero-title-shadow">
            Sua onda de<br />
            <span className="text-gradient-glow">links pessoais</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed md:text-xl" style={{ color: "rgba(30,80,120,0.55)" }}>
            Uma página única e compartilhável com todos os seus links. Simples de
            criar, impossível de ignorar.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {isLoggedIn ? (
              <a href="/dashboard" className="btn-cta">
                <ArrowRight size={19} /> Acessar dashboard
              </a>
            ) : (
              <>
                <a href="/register" className="btn-cta">
                  <UserPlus size={19} /> Pegar minha onda
                </a>
                <a href="/login" className="btn-outline">
                  Já tenho conta <ArrowRight size={17} />
                </a>
              </>
            )}
          </div>

          <p className="mt-6 text-sm" style={{ color: "rgba(30,80,120,0.55)" }}>
            <CheckCircle2 size={15} className="mr-1 inline" style={{ color: "#28b060" }} />
            Gratuito &middot; Sem cartão de crédito
          </p>

          <div className="mt-16 flex flex-wrap justify-center gap-5">
            <div className="stat-card">
              <p className="text-2xl font-black" style={{ color: "#2a8abf" }}>{formatNumber(stats.totalUsers)}</p>
              <p className="mt-1 text-sm" style={{ color: "rgba(30,80,120,0.55)" }}>Usuários</p>
            </div>
            <div className="stat-card">
              <p className="text-2xl font-black" style={{ color: "#2a8abf" }}>{formatNumber(stats.totalClicks)}</p>
              <p className="mt-1 text-sm" style={{ color: "rgba(30,80,120,0.55)" }}>Cliques</p>
            </div>
            <div className="stat-card">
              <p className="text-2xl font-black" style={{ color: "#2a8abf" }}>{stats.satisfaction}%</p>
              <p className="mt-1 text-sm" style={{ color: "rgba(30,80,120,0.55)" }}>Satisfação</p>
            </div>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}
