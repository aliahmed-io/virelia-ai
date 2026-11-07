import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMedicalCompanyBySlug } from "@/lib/data";
import {
  Briefcase,
  MapPin,
  Phone,
  MessageSquare,
  CreditCard,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Headphones,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { TECH_SUPPORT_CONTACTS } from "@/lib/constants";

interface CompanyDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { locale, slug } = await params;
  const isAr = locale === "ar";
  const company = await getMedicalCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 pt-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href={`/${locale}`} className="hover:text-brand-teal-600 transition-colors">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/companies`} className="hover:text-brand-teal-600 transition-colors">
            {isAr ? "قسم الشركات والمعدات" : "Companies & Equipment"}
          </Link>
          <span>/</span>
          <span className="text-brand-teal-700 truncate max-w-xs">
            {isAr ? company.nameAr : company.nameEn}
          </span>
        </div>

        {/* Company Profile Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm text-start space-y-6 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-brand-teal-50 px-3.5 py-1.5 text-xs font-bold text-brand-teal-800 border border-brand-teal-100">
              <Briefcase className="h-4 w-4 text-brand-teal-600" />
              <span>{isAr ? company.typeNameAr : company.typeNameEn}</span>
            </span>

            {company.isInstallmentAvailable && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                <span>{isAr ? `تسهيلات تقسيط حتى ${company.maxInstallmentMonths} شهراً` : `Installments up to ${company.maxInstallmentMonths} Months`}</span>
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              {isAr ? company.nameAr : company.nameEn}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {isAr ? company.bioAr : company.bioEn}
            </p>
          </div>

          {/* Details Row: Address & Direct Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-700">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-brand-teal-600 shrink-0" />
              <span>{isAr ? company.addressAr : company.addressEn}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-brand-teal-600 shrink-0" />
              <span className="font-mono font-bold dir-ltr">{company.phone}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-4 w-4 text-emerald-600 shrink-0" />
              <a
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-700 hover:underline"
              >
                {isAr ? "محادثة واتساب مباشرة" : "Direct WhatsApp Chat"}
              </a>
            </div>
          </div>
        </div>

        {/* Section Heading: Products & Installment Plans */}
        <div className="mb-6 flex items-center justify-between text-start">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isAr ? "كتالوج الأجهزة والمعدات وأنظمة التقسيط" : "Equipment Catalog & Installment Plans"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isAr
                ? "اختر الجهاز أو المستلزم وتعرف على سعر الكاش وأنظمة السداد الشهرية المتاحة"
                : "Select equipment and view direct cash price with monthly installment options"}
            </p>
          </div>
          <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {company.products.length} {isAr ? "منتجات" : "Items"}
          </span>
        </div>

        {/* Products List */}
        <div className="space-y-6">
          {company.products.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow text-start"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Product Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      {isAr ? product.categoryAr : product.categoryEn}
                    </span>
                    {product.inStock && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {isAr ? "متوفر للتسليم والتركيب الفوري" : "In Stock for Fast Delivery"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {isAr ? product.nameAr : product.nameEn}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">
                      {isAr ? "المواصفات الفنية والتشخيصية:" : "Technical Specifications:"}
                    </span>
                    {isAr ? product.specsAr : product.specsEn}
                  </p>
                </div>

                {/* Price Box */}
                <div className="rounded-2xl border border-brand-teal-100 bg-brand-teal-50/60 p-5 lg:w-72 shrink-0 space-y-3">
                  <div>
                    <span className="block text-[11px] font-bold text-brand-teal-800">
                      {isAr ? "سعر الكاش الفوري:" : "Direct Cash Price:"}
                    </span>
                    <span className="text-2xl font-extrabold text-brand-teal-900 font-mono">
                      {product.cashPrice.toLocaleString()} ج.م
                    </span>
                  </div>

                  <div className="pt-2 border-t border-brand-teal-200/60 text-xs text-slate-700 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isAr ? "أقل مقدم مطلوب:" : "Min Down Payment:"}</span>
                      <span className="font-bold text-emerald-800 font-mono">{product.minDownPaymentPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Installment Plans Grid */}
              {product.installmentPlans && product.installmentPlans.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      {isAr ? "أنظمة التقسيط المتاحة لهذا الجهاز:" : "Available Installment Plans:"}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {product.installmentPlans.map((plan) => (
                      <div
                        key={plan.months}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-start hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                              {isAr ? `نظام ${plan.months} شهر` : `${plan.months} Months`}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold">
                              {isAr ? `مقدم ${plan.downPaymentPercent}%` : `Down ${plan.downPaymentPercent}%`}
                            </span>
                          </div>

                          <div className="space-y-1 my-2">
                            <span className="block text-[10px] text-slate-500">{isAr ? "القسط الشهري:" : "Monthly Payment:"}</span>
                            <span className="text-lg font-bold text-slate-900 font-mono">
                              {plan.monthlyAmount.toLocaleString()} ج.م
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500">
                            {isAr ? "قيمة المقدم:" : "Down Amount:"}{" "}
                            <span className="font-bold font-mono text-slate-700">
                              {plan.downPaymentAmount.toLocaleString()} ج.م
                            </span>
                          </div>
                        </div>

                        {/* WhatsApp Installment Order Button for this plan */}
                        <a
                          href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
                            isAr
                              ? `مرحباً، أود الاستفسار وطلب تقسيط من ${company.nameAr} عبر منصة صحة الأسرة 🌿
• الجهاز: ${product.nameAr}
• السعر كاش: ${product.cashPrice.toLocaleString()} ج.م
• نظام التقسيط المختار: ${plan.months} شهر (المقدم: ${plan.downPaymentAmount.toLocaleString()} ج.م - القسط الشهري: ${plan.monthlyAmount.toLocaleString()} ج.م)
• مقدم الطلب: د. [اسم الطبيب أو المركز]
• التليفون: [رقم الهاتف]
• العنوان والمحافظة:`
                              : `Hello, I'd like to request an installment plan from ${company.nameEn} via Family Health:
• Equipment: ${product.nameEn}
• Cash Price: ${product.cashPrice} EGP
• Selected Plan: ${plan.months} Months (Monthly: ${plan.monthlyAmount} EGP)`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 px-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{isAr ? `طلب تقسيط ${plan.months} شهر` : `Order ${plan.months}m Plan`}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-start flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-100">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {isAr ? "الدعم الفني واستفسارات التقسيط والتعاقدات" : "Installment Support & Assistance"}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? "تواصل مع مستشاري التجهيز الطبي عبر الواتساب لمساعدتك في أنظمة التقسيط"
                  : "Contact our technical advisors for custom equipment installment quotes"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {TECH_SUPPORT_CONTACTS.map((c) => (
              <a
                key={c.phone}
                href={c.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
              >
                <span>{isAr ? c.labelAr : c.labelEn}:</span>
                <span className="font-mono text-emerald-700 dir-ltr">{c.display}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
