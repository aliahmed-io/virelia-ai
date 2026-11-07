"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Users,
  CreditCard,
  Building2,
  Stethoscope,
} from "lucide-react";

interface HeroBannerProps {
  locale: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ locale }) => {
  const router = useRouter();
  const isAr = locale === "ar";
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/${locale}/directory?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push(`/${locale}/directory`);
    }
  };

  const handleQuickPill = (query: string) => {
    if (query === "companies") {
      router.push(`/${locale}/companies`);
      return;
    }
    router.push(`/${locale}/directory?q=${encodeURIComponent(query)}`);
  };

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const quickPills = isAr
    ? [
        { label: "أجهزة ومعدات بالتقسيط 💳", query: "companies" },
        { label: "باطنة وسكر", query: "باطنة" },
        { label: "عظام ومفاصل", query: "عظام" },
        { label: "أسنان", query: "أسنان" },
        { label: "معامل تحاليل", query: "معامل" },
        { label: "مراكز أشعة", query: "أشعة" },
      ]
    : [
        { label: "Equipment Installments 💳", query: "companies" },
        { label: "Internal Medicine", query: "Internal" },
        { label: "Orthopedics", query: "Orthopedics" },
        { label: "Dental", query: "Dental" },
        { label: "Laboratories", query: "Laboratories" },
        { label: "Radiology", query: "Radiology" },
      ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-teal-50/70 via-white to-slate-50/50 py-8 sm:py-24">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -start-24 -top-24 h-96 w-96 rounded-full bg-brand-teal-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -end-24 top-1/2 h-96 w-96 rounded-full bg-emerald-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-teal-200 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-brand-teal-900">
              {isAr ? "كارت صحة الأسرة الموحد (F.H) 🌿" : "Family Health Unified Card (F.H) 🌿"}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.18]">
            {isAr ? (
              <>
                رعاية طبية راقية بخصومات تصل إلى{" "}
                <span className="relative inline-block text-brand-teal-700">
                  50%
                  <svg
                    className="absolute -bottom-2.5 start-0 w-full"
                    viewBox="0 0 100 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 10C30 3 70 3 97 10"
                      stroke="#E59A3C"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                لكل العائلة
              </>
            ) : (
              <>
                Premium Healthcare with up to{" "}
                <span className="relative inline-block text-brand-teal-700">
                  50% OFF
                  <svg
                    className="absolute -bottom-2.5 start-0 w-full"
                    viewBox="0 0 100 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 10C30 3 70 3 97 10"
                      stroke="#E59A3C"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                for All Generations
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
            {isAr
              ? "بطاقة طبية رقمية واحدة تغطي العائل وجميع التابعين. احصل على أسعار مخفضة فورية في كبرى العيادات، المستشفيات، المعامل ومراكز الأشعة مع حجز مباشر وسريع عبر واتساب."
              : "One digital medical membership covering the primary member and all family dependents. Instant transparent rates at top clinics, labs, and radiology centers with instant WhatsApp booking."}
          </p>

          {/* 3 Core Value Props Pills (HealthTag Mechanical Synergy) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs font-bold text-emerald-800 shadow-sm">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>{isAr ? "خصومات حقيقية من أول استخدام" : "Real discounts from day one"}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-brand-teal-200 bg-brand-teal-50/80 px-4 py-2 text-xs font-bold text-brand-teal-800 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-brand-teal-600" />
              <span>{isAr ? "بدون موافقات أو حد أقصى" : "Zero approvals or maximum limits"}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-2 text-xs font-bold text-amber-800 shadow-sm">
              <MapPin className="h-4 w-4 text-amber-600" />
              <span>{isAr ? "أسعار أقل وأماكن أقرب" : "Lower prices, closer clinics"}</span>
            </div>
          </div>

          {/* Instant Hero Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 mx-auto max-w-2xl rounded-3xl border-2 border-brand-teal-600/30 bg-white p-2.5 shadow-xl shadow-brand-teal-900/10 focus-within:border-brand-teal-600 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    isAr
                      ? "ابحث باسم الطبيب، المستشفى، التخصص أو المدينة..."
                      : "Search by doctor, clinic, specialty or city..."
                  }
                  className="w-full rounded-2xl border-none bg-transparent ps-11 pe-4 py-3.5 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <Search className="absolute start-4 top-4 h-5 w-5 text-brand-teal-600" />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal-600 px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-brand-teal-700 active:scale-95 transition-all"
              >
                <span>{isAr ? "بحث في الشبكة" : "Search Network"}</span>
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Quick Filter Search Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold me-1">
              {isAr ? "شائع الآن:" : "Popular:"}
            </span>
            {quickPills.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={() => handleQuickPill(pill.query)}
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 font-bold hover:bg-brand-teal-50 hover:text-brand-teal-700 transition-colors"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-slate-200/80 pt-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-brand-teal-800 font-mono">+500</span>
              <span className="mt-1 text-xs font-bold text-slate-500">
                {isAr ? "مقدم خدمة معتمد" : "Verified Providers"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-emerald-600 font-mono">50%</span>
              <span className="mt-1 text-xs font-bold text-slate-500">
                {isAr ? "أقصى نسبة خصم" : "Max Discount"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-amber-600 font-mono">+10,000</span>
              <span className="mt-1 text-xs font-bold text-slate-500">
                {isAr ? "عائلة مستفيدة" : "Covered Families"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-brand-teal-700 font-mono">100%</span>
              <span className="mt-1 text-xs font-bold text-slate-500">
                {isAr ? "حجز فوري بالواتساب" : "Direct WhatsApp"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
