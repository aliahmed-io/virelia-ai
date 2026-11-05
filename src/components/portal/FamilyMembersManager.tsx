"use client";

import React, { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, Trash2, AlertCircle, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { addFamilyMemberAction, removeFamilyMemberAction, type PortalActionResult } from "@/actions/portal";
import type { FamilyMemberItem } from "@/lib/mock-data";

interface FamilyMembersManagerProps {
  familyMembers: FamilyMemberItem[];
  locale: string;
}

export const FamilyMembersManager: React.FC<FamilyMembersManagerProps> = ({
  familyMembers,
  locale,
}) => {
  const router = useRouter();
  const isAr = locale === "ar";
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [membersList, setMembersList] = useState<FamilyMemberItem[]>(familyMembers);

  React.useEffect(() => {
    setMembersList((prev) => {
      const serverIds = new Set(familyMembers.map((m) => m.nationalId));
      const optimisticOnly = prev.filter((m) => !serverIds.has(m.nationalId) && m.id.startsWith("fam-"));
      return [...familyMembers, ...optimisticOnly];
    });
  }, [familyMembers]);

  const [state, formAction, isPending] = useActionState<PortalActionResult | null, FormData>(
    async (prevState, formData) => {
      const fullNameAr = (formData.get("fullNameAr") as string)?.trim();
      const nationalId = (formData.get("nationalId") as string)?.trim();
      const relationAr = (formData.get("relationAr") as string)?.trim();

      const res = await addFamilyMemberAction(locale, prevState, formData);
      if (res.success && fullNameAr && nationalId && relationAr) {
        setMembersList((prev) => [
          ...prev,
          {
            id: `fam-${Date.now()}`,
            parentUserId: "parent",
            fullNameAr,
            fullNameEn: fullNameAr,
            nationalId,
            relationAr,
            relationEn: relationAr,
            createdAt: new Date().toISOString(),
          },
        ]);
        setIsAdding(false);
        router.refresh();
      }
      return res;
    },
    null
  );

  const handleDelete = async (memberId: string) => {
    if (
      !confirm(
        isAr
          ? "هل أنت متأكد من حذف هذا التابع من كارت العائلة؟"
          : "Are you sure you want to remove this family member?"
      )
    ) {
      return;
    }

    setDeletingId(memberId);
    setMembersList((prev) => prev.filter((m) => m.id !== memberId));
    try {
      await removeFamilyMemberAction(locale, memberId);
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="text-start space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-teal-50 text-brand-teal-700">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {isAr ? "أفراد الأسرة التابعين (الإضافة للكل)" : "Family Dependents (Coverage for All)"}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            {isAr
              ? "يحق لجميع الأسماء المسجلة أدناه التمتع بنسب الخصم فورياً بمجرد إبراز رقمهم القومي."
              : "All registered dependents are entitled to immediate healthcare discounts across our network."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-teal-700 transition-colors self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          <span>{isAr ? "إضافة فرد جديد للأسرة" : "Add Family Member"}</span>
        </button>
      </div>

      {/* Add Family Member Form Dropdown */}
      {isAdding && (
        <form
          action={formAction}
          className="mt-6 rounded-2xl border border-brand-teal-200 bg-brand-teal-50/50 p-6 space-y-4 animate-fadeIn"
        >
          <div className="text-start">
            <h4 className="text-sm font-bold text-brand-teal-950">
              {isAr ? "بيانات فرد العائلة الجديد" : "New Family Dependent Information"}
            </h4>
            <p className="text-xs text-brand-teal-800">
              {isAr
                ? "أدخل الاسم الرباعي والرقم القومي وصلة القرابة لإدراجه في كارت العائلة الموحد."
                : "Enter full name, 14-digit National ID and relationship to link with your family card."}
            </p>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Arabic Name */}
            <div className="text-start">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? "الاسم رباعياً (بالعربية)" : "Full Name (Arabic)"}
              </label>
              <input
                type="text"
                name="fullNameAr"
                required
                placeholder={isAr ? "مثال: مريم محمود حسن" : "e.g. Maryam Mahmoud"}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
              />
            </div>

            {/* National ID */}
            <div className="text-start">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? "الرقم القومي (14 رقماً)" : "National ID (14 digits)"}
              </label>
              <input
                type="text"
                name="nationalId"
                required
                maxLength={14}
                placeholder="29901011234567"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
              />
            </div>

            {/* Relation */}
            <div className="text-start">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? "صلة القرابة" : "Relationship"}
              </label>
              <select
                name="relationAr"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
              >
                <option value="زوجة">{isAr ? "زوجة" : "Spouse (Wife)"}</option>
                <option value="زوج">{isAr ? "زوج" : "Spouse (Husband)"}</option>
                <option value="ابن">{isAr ? "ابن" : "Son"}</option>
                <option value="ابنة">{isAr ? "ابنة" : "Daughter"}</option>
                <option value="أب">{isAr ? "أب" : "Father"}</option>
                <option value="أم">{isAr ? "أم" : "Mother"}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-teal-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-teal-700 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isAr ? "حفظ وإضافة التابع" : "Save Dependent"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Dependents Table or Empty State */}
      <div className="mt-6">
        {membersList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-600">
                  <th className="py-3.5 ps-4 pe-6 text-start">{isAr ? "الاسم" : "Name"}</th>
                  <th className="py-3.5 px-6 text-start">{isAr ? "الرقم القومي" : "National ID"}</th>
                  <th className="py-3.5 px-6 text-start">{isAr ? "صلة القرابة" : "Relationship"}</th>
                  <th className="py-3.5 px-6 text-start">{isAr ? "حالة التغطية" : "Coverage Status"}</th>
                  <th className="py-3.5 ps-6 pe-4 text-end">{isAr ? "إجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {membersList.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 ps-4 pe-6 font-bold text-slate-900 text-start">
                      {isAr ? member.fullNameAr : member.fullNameEn || member.fullNameAr}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-700 text-start">
                      {member.nationalId}
                    </td>
                    <td className="py-3.5 px-6 text-start">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 font-bold text-slate-700">
                        {isAr ? member.relationAr : member.relationEn}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-start">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{isAr ? "مشمول بالخصم" : "Active Coverage"}</span>
                      </span>
                    </td>
                    <td className="py-3.5 ps-6 pe-4 text-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(member.id)}
                        disabled={deletingId === member.id}
                        className="inline-flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title={isAr ? "حذف التابع" : "Remove"}
                      >
                        {deletingId === member.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <h4 className="mt-3 text-sm font-bold text-slate-800">
              {isAr ? "لم تقم بإضافة أي تابعين بعد" : "No family dependents added yet"}
            </h4>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              {isAr
                ? "يمكنك إضافة زوجتك وأبنائك ووالديك في أي وقت ليستفيدوا من خصومات شبكة صحة الأسرة."
                : "You can add your spouse, children, or parents at any time to share your membership discounts."}
            </p>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-teal-700"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{isAr ? "إضافة فرد الآن" : "Add Dependent Now"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
