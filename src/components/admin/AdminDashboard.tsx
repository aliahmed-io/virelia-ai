"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  Layers,
  Download,
  UserPlus,
  Tag,
  Loader2,
  Briefcase,
  CreditCard,
  UserX,
} from "lucide-react";
import {
  saveProviderAction,
  deleteProviderAction,
  toggleProviderStatusAction,
  registerPatientAction,
  toggleUserStatusAction,
  createCategoryAction,
  adminAddFamilyMemberAction,
  adminDeleteFamilyMemberAction,
  togglePatientDeceasedAction,
  deletePatientAction,
  saveMedicalCompanyAction,
  toggleMedicalCompanyStatusAction,
  deleteMedicalCompanyAction,
} from "@/actions/admin";
import type {
  ProviderItem,
  CategoryItem,
  UserItem,
  BookingLogItem,
  ServiceItem,
  MedicalCompanyItem,
  CompanyType,
} from "@/lib/mock-data";

interface AdminDashboardProps {
  providers: ProviderItem[];
  topCategories: CategoryItem[];
  doctorSubSpecialties: CategoryItem[];
  users: UserItem[];
  bookings: BookingLogItem[];
  companies?: MedicalCompanyItem[];
  locale: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  providers: initialProviders,
  topCategories: initialTopCategories,
  doctorSubSpecialties: initialSubSpecialties,
  users: initialUsers,
  bookings,
  companies: initialCompanies = [],
  locale,
}) => {
  const router = useRouter();
  const isAr = locale === "ar";
  const [, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"providers" | "patients" | "categories" | "bookings" | "companies">("providers");

  // Local synced state
  const [providers, setProviders] = useState<ProviderItem[]>(initialProviders);
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [topCategories, setTopCategories] = useState<CategoryItem[]>(initialTopCategories);
  const [doctorSubSpecialties, setDoctorSubSpecialties] = useState<CategoryItem[]>(initialSubSpecialties);
  const [companies, setCompanies] = useState<MedicalCompanyItem[]>(initialCompanies);

  React.useEffect(() => {
    setCompanies(initialCompanies);
  }, [initialCompanies]);

  // Company state
  const [companySearch, setCompanySearch] = useState("");
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isSubmittingCompany, setIsSubmittingCompany] = useState(false);
  const [companyFormError, setCompanyFormError] = useState<string | null>(null);

  React.useEffect(() => {
    setProviders(initialProviders);
  }, [initialProviders]);

  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  React.useEffect(() => {
    setTopCategories(initialTopCategories);
  }, [initialTopCategories]);

  React.useEffect(() => {
    setDoctorSubSpecialties(initialSubSpecialties);
  }, [initialSubSpecialties]);

  // Provider state
  const [providerSearch, setProviderSearch] = useState("");
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ProviderItem | null>(null);

  // Patient state
  const [patientSearch, setPatientSearch] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [managingFamilyUser, setManagingFamilyUser] = useState<UserItem | null>(null);
  const [patientFormError, setPatientFormError] = useState<string | null>(null);
  const [isSubmittingPatient, setIsSubmittingPatient] = useState(false);

  // Category state
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

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
      setProviders((prev) => prev.filter((p) => p.id !== id));
      await deleteProviderAction(locale, id);
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const handleToggleProvider = async (id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    await toggleProviderStatusAction(locale, id);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleToggleUser = async (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
    await toggleUserStatusAction(locale, id);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleRegisterPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPatientFormError(null);
    setIsSubmittingPatient(true);
    const formData = new FormData(e.currentTarget);
    const res = await registerPatientAction(locale, null, formData);
    setIsSubmittingPatient(false);
    if (res.error) {
      setPatientFormError(res.error);
    } else {
      setIsAddPatientOpen(false);
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCategoryFormError(null);
    setIsSubmittingCategory(true);
    const formData = new FormData(e.currentTarget);
    const res = await createCategoryAction(locale, null, formData);
    setIsSubmittingCategory(false);
    if (res.error) {
      setCategoryFormError(res.error);
    } else {
      setIsAddCategoryOpen(false);
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const handleAdminAddDependent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!managingFamilyUser) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullNameAr = (formData.get("fullNameAr") as string)?.trim();
    const nationalId = (formData.get("nationalId") as string)?.trim();
    const relationAr = (formData.get("relationAr") as string)?.trim();

    if (!fullNameAr || !nationalId || !relationAr) return;

    const res = await adminAddFamilyMemberAction(locale, managingFamilyUser.id, formData);
    if (res.success) {
      const newFam = {
        id: `fam-${Date.now()}`,
        parentUserId: managingFamilyUser.id,
        fullNameAr,
        fullNameEn: fullNameAr,
        nationalId,
        relationAr,
        relationEn: relationAr,
        createdAt: new Date().toISOString(),
      };
      setManagingFamilyUser({
        ...managingFamilyUser,
        familyMembers: [...managingFamilyUser.familyMembers, newFam],
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === managingFamilyUser.id
            ? { ...u, familyMembers: [...u.familyMembers, newFam] }
            : u
        )
      );
      form.reset();
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const handleAdminDeleteDependent = async (memberId: string) => {
    if (!managingFamilyUser) return;
    if (!confirm(isAr ? "هل أنت متأكد من حذف التابع؟" : "Remove dependent?")) return;

    setManagingFamilyUser({
      ...managingFamilyUser,
      familyMembers: managingFamilyUser.familyMembers.filter((m) => m.id !== memberId),
    });
    setUsers((prev) =>
      prev.map((u) =>
        u.id === managingFamilyUser.id
          ? { ...u, familyMembers: u.familyMembers.filter((m) => m.id !== memberId) }
          : u
      )
    );
    await adminDeleteFamilyMemberAction(locale, memberId);
    startTransition(() => {
      router.refresh();
    });
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

  const filteredUsers = users.filter((u) => {
    const q = patientSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      u.fullNameAr.toLowerCase().includes(q) ||
      u.fullNameEn?.toLowerCase().includes(q) ||
      u.nationalId.includes(q) ||
      u.membershipNo.toLowerCase().includes(q)
    );
  });

  const filteredCompanies = companies.filter((c) => {
    const q = companySearch.toLowerCase().trim();
    if (!q) return true;
    return (
      c.nameAr.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.cityAr.toLowerCase().includes(q) ||
      c.typeNameAr.toLowerCase().includes(q)
    );
  });

  const handleToggleDeceased = async (userId: string) => {
    if (
      !confirm(
        isAr
          ? "تأكيد تسجيل/إلغاء حالة وفاة لهذا المريض؟ في حالة التأكيد سيتم إيقاف صلاحية الكارت تلقائياً فوراً لمنع سوء الاستخدام."
          : "Confirm toggle deceased status for this patient? The membership card will be immediately suspended."
      )
    ) {
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              isDeceased: !u.isDeceased,
              isActive: u.isDeceased ? true : false,
            }
          : u
      )
    );

    await togglePatientDeceasedAction(locale, userId);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDeletePatient = async (userId: string) => {
    if (
      !confirm(
        isAr
          ? "هل أنت متأكد من حذف حساب المريض وسجلاته الطبية نهائياً؟"
          : "Permanently delete patient account and all records?"
      )
    ) {
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    await deletePatientAction(locale, userId);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleToggleCompany = async (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, isActive: !c.isActive } : c))
    );
    await toggleMedicalCompanyStatusAction(locale, companyId);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (
      !confirm(
        isAr
          ? "هل أنت متأكد من حذف هذه الشركة وجميع منتجاتها وقوائم التقسيط؟"
          : "Permanently delete this medical company and its catalog?"
      )
    ) {
      return;
    }

    setCompanies((prev) => prev.filter((c) => c.id !== companyId));
    await deleteMedicalCompanyAction(locale, companyId);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleAddCompanySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingCompany(true);
    setCompanyFormError(null);
    const formData = new FormData(e.currentTarget);
    const res = await saveMedicalCompanyAction(locale, null, formData);
    setIsSubmittingCompany(false);

    if (res.error) {
      setCompanyFormError(res.error);
    } else {
      setIsAddCompanyOpen(false);
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Stats Header */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 text-start shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-teal-50 text-brand-teal-700">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="mt-3 block text-2xl font-bold text-slate-900 font-mono">
            {providers.length}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {isAr ? "العيادات والمراكز" : "Medical Providers"}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 text-start shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Users className="h-5 w-5" />
          </div>
          <span className="mt-3 block text-2xl font-bold text-slate-900 font-mono">
            {users.length}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {isAr ? "البطاقات والمستفيدون" : "Members & Cards"}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 text-start shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-teal-50 text-brand-teal-700">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="mt-3 block text-2xl font-bold text-slate-900 font-mono">
            {companies.length}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {isAr ? "شركات ومعدات (بالتقسيط)" : "Companies & Equipment"}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 text-start shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <Layers className="h-5 w-5" />
          </div>
          <span className="mt-3 block text-2xl font-bold text-slate-900 font-mono">
            {topCategories.length + doctorSubSpecialties.length}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {isAr ? "الأقسام والتخصصات" : "Categories & Specialties"}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 text-start shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="mt-3 block text-2xl font-bold text-slate-900 font-mono">
            {bookings.length}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {isAr ? "حجوزات الواتساب" : "WhatsApp Bookings"}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("providers")}
          className={`inline-flex items-center gap-2 border-b-2 px-5 py-4 text-xs sm:text-sm font-bold transition-colors ${
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
          onClick={() => setActiveTab("companies")}
          className={`inline-flex items-center gap-2 border-b-2 px-5 py-4 text-xs sm:text-sm font-bold transition-colors ${
            activeTab === "companies"
              ? "border-brand-teal-600 text-brand-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>{isAr ? "الشركات والمعدات (بالتقسيط)" : "Companies & Equipment"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("patients")}
          className={`inline-flex items-center gap-2 border-b-2 px-5 py-4 text-xs sm:text-sm font-bold transition-colors ${
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
          className={`inline-flex items-center gap-2 border-b-2 px-5 py-4 text-xs sm:text-sm font-bold transition-colors ${
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
          className={`inline-flex items-center gap-2 border-b-2 px-5 py-4 text-xs sm:text-sm font-bold transition-colors ${
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
                  <th className="py-4 px-4 text-start">{isAr ? "الحالة" : "Status"}</th>
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
                    <td className="py-4 px-4 text-start">
                      <button
                        type="button"
                        onClick={() => handleToggleProvider(p.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                          p.isActive
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                        }`}
                        title={isAr ? "انقر للتبديل" : "Click to toggle"}
                      >
                        {p.isActive ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-slate-400" />
                        )}
                        <span>{p.isActive ? (isAr ? "نشط" : "Active") : (isAr ? "موقوف" : "Inactive")}</span>
                      </button>
                    </td>
                    <td className="py-4 ps-4 pe-6 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditProviderModal(p)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title={isAr ? "تعديل" : "Edit"}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProvider(p.id)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          title={isAr ? "حذف" : "Delete"}
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
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder={isAr ? "بحث بالاسم، الرقم القومي أو رقم العضوية..." : "Search patient name, national ID or card #..."}
                className="w-full rounded-2xl border border-slate-200 bg-white ps-11 pe-4 py-3 text-xs font-semibold focus:border-brand-teal-500 focus:outline-none"
              />
              <Search className="absolute start-4 top-3.5 h-4 w-4 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => {
                setPatientFormError(null);
                setIsAddPatientOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal-600 px-5 py-3 text-xs font-bold text-white hover:bg-brand-teal-700 shadow-sm transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span>{isAr ? "تسجيل مريض جديد" : "Register New Patient"}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-700">
                  <th className="py-4 ps-6 pe-4 text-start">{isAr ? "اسم المستفيد الرئيسي" : "Primary Cardholder"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "الرقم القومي" : "National ID"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "رقم العضوية" : "Card No"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "الهاتف" : "Phone"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "التابعون المضافون" : "Dependents"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "حالة الكارت" : "Card Status"}</th>
                  <th className="py-4 ps-4 pe-6 text-end">{isAr ? "إجراءات وتحقق" : "Actions & QR"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {filteredUsers.map((u) => (
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
                      <button
                        type="button"
                        onClick={() => setManagingFamilyUser(u)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800 font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        title={isAr ? "عرض وإدارة التابعين" : "Manage dependents"}
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>{u.familyMembers.length} {isAr ? "أفراد" : "Dependents"}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-start">
                      {u.isDeceased ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold bg-slate-900 text-rose-300 border border-slate-700">
                          <UserX className="h-3 w-3 text-rose-400" />
                          <span>{isAr ? "متوفي (معطل)" : "Deceased"}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleUser(u.id)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                            u.isActive
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                          }`}
                          title={isAr ? "انقر لتفعيل / تعطيل العضوية" : "Click to activate/deactivate"}
                        >
                          {u.isActive ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-rose-500" />
                          )}
                          <span>{u.isActive ? (isAr ? "ساري" : "Active") : (isAr ? "معطل" : "Suspended")}</span>
                        </button>
                      )}
                    </td>
                    <td className="py-4 ps-4 pe-6 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setManagingFamilyUser(u)}
                          className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          {isAr ? "التابعين" : "Family"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleDeceased(u.id)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-bold border transition-colors ${
                            u.isDeceased
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              : "border-slate-300 bg-slate-50 text-slate-700 hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50"
                          }`}
                          title={isAr ? (u.isDeceased ? "إلغاء حالة الوفاة" : "تسجيل حالة وفاة وإيقاف الكارت") : "Toggle deceased status"}
                        >
                          {u.isDeceased ? (isAr ? "إلغاء وفاة" : "Undo") : (isAr ? "وفاة" : "Deceased")}
                        </button>
                        <a
                          href={`/${locale}/verify/${u.membershipNo}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-brand-teal-200 bg-brand-teal-50 px-2 py-1 text-[11px] font-bold text-brand-teal-800 hover:bg-brand-teal-100 transition-colors"
                        >
                          <span>{isAr ? "معاينة QR" : "QR"}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeletePatient(u.id)}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          title={isAr ? "حذف الحساب نهائياً" : "Delete patient"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* Tab: Medical Companies & Equipment Management */}
      {activeTab === "companies" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder={isAr ? "بحث باسم الشركة، نوع الأجهزة أو المحافظة..." : "Search company name, equipment or city..."}
                className="w-full rounded-2xl border border-slate-200 bg-white ps-11 pe-4 py-3 text-xs font-semibold focus:border-brand-teal-500 focus:outline-none"
              />
              <Search className="absolute start-4 top-3.5 h-4 w-4 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => {
                setCompanyFormError(null);
                setIsAddCompanyOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal-600 px-5 py-3 text-xs font-bold text-white hover:bg-brand-teal-700 shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{isAr ? "إضافة شركة / مورد أجهزة جديد" : "Add Medical Company"}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-700">
                  <th className="py-4 ps-6 pe-4 text-start">{isAr ? "اسم الشركة والمورد" : "Company Name"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "النوع والتصنيف" : "Type"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "المحافظة" : "City"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "رقم الواتساب" : "WhatsApp"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "أقصى تقسيط" : "Installment"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "المنتجات" : "Products"}</th>
                  <th className="py-4 px-4 text-start">{isAr ? "الحالة" : "Status"}</th>
                  <th className="py-4 ps-4 pe-6 text-end">{isAr ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-4 ps-6 pe-4 text-start">
                      <div>
                        <span className="font-bold text-slate-900 block">{isAr ? c.nameAr : c.nameEn}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{c.slug}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-start">
                      <span className="inline-flex items-center rounded-lg bg-brand-teal-50 px-2.5 py-1 text-brand-teal-800 font-bold border border-brand-teal-100">
                        {isAr ? c.typeNameAr : c.typeNameEn}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-start text-slate-600">
                      {isAr ? c.cityAr : c.cityEn}
                    </td>
                    <td className="py-4 px-4 text-start font-mono text-slate-700">
                      {c.whatsapp}
                    </td>
                    <td className="py-4 px-4 text-start">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <CreditCard className="h-3 w-3" />
                        <span>{c.maxInstallmentMonths} {isAr ? "شهر" : "m"}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-start font-mono text-slate-700">
                      {c.products.length} {isAr ? "أجهزة" : "items"}
                    </td>
                    <td className="py-4 px-4 text-start">
                      <button
                        type="button"
                        onClick={() => handleToggleCompany(c.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                          c.isActive
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                        }`}
                        title={isAr ? "انقر لتفعيل / تعطيل الشركة" : "Click to toggle"}
                      >
                        {c.isActive ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-slate-400" />
                        )}
                        <span>{c.isActive ? (isAr ? "نشط" : "Active") : (isAr ? "موقوف" : "Inactive")}</span>
                      </button>
                    </td>
                    <td className="py-4 ps-4 pe-6 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/${locale}/companies/${c.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-brand-teal-200 bg-brand-teal-50 px-2.5 py-1 text-[11px] font-bold text-brand-teal-800 hover:bg-brand-teal-100 transition-colors"
                        >
                          <span>{isAr ? "الكتالوج" : "View"}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteCompany(c.id)}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          title={isAr ? "حذف الشركة" : "Delete company"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* Tab 3: Categories & Specialties */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-start">
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? "هيكل التصنيفات والخدمات المعتمدة" : "Category & Specialty Hierarchy"}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr
                  ? "إدارة الأقسام الطبية الرئيسية وتخصصات الأطباء المعروضة في الدليل."
                  : "Manage primary health categories and doctor clinical sub-specialties."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setCategoryFormError(null);
                setIsAddCategoryOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal-600 px-5 py-3 text-xs font-bold text-white hover:bg-brand-teal-700 shadow-sm transition-all self-start sm:self-auto"
            >
              <Tag className="h-4 w-4" />
              <span>{isAr ? "إضافة قسم / تخصص جديد" : "Add Category / Specialty"}</span>
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-start space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              {isAr ? `الأقسام الرئيسية (${topCategories.length} أقسام معتمدة):` : `Main Categories (${topCategories.length} Top-Level):`}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topCategories.map((c) => (
                <div key={c.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="block font-bold text-slate-900">{isAr ? c.nameAr : c.nameEn}</span>
                  <span className="block text-[11px] text-slate-400 font-mono">{c.slug}</span>
                </div>
              ))}
            </div>

            <h4 className="text-sm font-bold text-slate-900 pt-4">
              {isAr ? `تخصصات الأطباء الفرعية (${doctorSubSpecialties.length} تخصصات):` : `Doctor Sub-Specialties (${doctorSubSpecialties.length} Sub-Categories):`}
            </h4>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-start">
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? "سجل إحالات وتحويلات الحجز عبر واتساب" : "WhatsApp Conversion & Referral Logs"}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? "تتبع نقرات الحجز المباشرة مع مقدمي الخدمة لضمان جودة التحويلات." : "Audit all direct booking dispatch events."}
              </p>
            </div>

            <button
              type="button"
              onClick={exportBookingsToCsv}
              disabled={bookings.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>{isAr ? "تحميل سجل الحجوزات CSV" : "Export CSV"}</span>
            </button>
          </div>

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
                          {isAr ? b.providerNameAr : b.providerNameEn}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-start font-mono text-slate-500">
                        {b.nationalId || (isAr ? "زائر" : "Guest")}
                      </td>
                      <td className="py-4 ps-4 pe-6 text-end font-mono text-slate-400 text-[11px]">
                        {new Date(b.createdAt).toLocaleString(isAr ? "ar-EG" : "en-US")}
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
                startTransition(() => {
                  router.refresh();
                });
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
                      {doctorSubSpecialties.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {isAr ? sub.nameAr : sub.nameEn}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "نسبة الخصم (%)" : "Discount Percentage (%)"}
                  </label>
                  <input
                    type="number"
                    name="discountPercent"
                    min="5"
                    max="90"
                    required
                    defaultValue={editingProvider?.discountPercent || 30}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "الرابط الفرعي (Slug)" : "Unique Slug"}
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
                    {isAr ? "رقم الهاتف" : "Phone Number"}
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
                    {isAr ? "رقم الواتساب للحجز (دولي)" : "WhatsApp Number (Intl)"}
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

              {/* Dynamic Services & Pricing List */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    {isAr ? "قائمة الخدمات والأسعار (قبل وبعد الخصم):" : "Services & Prices (Before/After Discount):"}
                  </span>
                  <button
                    type="button"
                    onClick={addServiceRow}
                    className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-300 px-3 py-1 text-xs font-bold text-brand-teal-700 hover:bg-slate-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isAr ? "إضافة خدمة" : "Add Service"}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {servicesList.map((srv, idx) => (
                    <div key={srv.id || idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={isAr ? "اسم الخدمة" : "Service Name"}
                        value={srv.nameAr}
                        onChange={(e) => updateServiceRow(idx, "nameAr", e.target.value)}
                        className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold"
                      />
                      <input
                        type="number"
                        placeholder={isAr ? "السعر قبل" : "Original"}
                        value={srv.originalPrice}
                        onChange={(e) => updateServiceRow(idx, "originalPrice", parseInt(e.target.value, 10) || 0)}
                        className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-semibold"
                      />
                      <input
                        type="number"
                        placeholder={isAr ? "بعد الخصم" : "Discounted"}
                        value={srv.discountedPrice}
                        onChange={(e) => updateServiceRow(idx, "discountedPrice", parseInt(e.target.value, 10) || 0)}
                        className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono font-semibold text-emerald-700"
                      />
                      {servicesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeServiceRow(idx)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

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
                  {editingProvider
                    ? isAr ? "حفظ التعديلات" : "Update Facility"
                    : isAr ? "حفظ المنشأة الطبية" : "Create Facility"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register New Patient Modal */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative my-8 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isAr ? "تسجيل مريض جديد وإصدار كارت" : "Register Patient & Issue Card"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? "يتم إنشاء حساب فوري مع رقم عضوية مشفر للتحقق." : "Instant membership account creation."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPatientOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {patientFormError && (
              <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200 text-start">
                {patientFormError}
              </div>
            )}

            <form onSubmit={handleRegisterPatient} className="mt-6 space-y-4 text-start">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "الاسم رباعياً (بالعربية)" : "Full Name (Arabic)"}
                </label>
                <input
                  type="text"
                  name="fullNameAr"
                  required
                  placeholder={isAr ? "مثال: حسام علي عبد العزيز" : "e.g. Hossam Ali"}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "الاسم (بالإنجليزية - اختياري)" : "Full Name (English - Optional)"}
                </label>
                <input
                  type="text"
                  name="fullNameEn"
                  placeholder="e.g. Hossam Ali"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "الرقم القومي (14 رقماً)" : "National ID (14 Digits)"}
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="010xxxxxxxx"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "كلمة المرور الأولية (افتراضياً Patient@123)" : "Initial Password (default: Patient@123)"}
                </label>
                <input
                  type="text"
                  name="password"
                  defaultValue="Patient@123"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPatientOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPatient}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-teal-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-teal-700 shadow-sm disabled:opacity-50"
                >
                  {isSubmittingPatient && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isAr ? "تسجيل المريض وإصدار الكارت" : "Create Patient"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Family Dependents Manager Modal */}
      {managingFamilyUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isAr ? "إدارة أفراد العائلة والتابعين" : "Manage Family Dependents"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? "المستفيد الرئيسي:" : "Primary Member:"}{" "}
                  <strong className="text-brand-teal-900">{managingFamilyUser.fullNameAr}</strong> ({managingFamilyUser.membershipNo})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManagingFamilyUser(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* List of current dependents */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 text-start">
                {isAr ? "التابعون المسجلون حالياً:" : "Current Registered Dependents:"}
              </h4>
              {managingFamilyUser.familyMembers.length > 0 ? (
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                  {managingFamilyUser.familyMembers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/50">
                      <div className="text-start space-y-0.5">
                        <span className="block text-xs font-bold text-slate-900">{m.fullNameAr}</span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-mono">{m.nationalId}</span>
                          <span>•</span>
                          <span className="font-semibold text-brand-teal-700">{m.relationAr}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAdminDeleteDependent(m.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        title={isAr ? "حذف التابع" : "Remove"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                  {isAr ? "لا يوجد تابعون مضافون لهذا المريض بعد." : "No family dependents added yet."}
                </div>
              )}
            </div>

            {/* Quick Add Dependent Form */}
            <form onSubmit={handleAdminAddDependent} className="mt-6 rounded-2xl border border-brand-teal-200 bg-brand-teal-50/50 p-4 space-y-3 text-start">
              <span className="block text-xs font-bold text-brand-teal-950">
                {isAr ? "إضافة فرد تابع جديد لهذا الكارت:" : "Add New Dependent to this Card:"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  name="fullNameAr"
                  required
                  placeholder={isAr ? "الاسم رباعياً" : "Full Name"}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                />
                <input
                  type="text"
                  name="nationalId"
                  required
                  maxLength={14}
                  placeholder={isAr ? "الرقم القومي (14)" : "National ID (14)"}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-semibold"
                />
                <select
                  name="relationAr"
                  required
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                >
                  <option value="زوجة">{isAr ? "زوجة" : "Wife"}</option>
                  <option value="زوج">{isAr ? "زوج" : "Husband"}</option>
                  <option value="ابن">{isAr ? "ابن" : "Son"}</option>
                  <option value="ابنة">{isAr ? "ابنة" : "Daughter"}</option>
                  <option value="أب">{isAr ? "أب" : "Father"}</option>
                  <option value="أم">{isAr ? "أم" : "Mother"}</option>
                </select>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-xl bg-brand-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-teal-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isAr ? "إضافة التابع الآن" : "Add Dependent"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative my-8 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isAr ? "إضافة قسم رئيسي أو تخصص فرعي" : "Add Category or Sub-Specialty"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? "توسيع شبكة التصنيفات الطبية المعتمدة في النظام." : "Expand system taxonomy."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {categoryFormError && (
              <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200 text-start">
                {categoryFormError}
              </div>
            )}

            <form onSubmit={handleAddCategory} className="mt-6 space-y-4 text-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "الاسم بالعربية" : "Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    required
                    placeholder={isAr ? "مثال: جلدية" : "e.g. Dermatology"}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "الاسم بالإنجليزية" : "Name (English)"}
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    required
                    placeholder="e.g. Dermatology"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "الرابط الفرعي (Slug)" : "Slug"}
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    placeholder="e.g. dermatology"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "القسم الأب" : "Parent Category"}
                  </label>
                  <select
                    name="parentId"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  >
                    <option value="none">{isAr ? "قسم رئيسي مستقل (Top-Level)" : "Top-Level Category"}</option>
                    {topCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isAr ? `تخصص فرعي تابع لـ: ${c.nameAr}` : `Sub-specialty under: ${c.nameEn}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "رمز الأيقونة (Lucide Icon Name)" : "Lucide Icon Name"}
                </label>
                <input
                  type="text"
                  name="iconName"
                  defaultValue="Activity"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCategory}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-teal-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-teal-700 shadow-sm disabled:opacity-50"
                >
                  {isSubmittingCategory && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isAr ? "إضافة القسم" : "Save Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Add Medical Company */}
      {isAddCompanyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-100">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="text-start">
                  <h3 className="text-lg font-bold text-slate-900">
                    {isAr ? "إضافة شركة / مورد أجهزة ومستلزمات جديدة" : "Add Medical Company & Supplier"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isAr ? "تجهيز وتوريد للأطباء والمراكز مع أنظمة التقسيط" : "Medical equipment, pharma & lab suppliers with installments"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCompanyOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {companyFormError && (
              <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-200 text-start">
                {companyFormError}
              </div>
            )}

            <form onSubmit={handleAddCompanySubmit} className="mt-6 space-y-4 text-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "اسم الشركة (بالعربية) *" : "Company Name (Arabic) *"}
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    required
                    placeholder={isAr ? "مثال: الشركة الهندسية للأجهزة الطبية" : "e.g. BioMedix Egypt"}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "الاسم (بالإنجليزية) *" : "Company Name (English) *"}
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    required
                    placeholder="e.g. BioMedix Medical Systems"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "نوع الشركة والتصنيف *" : "Company Type *"}
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  >
                    <option value="MEDICAL_EQUIPMENT">{isAr ? "أجهزة ومعدات طبية" : "Medical Equipment"}</option>
                    <option value="PHARMACEUTICAL">{isAr ? "شركات ومخازن أدوية" : "Pharmaceuticals"}</option>
                    <option value="CHEMICAL_LAB_SUPPLY">{isAr ? "مستلزمات وكيماويات معامل" : "Chemical & Lab Supplies"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "الرابط الفرعي (Slug)" : "Slug"}
                  </label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="e.g. biomedix-medical"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "أقصى فترة تقسيط (شهور)" : "Max Installment (Months)"}
                  </label>
                  <select
                    name="maxInstallmentMonths"
                    defaultValue="24"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                  >
                    <option value="6">6 {isAr ? "شهور" : "Months"}</option>
                    <option value="12">12 {isAr ? "شهراً" : "Months"}</option>
                    <option value="18">18 {isAr ? "شهراً" : "Months"}</option>
                    <option value="24">24 {isAr ? "شهراً (سنتين)" : "Months (2 Yrs)"}</option>
                    <option value="36">36 {isAr ? "شهراً (3 سنوات)" : "Months (3 Yrs)"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "رقم الواتساب للطلبات والتقسيط *" : "WhatsApp for Installments *"}
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    required
                    placeholder="201004315212"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "رقم الهاتف المباشر" : "Direct Phone"}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="01004315212"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "المحافظة (بالعربية)" : "City (Arabic)"}
                  </label>
                  <input
                    type="text"
                    name="cityAr"
                    defaultValue="القاهرة"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? "المحافظة (بالإنجليزية)" : "City (English)"}
                  </label>
                  <input
                    type="text"
                    name="cityEn"
                    defaultValue="Cairo"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "العنوان ومقر الشركة التفصيلي" : "Detailed Company Address"}
                </label>
                <input
                  type="text"
                  name="addressAr"
                  placeholder={isAr ? "مثال: 45 شارع مكرم عبيد، مدينة نصر، القاهرة" : "e.g. 45 Makram Ebeid St, Nasr City, Cairo"}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? "نبذة عن الأجهزة والتسهيلات المقدمة" : "Bio & Equipment Details"}
                </label>
                <textarea
                  name="bioAr"
                  rows={2}
                  placeholder={isAr ? "أجهزة سونار 4D، كراسي أسنان، رسم قلب مع تقسيط بدون فوائد..." : "Ultrasound systems, dental units, ECG with flexible installments..."}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCompanyOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCompany}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-teal-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-teal-700 shadow-sm disabled:opacity-50"
                >
                  {isSubmittingCompany && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isAr ? "حفظ وإضافة الشركة" : "Save Company"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
