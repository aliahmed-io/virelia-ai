import React from "react";
import { getCategories, getProviders, getUserByNationalId } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { DirectoryExplorer } from "@/components/directory/DirectoryExplorer";

interface DirectoryPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function DirectoryPage({ params, searchParams }: DirectoryPageProps) {
  const { locale } = await params;
  const { q, category } = await searchParams;
  const isAr = locale === "ar";

  const { topCategories, doctorSubSpecialties } = await getCategories();
  const allProviders = await getProviders();
  const session = await getCurrentUser();
  const currentUser = session ? await getUserByNationalId(session.nationalId) : null;

  return (
    <div className="bg-slate-50 py-10 sm:py-8 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-start mb-8 space-y-2">
          <span className="inline-block text-xs font-bold tracking-normal text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-full border border-brand-teal-200">
            {isAr ? "دليل الشبكة الطبية المعتمدة" : "Verified Healthcare Directory"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {isAr ? "دليل الأطباء، المراكز، والمعامل الطبية" : "Doctors, Clinics & Diagnostic Centers"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
            {isAr
              ? "ابحث وتصفح مقدمي الخدمات الطبية تقدم خصومات مباشرة لحاملي كارت صحة الأسرة بدون حد أقصى أو فترات انتظار."
              : "Search and browse accredited medical providers offering instant discounts to Family Health cardholders without limits or delays."}
          </p>
        </div>

        {/* Directory Explorer Component */}
        <DirectoryExplorer
          providers={allProviders}
          topCategories={topCategories}
          doctorSubSpecialties={doctorSubSpecialties}
          locale={locale}
          currentUser={currentUser}
          initialSearch={q ?? ""}
          initialCategory={category ?? ""}
        />
      </div>
    </div>
  );
}
