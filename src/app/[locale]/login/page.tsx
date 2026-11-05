import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/brand/Logo";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  const { redirect: redirectTo } = await searchParams;

  const currentUser = await getCurrentUser();
  if (currentUser) {
    if (currentUser.role === "ADMIN") {
      redirect(`/${locale}/admin`);
    } else {
      redirect(`/${locale}/portal`);
    }
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="mb-8">
        <Logo locale={locale} size="lg" />
      </div>

      <LoginForm locale={locale} redirectTo={redirectTo} />
    </div>
  );
}
