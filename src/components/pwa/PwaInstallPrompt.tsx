"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PwaInstallPromptProps {
  locale: string;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ locale }) => {
  const isAr = locale === "ar";
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    // Check if user dismissed prompt recently
    const dismissedAt = localStorage.getItem("fh_pwa_dismissed");
    if (dismissedAt && Date.now() - Number(dismissedAt) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If on iOS, show after 3 seconds
    if (isIosDevice) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("fh_pwa_dismissed", Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 start-4 end-4 md:start-auto md:end-6 z-50 max-w-sm transition-all duration-300">
      <div className="rounded-2xl border border-brand-teal-500/30 bg-white/95 p-4 shadow-xl shadow-brand-teal-950/15 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal-600 to-brand-teal-800 text-white shadow-md shadow-brand-teal-900/20">
            <Smartphone className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1 text-start">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                {isAr ? "تطبيق صحة الأسرة (F.H)" : "Family Health App (F.H)"}
              </h4>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-0.5 text-xs text-slate-600 leading-snug">
              {isAr
                ? "ثبّت التطبيق على شاشتك الرئيسية للوصول السريع لبطاقتك والدليل الطبي."
                : "Install app on your home screen for quick access to your card and directory."}
            </p>

            {showIosGuide && (
              <div className="mt-2.5 rounded-lg bg-slate-100 p-2 text-[11px] text-slate-700 space-y-1 border border-slate-200">
                <p className="font-bold flex items-center gap-1 text-brand-teal-700">
                  <Share className="h-3 w-3" />
                  {isAr ? "طريقة التثبيت على iPhone:" : "How to install on iOS:"}
                </p>
                <ol className="list-decimal ps-4 space-y-0.5 text-[10px] text-slate-600">
                  <li>{isAr ? "اضغط على زر المشاركة أسفل Safari (⎋)" : "Tap the Share button below in Safari (⎋)"}</li>
                  <li>{isAr ? "اختر 'إضافة إلى الشاشة الرئيسية'" : "Select 'Add to Home Screen'"}</li>
                </ol>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-teal-600 to-brand-teal-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-brand-teal-700/25 hover:from-brand-teal-700 hover:to-brand-teal-800 transition-all active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isAr ? "تثبيت التطبيق الآن" : "Install App Now"}</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                {isAr ? "لاحقاً" : "Later"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
