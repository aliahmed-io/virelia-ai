import React from "react";
import Link from "next/link";
import { getMedicalCompanies } from "@/lib/data";
import {
  Briefcase,
  Search,
  MapPin,
  Phone,
  MessageSquare,
  CreditCard,
  Sparkles,
  Stethoscope,
  Pill,
  FlaskConical,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import type { CompanyType } from "@/lib/mock-data";

interface CompaniesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; q?: string }>;
}

export default async function CompaniesPage({ params, searchParams }: CompaniesPageProps) {
  const { locale } = await params;
  const { type, q } = await searchParams;
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const companies = await getMedicalCompanies({
    type: type && type !== "ALL" ? type : undefined,
    search: q,
    activeOnly: true,
  });

  const categoryPills: { id: string; labelAr: string; labelEn: string; icon: React.ElementType }[] = [
    { id: "ALL", labelAr: "جميع الشركات والمعدات", labelEn: "All Companies", icon: Briefcase },
    { id: "MEDICAL_EQUIPMENT", labelAr: "أجهزة ومعدات طبية", labelEn: "Medical Equipment", icon: Stethoscope },
    { id: "PHARMACEUTICAL", labelAr: "شركات ومخازن أدوية", labelEn: "Pharmaceuticals", icon: Pill },
    { id: "CHEMICAL_LAB_SUPPLY", labelAr: "مستلزمات وكيماويات معامل", labelEn: "Chemical & Lab Supplies", icon: FlaskConical },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href={`/${locale}`} className="hover:text-brand-teal-600 transition-colors">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-brand-teal-700">{isAr ? "قسم الشركات والمعدات بالتقسيط" : "Companies & Installments"}</span>
        </div>

        {/* Hero Banner */}
        <div className="rounded-3xl border border-brand-teal-500/20 bg-gradient-to-br from-brand-teal-800 via-brand-teal-900 to-slate-900 p-8 sm:p-12 text-white shadow-xl shadow-brand-teal-950/20 relative overflow-hidden mb-10">
          <div className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl text-start space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                <CreditCard className="h-3.5 w-3.5" />
                {isAr ? "تسهيلات تقسيط حتى 36 شهراً" : "Installment Plans up to 36 Months"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-slate-200 border border-white/15">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                {isAr ? "للأطباء، العيادات والمراكز" : "For Doctors & Healthcare Centers"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isAr
                ? "دليل شركات الأجهزة، الأدوية والمستلزمات الطبية (بالتقسيط)"
                : "Medical Equipment, Pharma & Supplies Network (Installments)"}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {isAr
                ? "جهّز عيادتك أو مركزك الطبي بأحدث أجهزة السونار، كراسي الأسنان، أجهزة رسم القلب، كواشف المعامل وبكجات أدوية الطوارئ بأسعار الكاش المباشرة أو بأنظمة تقسيط ميسرة وبدون تعقيدات بنكية."
                : "Equip your medical clinic with 4D ultrasound, dental units, ECG systems, and lab reagents with direct cash discounts or flexible installment plans."}
            </p>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="mb-8 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryPills.map((pill) => {
              const Icon = pill.icon;
              const isSelected = (!type && pill.id === "ALL") || type === pill.id;
              return (
                <Link
                  key={pill.id}
                  href={`/${locale}/companies?type=${pill.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-brand-teal-700 text-white shadow-md shadow-brand-teal-900/20 scale-102"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-brand-teal-300 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-emerald-300" : "text-brand-teal-600"}`} />
                  <span>{isAr ? pill.labelAr : pill.labelEn}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <form method="GET" action={`/${locale}/companies`} className="relative max-w-xl text-start">
            {type && <input type="hidden" name="type" value={type} />}
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder={
                isAr
                  ? "ابحث باسم الشركة، الجهاز الطبي، السونار، أو المحافظة..."
                  : "Search company name, equipment, ultrasound, or city..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-white ps-11 pe-24 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            />
            <Search className="absolute start-4 top-3.5 h-4 w-4 text-slate-400" />
            <button
              type="submit"
              className="absolute end-2 top-2 rounded-xl bg-brand-teal-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-teal-700 transition-colors"
            >
              {isAr ? "بحث" : "Search"}
            </button>
          </form>
        </div>

        {/* Companies Grid */}
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-brand-teal-300 transition-all text-start"
              >
                <div>
                  {/* Top Bar: Type Badge & Installment Flag */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-brand-teal-50 px-3 py-1 text-xs font-bold text-brand-teal-800 border border-brand-teal-100">
                      <Briefcase className="h-3.5 w-3.5 text-brand-teal-600" />
                      <span>{isAr ? comp.typeNameAr : comp.typeNameEn}</span>
                    </span>

                    {comp.isInstallmentAvailable && (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                        <CreditCard className="h-3 w-3 text-emerald-600" />
                        <span>{isAr ? `تقسيط حتى ${comp.maxInstallmentMonths} شهر` : `Installments ${comp.maxInstallmentMonths}m`}</span>
                      </span>
                    )}
                  </div>

                  {/* Company Name & Bio */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    {isAr ? comp.nameAr : comp.nameEn}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {isAr ? comp.bioAr : comp.bioEn}
                  </p>

                  {/* Location & Contact Info */}
                  <div className="space-y-1.5 rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-xs text-slate-700 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{isAr ? comp.addressAr : comp.addressEn}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono font-semibold dir-ltr">{comp.phone}</span>
                    </div>
                  </div>

                  {/* Available Products / Equipment Badges */}
                  {comp.products && comp.products.length > 0 && (
                    <div className="mb-4">
                      <span className="block text-[11px] font-bold text-slate-400 mb-1.5">
                        {isAr ? "أبرز الأجهزة والمعدات المتاحة:" : "Featured Equipment:"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {comp.products.map((p) => (
                          <span
                            key={p.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>{isAr ? p.nameAr : p.nameEn}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                  <Link
                    href={`/${locale}/companies/${comp.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-teal-700 transition-colors shadow-sm shadow-brand-teal-600/20"
                  >
                    <span>{isAr ? "عرض الأجهزة والأسعار والتقسيط" : "View Catalog & Installments"}</span>
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </Link>

                  <a
                    href={`https://wa.me/${comp.whatsapp}?text=${encodeURIComponent(
                      isAr
                        ? `مرحباً، أود الاستفسار وطلب تقسيط أجهزة طبية من ${comp.nameAr} عبر منصة صحة الأسرة 🌿`
                        : `Hello, I'd like to inquire about medical equipment installments from ${comp.nameEn} via Family Health.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    <span>{isAr ? "واتساب الشركة" : "WhatsApp"}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {isAr ? "لم يتم العثور على شركات مطابقة" : "No matching companies found"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {isAr ? "جرب تصفح جميع الفئات أو إزالة كلمات البحث" : "Try clearing your search query or browsing all types"}
            </p>
            <Link
              href={`/${locale}/companies`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-teal-700"
            >
              <span>{isAr ? "عرض جميع الشركات" : "Show All Companies"}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
