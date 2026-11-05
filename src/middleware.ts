import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware(routing);
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "family-health-super-secure-jwt-secret-key-32chars-minimum-2025"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale prefix if present
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  const locale =
    maybeLocale && routing.locales.includes(maybeLocale as "ar" | "en")
      ? maybeLocale
      : routing.defaultLocale;

  const pathWithoutLocale = segments.slice(2).join("/");

  // Route protection
  const isPortal = pathWithoutLocale === "portal" || pathWithoutLocale.startsWith("portal/");
  const isAdmin = pathWithoutLocale === "admin" || pathWithoutLocale.startsWith("admin/");

  if (isPortal || isAdmin) {
    const token = request.cookies.get("fh_session")?.value;

    if (!token) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      const role = payload.role as string;

      if (isAdmin && role !== "ADMIN") {
        const portalUrl = new URL(`/${locale}/portal`, request.url);
        return NextResponse.redirect(portalUrl);
      }
    } catch {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("fh_session");
      return res;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
