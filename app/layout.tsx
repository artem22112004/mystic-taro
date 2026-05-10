import type { Metadata, Viewport } from "next";
import { Cinzel, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0D0B1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mystic-taro.vercel.app"
  ),
  title: "Мистические расклады — AI Таро",
  description: "Персональные расклады таро с толкованием на русском языке. Карта дня, расклад Да/Нет, расклад на отношения.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Таро",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon-192",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "Мистические расклады — AI Таро",
    description: "Персональные расклады таро с толкованием на русском языке. Карта дня, да/нет, расклад на отношения.",
    siteName: "Мистические расклады",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Мистические расклады — AI Таро",
    description: "AI-таролог, который говорит прямо. Карта дня бесплатно.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${cinzel.variable} font-sans`}
    >
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
