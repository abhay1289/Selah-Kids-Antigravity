import type { Metadata } from "next";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Selah Kids | Faith-based original music & Bible stories",
  description: "A faith-based platform featuring original music, Bible songs, and engaging activities for children and families.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for faster Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.transparenttextures.com" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <Script
            src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs"
            type="module"
            strategy="lazyOnload"
          />
          <div className="min-h-screen overflow-x-hidden selection:bg-selah-orange selection:text-white bg-selah-bg">
            <Navbar />
            <main>{children}</main>
            <div className="h-px w-full bg-selah-dark/5" />
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
