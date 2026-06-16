import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Navbar } from "@/components/landing/navbar";
import { StatsSection } from "@/components/landing/stats-section";
import { getLandingStats } from "@/lib/actions/stats";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const [stats, supabase] = await Promise.all([getLandingStats(), createClient()]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="aurora-shell relative min-h-screen overflow-hidden">
      <div className="mesh-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-[-10rem] top-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-56 h-96 w-96 rounded-full bg-brand/25 blur-3xl" />
      <Navbar isLoggedIn={Boolean(user)} />
      <HeroSection isLoggedIn={Boolean(user)} stats={stats} />
      <StatsSection stats={stats} />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection isLoggedIn={Boolean(user)} totalUsers={stats.totalUsers} />
      <Footer />
    </main>
  );
}
