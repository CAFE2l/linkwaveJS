import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "LinkWave | Sua onda de links pessoais",
    template: "%s | LinkWave",
  },
  description:
    "Crie uma página pública, bonita e mensurável para reunir todos os seus links.",
  openGraph: {
    title: "LinkWave",
    description: "Uma página única e compartilhável com todos os seus links.",
    url: "/",
    siteName: "LinkWave",
    images: [{ url: "/brand/banner.png", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkWave",
    description: "Sua onda de links pessoais.",
    images: ["/brand/banner.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable} ${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Script
          src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics-compat.js"
          strategy="lazyOnload"
        />
        <Script
          id="firebase-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `if(typeof firebase !== "undefined"){firebase.initializeApp({apiKey:"AIzaSyAnLjNIr5KQ42kZNOKzMG3vEPlJd4_ik-U",authDomain:"linkwave-5bfb1.firebaseapp.com",projectId:"linkwave-5bfb1",storageBucket:"linkwave-5bfb1.firebasestorage.app",messagingSenderId:"462579547054",appId:"1:462579547054:web:b0c9034f0f6d64021ea63f",measurementId:"G-JS525M5ZZK"});firebase.analytics();}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
