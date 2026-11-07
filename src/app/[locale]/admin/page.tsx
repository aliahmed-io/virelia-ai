import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCategories, getProviders, getAllUsers, getBookingLogs, getMedicalCompanies } from "@/lib/data";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ShieldCheck } from "lucide-react";

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const session = await getCurrentUser();
  if (!session || session.role !== "ADMIN") {
    redirect(`/${locale}/login?redirect=/${locale}/admin`);
  }

  const { topCategories, doctorSubSpecialties } = await getCategories();
  const providers = await getProviders({ onlyActive: false });
  const users = await getAllUsers();
  const bookings = await getBookingLogs();
  const companies = await getMedicalCompanies({ activeOnly: false });

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="text-start space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal-50 px-3 py-1 text-xs font-bold text-brand-teal-800 border border-brand-teal-200">
            <ShieldCheck className="h-4 w-4 text-brand-teal-600" />
            <span>{isAr ? "لوحة الإدارة المركزية (أنا المتحكم بالإضافة والحذف)" : "Central Administration"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {isAr ? "لوحة التحكم في شبكة صحة الأسرة" : "Family Health Control Dashboard"}
          </h1>
          <p className="text-xs text-slate-500">
            {isAr
              ? "إدارة شاملة لجميع مقدمي الخدمة، المستفيدين، نسب الخصومات، ومتابعة تحويلات الحجز عبر واتساب."
              : "Full administrative control over providers, patient memberships, discounts, and WhatsApp logs."}
          </p>
        </div>

        {/* Dashboard Component */}
        <AdminDashboard
          providers={providers}
          topCategories={topCategories}
          doctorSubSpecialties={doctorSubSpecialties}
          users={users}
          bookings={bookings}
          companies={companies}
          locale={locale}
        />
      </div>
    </div>
  );
}
