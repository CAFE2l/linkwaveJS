import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Navbar } from "@/components/landing/navbar";

import { NewNavbar } from "@/components/landing/new-navbar";
import { NewHeroSection } from "@/components/landing/new-hero-section";
import { NewHowItWorksSection } from "@/components/landing/new-how-it-works-section";
import { NewFeaturesSection } from "@/components/landing/new-features-section";
import { NewCTASection } from "@/components/landing/new-cta-section";
import { NewFooter } from "@/components/landing/new-footer";
import { Showcase } from "@/components/landing/cosmic-profile-preview";

import { FAQ } from "@/components/landing/faq-terminal";

import { BlobBackground } from "@/components/landing/blob-background";
import { ThemeProvider } from "@/components/landing/theme-provider";
import { getLandingStats } from "@/lib/actions/stats";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [stats, supabase] = await Promise.all([getLandingStats(), createClient()]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = Boolean(user);

  if (isLoggedIn) {
    return (
      <ThemeProvider>
        <div className="min-h-screen landing-bg">
          <BlobBackground />
          <div className="relative z-10">
            <Navbar isLoggedIn={isLoggedIn} />
            <HeroSection isLoggedIn={isLoggedIn} stats={stats} />
            <div className="mx-auto max-w-5xl px-5">
              <div className="glass-divider" />
            </div>
            <HowItWorksSection />
            <div className="mx-auto max-w-5xl px-5">
              <div className="glass-divider" />
            </div>
            <FeaturesSection />
            <div className="mx-auto max-w-5xl px-5">
              <div className="glass-divider" />
            </div>
            <CTASection isLoggedIn={isLoggedIn} />
            <Footer isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen landing-bg">
        <BlobBackground />
        <div className="relative z-10">
          <NewNavbar isLoggedIn={isLoggedIn} />
          <NewHeroSection isLoggedIn={isLoggedIn} stats={stats} />
          <div className="mx-auto max-w-5xl px-5">
            <div className="glass-divider" />
          </div>
          <NewHowItWorksSection />
          <div className="mx-auto max-w-5xl px-5">
            <div className="glass-divider" />
          </div>
          <NewFeaturesSection />
          <div className="mx-auto max-w-5xl px-5">
            <div className="glass-divider" />
          </div>
          <Showcase />
          <div className="mx-auto max-w-5xl px-5">
            <div className="glass-divider" />
          </div>

          <FAQ />
          <div className="mx-auto max-w-5xl px-5">
            <div className="glass-divider" />
          </div>
          <NewCTASection isLoggedIn={isLoggedIn} />
          <NewFooter />
        </div>
      </div>
    </ThemeProvider>
  );
}
