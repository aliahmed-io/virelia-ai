"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  currentLocale: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLocale }) => {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = currentLocale === "ar" ? "en" : "ar";
    if (!pathname) {
      router.push(`/${nextLocale}`);
      return;
    }

    // Replace locale segment in current path
    const segments = pathname.split("/");
    if (segments.length > 1 && (segments[1] === "ar" || segments[1] === "en")) {
      segments[1] = nextLocale;
      router.push(segments.join("/") + window.location.search + window.location.hash);
    } else {
      router.push(`/${nextLocale}${pathname}${window.location.search}${window.location.hash}`);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-brand-teal-500 hover:text-brand-teal-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
      aria-label={currentLocale === "ar" ? "English" : "العربية"}
    >
      <Globe className="h-4 w-4 text-brand-teal-600" />
      <span>{currentLocale === "ar" ? "English" : "العربية"}</span>
    </button>
  );
};
