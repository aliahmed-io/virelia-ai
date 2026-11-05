"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, CreditCard, ShieldCheck, User as UserIcon } from "lucide-react";
import type { SessionPayload } from "@/lib/auth";

interface MobileBottomNavProps {
  locale: string;
  user: SessionPayload | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ locale, user }) => {
  const pathname = usePathname();
  const isAr = locale === "ar";

  const tabs = [
    {
      href: `/${locale}`,
      label: isAr ? "الرئيسية" : "Home",
      icon: Home,
      isActive: pathname === `/${locale}`,
    },
    {
      href: `/${locale}/directory`,
      label: isAr ? "الدليل" : "Directory",
      icon: Building2,
      isActive: pathname?.startsWith(`/${locale}/directory`) || pathname?.startsWith(`/${locale}/providers`),
    },
    {
      href: `/${locale}/portal`,
      label: isAr ? "كارتي" : "My Card",
      icon: CreditCard,
      isActive: pathname?.startsWith(`/${locale}/portal`),
    },
  ];

  if (user?.role === "ADMIN") {
    tabs.push({
      href: `/${locale}/admin`,
      label: isAr ? "الإدارة" : "Admin",
      icon: ShieldCheck,
      isActive: pathname?.startsWith(`/${locale}/admin`),
    });
  } else {
    tabs.push({
      href: user ? `/${locale}/portal` : `/${locale}/login`,
      label: user ? (isAr ? "حسابي" : "Account") : (isAr ? "دخول" : "Sign In"),
      icon: UserIcon,
      isActive: user ? false : pathname?.startsWith(`/${locale}/login`),
    });
  }

  return (
    <div className="fixed bottom-0 start-0 end-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-lg pb-safe md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <nav className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive;
          return (
            <Link
              key={tab.label}
              aria-current={active ? "page" : undefined}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                active ? "text-brand-teal-700 font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div
                className={`relative flex items-center justify-center rounded-xl p-1 transition-transform ${
                  active ? "scale-110 text-brand-teal-700" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
