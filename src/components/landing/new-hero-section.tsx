"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MotionReveal } from "@/components/shared/motion-reveal";
import { ArrowRight, CheckCircle2, UserPlus } from "lucide-react";
import type { LandingStats } from "@/types/database";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")}M+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k+`;
  return `${n}+`;
}

export function NewHeroSection({
  isLoggedIn,
  stats,
}: {
  isLoggedIn: boolean;
  stats: LandingStats;
}) {
  const statEntries = [
    { label: "Usuários", value: formatNumber(stats.totalUsers) },
    { label: "Cliques", value: formatNumber(stats.totalClicks) },
    { label: "Satisfação", value: `${stats.satisfaction}%` },
    { label: "Personalizável", value: "100%" },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const tilt = tiltRef.current;
    if (!container || !tilt) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetX = (y - 0.5) * -14;
      targetY = (x - 0.5) * 14;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      tilt.style.transform = `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      rafId = requestAnimationFrame(animate);
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 px-5 overflow-hidden" id="hero">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-orb" style={{ width: "600px", height: "600px", background: "radial-gradient(circle, rgba(34,211,238,0.25), transparent 70%)", top: "5%", right: "10%" }} />
        <div className="hero-orb" style={{ width: "450px", height: "450px", background: "radial-gradient(circle, rgba(74,222,128,0.2), transparent 70%)", bottom: "10%", left: "5%" }} />
        <div className="hero-orb" style={{ width: "350px", height: "350px", background: "radial-gradient(circle, rgba(96,165,250,0.2), transparent 70%)", top: "40%", left: "50%" }} />
      </div>

      <div className="mx-auto max-w-6xl w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          <MotionReveal className="text-center lg:text-left">
            <span className="glass-tag">✦ LinkWave v2.0 — Sua identidade digital</span>
            <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] text-ocean">
              Sua onda de<br />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
                links pessoais
              </span>
            </h1>
            <p className="mt-5 text-lg md:text-xl leading-relaxed text-muted max-w-lg mx-auto lg:mx-0">
              Uma página única, compartilhável e personalizável com todos os seus links.
              Minimalista, elegante, em segundos.
            </p>
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
              {isLoggedIn ? (
                <a href="/dashboard" className="glass-button-green px-8 py-3 text-base">
                  <ArrowRight size={19} /> Acessar dashboard
                </a>
              ) : (
                <>
                  <a href="/register" className="glass-button-green px-8 py-3 text-base">
                    <UserPlus size={19} /> Criar minha página
                  </a>
                  <a href="/login" className="glass-button-outline px-7 py-3 text-base">
                    Já tenho conta <ArrowRight size={17} />
                  </a>
                </>
              )}
            </div>
            <p className="mt-4 text-sm text-muted/60 flex items-center justify-center lg:justify-start gap-1.5">
              <CheckCircle2 size={15} className="text-green-500 shrink-0" />
              Gratuito · Sem cartão de crédito · 2 minutos
            </p>
          </MotionReveal>

          <MotionReveal variant="scale" delay={0.2} className="flex justify-center lg:justify-end">
            <div className="phone-container" ref={containerRef}>
              <div className="phone-bg-glow" />
              <div className="phone-energy-ring" />
              <div className="phone-wave" />
              <div className="phone-wave wave-2" />
              <div className="phone-wave wave-3" />
              <div className="phone-tilt" ref={tiltRef}>
                <div className="phone-wrap" id="phoneWrap">
                  <div className="phone-light-sweep" />
                  <Image
                    src="/imgs/essentials/frame.png"
                    alt="Phone frame"
                    className="phone-frame"
                    width={500}
                    height={938}
                    priority
                  />
                  <div className="phone-screen">
                    <div className="relative w-11 h-11 mx-auto mb-2 z-[2]">
                      <div className="absolute inset-0 rounded-full ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-white/20 shadow-[0_0_10px_rgba(56,189,248,0.35)]" />
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <Image
                          src="/imgs/essentials/profile.jpg"
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          width={44}
                          height={44}
                        />
                      </div>
                    </div>
                    <p className="phone-name">itsluca.s</p>
                    <p className="phone-bio">criador digital</p>
                    <div className="phone-links">
                      {[
                        { label: "Instagram", color: "from-pink-400 to-purple-500" },
                        { label: "YouTube", color: "from-red-500 to-red-600" },
                        { label: "Meu Site", color: "from-blue-500 to-cyan-500" },
                        { label: "Portfólio", color: "from-green-400 to-emerald-500" },
                      ].map((l) => (
                        <div key={l.label} className="phone-link-item">
                          <div className="phone-link-dot" style={{ background: `linear-gradient(135deg, ${l.color.replace("from-", "").replace(" to-", ",")})` }} />
                          {l.label}
                        </div>
                      ))}
                    </div>
                    <div className="phone-badge">LinkWave — sua página de links</div>
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>

        <MotionReveal delay={0.4} className="mt-20">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {statEntries.map((s) => (
              <div key={s.label} className="glass-stat">
                <p className="text-2xl font-black text-ocean-light">{s.value}</p>
                <p className="mt-0.5 text-xs font-bold text-muted uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
