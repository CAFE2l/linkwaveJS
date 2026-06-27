"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MotionReveal } from "@/components/shared/motion-reveal";
import { ArrowRight, CheckCircle2, UserPlus } from "lucide-react";
import type { LandingStats } from "@/types/database";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
  return `${n}`;
}

const phoneLinks = [
  { name: "Instagram", icon: "/imgs/icons/links/Instagram.png" },
  { name: "YouTube", icon: "/imgs/icons/links/Youtube.png" },
  { name: "Meu Site", icon: "/imgs/icons/links/Google Chrome.png" },
  { name: "WhatsApp", icon: "/imgs/icons/links/Whatsapp.png" },
  { name: "Portfólio", icon: "/imgs/icons/links/Discord.png" },
];

const pinnedSocials = [
  { name: "Instagram", icon: "/imgs/icons/Instagram.png" },
  { name: "YouTube", icon: "/imgs/icons/Youtube.png" },
  { name: "TikTok", icon: "/imgs/icons/TikTok.png" },
  { name: "GitHub", icon: "/imgs/icons/github.png" },
  { name: "WhatsApp", icon: "/imgs/icons/Whatsapp.png" },
];

export function NewHeroSection({ isLoggedIn, stats }: { isLoggedIn: boolean; stats: LandingStats }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const tilt = tiltRef.current;
    if (!container || !tilt) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let rafId: number;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let isHovering = false, isLeaving = false;
    const MAX_TILT = 18;

    const applyTilt = () => {
      if (isLeaving) { rafId = 0; return; }
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      tilt.style.transform = `perspective(800px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale3d(1.02,1.02,1.02)`;
      if (Math.abs(currentX - targetX) > 0.01 || Math.abs(currentY - targetY) > 0.01 || isHovering) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        rafId = 0;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetY = (x - 0.5) * MAX_TILT * 1.4;
      targetX = (y - 0.5) * -MAX_TILT;
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    };

    const onMouseEnter = () => { isHovering = true; isLeaving = false; };
    const onMouseLeave = () => {
      isHovering = false; isLeaving = true;
      targetX = 0; targetY = 0;
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      tilt.style.transition = "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)";
      tilt.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      setTimeout(() => { tilt.style.transition = ""; isLeaving = false; }, 1000);
    };

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
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
                  <div className="phone-screen cosmic-page">
                    <div className="cosmic-banner">
                      <Image src="/imgs/banners/linkwave.png" alt="Banner" width={300} height={120} className="w-full h-full object-cover" />
                      <span />
                    </div>

                    <div className="cosmic-profile">
                      <Image src="/imgs/essentials/profile.jpg" alt="Avatar" width={56} height={56} />
                    </div>

                    <p className="cosmic-title">itsluca.s</p>
                    <p className="cosmic-bio">criador digital · compartilhando ideias e código</p>

                    <div className="cosmic-pinned">
                      {pinnedSocials.map((s) => (
                        <div key={s.name} className="cosmic-pinned-item">
                          <Image src={s.icon} alt={s.name} width={14} height={14} />
                        </div>
                      ))}
                    </div>

                    <div className="cosmic-links">
                      {phoneLinks.map((link) => (
                        <div key={link.name} className="cosmic-link">
                          <Image src={link.icon} alt="" width={18} height={18} />
                          <span>{link.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="cosmic-footer">LinkWave — sua página de links</div>
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>

        <MotionReveal delay={0.4} className="mt-20">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <div className="glass-stat">
              <p className="text-2xl font-black text-ocean-light">{formatNumber(stats.totalUsers)}</p>
              <p className="mt-0.5 text-xs font-bold text-muted uppercase tracking-wider">Usuários</p>
            </div>
            <div className="glass-stat">
              <p className="text-2xl font-black text-ocean-light">100%</p>
              <p className="mt-0.5 text-xs font-bold text-muted uppercase tracking-wider">Grátis</p>
            </div>
            <div className="glass-stat">
              <p className="text-2xl font-black text-ocean-light">100%</p>
              <p className="mt-0.5 text-xs font-bold text-muted uppercase tracking-wider">Personalizável</p>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
