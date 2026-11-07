/**
 * Official Contact & Technical Support Numbers for Family Health
 * رقم الدعم الفني 1: 01004315212
 * رقم الدعم الفني 2: 01117945122
 */

export interface SupportContact {
  phone: string;
  international: string;
  display: string;
  labelAr: string;
  labelEn: string;
  whatsappUrl: string;
  telUrl: string;
}

export const TECH_SUPPORT_CONTACTS: SupportContact[] = [
  {
    phone: "01004315212",
    international: "201004315212",
    display: "01004315212",
    labelAr: "الدعم الفني الرئيسي",
    labelEn: "Primary Tech Support",
    whatsappUrl: "https://wa.me/201004315212",
    telUrl: "tel:01004315212",
  },
  {
    phone: "01117945122",
    international: "201117945122",
    display: "01117945122",
    labelAr: "خدمة العملاء والتقسيط",
    labelEn: "Customer Care & Installments",
    whatsappUrl: "https://wa.me/201117945122",
    telUrl: "tel:01117945122",
  },
];
