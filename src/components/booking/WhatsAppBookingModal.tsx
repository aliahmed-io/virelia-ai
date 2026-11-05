"use client";

import React, { useState, useEffect } from "react";
import { X, MessageSquare, ShieldCheck, UserCheck, Users, Phone, AlertCircle, Loader2 } from "lucide-react";
import { submitWhatsAppBooking } from "@/actions/booking";
import type { ProviderItem, UserItem, FamilyMemberItem } from "@/lib/mock-data";

interface WhatsAppBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderItem | null;
  locale: string;
  currentUser: UserItem | null;
}

export const WhatsAppBookingModal: React.FC<WhatsAppBookingModalProps> = ({
  isOpen,
  onClose,
  provider,
  locale,
  currentUser,
}) => {
  const isAr = locale === "ar";

  const [bookingType, setBookingType] = useState<"self" | "dependent">("self");
  const [selectedDependentId, setSelectedDependentId] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [nationalId, setNationalId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      if (bookingType === "self") {
        setPatientName(isAr ? currentUser.fullNameAr : currentUser.fullNameEn || currentUser.fullNameAr);
        setPatientPhone(currentUser.phone);
        setNationalId(currentUser.nationalId);
      } else {
        const dependent = currentUser.familyMembers.find((m) => m.id === selectedDependentId);
        if (dependent) {
          setPatientName(isAr ? dependent.fullNameAr : dependent.fullNameEn || dependent.fullNameAr);
          setNationalId(dependent.nationalId);
          setPatientPhone(currentUser.phone);
        }
      }
    }
  }, [currentUser, bookingType, selectedDependentId, isAr]);

  // Set default dependent if available
  useEffect(() => {
    if (currentUser && currentUser.familyMembers.length > 0 && !selectedDependentId) {
      const firstDep = currentUser.familyMembers[0];
      if (firstDep) {
        setSelectedDependentId(firstDep.id);
      }
    }
  }, [currentUser, selectedDependentId]);

  if (!isOpen || !provider) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!patientName.trim() || !patientPhone.trim()) {
      setErrorMessage(
        isAr ? "يرجى كتابة الاسم ورقم الهاتف للتواصل" : "Please enter patient name and contact phone"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitWhatsAppBooking({
        providerSlug: provider.slug,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        nationalId: nationalId.trim() || undefined,
        locale: isAr ? "ar" : "en",
      });

      if (res.success && res.whatsappUrl) {
        // Open WhatsApp in new tab or direct window
        window.open(res.whatsappUrl, "_blank");
        onClose();
      } else {
        setErrorMessage(res.error || (isAr ? "تعذر إنشاء رابط الحجز" : "Failed to generate booking link"));
      }
    } catch {
      setErrorMessage(isAr ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div role="dialog" aria-modal="true" aria-label={isAr ? "تفاصيل الحجز" : "Booking details"} className="relative max-h-[90dvh] overflow-y-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 end-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label={isAr ? "إغلاق" : "Close"}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-start space-y-2 pe-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
            <span>{isAr ? "حجز مباشر عبر واتساب" : "Direct WhatsApp Booking"}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {isAr ? "تأكيد تفاصيل الحجز وتطبيق الخصم" : "Confirm Booking & Apply Discount"}
          </h3>
          <p className="text-xs text-slate-600">
            {isAr ? (
              <>
                سيتم تحويلك إلى واتساب عيادة{" "}
                <span className="font-bold text-brand-teal-700">{provider.nameAr}</span> مع
                تثبيت خصم كارت صحة الأسرة (
                <span className="font-bold text-emerald-700">{provider.discountPercent}%</span>).
              </>
            ) : (
              <>
                You will be connected to{" "}
                <span className="font-bold text-brand-teal-700">{provider.nameEn}</span> via
                WhatsApp with guaranteed Family Health discount (
                <span className="font-bold text-emerald-700">{provider.discountPercent}% OFF</span>).
              </>
            )}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* If Logged In as Patient, Offer Selection */}
          {currentUser && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-3">
              <span className="block text-xs font-bold text-slate-700 text-start">
                {isAr ? "اختر المستفيد من الكشف:" : "Select Patient for Appointment:"}
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBookingType("self")}
                  className={`flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-bold transition-all ${
                    bookingType === "self"
                      ? "bg-brand-teal-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>{isAr ? "حامل الكارت الرئيسي" : "Primary Member"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingType("dependent")}
                  disabled={currentUser.familyMembers.length === 0}
                  className={`flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-bold transition-all ${
                    bookingType === "dependent"
                      ? "bg-brand-teal-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>
                    {isAr
                      ? `أحد التابعين (${currentUser.familyMembers.length})`
                      : `Family (${currentUser.familyMembers.length})`}
                  </span>
                </button>
              </div>

              {bookingType === "dependent" && currentUser.familyMembers.length > 0 && (
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600 text-start mb-1">
                    {isAr ? "اختر فرد العائلة:" : "Choose Family Member:"}
                  </label>
                  <select
                    value={selectedDependentId}
                    onChange={(e) => setSelectedDependentId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800 focus:border-brand-teal-500 focus:outline-none"
                  >
                    {currentUser.familyMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {isAr ? m.fullNameAr : m.fullNameEn || m.fullNameAr} ({isAr ? m.relationAr : m.relationEn})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Patient Name */}
          <div className="text-start">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isAr ? "اسم المريض رباعياً" : "Full Patient Name"}
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder={isAr ? "مثال: محمود حسن عبد الرحيم" : "e.g. Mahmoud Hassan"}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-teal-500 focus:ring-2 focus:ring-brand-teal-500/20 focus:outline-none"
            />
          </div>

          {/* Patient Phone */}
          <div className="text-start">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isAr ? "رقم الهاتف / الواتساب للتأكيد" : "Phone / WhatsApp Number"}
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="010xxxxxxxx"
                className="w-full rounded-xl border border-slate-300 bg-white ps-10 pe-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-teal-500 focus:ring-2 focus:ring-brand-teal-500/20 focus:outline-none font-mono"
              />
              <Phone className="absolute start-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* National ID */}
          <div className="text-start">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isAr ? "الرقم القومي (اختياري للزوار)" : "National ID (Optional for Guests)"}
            </label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="14 رقماً"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-teal-500 focus:ring-2 focus:ring-brand-teal-500/20 focus:outline-none font-mono"
            />
          </div>

          {/* Live WhatsApp Message Preview Bubble */}
          <div className="rounded-2xl bg-emerald-50/70 p-3.5 border border-emerald-200/80 text-start space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-950 block">
              {isAr ? "معاينة نص الرسالة المرسلة للعيادة:" : "WhatsApp Message Preview:"}
            </span>
            <div className="rounded-xl bg-white p-3 border border-emerald-100 text-xs font-mono text-slate-700 leading-relaxed space-y-0.5 shadow-sm">
              <div className="font-bold text-emerald-800">
                {isAr ? "مرحباً، أرغب في حجز موعد عبر كارت صحة الأسرة 🌿" : "Hello, booking via Family Health (F.H) Card 🌿"}
              </div>
              <div>• {isAr ? "الاسم:" : "Name:"} <span className="font-bold text-slate-900">{patientName || "..."}</span></div>
              <div>• {isAr ? "التخصص:" : "Specialty:"} {isAr ? provider.specialtyTitleAr : provider.specialtyTitleEn}</div>
              <div>• {isAr ? "العنوان:" : "Address:"} {isAr ? provider.addressAr : provider.addressEn}</div>
              <div>• {isAr ? "التليفون:" : "Phone:"} <span className="font-bold text-slate-900">{patientPhone || "..."}</span></div>
              <div>• {isAr ? "العضوية / الرقم القومي:" : "Card / ID:"} {nationalId || (currentUser?.nationalId ?? (isAr ? "زائر غير مسجل" : "Guest"))}</div>
            </div>
          </div>

          {/* Guarantee Note */}
          <div className="flex items-center gap-2 rounded-xl bg-brand-teal-50/70 p-3 text-start">
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-teal-700" />
            <p className="text-[11px] leading-tight text-brand-teal-900">
              {isAr
                ? "يتم تطبيق الخصم مباشرة داخل العيادة بمجرد إبراز الكارت الرقمي أو الرقم القومي."
                : "Discount is applied directly at the clinic upon presenting your digital card or National ID."}
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{isAr ? "جاري تحويلك للواتساب..." : "Opening WhatsApp..."}</span>
                </>
              ) : (
                <>
                  <MessageSquare className="h-5 w-5" />
                  <span>{isAr ? "متابعة الحجز على واتساب 🌿" : "Proceed to WhatsApp 🌿"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
