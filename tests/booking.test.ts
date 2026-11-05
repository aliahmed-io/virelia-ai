import { describe, it, expect } from "vitest";
import { submitWhatsAppBooking } from "../src/actions/booking";

describe("WhatsApp Booking Dispatch Engine", () => {
  it("formats Arabic WhatsApp booking URL with all 5 mandatory fields", async () => {
    const res = await submitWhatsAppBooking({
      providerSlug: "dr-tarek-el-banna",
      patientName: "محمود حسن",
      patientPhone: "01012345678",
      nationalId: "29901011234567",
      locale: "ar",
    });

    expect(res.success).toBe(true);
    expect(res.whatsappUrl).toContain("https://wa.me/201012345678?text=");

    const decoded = decodeURIComponent(res.whatsappUrl);
    expect(decoded).toContain("صحة الأسرة");
    expect(decoded).toContain("محمود حسن");
    expect(decoded).toContain("01012345678");
    expect(decoded).toContain("29901011234567");
    expect(decoded).toContain("د. طارق البنا");
  });

  it("formats English WhatsApp booking URL correctly", async () => {
    const res = await submitWhatsAppBooking({
      providerSlug: "dr-tarek-el-banna",
      patientName: "John Doe",
      patientPhone: "01099887766",
      nationalId: "Guest",
      locale: "en",
    });

    expect(res.success).toBe(true);
    expect(res.whatsappUrl).toContain("https://wa.me/201012345678?text=");

    const decoded = decodeURIComponent(res.whatsappUrl);
    expect(decoded).toContain("Family Health (F.H) Card");
    expect(decoded).toContain("John Doe");
    expect(decoded).toContain("01099887766");
  });
});
