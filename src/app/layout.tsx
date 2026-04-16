import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
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
    <html lang="en" className={`${fredoka.variable} ${quicksand.variable}`}>
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.transparenttextures.com" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
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
