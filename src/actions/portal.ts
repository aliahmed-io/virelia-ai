"use server";

import { getCurrentUser } from "@/lib/auth";
import { addFamilyMember, deleteFamilyMember } from "@/lib/data";
import { revalidatePath } from "next/cache";

export interface PortalActionResult {
  error?: string;
  success?: boolean;
}

export async function addFamilyMemberAction(
  locale: string,
  prevState: PortalActionResult | null,
  formData: FormData
): Promise<PortalActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: locale === "ar" ? "يجب تسجيل الدخول أولاً" : "Authentication required",
    };
  }

  const fullNameAr = (formData.get("fullNameAr") as string)?.trim();
  const fullNameEn = (formData.get("fullNameEn") as string)?.trim() || undefined;
  const nationalId = (formData.get("nationalId") as string)?.trim();
  const relationAr = (formData.get("relationAr") as string)?.trim();

  if (!fullNameAr || !nationalId || !relationAr) {
    return {
      error:
        locale === "ar"
          ? "يرجى استيفاء جميع الحقول المطلوبة (الاسم، الرقم القومي، صلة القرابة)"
          : "Please fill all required fields (Name, National ID, Relationship)",
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

  // Map Arabic relation to English relation
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
      parentUserId: user.userId,
      fullNameAr,
      fullNameEn,
      nationalId,
      relationAr,
      relationEn,
    });

    revalidatePath(`/${locale}/portal`);
    revalidatePath(`/${locale}/verify/${user.membershipNo}`);

    return { success: true };
  } catch {
    return {
      error:
        locale === "ar"
          ? "حدث خطأ أثناء إضافة فرد العائلة، يرجى المحاولة لاحقاً"
          : "Failed to add family member. Please try again.",
    };
  }
}

export async function removeFamilyMemberAction(
  locale: string,
  memberId: string
): Promise<PortalActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: locale === "ar" ? "يجب تسجيل الدخول أولاً" : "Authentication required",
    };
  }

  try {
    await deleteFamilyMember(memberId);
    revalidatePath(`/${locale}/portal`);
    revalidatePath(`/${locale}/verify/${user.membershipNo}`);
    return { success: true };
  } catch {
    return {
      error:
        locale === "ar"
          ? "حدث خطأ أثناء حذف فرد العائلة"
          : "Failed to remove family member",
    };
  }
}
