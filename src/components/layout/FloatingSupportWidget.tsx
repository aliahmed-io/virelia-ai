"use client";

import React, { useState } from "react";
import { TECH_SUPPORT_CONTACTS } from "@/lib/constants";
import { MessageSquare, Phone, X, Headphones, Sparkles } from "lucide-react";

interface FloatingSupportWidgetProps {
  locale: string;
}

export const FloatingSupportWidget: React.FC<FloatingSupportWidgetProps> = ({ locale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAr = locale === "ar";

  return (
    <div className="fixed bottom-20 md:bottom-6 end-4 md:end-6 z-40">
      {/* Popover Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={isAr ? "الدعم الفني والمساعدة" : "Technical Support"}
          className="mb-3 w-80 max-w-[calc(100vw-2rem)] rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-100">
                <Headphones className="h-4 w-4" />
              </div>
              <div className="text-start">
                <h4 className="text-sm font-bold text-slate-900">
                  {isAr ? "الدعم الفني والخدمة" : "Technical Support"}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isAr ? "فريق صحة الأسرة في خدمتك" : "Family Health Support Team"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label={isAr ? "إغلاق" : "Close"}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Numbers list */}
          <div className="mt-3.5 space-y-2.5">
            {TECH_SUPPORT_CONTACTS.map((item, idx) => (
              <div
                key={item.phone}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 text-start hover:border-brand-teal-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    {isAr ? item.labelAr : item.labelEn}
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-teal-700 dir-ltr">
                    {item.display}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={item.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{isAr ? "واتساب" : "WhatsApp"}</span>
                  </a>
                  <a
                    href={item.telUrl}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-300 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-600" />
                    <span>{isAr ? "اتصال" : "Call"}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
              <Sparkles className="h-3 w-3" />
              {isAr ? "متاح على مدار الساعة للمساعدة" : "Available 24/7 for assistance"}
            </span>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isAr ? "فتح الدعم الفني" : "Open Technical Support"}
        className={`group flex items-center gap-2.5 rounded-full px-4 py-3 text-white shadow-xl shadow-brand-teal-900/20 transition-all duration-300 active:scale-95 ${
          isOpen
            ? "bg-slate-800 hover:bg-slate-900"
            : "bg-gradient-to-r from-brand-teal-600 to-emerald-600 hover:from-brand-teal-700 hover:to-emerald-700 hover:shadow-2xl hover:scale-105"
        }`}
      >
        <div className="relative">
          <Headphones className="h-5 w-5 animate-pulse" />
          <span className="absolute -top-1 -end-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
          </span>
        </div>
        <span className="text-xs font-bold tracking-wide">
          {isOpen
            ? isAr
              ? "إغلاق"
              : "Close"
            : isAr
            ? "الدعم الفني 01004315212"
            : "Support 01004315212"}
        </span>
      </button>
    </div>
  );
};
