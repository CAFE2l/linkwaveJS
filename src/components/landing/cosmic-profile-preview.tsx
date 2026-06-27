"use client";

import Image from "next/image";
import { Monitor, Smartphone } from "lucide-react";

interface LinkItem {
  title: string;
  icon: string;
}

const profileLinks: LinkItem[] = [
  { title: "Portfólio", icon: "/imgs/icons/links/Google Chrome.png" },
  { title: "Twitter", icon: "/imgs/icons/links/Twitter.png" },
  { title: "LinkedIn", icon: "/imgs/icons/links/LinkedIn.png" },
  { title: "GitHub", icon: "/imgs/icons/links/Google Chrome.png" },
  { title: "YouTube", icon: "/imgs/icons/links/Youtube.png" },
  { title: "Pinterest", icon: "/imgs/icons/links/Pinterest.png" },
  { title: "Telegram", icon: "/imgs/icons/links/Telegram.png" },
  { title: "Discord", icon: "/imgs/icons/links/Discord.png" },
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
          width={600}
          height={200}
          className="w-full h-full object-cover"
        />
        <div className="banner-overlay" />
      </div>

      <div className="cosmic-avatar-ring">
        <Image
          src="/imgs/essentials/profile.jpg"
          alt="Avatar"
          width={80}
          height={80}
          className="cosmic-avatar-img"
        />
      </div>

      <h3 className="cosmic-preview-name">Gabriel Felipe</h3>
      <p className="cosmic-preview-bio">Full-Stack Developer · Digital Influencer · Web 3 Enthusiast</p>

      <div className="cosmic-preview-links">
        {profileLinks.map((link) => (
          <div key={link.title} className="quantum-link-item">
            <Image src={link.icon} alt="" width={20} height={20} className="link-icon" />
            <span>{link.title}</span>
          </div>
        ))}
      </div>

      <div className="cosmic-preview-footer">
        <span className="text-blue-300 mr-1">✦</span>
        LinkWave — sua página de links
      </div>
    </div>
  );
}

function CosmicProfileMobile() {
  const mobileLinks = profileLinks.slice(0, 6);

  return (
    <div className="cosmic-preview-mobile">
      <div className="cosmic-preview-nebula" />
      <div className="cosmic-preview-stars" />

      <div className="cosmic-mobile-banner">
        <Image
          src="/imgs/banners/linkwave.png"
          alt="Banner"
          width={280}
          height={100}
          className="w-full h-full object-cover"
        />
        <div className="banner-overlay" />
      </div>

      <div className="cosmic-mobile-avatar-ring">
        <Image
          src="/imgs/essentials/profile.jpg"
          alt="Avatar"
          width={44}
          height={44}
          className="cosmic-avatar-img"
        />
      </div>

      <div className="cosmic-mobile-name">Gabriel Felipe</div>
      <div className="cosmic-mobile-bio">Full-Stack Developer</div>

      <div className="cosmic-mobile-links">
        {mobileLinks.map((link) => (
          <div key={link.title} className="quantum-link-item-mobile">
            <Image src={link.icon} alt="" width={14} height={14} className="link-icon" />
            <span>{link.title}</span>
            <span className="ml-auto opacity-30 text-[9px]">›</span>
          </div>
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
            <div className="cosmic-preview-wrapper">
              <CosmicProfileDesktop />
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
            <div className="flex justify-center">
              <div className="phone-container-sm">
                <div className="phone-glow-sm" />
                <div className="phone-tilt-sm">
                  <div className="phone-wrap-sm">
                    <div className="phone-light-sweep-sm" />
                    <Image
                      src="/imgs/essentials/frame.png"
                      alt="Phone frame"
                      className="phone-frame-sm"
                      width={500}
                      height={938}
                    />
                    <div className="phone-screen-sm">
                      <CosmicProfileMobile />
                    </div>
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
