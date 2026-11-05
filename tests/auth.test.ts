import { describe, it, expect } from "vitest";
import { signSessionToken, verifySessionToken } from "../src/lib/auth";

describe("Authentication JWT Utility Tests", () => {
  it("successfully signs and verifies a valid session payload", async () => {
    const payload = {
      userId: "test-user-id",
      nationalId: "29901011234567",
      fullNameAr: "أحمد علي إبراهيم",
      fullNameEn: "Ahmed Ali Ibrahim",
      phone: "+201012345678",
      role: "PATIENT" as const,
      membershipNo: "FH-2025-001122",
    };

    const token = await signSessionToken(payload);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.nationalId).toBe(payload.nationalId);
    expect(decoded?.role).toBe("PATIENT");
    expect(decoded?.membershipNo).toBe(payload.membershipNo);
  });

  it("returns null for an invalid or tampered token", async () => {
    const invalidToken = "invalid.token.structure";
    const result = await verifySessionToken(invalidToken);
    expect(result).toBeNull();
  });
});
