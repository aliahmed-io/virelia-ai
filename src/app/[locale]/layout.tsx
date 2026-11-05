import React from "react";
import type { Metadata, Viewport } from "next";
import { Cairo, Plus_Jakarta_Sans, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";

import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
import { getCurrentUser } from "@/lib/auth";

export const viewport: Viewport = {
  themeColor: "#156570",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "صحة الأسرة | Family Health (F.H)",
  description: "شبكة الخصومات الطبية المعتمدة في مصر - رعاية شاملة لكل جيل",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "صحة الأسرة | Family Health",
  },
  formatDetection: {
    telephone: false,
  },
};

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  const messages = await getMessages();
  const currentUser = await getCurrentUser();
  const isAr = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isAr ? "rtl" : "ltr"}
      className={`${cairo.variable} ${tajawal.variable} ${plusJakartaSans.variable}`}
    >
      <body className={`min-h-screen flex flex-col ${isAr ? "font-cairo" : "font-sans"}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ServiceWorkerRegister />
          <Navbar locale={locale} user={currentUser} />
          <main className="app-content flex-1">{children}</main>

          <MobileBottomNav locale={locale} user={currentUser} />
          <PwaInstallPrompt locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
