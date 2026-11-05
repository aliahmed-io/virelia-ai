"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../brand/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Menu,
  X,
  CreditCard,
  Building2,
  Home,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  QrCode,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import type { SessionPayload } from "@/lib/auth";

interface NavbarProps {
  locale: string;
  user: SessionPayload | null;
}

export const Navbar: React.FC<NavbarProps> = ({ locale, user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAr = locale === "ar";

  const navLinks = [
    {
      href: `/${locale}`,
      label: isAr ? "الرئيسية" : "Home",
      icon: Home,
    },
    {
      href: `/${locale}/directory`,
      label: isAr ? "دليل الأطباء والمراكز" : "Directory",
      icon: Building2,
    },
    {
      href: `/${locale}/portal`,
      label: isAr ? "كارت العائلة" : "Family Card",
      icon: CreditCard,
    },
  ];

  if (user?.role === "ADMIN") {
    navLinks.push({
      href: `/${locale}/admin`,
      label: isAr ? "لوحة الإدارة" : "Admin Panel",
      icon: ShieldCheck,
    });
  }

  const isActive = (path: string) => {
    if (path === `/${locale}`) {
      return pathname === `/${locale}`;
    }
    return pathname?.startsWith(path);
  };

  return (
    <header data-app-header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo locale={locale} size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                aria-current={active ? "page" : undefined}
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand-teal-50 text-brand-teal-700"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-brand-teal-600" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Language Switcher + User State */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher currentLocale={locale} />

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={user.role === "ADMIN" ? `/${locale}/admin` : `/${locale}/portal`}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-brand-teal-400 hover:bg-brand-teal-50/50"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal-600 text-[11px] font-bold text-white">
                  {user.role === "ADMIN" ? "A" : "P"}
                </div>
                <div className="flex flex-col text-start">
                  <span className="font-bold text-slate-900">
                    {isAr ? user.fullNameAr : user.fullNameEn || user.fullNameAr}
                  </span>
                  <span className="text-[10px] text-brand-teal-700 font-mono">
                    {user.membershipNo}
                  </span>
                </div>
              </Link>

              <form action={() => logoutAction(locale)}>
                <button
                  type="submit"
                  title={isAr ? "تسجيل الخروج" : "Sign Out"}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-teal-700 active:scale-95"
            >
              <UserIcon className="h-4 w-4" />
              <span>{isAr ? "تسجيل الدخول" : "Sign In"}</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher currentLocale={locale} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label={isAr ? "القائمة" : "Menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pb-6 pt-2 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                aria-current={active ? "page" : undefined}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-brand-teal-50 text-brand-teal-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-brand-teal-600" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="my-2 border-t border-slate-100 pt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal-600 font-bold text-white">
                        {user.role === "ADMIN" ? "A" : "P"}
                      </div>
                      <div className="flex flex-col text-start">
                        <span className="font-bold text-slate-900 text-sm">
                          {isAr ? user.fullNameAr : user.fullNameEn || user.fullNameAr}
                        </span>
                        <span className="text-xs text-brand-teal-700 font-mono">
                          {user.membershipNo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <form action={() => logoutAction(locale)}>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{isAr ? "تسجيل الخروج" : "Sign Out"}</span>
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-teal-700"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>{isAr ? "تسجيل الدخول" : "Sign In"}</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
