"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";

interface FaqSectionProps {
  locale: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ locale }) => {
  const isAr = locale === "ar";
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = isAr
    ? [
        {
          q: "هل أحتاج موافقة شركة تأمين أو انتظار قبل الكشف؟",
          a: "إطلاقاً! ميزة كارت صحة الأسرة أنه يعمل بنظام الخصم النقدي الفوري المباشر. تذهب للعيادة أو المعمل وتبرز كارتك أو رقمك القومي، وتحصل على الخصم فورياً بدون أي استمارات أو موافقات مسبقة.",
        },
        {
          q: "كيف يستفيد أفراد عائلتي من الكارت الموحد (الإضافة للكل)؟",
          a: "من خلال بوابة المريض، يمكنك إضافة زوجتك وأبنائك ووالديك برقمهم القومي. بمجرد إضافتهم، يحق لهم التوجه لأي عيادة والاستفادة من نفس نسب الخصم المعتمدة لحامل الكارت الرئيسي.",
        },
        {
          q: "هل يوجد حد أقصى للمبالغ الموفرة أو عدد الزيارات الطبية؟",
          a: "لا يوجد أي حد أقصى لعدد مرات الكشف أو الفحوصات أو التحاليل طوال مدة سريان العضوية. الخصم ساري في كل زيارة لأي منشأة طبية شريكة.",
        },
        {
          q: "كيف يعمل نظام الحجز التلقائي عبر واتساب؟",
          a: "بمجرد الضغط على زر 'حجز عبر واتساب' بجانب أي طبيب أو مركز، يقوم النظام بصياغة رسالة حجز رسمية تشمل اسم المريض، تخصص المركز، العنوان، ورقم العضوية لإرسالها مباشرة لرقم واتساب العيادة المعتمد.",
        },
        {
          q: "هل يشمل الكارت العمليات الجراحية والولادة والأسنان؟",
          a: "نعم، تشمل الشبكة خصومات خاصة على جراحات اليوم الواحد، الولادة، تركيبات وزراعة وتبييض الأسنان، وتصحيح الإبصار بالفيمتو ليزك بنسب توفير قياسية.",
        },
      ]
    : [
        {
          q: "Do I need prior insurance approvals or waiting times?",
          a: "Not at all! Family Health operates as an instant direct discount network. Simply present your digital card or National ID at any partner facility to receive your discount on the spot.",
        },
        {
          q: "How do my family members benefit under the single card?",
          a: "Through your Patient Portal, you can add your spouse, children, and parents using their National IDs. All registered dependents immediately qualify for the exact same discount tiers.",
        },
        {
          q: "Is there a ceiling on total savings or visit count?",
          a: "Zero limits or visit caps. Your discounts apply without restrictions across all network providers for the entire duration of your membership.",
        },
        {
          q: "How does the direct WhatsApp booking workflow work?",
          a: "Clicking 'Book via WhatsApp' generates a formatted appointment dispatch containing patient name, provider specialty, clinic address, and membership ID directly to the facility's reception WhatsApp.",
        },
        {
          q: "Are surgical operations, dental, and lasik covered?",
          a: "Yes, our network covers day surgeries, maternity, dental implants/orthodontics, and Femto-LASIK vision correction with savings up to 50%.",
        },
      ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="bg-white py-8 sm:py-24 border-t border-slate-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal-50 px-3 py-1 text-xs font-bold text-brand-teal-800 border border-brand-teal-200">
            <HelpCircle className="h-3.5 w-3.5 text-brand-teal-600" />
            <span>{isAr ? "الأسئلة الأكثر شيوعاً" : "Frequently Asked Questions"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isAr ? "كل ما تود معرفته عن كارت صحة الأسرة" : "Everything You Need to Know"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            {isAr
              ? "إجابات واضحة ومباشرة حول آلية الخصم الفوري وإدارة بطاقات العائلة"
              : "Clear answers regarding instant discounts and family card management"}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 transition-all hover:border-brand-teal-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-start font-bold text-sm text-slate-900 focus:outline-none"
                >
                  <span className="pe-4">{faq.q}</span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-teal-600" : "text-slate-400"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-200/60 bg-white p-5 text-start text-xs sm:text-sm leading-relaxed text-slate-600 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
