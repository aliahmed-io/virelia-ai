"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  Building2,
  Star,
  CheckCircle2,
  Tag,
} from "lucide-react";
import type { ProviderItem } from "@/lib/mock-data";

interface ProviderCardProps {
  provider: ProviderItem;
  locale: string;
  onBookWhatsApp: (provider: ProviderItem) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  locale,
  onBookWhatsApp,
}) => {
  const isAr = locale === "ar";
  const firstService = provider.servicesJson[0];

  return (
    <div className="provider-card group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300  hover:border-brand-teal-400 hover:shadow-md hover:shadow-brand-teal-900/8">
      {/* Visual Header Banner */}
      <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-brand-teal-900 via-brand-teal-800 to-brand-teal-950 p-4 text-white flex flex-col justify-between">
        {/* Decorative Grid & Glow */}
        <div className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-xl" />
        <div className="pointer-events-none absolute -start-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/15 blur-xl" />

        {/* Top Badges Row */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          {/* Category Pill */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/20">
            <Building2 className="h-3.5 w-3.5 text-emerald-300" />
            <span>{isAr ? provider.categoryNameAr : provider.categoryNameEn}</span>
          </span>

          {/* Prominent Glowing Discount Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3.5 py-1 text-xs font-bold text-white shadow-md shadow-emerald-500/30 border border-emerald-400/40">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {isAr ? `خصم حتى ${provider.discountPercent}%` : `Up to ${provider.discountPercent}% OFF`}
            </span>
          </div>
        </div>

        {/* Verification & Rating Row */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-brand-teal-100">
          <div className="flex items-center gap-1 font-bold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isAr ? "منشأة معتمدة" : "Verified Partner"}</span>
          </div>


        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Doctor / Clinic Name */}
          <h3 className="text-start text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-teal-700 transition-colors line-clamp-2">
            {isAr ? provider.nameAr : provider.nameEn}
          </h3>

          {/* Specialty Description */}
          <p className="mt-1 text-start text-xs font-bold text-brand-teal-700 line-clamp-1">
            {isAr ? provider.specialtyTitleAr : provider.specialtyTitleEn}
          </p>

          {/* Short Bio / Showcase snippet */}
          <p className="mt-3 text-start text-xs leading-relaxed text-slate-600 line-clamp-2">
            {isAr ? provider.bioAr : provider.bioEn}
          </p>

          {/* Transparent Price Callout Box */}
          {firstService && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50/70 p-3 border border-emerald-200/60 text-xs">
              <div className="flex items-center gap-2 text-start">
                <Tag className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800 line-clamp-1">
                  {isAr ? firstService.nameAr : firstService.nameEn}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono">
                <span className="text-slate-400 line-through text-[11px]">
                  {firstService.originalPrice} {isAr ? "ج.م" : "EGP"}
                </span>
                <span className="font-bold text-emerald-700 text-sm">
                  {firstService.discountedPrice} {isAr ? "ج.م" : "EGP"}
                </span>
              </div>
            </div>
          )}

          {/* Meta Info: Address & Phone */}
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div className="flex items-start gap-2 text-start">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
              <span className="line-clamp-1">{isAr ? provider.addressAr : provider.addressEn}</span>
            </div>

            <div className="flex items-center gap-2 text-start font-mono">
              <Phone className="h-4 w-4 shrink-0 text-slate-400" />
              <bdi dir="ltr">{provider.phone}</bdi>
            </div>

            {(provider.workingHoursAr || provider.workingHoursEn) && (
              <div className="flex items-start gap-2 text-start text-slate-500">
                <Clock className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                <span className="line-clamp-1">
                  {isAr ? provider.workingHoursAr : provider.workingHoursEn}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: 1. View Clinic & Prices | 2. Book via WhatsApp */}
        <div className="mt-6 flex flex-col gap-2.5 pt-2">
          <Link
            href={`/${locale}/providers/${provider.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-teal-200 bg-brand-teal-50/60 px-4 py-2.5 text-xs font-bold text-brand-teal-800 transition-colors hover:bg-brand-teal-100 hover:text-brand-teal-900"
          >
            <span>{isAr ? "عرض العيادة والأسعار" : "View Clinic & Prices"}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => onBookWhatsApp(provider)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/30 active:scale-98"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{isAr ? "حجز عبر واتساب" : "Book via WhatsApp"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
