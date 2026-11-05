"use server";

import { authenticateCredentials, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface LoginActionResult {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  locale: string,
  prevState: LoginActionResult | null,
  formData: FormData
): Promise<LoginActionResult> {
  const nationalId = formData.get("nationalId") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  if (!nationalId || !password) {
    return {
      error:
        locale === "ar"
          ? "يرجى إدخال الرقم القومي وكلمة المرور"
          : "Please enter both National ID and Password",
    };
  }

  const authResult = await authenticateCredentials(nationalId, password);

  if (!authResult) {
    return {
      error:
        locale === "ar"
          ? "الرقم القومي أو كلمة المرور غير صحيحة"
          : "Invalid National ID or Password",
    };
  }

  await setSessionCookie(authResult.token);

  if (redirectTo && redirectTo.startsWith(`/${locale}`)) {
    redirect(redirectTo);
  }

  if (authResult.user.role === "ADMIN") {
    redirect(`/${locale}/admin`);
  } else {
    redirect(`/${locale}/portal`);
  }
}

export async function logoutAction(locale: string) {
  await clearSessionCookie();
  redirect(`/${locale}/login`);
}
