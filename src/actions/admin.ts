"use server";

import { getCurrentUser } from "@/lib/auth";
import { upsertProvider, deleteProvider, getProviderBySlug } from "@/lib/data";
import { revalidatePath } from "next/cache";

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
  } catch (e) {
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
