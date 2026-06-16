import { ThemeProvider } from "@/components/landing/theme-provider";
import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Navbar } from "@/components/landing/navbar";
import { StatsSection } from "@/components/landing/stats-section";
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
      <main className="aero-shell relative min-h-screen overflow-hidden">
        <Navbar isLoggedIn={Boolean(user)} />
        <HeroSection isLoggedIn={Boolean(user)} stats={stats} />
        <StatsSection stats={stats} />
        <HowItWorksSection />
        <FeaturesSection />
        <CTASection isLoggedIn={Boolean(user)} totalUsers={stats.totalUsers} />
        <Footer />
      </main>
    </ThemeProvider>
  );
}
