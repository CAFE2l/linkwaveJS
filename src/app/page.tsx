import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Navbar } from "@/components/landing/navbar";
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

  return (
    <ThemeProvider>
      <div className="min-h-screen landing-bg">
        <BlobBackground />
        <div className="relative z-10">
          <Navbar isLoggedIn={Boolean(user)} />
          <HeroSection isLoggedIn={Boolean(user)} stats={stats} />
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
          <CTASection isLoggedIn={Boolean(user)} />
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
