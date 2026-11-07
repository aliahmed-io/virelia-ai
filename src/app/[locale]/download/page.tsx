"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Monitor,
  Smartphone,
  Apple,
  Download,
  CheckCircle2,
  Sparkles,
  Share,
  PlusSquare,
  ShieldCheck,
  Headphones,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { TECH_SUPPORT_CONTACTS } from "@/lib/constants";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function DownloadAppPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        isAr
          ? "لتثبيت البرنامج على الكمبيوتر: اضغط على أيقونة التثبيت (⊕ أو رمز الشاشة) الموجودة في شريط العنوان أعلى المتصفح، أو اختر من قائمة المتصفح: 'تثبيت تطبيق صحة الأسرة'."
          : "To install on Desktop: Click the Install icon (⊕ or screen icon) in your browser address bar, or choose 'Install Family Health App' from the menu."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 pt-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href={`/${locale}`} className="hover:text-brand-teal-600 transition-colors">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-brand-teal-700">{isAr ? "تحميل وتثبيت البرنامج" : "Download & Install App"}</span>
        </div>

        {/* Hero Section */}
        <div className="rounded-3xl border border-brand-teal-500/20 bg-gradient-to-br from-brand-teal-800 to-slate-900 p-8 sm:p-12 text-white shadow-xl shadow-brand-teal-950/20 relative overflow-hidden">
          <div className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl text-start space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              {isAr ? "تطبيق أصلي خفيف PWA وسريع" : "Lightweight & Ultra-Fast PWA App"}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isAr
                ? "تثبيت برنامج صحة الأسرة (F.H) على الكمبيوتر والموبايل"
                : "Install Family Health App on Desktop & Mobile"}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {isAr
                ? "احصل على وصول فوري ومباشر لكارت العائلة وشبكة الخصومات الطبية بدون الحاجة للمتصفح. يعمل كبرنامج منفصل على سطح المكتب وكتطبيق سريع على هواتف الأندرويد والآيفون."
                : "Access your family card and instant discounts without a browser. Runs as a standalone desktop software on Windows/Mac and a high-speed app on mobile."}
            </p>

            {isInstalled ? (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-2.5 text-sm font-bold text-emerald-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>{isAr ? "البرنامج مثبت بالفعل على هذا الجهاز!" : "App is already installed on this device!"}</span>
              </div>
            ) : (
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 active:scale-95 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>{isAr ? "تثبيت البرنامج بنقرة واحدة الآن" : "Install App in 1-Click"}</span>
                </button>

                <Link
                  href={`/${locale}/portal`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/20 px-5 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                >
                  <span>{isAr ? "فتح كارت العائلة الرقمي" : "Open Digital Card"}</span>
                  {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 3 Platforms Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* 1. Desktop Computer (Windows & Mac) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 text-start shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal-50 text-brand-teal-700 mb-5 border border-brand-teal-100">
              <Monitor className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {isAr ? "أجهزة الكمبيوتر واللابتوب" : "Desktop Computer (PC / Mac)"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {isAr
                ? "يعمل كبرنامج منفصل كامل على Windows و macOS بشريط عنوان خاص، مع أيقونة على سطح المكتب وشريط المهام."
                : "Runs as a standalone desktop window on Windows & macOS with dedicated taskbar and desktop launch icons."}
            </p>

            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{isAr ? "بدون استهلاك مساحة أو رامات" : "Zero storage bloat"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{isAr ? "تحديث تلقائي فوري للأسعار والخدمات" : "Real-time auto updates"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{isAr ? "فتح سريع من قائمة Start أو Launchpad" : "Instant launch from Start Menu"}</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal-600 py-2.5 text-xs font-bold text-white hover:bg-brand-teal-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isAr ? "تثبيت للكمبيوتر" : "Install for Desktop"}</span>
            </button>
          </div>

          {/* 2. Android Phone */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 text-start shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-5 border border-emerald-100">
              <Smartphone className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {isAr ? "هواتف أندرويد (Android)" : "Android Smartphones"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {isAr
                ? "تثبيت فوري بضغطة واحدة من المتصفح كـ PWA، مع دعم عرض الكارت والـ QR بدون الحاجة لاتصال بالإنترنت."
                : "1-Click instant install directly from mobile browser, enabling offline QR code access at clinic receptions."}
            </p>

            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{isAr ? "ظهور في شاشة التطبيقات الرئيسية" : "App icon on Home Screen"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{isAr ? "حجز مباشر للعيادات بضغطة زر" : "1-Tap direct WhatsApp booking"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{isAr ? "تخزين وإدارة المستندات الطبية" : "Upload medical scans & reports"}</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isAr ? "تثبيت للأندرويد" : "Install for Android"}</span>
            </button>
          </div>

          {/* 3. Apple iPhone (iOS) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 text-start shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 mb-5 border border-slate-200">
              <Apple className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {isAr ? "أجهزة آبل آيفون (iOS)" : "Apple iPhone (iOS)"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {isAr
                ? "خطوات سريعة لإضافة التطبيق في الشاشة الرئيسية لهواتف آيفون عبر متصفح Safari."
                : "Simple 3-step setup to place the Family Health icon directly on your iPhone home screen via Safari."}
            </p>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 space-y-2 text-xs text-slate-700 mb-6">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold">1</span>
                <span>{isAr ? "افتح الموقع في Safari" : "Open in Safari"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold">2</span>
                <span className="inline-flex items-center gap-1">
                  {isAr ? "اضغط على زر المشاركة" : "Tap Share"}
                  <Share className="h-3.5 w-3.5 text-brand-teal-600" />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold">3</span>
                <span className="inline-flex items-center gap-1">
                  {isAr ? "اختر 'إضافة إلى الصفحة الرئيسية'" : "Choose 'Add to Home Screen'"}
                  <PlusSquare className="h-3.5 w-3.5 text-brand-teal-600" />
                </span>
              </div>
            </div>

            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                {isAr ? "معتمد وموثوق على iOS" : "Verified & Safe on iOS"}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Support Box */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-start flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-100">
              <Headphones className="h-7 w-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {isAr ? "تحتاج مساعدة في التثبيت والتشغيل؟" : "Need Help Installing the App?"}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? "فريق الدعم الفني جاهز لمساعدتك خطوة بخطوة عبر الواتساب أو الهاتف"
                  : "Our technical team is ready to assist you via WhatsApp or direct phone call"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {TECH_SUPPORT_CONTACTS.map((c) => (
              <a
                key={c.phone}
                href={c.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
              >
                <span>{isAr ? c.labelAr : c.labelEn}:</span>
                <span className="font-mono text-emerald-700 dir-ltr">{c.display}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
