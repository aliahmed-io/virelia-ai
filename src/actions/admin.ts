"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  upsertProvider,
  deleteProvider,
  createPatientUser,
  toggleUserActive,
  toggleProviderActive,
  createCategory,
  addFamilyMember,
  deleteFamilyMember,
  togglePatientDeceased,
  deletePatientUser,
  createMedicalCompany,
  toggleMedicalCompanyActive,
  deleteMedicalCompany,
} from "@/lib/data";
import type { CompanyType } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export interface AdminActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Upsert Provider (Admin only)
 */
export async function saveProviderAction(
  locale: string,
  prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string | null;
  const nameAr = (formData.get("nameAr") as string)?.trim();
  const nameEn = (formData.get("nameEn") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || nameEn.toLowerCase().replace(/\s+/g, "-");
  const categoryId = formData.get("categoryId") as string;
  const specialtyTitleAr = (formData.get("specialtyTitleAr") as string)?.trim() || nameAr;
  const specialtyTitleEn = (formData.get("specialtyTitleEn") as string)?.trim() || nameEn;
  const bioAr = (formData.get("bioAr") as string)?.trim() || "";
  const bioEn = (formData.get("bioEn") as string)?.trim() || "";
  const discountPercent = parseInt(formData.get("discountPercent") as string, 10) || 20;
  const cityAr = (formData.get("cityAr") as string)?.trim() || "القاهرة";
  const cityEn = (formData.get("cityEn") as string)?.trim() || "Cairo";
  const addressAr = (formData.get("addressAr") as string)?.trim() || "";
  const addressEn = (formData.get("addressEn") as string)?.trim() || "";
  const phone = (formData.get("phone") as string)?.trim() || "";
  const whatsapp = (formData.get("whatsapp") as string)?.trim() || "";
  const workingHoursAr = (formData.get("workingHoursAr") as string)?.trim() || undefined;
  const workingHoursEn = (formData.get("workingHoursEn") as string)?.trim() || undefined;
  const isFeatured = formData.get("isFeatured") === "true";
  const isActive = formData.get("isActive") !== "false";

  // Parse servicesJson
  const servicesJsonRaw = formData.get("servicesJson") as string;
  let servicesJson = [];
  try {
    servicesJson = servicesJsonRaw ? JSON.parse(servicesJsonRaw) : [];
  } catch {
    servicesJson = [];
  }

  if (!nameAr || !nameEn || !categoryId || !whatsapp) {
    return {
      error:
        locale === "ar"
          ? "يرجى استيفاء الحقول الأساسية (الاسم، القسم، رقم الواتساب)"
          : "Please complete required fields (Name, Category, WhatsApp)",
    };
  }

  try {
    await upsertProvider({
      id: id || undefined,
      slug,
      categoryId,
      nameAr,
      nameEn,
      specialtyTitleAr,
      specialtyTitleEn,
      bioAr,
      bioEn,
      discountPercent,
      servicesJson,
      cityAr,
      cityEn,
      addressAr,
      addressEn,
      phone,
      whatsapp,
      workingHoursAr,
      workingHoursEn,
      isFeatured,
      isActive,
    });

    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/directory`);
    revalidatePath(`/${locale}`);

    return { success: true };
  } catch {
    return { error: "Failed to save provider" };
  }
}

/**
 * Delete Provider (Admin only)
 */
export async function deleteProviderAction(locale: string, providerId: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await deleteProvider(providerId);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/directory`);
    return { success: true };
  } catch {
    return { error: "Failed to delete provider" };
  }
}

/**
 * Toggle Provider Active Status (Admin only)
 */
export async function toggleProviderStatusAction(locale: string, providerId: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await toggleProviderActive(providerId);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/directory`);
    return { success: true };
  } catch {
    return { error: "Failed to toggle provider status" };
  }
}

/**
 * Register New Patient (Admin only)
 */
export async function registerPatientAction(
  locale: string,
  prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const fullNameAr = (formData.get("fullNameAr") as string)?.trim();
  const fullNameEn = (formData.get("fullNameEn") as string)?.trim() || undefined;
  const nationalId = (formData.get("nationalId") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const passwordPlain = (formData.get("password") as string)?.trim() || nationalId;

  if (!fullNameAr || !nationalId || !phone) {
    return {
      error:
        locale === "ar"
          ? "يرجى إدخال الاسم، الرقم القومي ورقم الهاتف"
          : "Please fill full name, national ID and phone",
    };
  }

  if (nationalId.length !== 14 || !/^\d+$/.test(nationalId)) {
    return {
      error:
        locale === "ar"
          ? "يجب أن يتكون الرقم القومي من 14 رقماً"
          : "National ID must be exactly 14 digits",
    };
  }

  try {
    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    await createPatientUser({
      nationalId,
      passwordHash,
      fullNameAr,
      fullNameEn,
      phone,
    });

    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch {
    return { error: "Failed to register patient" };
  }
}

/**
 * Toggle User / Card Active Status (Admin only)
 */
export async function toggleUserStatusAction(locale: string, userId: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await toggleUserActive(userId);
    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch {
    return { error: "Failed to toggle user status" };
  }
}

/**
 * Create New Category or Doctor Sub-Specialty (Admin only)
 */
export async function createCategoryAction(
  locale: string,
  prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const nameAr = (formData.get("nameAr") as string)?.trim();
  const nameEn = (formData.get("nameEn") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || nameEn.toLowerCase().replace(/\s+/g, "-");
  const iconName = (formData.get("iconName") as string)?.trim() || "Activity";
  const parentId = (formData.get("parentId") as string)?.trim() || null;

  if (!nameAr || !nameEn || !slug) {
    return {
      error:
        locale === "ar"
          ? "يرجى استيفاء الاسم بالعربية والإنجليزية والرابط"
          : "Please provide Arabic name, English name and slug",
    };
  }

  try {
    await createCategory({
      nameAr,
      nameEn,
      slug,
      iconName,
      parentId: parentId === "none" ? null : parentId,
    });

    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/directory`);
    revalidatePath(`/${locale}`);
    return { success: true };
  } catch {
    return { error: "Failed to create category" };
  }
}

/**
 * Admin add family member to any patient
 */
export async function adminAddFamilyMemberAction(
  locale: string,
  parentUserId: string,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const fullNameAr = (formData.get("fullNameAr") as string)?.trim();
  const nationalId = (formData.get("nationalId") as string)?.trim();
  const relationAr = (formData.get("relationAr") as string)?.trim();

  if (!fullNameAr || !nationalId || !relationAr) {
    return { error: "Missing required fields" };
  }

  const relationMap: Record<string, string> = {
    زوجة: "Spouse",
    زوج: "Spouse",
    ابن: "Son",
    ابنة: "Daughter",
    أب: "Father",
    أم: "Mother",
  };
  const relationEn = relationMap[relationAr] ?? "Dependent";

  try {
    await addFamilyMember({
      parentUserId,
      fullNameAr,
      fullNameEn: fullNameAr,
      nationalId,
      relationAr,
      relationEn,
    });

    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch {
    return { error: "Failed to add family member" };
  }
}

/**
 * Admin remove family member
 */
export async function adminDeleteFamilyMemberAction(locale: string, memberId: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await deleteFamilyMember(memberId);
    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch {
    return { error: "Failed to delete family member" };
  }
}

/**
 * Toggle patient deceased status (Admin only)
 */
export async function togglePatientDeceasedAction(locale: string, userId: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await togglePatientDeceased(userId);
    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch {
    return { error: "Failed to toggle deceased status" };
  }
}

/**
 * Delete patient user permanently (Admin only)
 */
export async function deletePatientAction(locale: string, userId: string): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await deletePatientUser(userId);
    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch {
    return { error: "Failed to delete patient" };
  }
}

/**
 * Save / Create Medical Company (Admin only)
 */
export async function saveMedicalCompanyAction(
  locale: string,
  prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const nameAr = (formData.get("nameAr") as string)?.trim();
  const nameEn = (formData.get("nameEn") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || nameEn.toLowerCase().replace(/\s+/g, "-");
  const type = (formData.get("type") as string) as CompanyType;
  const phone = (formData.get("phone") as string)?.trim() || "";
  const whatsapp = (formData.get("whatsapp") as string)?.trim() || "";
  const cityAr = (formData.get("cityAr") as string)?.trim() || "القاهرة";
  const cityEn = (formData.get("cityEn") as string)?.trim() || "Cairo";
  const addressAr = (formData.get("addressAr") as string)?.trim() || "";
  const addressEn = (formData.get("addressEn") as string)?.trim() || "";
  const bioAr = (formData.get("bioAr") as string)?.trim() || "";
  const bioEn = (formData.get("bioEn") as string)?.trim() || "";
  const maxInstallmentMonths = parseInt(formData.get("maxInstallmentMonths") as string, 10) || 24;

  if (!nameAr || !nameEn || !type || !whatsapp) {
    return {
      error:
        locale === "ar"
          ? "يرجى استيفاء الحقول الأساسية (اسم الشركة، النوع، ورقم الواتساب)"
          : "Please fill required company fields (Name, Type, WhatsApp)",
    };
  }

  try {
    await createMedicalCompany({
      nameAr,
      nameEn,
      slug,
      type,
      phone,
      whatsapp,
      cityAr,
      cityEn,
      addressAr,
      addressEn,
      bioAr,
      bioEn,
      maxInstallmentMonths,
    });

    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/companies`);
    return { success: true };
  } catch {
    return { error: "Failed to create medical company" };
  }
}

/**
 * Toggle Medical Company Active Status (Admin only)
 */
export async function toggleMedicalCompanyStatusAction(
  locale: string,
  companyId: string
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await toggleMedicalCompanyActive(companyId);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/companies`);
    return { success: true };
  } catch {
    return { error: "Failed to toggle company status" };
  }
}

/**
 * Delete Medical Company (Admin only)
 */
export async function deleteMedicalCompanyAction(
  locale: string,
  companyId: string
): Promise<AdminActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await deleteMedicalCompany(companyId);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/companies`);
    return { success: true };
  } catch {
    return { error: "Failed to delete company" };
  }
}

