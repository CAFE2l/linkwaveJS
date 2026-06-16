import type React from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, LogIn, UserPlus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { MotionReveal } from "@/components/shared/motion-reveal";
import type { LandingStats } from "@/types/database";
import instagramIcon from "/public/imgs/icons/links/Instagram.png";
import youtubeIcon from "/public/imgs/icons/links/Youtube.png";
import tiktokIcon from "/public/imgs/icons/links/TikTok.png";
import facebookIcon from "/public/imgs/icons/links/Facebook.png";

const socialLinks = [
  { name: "Instagram", icon: instagramIcon, handle: "@usuario", url: "instagram.com", href: "https://instagram.com" },
  { name: "YouTube", icon: youtubeIcon, handle: "@usuario", url: "youtube.com", href: "https://youtube.com" },
  { name: "TikTok", icon: tiktokIcon, handle: "@usuario", url: "tiktok.com", href: "https://tiktok.com" },
  { name: "Facebook", icon: facebookIcon, handle: "/usuario", url: "facebook.com", href: "https://facebook.com" },
] as const;

export function HeroSection({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
  stats: LandingStats;
}) {
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-28 md:grid-cols-[1.05fr_0.95fr] md:pb-32 md:pt-36">
      <div className="aero-blob aero-blob-1 left-[3%] top-[10%]" />
      <div className="aero-blob aero-blob-2 right-[5%] top-[25%]" />
      <div className="aero-blob aero-blob-3 left-[35%] top-[50%]" />

      <MotionReveal>
        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/35 px-4 py-1.5 text-sm font-semibold text-brand backdrop-blur-xl dark:bg-[rgba(0,180,255,0.08)] dark:border-[rgba(0,180,255,0.2)]" style={{ border: "1.5px solid rgba(255,255,255,0.7)", boxShadow: "0 4px 14px rgba(42,168,224,0.15), inset 0 1px 0 rgba(255,255,255,0.8)" }}>
            <span className="h-2 w-2 rounded-full bg-accent shadow-sm animate-glow-pulse dark:bg-[#00ff88]" style={{ boxShadow: "0 0 8px rgba(40,176,96,0.5)" }} />
            LinkWave v1.0 &mdash; Crie sua onda
          </div>

          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Sua onda de<br />
            <span className="text-gradient-glow">links pessoais</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 md:text-xl dark:text-[#80d0ff]" style={{ color: "#1a6a9a" }}>
            Uma página única e compartilhável com todos os seus links. Simples de
            criar, impossível de ignorar.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {isLoggedIn ? (
              <ButtonLink href="/dashboard" size="lg" variant="accent">
                Acessar dashboard <ArrowRight size={19} />
              </ButtonLink>
            ) : (
              <>
                <a href="/register" className="aero-btn-green text-base px-7 py-3">
                  <UserPlus size={19} /> Pegar minha onda
                </a>
                <a href="/login" className="aero-btn-ghost text-base px-7 py-3">
                  <LogIn size={19} /> Já tenho conta
                </a>
              </>
            )}
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold dark:text-[#80d0ff]" style={{ color: "#1a6a9a" }}>
            <CheckCircle2 size={17} className="text-accent dark:text-[#00ff88]" />
            Gratuito &middot; Sem cartão de crédito
          </div>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.12} variant="right">
        <div className="relative animate-float">
          <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-brand/10 via-cyan/10 to-accent/5 blur-[80px] dark:from-[rgba(0,180,255,0.08)] dark:via-[rgba(80,0,200,0.05)] dark:to-[rgba(0,255,136,0.03)] animate-glow-pulse" />

          <div className="relative mx-auto w-[300px] md:w-[340px]">
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-b from-gray-800 to-gray-900 p-3 shadow-2xl dark:from-[#0a0a14] dark:to-[#000005]" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)" }}>
              <div className="relative mx-auto mb-2 h-5 w-28 rounded-full bg-black">
                <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800 border border-gray-700 dark:bg-[#1a1a2e] dark:border-[#2a2a4e]" />
              </div>

              <div className="phone-bg-screen relative overflow-hidden rounded-[2rem]" style={{ minHeight: "580px" }}>
                <div className="phone-screen-glow absolute inset-0 pointer-events-none" />

                <div className="relative flex items-center justify-between px-5 pt-5 pb-2">
                  <span className="phone-time text-xs font-bold">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="phone-battery h-2.5 w-4 rounded-sm border relative">
                      <div className="absolute inset-0.5 rounded-sm bg-accent dark:bg-[#00ff88]" style={{ width: "70%" }} />
                    </div>
                    <svg className="phone-wifi h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                  </div>
                </div>

                <div className="phone-bg-card relative mx-3 rounded-2xl p-4 text-center">
                  <div className="mx-auto mb-2 h-14 w-14 overflow-hidden rounded-full" style={{ border: "3px solid rgba(255,255,255,0.85)", boxShadow: "0 4px 16px rgba(80,180,220,0.3)" }}>
                    <Image src="/brand/icon.png" alt="" width={56} height={56} className="h-full w-full object-cover" />
                  </div>
                  <p className="phone-text-primary text-xs font-bold">@usuario</p>
                  <p className="phone-text-strong text-sm font-black">Minha onda</p>
                  <p className="phone-text-muted text-xs">Compartilhe seus links 🌊</p>

                  <div className="phone-follow-btn mx-auto mt-3 w-28 rounded-full py-1.5 text-xs font-bold text-white">
                    Seguir
                  </div>
                </div>

                <div className="relative mt-3 space-y-2 px-3 pb-4">
                  {socialLinks.map((item, i) => (
                    <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer"
                      className="phone-link-item group relative flex items-center gap-3 rounded-2xl p-3 transition-all duration-300 no-underline"
                      style={{ animation: `fade-in-up 0.5s ease-out ${i * 0.1}s both` }}
                    >
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent dark:from-[rgba(0,200,255,0.05)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <Image src={item.icon} alt="" className="relative z-10 h-8 w-8 shrink-0 rounded-xl object-contain" />
                      <div className="relative z-10 min-w-0 flex-1">
                        <div className="phone-link-text text-sm font-bold">{item.name}</div>
                        <p className="phone-text-muted truncate text-xs">{item.url}</p>
                      </div>
                      <ArrowRight size={14} className="phone-arrow relative z-10 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="phone-shine-overlay pointer-events-none absolute inset-0 rounded-[3rem]" />
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}
