import React from "react";
import Link from "next/link";
import { Logo } from "../brand/Logo";
import { ShieldCheck, HeartHandshake, Sparkles, Phone, MessageSquare } from "lucide-react";

interface FooterProps {
  locale: string;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const isAr = locale === "ar";

  return (
    <footer className="border-t border-slate-200 bg-white pb-20 md:pb-12 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <Logo locale={locale} size="lg" />
            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              {isAr
                ? "كارت صحة الأسرة (F.H) - شبكة الخصومات الطبية الفورية المعتمدة في أرقى المستشفيات والعيادات والمعامل. رعاية شاملة لكل جيل بخصومات حقيقية من أول استخدام وبدون موافقات مسبقة."
                : "Family Health (F.H) - Certified instant medical discount network across top hospitals, clinics, labs, and radiology centers. Comprehensive care for every generation with real discounts from day one."}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                {isAr ? "خصومات حقيقية من أول استخدام" : "Instant direct savings"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal-50 px-3 py-1 text-xs font-semibold text-brand-teal-800 border border-brand-teal-200">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-teal-600" />
                {isAr ? "بدون موافقات أو حد أقصى" : "Zero pre-approvals"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                <HeartHandshake className="h-3.5 w-3.5 text-amber-600" />
                {isAr ? "أسعار أقل وأماكن أقرب" : "Lower prices & closer"}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-start">
            <h4 className="text-sm font-bold tracking-normal text-slate-900">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link
                  href={`/${locale}/directory`}
                  className="transition-colors hover:text-brand-teal-600"
                >
                  {isAr ? "دليل الأطباء والمراكز الطبية" : "Medical Network Directory"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/portal`}
                  className="transition-colors hover:text-brand-teal-600"
                >
                  {isAr ? "بوابة كارت العائلة الرقمي" : "Digital Family Health Card"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/login`}
                  className="transition-colors hover:text-brand-teal-600"
                >
                  {isAr ? "تسجيل دخول حاملي البطاقات" : "Cardholder Sign In"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/verify/FH-2025-998877`}
                  className="transition-colors hover:text-brand-teal-600"
                >
                  {isAr ? "نموذج التحقق من الكارت (QR)" : "Public Card Verification (QR)"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4 text-start">
            <h4 className="text-sm font-bold tracking-normal text-slate-900">
              {isAr ? "خدمة العملاء والحجز" : "Support & Booking"}
            </h4>
            <p className="text-xs text-slate-500">
              {isAr
                ? "فريق الدعم متاح طوال الأسبوع لمساعدتك في استفسارات التغطية وحجز المواعيد عبر واتساب."
                : "Customer care is available 7 days a week to assist with network coverage and direct WhatsApp appointments."}
            </p>
            <div className="flex flex-col gap-2 pt-1 text-sm text-slate-700">
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium hover:border-emerald-500 hover:text-emerald-700 transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                <span>{isAr ? "تواصل معنا عبر واتساب" : "Chat on WhatsApp"}</span>
              </a>
              <a
                href="tel:19000"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium hover:border-brand-teal-500 hover:text-brand-teal-700 transition-colors"
              >
                <Phone className="h-4 w-4 text-brand-teal-600" />
                <span>{isAr ? "الخط الساخن: 19000" : "Hotline: 19000"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            {isAr
              ? "صحة الأسرة (Family Health — F.H). جميع الحقوق محفوظة."
              : "Family Health (F.H). All rights reserved."}
          </p>
          <p className="text-[11px] text-slate-400">
            {isAr
              ? "كارت صحة الأسرة هو شبكة خصومات طبية فورية مستقلة بدون شروط مسبقة."
              : "Family Health is an independent instant healthcare discount network."}
          </p>
        </div>
      </div>
    </footer>
  );
};
