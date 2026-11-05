import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getUserByNationalId } from "./data";
import type { UserItem } from "./mock-data";

const COOKIE_NAME = "fh_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "family-health-super-secure-jwt-secret-key-32chars-minimum-2025"
);

export interface SessionPayload {
  userId: string;
  nationalId: string;
  fullNameAr: string;
  fullNameEn: string;
  phone: string;
  role: "ADMIN" | "PATIENT";
  membershipNo: string;
  exp?: number;
}

/**
 * Sign a new JWT session token (valid for 30 days)
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET_KEY);
}

/**
 * Verify and decode session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Authenticate credentials (National ID + Password)
 */
export async function authenticateCredentials(
  nationalId: string,
  passwordPlain: string
): Promise<{ user: UserItem; token: string } | null> {
  const cleanId = nationalId.trim();
  const user = await getUserByNationalId(cleanId);

  if (!user || !user.isActive) {
    return null;
  }

  // Support demo passwords directly or bcrypt compare
  const isMatch =
    passwordPlain === "Admin@1234" && user.role === "ADMIN"
      ? true
      : passwordPlain === "Patient@123" && user.role === "PATIENT"
      ? true
      : await bcrypt.compare(passwordPlain, user.passwordHash).catch(() => false);

  if (!isMatch) {
    return null;
  }

  const token = await signSessionToken({
    userId: user.id,
    nationalId: user.nationalId,
    fullNameAr: user.fullNameAr,
    fullNameEn: user.fullNameEn,
    phone: user.phone,
    role: user.role,
    membershipNo: user.membershipNo,
  });

  return { user, token };
}

/**
 * Set HTTP-only session cookie
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/**
 * Clear session cookie on logout
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get current session user from request cookies
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}
