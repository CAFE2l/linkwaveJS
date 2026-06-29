"use client";

import Image from "next/image";
import { Monitor, Smartphone } from "lucide-react";

interface LinkItem {
  title: string;
  icon: string;
  url: string;
}

const profileLinks: LinkItem[] = [
  { title: "Portfólio", icon: "/imgs/icons/Google Chrome.png", url: "https://main-portfolio-sigma-flame.vercel.app/" },
  { title: "Twitter", icon: "/imgs/icons/Twitter.png", url: "https://x.com/ct_cafe87877" },
  { title: "LinkedIn", icon: "/imgs/icons/LinkedIn.png", url: "https://www.linkedin.com/in/gabriel-felipe-sabino-de-souza-ab05a630a/" },
  { title: "GitHub", icon: "/imgs/icons/github.png", url: "https://github.com/CAFE2l" },
  { title: "YouTube", icon: "/imgs/icons/Youtube.png", url: "https://www.youtube.com/@CAFE_ct" },
  { title: "Pinterest", icon: "/imgs/icons/Pinterest.png", url: "https://br.pinterest.com/abbass11king11duolingo/" },
  { title: "Telegram", icon: "/imgs/icons/Telegram.png", url: "https://t.me/cafect2l" },
  { title: "Discord", icon: "/imgs/icons/Discord.png", url: "https://discord.com/invite/gW2tShPFxf" },
];

const pinnedSocials = [
  { name: "Instagram", icon: "/imgs/icons/Instagram.png" },
  { name: "YouTube", icon: "/imgs/icons/Youtube.png" },
  { name: "TikTok", icon: "/imgs/icons/TikTok.png" },
  { name: "GitHub", icon: "/imgs/icons/github.png" },
  { name: "WhatsApp", icon: "/imgs/icons/Whatsapp.png" },
];

function CosmicProfileDesktop() {
  return (
    <div className="cosmic-preview-desktop">
      <div className="cosmic-preview-nebula" />
      <div className="cosmic-preview-stars" />

      <div className="dimensional-banner">
        <Image
          src="/imgs/banners/linkwave.png"
          alt="Banner"
          width={315}
          height={45}
          className="w-full h-full object-cover"
        />
        <div className="banner-overlay" />
      </div>

      <div className="cosmic-avatar-border">
        <Image
          src="/imgs/essentials/profile.jpg"
          alt="Avatar"
          width={36}
          height={36}
          className="cosmic-avatar-img"
        />
      </div>

      <h3 className="cosmic-preview-name">Gabriel Felipe</h3>
      <p className="cosmic-preview-bio">Full-Stack Developer · Digital Influencer</p>

      <div className="cosmic-preview-pinned">
        {pinnedSocials.map((s) => (
          <div key={s.name} className="cosmic-preview-pinned-item">
            <Image src={s.icon} alt={s.name} width={12} height={12} />
          </div>
        ))}
      </div>

      <div className="cosmic-preview-links">
        {profileLinks.slice(0, 3).map((link) => (
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="quantum-link-item"
          >
            <Image src={link.icon} alt="" width={14} height={14} className="link-icon" />
            <span>{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function CosmicProfileMobile() {
  return (
    <div className="cosmic-preview-mobile">
      <div className="cosmic-preview-nebula" />
      <div className="cosmic-preview-stars" />

      <div className="cosmic-mobile-banner">
        <Image
          src="/imgs/banners/linkwave.png"
          alt="Banner"
          width={165}
          height={48}
          className="w-full h-full object-cover"
        />
        <div className="banner-overlay" />
      </div>

      <div className="cosmic-mobile-avatar-border">
        <Image
          src="/imgs/essentials/profile.jpg"
          alt="Avatar"
          width={30}
          height={30}
          className="cosmic-avatar-img"
        />
      </div>

      <div className="cosmic-mobile-name">Gabriel Felipe</div>
      <div className="cosmic-mobile-bio">Full-Stack Developer</div>

      <div className="cosmic-mobile-pinned">
        {pinnedSocials.map((s) => (
          <div key={s.name} className="cosmic-mobile-pinned-item">
            <Image src={s.icon} alt={s.name} width={10} height={10} />
          </div>
        ))}
      </div>

      <div className="cosmic-mobile-links">
        {profileLinks.slice(0, 5).map((link) => (
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="quantum-link-item-mobile"
          >
            <Image src={link.icon} alt="" width={12} height={12} className="link-icon" />
            <span>{link.title}</span>
          </a>
        ))}
      </div>

      <div className="cosmic-mobile-footer">✦ LinkWave</div>
    </div>
  );
}

export function Showcase() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28" id="showcase">
      <div className="text-center mb-14">
        <span className="glass-tag">Preview</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl text-ocean">
          Veja como sua página fica
        </h2>
        <p className="mt-3 text-base text-muted max-w-md mx-auto">
          Uma experiência premium em qualquer tela.
        </p>
      </div>

      <div className="grid md:grid-cols-7 gap-8 items-start">
        {/* Desktop Preview */}
        <div className="md:col-span-4">
          <div className="glass-card-strong p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Monitor size={15} className="text-ocean-light" />
              <span className="text-xs font-bold text-ocean-light uppercase tracking-wider">Desktop</span>
            </div>
            <div className="flex justify-center py-4">
              <div className="monitor-container">
                <div className="monitor-glow-bg" />
                <div className="monitor-tilt">
                  <div className="monitor-body">
                    <div className="monitor-screen">
                      <CosmicProfileDesktop />
                    </div>
                    <Image
                      src="/imgs/essentials/monitor.png"
                      alt="Monitor"
                      width={370}
                      height={310}
                      className="monitor-frame"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview */}
        <div className="md:col-span-3 flex justify-center md:justify-start">
          <div className="glass-card-strong p-4 md:p-5 w-full">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone size={15} className="text-ocean-light" />
              <span className="text-xs font-bold text-ocean-light uppercase tracking-wider">Mobile</span>
            </div>
            <div className="flex justify-center py-4">
              <div className="phone-container-sm">
                <div className="phone-glow-bg-sm" />
                <div className="phone-tilt-sm">
                  <div className="phone-body-sm">
                    <div className="phone-screen-sm">
                      <CosmicProfileMobile />
                    </div>
                    <Image
                      src="/imgs/essentials/frame.png"
                      alt="Phone"
                      width={231}
                      height={496}
                      className="phone-frame-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
