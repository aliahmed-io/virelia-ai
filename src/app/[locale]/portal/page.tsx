import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserByNationalId } from "@/lib/data";
import { DigitalFamilyCard } from "@/components/portal/DigitalFamilyCard";
import { FamilyMembersManager } from "@/components/portal/FamilyMembersManager";
import { PatientDocumentsManager } from "@/components/portal/PatientDocumentsManager";
import Link from "next/link";
import { Building2, Search, Sparkles, ExternalLink } from "lucide-react";

interface PortalPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const session = await getCurrentUser();
  if (!session) {
    redirect(`/${locale}/login?redirect=/${locale}/portal`);
  }

  const user = await getUserByNationalId(session.nationalId);
  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-start space-y-1">
            <span className="inline-block text-xs font-bold tracking-normal text-brand-teal-700 bg-brand-teal-50 px-3 py-1 rounded-full border border-brand-teal-200">
              {isAr ? "بوابة المستفيد والعائلة" : "Cardholder & Family Portal"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {isAr ? "كارت صحة الأسرة الرقمي وإدارة التابعين" : "Digital Family Health Card & Dependents"}
            </h1>
            <p className="text-xs text-slate-500">
              {isAr
                ? "أهلاً بك، يمكنك إظهار البطاقة الرقمية ورمز QR في أي منشأة طبية للاستفادة الفورية من الخصم."
                : "Welcome! Present this digital card or scan the QR at any medical facility for instant savings."}
            </p>
          </div>

          <Link
            href={`/${locale}/directory`}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-teal-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-brand-teal-700 transition-colors self-start sm:self-auto"
          >
            <Building2 className="h-4 w-4" />
            <span>{isAr ? "تصفح شبكة العيادات" : "Browse Clinics"}</span>
          </Link>
        </div>

        {/* Digital Membership Card Showcase */}
        <div>
          <DigitalFamilyCard user={user} locale={locale} />
        </div>

        {/* Medical Records & Document Storage (صور، Word، PDF) */}
        <div>
          <PatientDocumentsManager
            documents={user.documents || []}
            locale={locale}
          />
        </div>

        {/* Family Members Management Section (الإضافة للكل) */}
        <div>
          <FamilyMembersManager
            familyMembers={user.familyMembers}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
