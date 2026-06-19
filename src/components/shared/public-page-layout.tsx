import { ReactNode } from "react";
import { ThemeProvider } from "@/components/landing/theme-provider";
import { BlobBackground } from "@/components/landing/blob-background";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export function PublicPageLayout({
  children,
  isLoggedIn,
}: {
  children: ReactNode;
  isLoggedIn: boolean;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen landing-bg">
        <BlobBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar isLoggedIn={isLoggedIn} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
