import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import { LanguageProvider } from "../contexts/LanguageContext";
import { LayoutShell } from "../components/LayoutShell";
import { LanguageSync } from "../components/LanguageSync";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-fredoka",
  preload: true,
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-quicksand",
  preload: true,
});

export const metadata: Metadata = {
  title: "Selah Kids | Faith-based original music & Christian cartoons",
  description: "A faith-based platform featuring original worship music, Christian cartoons, and engaging activities for children and families.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${quicksand.variable}`} translate="no">
      <head>
        {/* Prevent Google Translate from auto-translating — site has built-in EN/ES toggle */}
        <meta name="google" content="notranslate" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.transparenttextures.com" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <LanguageSync />
          <LayoutShell>{children}</LayoutShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
