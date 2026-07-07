import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { getCachedConfig } from "@/lib/cached-config";
import TrackingScripts from "@/components/TrackingScripts";
import "./globals.css";

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
      <body>
        <style>{`:root{--brand-primary:${primaryColor};--brand-secondary:${secondaryColor};--brand-accent:${accentColor};}`}</style>
        {children}
        <TrackingScripts tracking={config.tracking} />
      </body>
    </html>
  );
}
