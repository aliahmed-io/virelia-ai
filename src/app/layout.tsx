import React from "react";
import "./globals.css";

export const metadata = {
  title: "Family Health | صحة الأسرة — رعاية شاملة لكل جيل",
  description:
    "شبكة الخصومات الطبية المعتمدة في مصر - خصومات حقيقية من أول استخدام بدون موافقات أو حد أقصى مع حجز مباشر عبر واتساب.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
