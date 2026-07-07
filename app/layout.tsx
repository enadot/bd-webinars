import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { getCachedConfig } from "@/lib/cached-config";
import TrackingScripts from "@/components/TrackingScripts";
import "./globals.css";

// Heebo carries Hebrew glyphs (Google Sans is Latin-only); it's the fallback
// face in the stack so Hebrew renders in a proper heavy sans at weight 900.
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heebo",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCachedConfig();
  return {
    title: config.general.title,
    description: config.general.subtitle,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getCachedConfig();
  const { primaryColor, secondaryColor, accentColor } = config.design;
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* primaryColor → lime CTA, secondaryColor → sage canvas, accentColor → ink */}
        <style>{`:root{--brand-primary:${primaryColor};--brand-canvas-soft:${secondaryColor};--brand-ink:${accentColor};}`}</style>
        {children}
        <TrackingScripts tracking={config.tracking} />
      </body>
    </html>
  );
}
