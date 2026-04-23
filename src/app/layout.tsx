import type { Metadata } from "next";
import localFont from "next/font/local";
import { LanguageProvider } from "../contexts/LanguageContext";
import { LanguageSync } from "../components/LanguageSync";
import "./globals.css";

// Self-hosted fonts (Fredoka + Quicksand from Google Fonts, committed under
// public/fonts/). Using next/font/local instead of next/font/google so
// production builds don't depend on outbound access to fonts.gstatic.com —
// that fetch was flaky on our build box and would intermittently fail.
const fredoka = localFont({
  src: [
    { path: "../../public/fonts/fredoka/fredoka-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/fredoka/fredoka-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/fredoka/fredoka-600.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/fredoka/fredoka-700.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-fredoka",
  preload: true,
});

const quicksand = localFont({
  src: [
    { path: "../../public/fonts/quicksand/quicksand-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/quicksand/quicksand-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/quicksand/quicksand-600.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/quicksand/quicksand-700.ttf", weight: "700", style: "normal" },
  ],
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
    <html
      lang="en"
      className={`${fredoka.variable} ${quicksand.variable}`}
      translate="no"
      suppressHydrationWarning
    >
      <head>
        {/* Prevent Google Translate from auto-translating — site has built-in EN/ES toggle */}
        <meta name="google" content="notranslate" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.transparenttextures.com" />
        {/*
          Time-of-day mood — set BEFORE React hydrates so the first paint shows the
          correct palette. Without this, SSR has no timezone and the page would
          hydrate-flip from 'noon' (default) to the visitor's real mood.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var h=new Date().getHours();var m=(h>=5&&h<10)?'dawn':(h>=10&&h<16)?'noon':(h>=16&&h<19)?'golden':'dusk';document.documentElement.classList.add('mood-'+m);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        {/*
          Root is shared by /[locale]/* (public) and /admin/* (admin). The
          public locale layout mounts WorldProvider + Navbar + Footer + data
          fetch; the admin layout owns its own sidebar/header. Root stays
          lean so admin doesn't pay for public chrome on every page load.
        */}
        <LanguageProvider>
          <LanguageSync />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
