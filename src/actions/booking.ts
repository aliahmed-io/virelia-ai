"use server";

import { recordBookingLog, getProviderBySlug } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export interface BookingInput {
  providerSlug: string;
  patientName: string;
  patientPhone: string;
  nationalId?: string;
  locale: "ar" | "en";
}

export interface BookingResponse {
  whatsappUrl: string;
  success: boolean;
  error?: string;
}

export async function submitWhatsAppBooking(data: BookingInput): Promise<BookingResponse> {
  const provider = await getProviderBySlug(data.providerSlug);
  if (!provider) {
    return {
      success: false,
      whatsappUrl: "",
      error: data.locale === "ar" ? "لم يتم العثور على المنشأة الطبية" : "Provider not found",
    };
  }

  const currentUser = await getCurrentUser();

  // Log to database / runtime repository
  try {
    await recordBookingLog({
      providerId: provider.id,
      userId: currentUser?.userId ?? null,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      nationalId: data.nationalId || (currentUser?.nationalId ?? null),
    });
  } catch (e) {
    console.error("Booking log failed:", e);
  }

  // Sanitize WhatsApp phone number: remove non-digits
  const cleanPhone = provider.whatsapp.replace(/\D/g, "");

  // Format message text
  let messageText = "";
  const idValue = data.nationalId || (currentUser?.nationalId ?? (data.locale === "ar" ? "زائر غير مسجل" : "Unregistered Guest"));

  if (data.locale === "ar") {
    messageText = `مرحباً، أرغب في حجز موعد عبر كارت صحة الأسرة (Family Health) 🌿
• الاسم: ${data.patientName}
• التخصص: ${provider.specialtyTitleAr} - ${provider.nameAr}
• العنوان: ${provider.addressAr}
• التليفون: ${data.patientPhone}
• رقم العضوية / الرقم القومي: ${idValue}`;
  } else {
    messageText = `Hello, I would like to book an appointment via Family Health (F.H) Card 🌿
• Name: ${data.patientName}
• Specialty: ${provider.specialtyTitleEn} - ${provider.nameEn}
• Address: ${provider.addressEn}
• Phone: ${data.patientPhone}
• Membership / National ID: ${idValue}`;
  }

  const encodedMessage = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return {
    success: true,
    whatsappUrl,
  };
}
