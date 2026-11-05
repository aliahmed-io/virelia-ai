"use server";

import { getCurrentUser } from "@/lib/auth";
import { addPatientDocument, deletePatientDocument } from "@/lib/data";
import { revalidatePath } from "next/cache";
import type { PatientDocumentItem } from "@/lib/mock-data";

export interface DocumentActionResult {
  error?: string;
  success?: boolean;
  document?: PatientDocumentItem;
}

export async function uploadDocumentAction(
  locale: string,
  prevState: DocumentActionResult | null,
  formData: FormData
): Promise<DocumentActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: locale === "ar" ? "يجب تسجيل الدخول أولاً" : "Authentication required",
    };
  }

  const title = (formData.get("title") as string)?.trim();
  const categoryRaw = (formData.get("category") as string)?.trim() || "other";
  const file = formData.get("file") as File | null;

  if (!title) {
    return {
      error:
        locale === "ar"
          ? "يرجى إدخال اسم أو وصف للمستند"
          : "Please provide a document title or description",
    };
  }

  if (!file || file.size === 0) {
    return {
      error: locale === "ar" ? "يرجى اختيار ملف لرفعه" : "Please select a file to upload",
    };
  }

  // Max 10MB limit
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return {
      error:
        locale === "ar"
          ? "حجم الملف يتجاوز الحد الأقصى المسموح به (10 ميجابايت)"
          : "File size exceeds the 10MB maximum limit",
    };
  }

  const fileName = file.name;
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const mimeType = file.type.toLowerCase();

  let fileType: "IMAGE" | "PDF" | "WORD" = "PDF";

  if (
    mimeType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)
  ) {
    fileType = "IMAGE";
  } else if (
    mimeType === "application/pdf" ||
    extension === "pdf"
  ) {
    fileType = "PDF";
  } else if (
    mimeType.includes("word") ||
    mimeType.includes("officedocument") ||
    ["doc", "docx"].includes(extension)
  ) {
    fileType = "WORD";
  } else {
    return {
      error:
        locale === "ar"
          ? "صيغة الملف غير مدعومة. يرجى رفع صور (JPG/PNG)، ملفات PDF أو مستندات Word (DOC/DOCX) فقط"
          : "Unsupported file format. Please upload images, PDF, or Word documents (.doc, .docx) only",
    };
  }

  const allowedCategories = ["prescription", "lab", "radiology", "report", "other"] as const;
  const category = (
    allowedCategories.includes(categoryRaw as (typeof allowedCategories)[number])
      ? categoryRaw
      : "other"
  ) as PatientDocumentItem["category"];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resolvedMime = mimeType || (
      fileType === "IMAGE" ? `image/${extension || "png"}` :
      fileType === "PDF" ? "application/pdf" :
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    const fileUrl = `data:${resolvedMime};base64,${buffer.toString("base64")}`;

    const newDoc = await addPatientDocument({
      userId: user.userId,
      title,
      category,
      fileType,
      fileName,
      fileSize: file.size,
      fileUrl,
    });

    revalidatePath(`/${locale}/portal`);

    return {
      success: true,
      document: newDoc,
    };
  } catch {
    return {
      error:
        locale === "ar"
          ? "حدث خطأ أثناء رفع وحفظ الملف، يرجى المحاولة لاحقاً"
          : "An error occurred while uploading the file. Please try again.",
    };
  }
}

export async function deleteDocumentAction(
  locale: string,
  documentId: string
): Promise<DocumentActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: locale === "ar" ? "يجب تسجيل الدخول أولاً" : "Authentication required",
    };
  }

  try {
    await deletePatientDocument(documentId);
    revalidatePath(`/${locale}/portal`);
    return { success: true };
  } catch {
    return {
      error:
        locale === "ar"
          ? "حدث خطأ أثناء حذف المستند"
          : "An error occurred while deleting the document",
    };
  }
}
