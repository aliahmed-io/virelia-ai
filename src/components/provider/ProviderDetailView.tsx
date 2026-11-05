"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Sparkles,
  Building2,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { WhatsAppBookingModal } from "../booking/WhatsAppBookingModal";
import type { ProviderItem, UserItem } from "@/lib/mock-data";

interface ProviderDetailViewProps {
  provider: ProviderItem;
  locale: string;
  currentUser: UserItem | null;
}

export const ProviderDetailView: React.FC<ProviderDetailViewProps> = ({
  provider,
  locale,
  currentUser,
}) => {
  const isAr = locale === "ar";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const BackIcon = isAr ? ChevronRight : ChevronLeft;

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={`/${locale}/directory`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-teal-700 transition-colors"
          >
            <BackIcon className="h-4 w-4" />
            <span>{isAr ? "العودة إلى الدليل الطبي" : "Back to Directory"}</span>
          </Link>
        </div>

        {/* Provider Header Showcase Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Left/Start details */}
            <div className="space-y-4 text-start flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-brand-teal-50 px-3 py-1 text-xs font-bold text-brand-teal-800 border border-brand-teal-200">
                  <Building2 className="h-3.5 w-3.5 text-brand-teal-600" />
                  <span>{isAr ? provider.categoryNameAr : provider.categoryNameEn}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>
                    {isAr
                      ? `خصم كارت صحة الأسرة حتى ${provider.discountPercent}%`
                      : `Family Health Card Discount up to ${provider.discountPercent}%`}
                  </span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {isAr ? provider.nameAr : provider.nameEn}
              </h1>

              <p className="text-sm font-semibold text-brand-teal-800">
                {isAr ? provider.specialtyTitleAr : provider.specialtyTitleEn}
              </p>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 pt-2">
                {isAr ? provider.bioAr : provider.bioEn}
              </p>

              {/* Location, Phone, Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-brand-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-slate-800">{isAr ? "العنوان:" : "Address:"}</span>
                    <span className="text-slate-600">{isAr ? provider.addressAr : provider.addressEn}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-brand-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-slate-800">{isAr ? "التليفون:" : "Phone:"}</span>
                    <span className="font-mono text-slate-800 font-semibold">{provider.phone}</span>
                  </div>
                </div>

                {(provider.workingHoursAr || provider.workingHoursEn) && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-brand-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-slate-800">{isAr ? "ساعات العمل:" : "Hours:"}</span>
                      <span className="text-slate-600">
                        {isAr ? provider.workingHoursAr : provider.workingHoursEn}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Action Box (Desktop) */}
            <div className="w-full lg:w-80 shrink-0 rounded-2xl border border-brand-teal-100 bg-brand-teal-50/60 p-6 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal-600 text-white shadow-md shadow-brand-teal-600/30">
                <MessageSquare className="h-6 w-6" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {isAr ? "حجز موعد مباشر" : "Direct Appointment"}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {isAr
                    ? "احجز الآن عبر واتساب مع تثبيت نسبة الخصم الفورية."
                    : "Book via WhatsApp with guaranteed instant discount rate."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 active:scale-95"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{isAr ? "حجز عبر واتساب 🌿" : "Book via WhatsApp 🌿"}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{isAr ? "خصم فوري بدون موافقات مسبقة" : "Instant discount without prior approval"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Discounted Services Table (HealthTag Style) */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-start">
            <div>
              <span className="text-xs font-bold tracking-normal text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-1">
                {isAr ? "أسعار الكشف والخدمات" : "Transparent Pricing Table"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isAr
                  ? "جدول أسعار الخدمات لحاملي كارت صحة الأسرة"
                  : "Services & Discounted Rates for Family Health Cardholders"}
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {isAr ? "* جميع الأسعار بالجنيه المصري" : "* All prices in EGP"}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-700">
                  <th className="py-4 ps-4 pe-6 text-start">{isAr ? "الخدمة / الإجراء الطبي" : "Service / Procedure"}</th>
                  <th className="py-4 px-6 text-start">{isAr ? "السعر قبل الخصم" : "Original Price"}</th>
                  <th className="py-4 px-6 text-start">{isAr ? "سعر كارت صحة الأسرة" : "Family Health Price"}</th>
                  <th className="py-4 px-6 text-start">{isAr ? "قيمة التوفير" : "You Save"}</th>
                  <th className="py-4 ps-6 pe-4 text-end">{isAr ? "الحجز" : "Booking"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {provider.servicesJson.map((service) => {
                  const savingsAmount = service.originalPrice - service.discountedPrice;
                  const discountPct = Math.round((savingsAmount / service.originalPrice) * 100);

                  return (
                    <tr key={service.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 ps-4 pe-6 font-bold text-slate-900 text-start">
                        {isAr ? service.nameAr : service.nameEn}
                      </td>

                      {/* Original Price (Strikethrough) */}
                      <td className="py-4 px-6 text-slate-400 line-through font-mono text-start">
                        {service.originalPrice} {isAr ? "ج.م" : "EGP"}
                      </td>

                      {/* Discounted Price Highlighted in Teal/Emerald */}
                      <td className="py-4 px-6 text-start">
                        <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800 font-mono border border-emerald-200">
                          {service.discountedPrice} {isAr ? "ج.م" : "EGP"}
                        </span>
                      </td>

                      {/* Savings Amount */}
                      <td className="py-4 px-6 text-start">
                        <div className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs">
                          <TrendingDown className="h-3.5 w-3.5" />
                          <span>
                            {isAr
                              ? `وفرت ${savingsAmount} ج.م (${discountPct}%)`
                              : `Save ${savingsAmount} EGP (${discountPct}%)`}
                          </span>
                        </div>
                      </td>

                      {/* Row Action */}
                      <td className="py-4 ps-6 pe-4 text-end">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{isAr ? "حجز" : "Book"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                {isAr ? "ضمان الخصم الفوري بدون حد أقصى" : "Guaranteed Instant Discount with No Limit"}
              </h4>
              <p className="text-xs text-emerald-800">
                {isAr
                  ? "تطبق الأسعار الموضحة أعلاه فورياً بمجرد إبراز بطاقة صحة الأسرة أو رقمك القومي داخل المركز."
                  : "These rates apply directly upon presenting your Family Health Card or National ID at the center."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{isAr ? "حجز موعد عبر واتساب" : "Book via WhatsApp"}</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Booking Modal */}
      <WhatsAppBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        provider={provider}
        locale={locale}
        currentUser={currentUser}
      />
    </div>
  );
};
