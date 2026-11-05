"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  LayoutGrid,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Sparkles,
  Phone,
  ShieldCheck,
  MapPin,
  Clock,
  Layers,
  Download,
} from "lucide-react";
import { saveProviderAction, deleteProviderAction } from "@/actions/admin";
import type { ProviderItem, CategoryItem, UserItem, BookingLogItem, ServiceItem } from "@/lib/mock-data";

interface AdminDashboardProps {
  providers: ProviderItem[];
  topCategories: CategoryItem[];
  doctorSubSpecialties: CategoryItem[];
  users: UserItem[];
  bookings: BookingLogItem[];
  locale: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  providers,
  topCategories,
  doctorSubSpecialties,
  users,
  bookings,
  locale,
}) => {
  const isAr = locale === "ar";
  const [activeTab, setActiveTab] = useState<"providers" | "patients" | "categories" | "bookings">("providers");

  // Providers filter & modal
  const [providerSearch, setProviderSearch] = useState("");
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ProviderItem | null>(null);

  // Dynamic service list in add/edit provider
  const [servicesList, setServicesList] = useState<ServiceItem[]>([
    { id: "s1", nameAr: "كشف استشاري", nameEn: "Consultant Exam", originalPrice: 400, discountedPrice: 260 },
  ]);

  const addServiceRow = () => {
    setServicesList((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        nameAr: "",
        nameEn: "",
        originalPrice: 100,
        discountedPrice: 70,
      },
    ]);
  };

  const removeServiceRow = (idx: number) => {
    setServicesList((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateServiceRow = <K extends keyof ServiceItem>(
    idx: number,
    field: K,
    value: ServiceItem[K]
  ) => {
    setServicesList((prev) => {
      const copy = [...prev];
      const current = copy[idx];
      if (current) {
        copy[idx] = { ...current, [field]: value };
      }
      return copy;
    });
  };

  const openNewProviderModal = () => {
    setEditingProvider(null);
    setServicesList([
      { id: "s1", nameAr: "كشف استشاري", nameEn: "Consultant Exam", originalPrice: 400, discountedPrice: 260 },
    ]);
    setIsAddProviderOpen(true);
  };

  const openEditProviderModal = (provider: ProviderItem) => {
    setEditingProvider(provider);
    setServicesList(provider.servicesJson.length > 0 ? provider.servicesJson : [
      { id: "s1", nameAr: "كشف استشاري", nameEn: "Consultant Exam", originalPrice: 400, discountedPrice: 260 },
    ]);
    setIsAddProviderOpen(true);
  };

  const handleDeleteProvider = async (id: string) => {
    if (confirm(isAr ? "هل أنت متأكد من حذف هذه العيادة نهائياً؟" : "Are you sure you want to delete this provider?")) {
      await deleteProviderAction(locale, id);
    }
  };

  const exportBookingsToCsv = () => {
    if (bookings.length === 0) return;
    const headers = ["ID", "Patient Name", "Phone", "Provider", "National ID", "Timestamp"];
    const rows = bookings.map((b) => [
      b.id,
      `"${b.patientName.replace(/"/g, '""')}"`,
      `"${b.patientPhone}"`,
      `"${b.providerNameAr.replace(/"/g, '""')}"`,
      `"${b.nationalId || ""}"`,
      `"${b.createdAt}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `family_health_bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProviders = providers.filter((p) => {
    const q = providerSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      p.nameAr.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.cityAr.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Admin Stats Header */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-start shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-teal-50 text-brand-teal-700">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="mt-4 block text-2xl font-bold text-slate-900 font-mono">
            {providers.length}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {isAr ? "مقدمو الخدمة والعيادات" : "Medical Providers"}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-start shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Users className="h-5 w-5" />
          </div>
          <span className="mt-4 block text-2xl font-bold text-slate-900 font-mono">
            {users.length}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {isAr ? "البطاقات والمستفيدون" : "Members & Cards"}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-start shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <Layers className="h-5 w-5" />
          </div>
          <span className="mt-4 block text-2xl font-bold text-slate-900 font-mono">
            {topCategories.length + doctorSubSpecialties.length}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {isAr ? "الأقسام والتخصصات" : "Categories & Specialties"}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-start shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="mt-4 block text-2xl font-bold text-slate-900 font-mono">
            {bookings.length}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {isAr ? "حجوزات الواتساب" : "WhatsApp Bookings"}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("providers")}
          className={`inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition-colors ${
            activeTab === "providers"
              ? "border-brand-teal-600 text-brand-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>{isAr ? "مقدمو الخدمة والعيادات" : "Providers & Clinics"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("patients")}
          className={`inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition-colors ${
            activeTab === "patients"
              ? "border-brand-teal-600 text-brand-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{isAr ? "المرضى وبطاقات العائلة" : "Patients & Family Cards"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition-colors ${
            activeTab === "categories"
              ? "border-brand-teal-600 text-brand-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>{isAr ? "الأقسام والتخصصات" : "Categories & Specialties"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={`inline-flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition-colors ${
            activeTab === "bookings"
              ? "border-brand-teal-600 text-brand-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{isAr ? "سجل حجوزات الواتساب" : "WhatsApp Logs"}</span>
        </button>
      </div>

      {/* Tab 1: Providers Management */}
      {activeTab === "providers" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
                placeholder={isAr ? "بحث عن عيادة أو طبيب..." : "Search clinic or doctor..."}
                className="w-full rounded-2xl border border-slate-200 bg-white ps-11 pe-4 py-3 text-xs font-semibold focus:border-brand-teal-500 focus:outline-none"
              />
              <Search className="absolute start-4 top-3.5 h-4 w-4 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={openNewProviderModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal-600 px-5 py-3 text-xs font-bold text-white hover:bg-brand-teal-700 shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{isAr ? "إضافة عيادة / مركز طبي جديد" : "Add New Medical Facility"}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-700">
                  <th className="py-4 ps-6 pe-4 text-start">{isAr ? "اسم المنشأة" : "Facility Name"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "القسم / التخصص" : "Category"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "نسبة الخصم" : "Discount"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "المدينة" : "City"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "الواتساب" : "WhatsApp"}</th>
                  <th className="py-4 ps-4 pe-6 text-end">{isAr ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {filteredProviders.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-4 ps-6 pe-4 text-start">
                      <div className="space-y-0.5">
                        <span className="block font-bold text-slate-900">{isAr ? p.nameAr : p.nameEn}</span>
                        <span className="block text-[11px] text-slate-500">{p.slug}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-start">
                      <span className="inline-flex items-center rounded-lg bg-brand-teal-50 px-2.5 py-1 text-brand-teal-800 font-bold border border-brand-teal-100">
                        {isAr ? p.categoryNameAr : p.categoryNameEn}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-start">
                      <span className="font-bold text-emerald-600 font-mono text-sm">
                        {p.discountPercent}% OFF
                      </span>
                    </td>
                    <td className="py-4 px-4 text-start text-slate-600">
                      {isAr ? p.cityAr : p.cityEn}
                    </td>
                    <td className="py-4 px-4 text-start font-mono text-slate-700">
                      {p.whatsapp}
                    </td>
                    <td className="py-4 ps-4 pe-6 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditProviderModal(p)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="تعديل"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProvider(p.id)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Patients & Membership Management */}
      {activeTab === "patients" && (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-700">
                <th className="py-4 ps-6 pe-4 text-start">{isAr ? "اسم المستفيد الرئيسي" : "Primary Cardholder"}</th>
                <th className="py-4 px-4 text-start">{isAr ? "الرقم القومي" : "National ID"}</th>
                <th className="py-4 px-4 text-start">{isAr ? "رقم العضوية" : "Card No"}</th>
                <th className="py-4 px-4 text-start">{isAr ? "الهاتف" : "Phone"}</th>
                <th className="py-4 px-4 text-start">{isAr ? "التابعون المضافون" : "Dependents"}</th>
                <th className="py-4 ps-4 pe-6 text-end">{isAr ? "التحقق" : "Verify"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="py-4 ps-6 pe-4 text-start">
                    <span className="font-bold text-slate-900">{isAr ? u.fullNameAr : u.fullNameEn || u.fullNameAr}</span>
                  </td>
                  <td className="py-4 px-4 text-start font-mono text-slate-700">
                    {u.nationalId}
                  </td>
                  <td className="py-4 px-4 text-start font-mono text-brand-teal-700 font-bold">
                    {u.membershipNo}
                  </td>
                  <td className="py-4 px-4 text-start font-mono text-slate-600">
                    {u.phone}
                  </td>
                  <td className="py-4 px-4 text-start">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800 font-bold border border-emerald-200">
                      <Users className="h-3.5 w-3.5" />
                      <span>{u.familyMembers.length} {isAr ? "أفراد" : "Dependents"}</span>
                    </span>
                  </td>
                  <td className="py-4 ps-4 pe-6 text-end">
                    <a
                      href={`/${locale}/verify/${u.membershipNo}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal-700 hover:underline"
                    >
                      <span>{isAr ? "معاينة QR" : "QR Preview"}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Categories & Specialties */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-start space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? "الأقسام الرئيسية (7 أقسام معتمدة):" : "Main Categories (7 Top-Level):"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topCategories.map((c) => (
                <div key={c.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="block font-bold text-slate-900">{isAr ? c.nameAr : c.nameEn}</span>
                  <span className="block text-[11px] text-slate-400 font-mono">{c.slug}</span>
                </div>
              ))}
            </div>

            <h3 className="text-base font-bold text-slate-900 pt-4">
              {isAr ? "تخصصات الأطباء الفرعية (6 تخصصات):" : "Doctor Sub-Specialties (6 Sub-Categories):"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {doctorSubSpecialties.map((sub) => (
                <div key={sub.id} className="rounded-2xl border border-brand-teal-200 bg-brand-teal-50/50 p-4">
                  <span className="block font-bold text-brand-teal-950">{isAr ? sub.nameAr : sub.nameEn}</span>
                  <span className="block text-[11px] text-brand-teal-700 font-mono">{sub.slug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: WhatsApp Booking Logs */}
      {activeTab === "bookings" && (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-700">
                <th className="py-4 ps-6 pe-4 text-start">{isAr ? "اسم المريض" : "Patient Name"}</th>
                <th className="py-4 px-4 text-start">{isAr ? "الهاتف" : "Phone"}</th>
                <th className="py-4 px-4 text-start">{isAr ? "المنشأة الطبية المحجوزة" : "Target Facility"}</th>
                <th className="py-4 px-4 text-start">{isAr ? "الرقم القومي / العضوية" : "National ID / Card"}</th>
                <th className="py-4 ps-4 pe-6 text-end">{isAr ? "توقيت الطلب" : "Timestamp"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="py-4 ps-6 pe-4 text-start font-bold text-slate-900">
                      {b.patientName}
                    </td>
                    <td className="py-4 px-4 text-start font-mono text-slate-700">
                      {b.patientPhone}
                    </td>
                    <td className="py-4 px-4 text-start">
                      <span className="inline-flex items-center gap-1 font-bold text-brand-teal-800">
                        <Building2 className="h-3.5 w-3.5 text-brand-teal-600" />
                        <span>{isAr ? b.providerNameAr : b.providerNameEn}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-start font-mono text-slate-500">
                      {b.nationalId || (isAr ? "زائر" : "Guest")}
                    </td>
                    <td className="py-4 ps-4 pe-6 text-end font-mono text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString(locale)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    {isAr ? "لا توجد طلبات حجز مسجلة بعد" : "No booking logs recorded yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Provider Modal */}
      {isAddProviderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative my-8 w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-start">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProvider
                  ? isAr ? "تعديل بيانات العيادة / المركز" : "Edit Provider Details"
                  : isAr ? "إضافة منشأة طبية جديدة للشبكة" : "Add New Medical Provider"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddProviderOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form
              action={async (formData) => {
                formData.set("servicesJson", JSON.stringify(servicesList));
                if (editingProvider) {
                  formData.set("id", editingProvider.id);
                }
                await saveProviderAction(locale, null, formData);
                setIsAddProviderOpen(false);
              }}
              className="mt-6 space-y-4 text-start"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "اسم المنشأة / الطبيب (بالعربية)" : "Facility Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    required
                    defaultValue={editingProvider?.nameAr || ""}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "اسم المنشأة / الطبيب (بالإنجليزية)" : "Facility Name (English)"}
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    required
                    defaultValue={editingProvider?.nameEn || ""}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "القسم الرئيسي أو التخصص" : "Category / Specialty"}
                  </label>
                  <select
                    name="categoryId"
                    required
                    defaultValue={editingProvider?.categoryId || topCategories[0]?.id || ""}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  >
                    <optgroup label={isAr ? "الأقسام العامة" : "General Categories"}>
                      {topCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {isAr ? c.nameAr : c.nameEn}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={isAr ? "تخصصات الأطباء" : "Doctor Sub-Specialties"}>
                      {doctorSubSpecialties.map((s) => (
                        <option key={s.id} value={s.id}>
                          {isAr ? s.nameAr : s.nameEn}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "نسبة الخصم (%)" : "Discount Percent (%)"}
                  </label>
                  <input
                    type="number"
                    name="discountPercent"
                    required
                    defaultValue={editingProvider?.discountPercent || 30}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "الرابط الفرعي (Slug)" : "Slug (URL)"}
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    defaultValue={editingProvider?.slug || ""}
                    placeholder="e.g. dr-clinic-name"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "رقم الهاتف" : "Phone"}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    defaultValue={editingProvider?.phone || ""}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "رقم الواتساب للحجز (دولي)" : "WhatsApp Number (International)"}
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    required
                    defaultValue={editingProvider?.whatsapp || ""}
                    placeholder="2010xxxxxxxx"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "المدينة (بالعربية)" : "City (Arabic)"}
                  </label>
                  <input
                    type="text"
                    name="cityAr"
                    required
                    defaultValue={editingProvider?.cityAr || "القاهرة"}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "المدينة (بالإنجليزية)" : "City (English)"}
                  </label>
                  <input
                    type="text"
                    name="cityEn"
                    required
                    defaultValue={editingProvider?.cityEn || "Cairo"}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "العنوان بالتفصيل (بالعربية)" : "Address (Arabic)"}
                </label>
                <input
                  type="text"
                  name="addressAr"
                  required
                  defaultValue={editingProvider?.addressAr || ""}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                />
              </div>

              {/* Dynamic Service Builder */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    {isAr ? "قائمة الخدمات والأسعار (قبل وبعد الخصم):" : "Services & Pricing List:"}
                  </span>
                  <button
                    type="button"
                    onClick={addServiceRow}
                    className="inline-flex items-center gap-1 rounded-lg bg-white border border-slate-300 px-2.5 py-1 text-[11px] font-bold text-brand-teal-700 hover:bg-slate-50"
                  >
                    <Plus className="h-3 w-3" />
                    <span>{isAr ? "إضافة خدمة" : "Add Service"}</span>
                  </button>
                </div>

                {servicesList.map((srv, idx) => (
                  <div key={srv.id || idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      placeholder={isAr ? "اسم الخدمة" : "Service Name"}
                      value={srv.nameAr}
                      onChange={(e) => updateServiceRow(idx, "nameAr", e.target.value)}
                      className="sm:col-span-2 rounded-lg border border-slate-200 p-2 text-xs"
                    />
                    <input
                      type="number"
                      placeholder={isAr ? "السعر الأصلي" : "Original"}
                      value={srv.originalPrice}
                      onChange={(e) => updateServiceRow(idx, "originalPrice", parseFloat(e.target.value) || 0)}
                      className="rounded-lg border border-slate-200 p-2 text-xs font-mono"
                    />
                    <input
                      type="number"
                      placeholder={isAr ? "بعد الخصم" : "Discounted"}
                      value={srv.discountedPrice}
                      onChange={(e) => updateServiceRow(idx, "discountedPrice", parseFloat(e.target.value) || 0)}
                      className="rounded-lg border border-slate-200 p-2 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => removeServiceRow(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProviderOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-teal-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-teal-700 shadow-sm"
                >
                  {isAr ? "حفظ المنشأة الطبية" : "Save Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
