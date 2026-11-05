import React from "react";
import { notFound } from "next/navigation";
import { getUserByMembershipNo } from "@/lib/data";
import { ShieldCheck, XCircle, Users, CheckCircle2, Phone, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

interface VerifyPageProps {
  params: Promise<{ locale: string; membershipNo: string }>;
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { locale, membershipNo } = await params;
  const isAr = locale === "ar";
  const user = await getUserByMembershipNo(membershipNo);
  const BackIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header / Brand */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <Logo locale={locale} size="md" />
          </div>
          <span className="block mt-3 text-xs font-bold text-slate-500 tracking-widest">
            {isAr ? "نظام التحقق الرسمي للشبكة الطبية" : "Official Network Verification Gateway"}
          </span>
        </div>

        {user && user.isActive ? (
          /* Valid Active Card */
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-white p-6 sm:p-10 shadow-xl space-y-8">
            {/* Status Banner */}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3.5 text-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-emerald-950">
                  {isAr ? "بطاقة صحة الأسرة معتمدة وسارية 🌿" : "Verified & Active Family Health Card 🌿"}
                </h2>
                <p className="text-xs text-emerald-800">
                  {isAr
                    ? "العضوية نشطة ومؤهلة للحصول على كافة خصومات العيادات والمراكز فورياً."
                    : "Membership is active and entitled to direct network discounts."}
                </p>
              </div>
            </div>

            {/* Primary Member Info Grid */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 text-start">
              <span className="text-[11px] font-bold text-slate-500 tracking-normal block">
                {isAr ? "بيانات حامل الكارت الرئيسي" : "Primary Cardholder Information"}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    {isAr ? "الاسم الرباعي" : "Full Name"}
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {isAr ? user.fullNameAr : user.fullNameEn || user.fullNameAr}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    {isAr ? "رقم العضوية" : "Membership No"}
                  </span>
                  <span className="text-base font-bold text-brand-teal-700 font-mono">
                    {user.membershipNo}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    {isAr ? "الرقم القومي" : "National ID"}
                  </span>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {user.nationalId}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    {isAr ? "رقم الهاتف" : "Phone"}
                  </span>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {user.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Family Dependents Section (الإضافة للكل) */}
            <div className="space-y-3 text-start">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isAr
                    ? `أفراد الأسرة المشمولون بالخصم (${user.familyMembers.length})`
                    : `Registered Family Dependents (${user.familyMembers.length})`}
                </h3>
              </div>

              {user.familyMembers.length > 0 ? (
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
                  {user.familyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 text-sm block">
                          {isAr ? member.fullNameAr : member.fullNameEn || member.fullNameAr}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          {member.nationalId}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {isAr ? member.relationAr : member.relationEn}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>{isAr ? "مشمول" : "Covered"}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  {isAr ? "لا يوجد تابعون مسجلون حالياً على هذه البطاقة." : "No registered dependents on this card."}
                </p>
              )}
            </div>

            {/* Verification Instruction Note for Medical Center Staff */}
            <div className="rounded-2xl border border-brand-teal-200 bg-brand-teal-50/60 p-4 text-start">
              <p className="text-xs leading-relaxed text-brand-teal-900 font-medium">
                {isAr
                  ? "📌 تعليمات الاستقبال: يحق للمنشأة الطبية منح نسب الخصم المعتمدة لجميع الأسماء والتابعين المدرجين أعلاه عند إبراز البطاقة الشخصية."
                  : "📌 Reception Note: Honor agreed discount rates for all individuals listed above upon identity verification."}
              </p>
            </div>
          </div>
        ) : (
          /* Invalid / Not Found Card */
          <div className="rounded-3xl border-2 border-rose-300 bg-white p-8 text-center shadow-xl space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <XCircle className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {isAr ? "عذراً، لم يتم العثور على بطاقة مطابقة أو العضوية غير نشطة" : "Card Not Found or Inactive"}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isAr
                ? "تأكد من رقم العضوية الممسوح أو تواصل مع إدارة صحة الأسرة للتأكد من حالة الاشتراك."
                : "Please check the membership number or contact Family Health support."}
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-teal-700"
          >
            <span>{isAr ? "العودة للصفحة الرئيسية" : "Back to Home"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
