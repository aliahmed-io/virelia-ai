import Link from "next/link";
import { CreditCard, ArrowLeft, ArrowRight, HeartPulse, Users, Building2 } from "lucide-react";
import { getCategories, getProviders, getUserByNationalId } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { DirectoryExplorer } from "@/components/directory/DirectoryExplorer";

export default async function HomePage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { q, category } = await searchParams;
  const isAr = locale === "ar";
  const [categories, providers, session] = await Promise.all([getCategories(), getProviders(), getCurrentUser()]);
  const user = session ? await getUserByNationalId(session.nationalId) : null;
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  return (
    <div className="app-home mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="workspace-heading">
        <div><p className="text-sm text-slate-500">{isAr ? "صحة الأسرة، كل يوم" : "Family Health, every day"}</p>
        <h1>{user ? (isAr ? `أهلاً، ${user.fullNameAr}` : `Hello, ${user.fullNameEn || user.fullNameAr}`) : (isAr ? "رعاية أقرب لك ولأسرتك" : "Care for you and your family")}</h1>
        <p className="mt-2 text-sm text-slate-500">{isAr ? "ابحث عن رعايتك، قارن الأسعار واحجز مباشرة مع مقدم الخدمة." : "Find care, compare prices and book directly with your provider."}</p></div>
        <HeartPulse className="h-10 w-10 text-brand-teal-600" aria-hidden="true" />
      </div>
      <div className="home-shortcuts">
        <Link href={`/${locale}/portal`} className="membership-shortcut">
          <div className="flex items-center gap-3"><CreditCard className="h-6 w-6" /><span>{isAr ? "كارت العائلة" : "Family card"}</span></div>
          <strong>{user ? user.membershipNo : (isAr ? "بطاقة واحدة لعائلتك" : "One card for your family")}</strong>
          <div className="flex items-center justify-between text-sm"><span>{isAr ? "عرض البطاقة وإدارة أفراد الأسرة" : "View card & manage family members"}</span><Arrow className="h-4 w-4" /></div>
        </Link>
        <Link href={`/${locale}/directory`} className="care-shortcut"><Building2 className="h-6 w-6 text-brand-teal-600" /><strong>{isAr ? "شبكتك الطبية" : "Your care network"}</strong><span>{isAr ? `${providers.length} مقدم خدمة • أسعار وخصومات واضحة` : `${providers.length} providers · Clear prices and discounts`}</span><Arrow className="h-4 w-4" /></Link>
        <Link href={`/${locale}/portal`} className="care-shortcut"><Users className="h-6 w-6 text-brand-teal-600" /><strong>{isAr ? "أفراد الأسرة" : "Family members"}</strong><span>{isAr ? "إدارة أفراد الأسرة المشمولين بالبطاقة" : "Manage the family members on your card"}</span><Arrow className="h-4 w-4" /></Link>
      </div>
      <section aria-labelledby="care-title" className="mt-10">
        <div className="mb-5"><h2 id="care-title" className="text-xl font-bold text-slate-900">{isAr ? "ابحث عن الرعاية المناسبة" : "Find your care"}</h2><p className="mt-1 text-sm text-slate-500">{isAr ? "أطباء، صيدليات، معامل ومراكز طبية" : "Doctors, pharmacies, labs and medical centers"}</p></div>
        <DirectoryExplorer providers={providers} topCategories={categories.topCategories} doctorSubSpecialties={categories.doctorSubSpecialties} locale={locale} currentUser={user} initialSearch={q ?? ""} initialCategory={category ?? ""} />
      </section>
    </div>
  );
}
