"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ShieldCheck,
  Sparkles,
  QrCode,
  ExternalLink,
  Users,
  Copy,
  Check,
  Printer,
  RotateCw,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import type { UserItem } from "@/lib/mock-data";

interface DigitalFamilyCardProps {
  user: UserItem;
  locale: string;
}

export const DigitalFamilyCard: React.FC<DigitalFamilyCardProps> = ({ user, locale }) => {
  const isAr = locale === "ar";
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${locale}/verify/${user.membershipNo}`;

  const copyCardNumber = () => {
    navigator.clipboard.writeText(user.membershipNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printCard = () => {
    window.print();
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* 3D Flip Card Container */}
      <div
        className="relative h-[330px] sm:h-[350px] cursor-pointer transition-all duration-700 [perspective:1000px]"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* ================= CARD FRONT ================= */}
          <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-tr from-brand-teal-950 via-brand-teal-900 to-brand-teal-700 p-7 sm:p-8 text-white shadow-2xl shadow-brand-teal-950/30 border border-brand-teal-600/40 [backface-visibility:hidden]">
            {/* Ambient Background Shimmers */}
            <div className="pointer-events-none absolute -end-16 -top-16 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -start-16 -bottom-16 h-60 w-60 rounded-full bg-amber-500/15 blur-3xl" />

            {/* Subtle Texture Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Front Header */}
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="text-start space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                    {isAr ? "صحة الأسرة" : "Family Health"}
                  </span>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold tracking-normal text-emerald-300 backdrop-blur-md border border-white/20">
                    F.H PREMIUM
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-brand-teal-200">
                  {isAr ? "رعاية شاملة لكل جيل • كارت العائلة الموحد" : "Comprehensive Care for Every Generation"}
                </p>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/40 backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>{isAr ? "عضوية سارية" : "Active Member"}</span>
              </div>
            </div>

            {/* Front Body: Smart Chip + Covered Dependents Badge */}
            <div className="relative z-10 my-6 flex items-center justify-between">
              {/* Metallic Smart Chip */}
              <div className="h-10 w-14 rounded-xl bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 p-1.5 shadow-md shadow-black/20 flex items-center justify-center">
                <div className="h-full w-full rounded border border-amber-600/40 grid grid-cols-2 gap-0.5">
                  <div className="border-b border-e border-amber-700/30" />
                  <div className="border-b border-amber-700/30" />
                  <div className="border-e border-amber-700/30" />
                  <div />
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-3.5 py-1.5 backdrop-blur-md border border-white/15 text-xs">
                <Users className="h-4 w-4 text-amber-300" />
                <span className="font-bold text-white">
                  {isAr
                    ? `${user.familyMembers.length + 1} أفراد مشمولين بالخصم`
                    : `${user.familyMembers.length + 1} Covered Members`}
                </span>
              </div>
            </div>

            {/* Front Footer: Member Name, Numbers & QR */}
            <div className="relative z-10 flex items-end justify-between gap-4 border-t border-white/15 pt-5">
              <div className="text-start space-y-2.5">
                <div>
                  <span className="block text-[10px] font-bold tracking-normal text-brand-teal-300">
                    {isAr ? "المستفيد الرئيسي" : "Primary Cardholder"}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white tracking-wide">
                    {isAr ? user.fullNameAr : user.fullNameEn || user.fullNameAr}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-mono">
                  <div>
                    <span className="block text-[9px] text-brand-teal-300 font-sans">
                      {isAr ? "الرقم القومي" : "National ID"}
                    </span>
                    <span className="font-bold text-slate-200 tracking-normal">{user.nationalId}</span>
                  </div>

                  <div>
                    <span className="block text-[9px] text-brand-teal-300 font-sans">
                      {isAr ? "رقم العضوية" : "Card No"}
                    </span>
                    <span className="font-bold text-emerald-300 tracking-normal">{user.membershipNo}</span>
                  </div>
                </div>
              </div>

              {/* Scannable Verification QR Code */}
              <div className="flex flex-col items-center">
                <div className="rounded-2xl bg-white p-2 shadow-lg">
                  <QRCodeSVG
                    value={verifyUrl}
                    size={76}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <span className="mt-1 text-[9px] font-bold tracking-normal text-emerald-300">
                  {isAr ? "امسح للتحقق" : "Scan QR"}
                </span>
              </div>
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl bg-slate-900 p-7 sm:p-8 text-white shadow-2xl border border-slate-700/60 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            {/* Magnetic Stripe Graphic */}
            <div className="absolute start-0 end-0 top-8 h-12 bg-slate-950 border-y border-slate-800" />

            {/* Back Content */}
            <div className="relative z-10 pt-16 text-start space-y-4">
              <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700 text-xs font-mono flex items-center justify-between">
                <span className="text-slate-400">{isAr ? "رقم العضوية المشفر:" : "Card Hash:"}</span>
                <span className="font-bold text-emerald-400">{user.membershipNo}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="font-bold text-white">
                  {isAr ? "شروط وتعليمات استخدام كارت صحة الأسرة:" : "Terms & Usage Instructions:"}
                </p>
                <ul className="list-disc ps-4 space-y-1 text-[11px] text-slate-400">
                  <li>{isAr ? "الخصومات فورية ومباشرة بدون الحاجة لموافقات مسبقة." : "Direct instant discounts without prior approvals."}</li>
                  <li>{isAr ? "يشمل الكارت جميع أفراد الأسرة المقيدين على الرابط الرقمي." : "Covers all family dependents listed on the digital QR record."}</li>
                  <li>{isAr ? "يتم إبراز البطاقة أو الرقم القومي عند موظف الاستقبال." : "Present card or registered National ID to the clinic receptionist."}</li>
                </ul>
              </div>
            </div>

            {/* Back Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <PhoneCall className="h-4 w-4 text-emerald-400" />
                <span>{isAr ? "الدعم: 01004315212 - 01117945122" : "Support: 01004315212 / 01117945122"}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">familyhealth.eg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Toolbar Below Card */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {/* Flip Button */}
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-brand-teal-400 hover:text-brand-teal-700 transition-all active:scale-95"
        >
          <RotateCw className="h-3.5 w-3.5 text-brand-teal-600" />
          <span>{isAr ? (isFlipped ? "عرض وجه الكارت" : "عرض ظهر الكارت") : (isFlipped ? "Show Front" : "Flip Card")}</span>
        </button>

        {/* Copy Card No Button */}
        <button
          type="button"
          onClick={copyCardNumber}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-emerald-400 hover:text-emerald-700 transition-all active:scale-95"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
          <span>{copied ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "نسخ رقم الكارت" : "Copy Card No")}</span>
        </button>

        {/* Print / Save Button */}
        <button
          type="button"
          onClick={printCard}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-brand-teal-400 hover:text-brand-teal-700 transition-all active:scale-95"
        >
          <Printer className="h-3.5 w-3.5 text-slate-500" />
          <span>{isAr ? "طباعة / حفظ PDF" : "Print / Save PDF"}</span>
        </button>

        {/* Public Verification Link */}
        <Link
          href={`/${locale}/verify/${user.membershipNo}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-teal-50 px-3.5 py-2 text-xs font-bold text-brand-teal-800 border border-brand-teal-200 hover:bg-brand-teal-100 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5 text-brand-teal-600" />
          <span>{isAr ? "معاينة QR المباشر" : "Live QR Page"}</span>
        </Link>
      </div>
    </div>
  );
};
