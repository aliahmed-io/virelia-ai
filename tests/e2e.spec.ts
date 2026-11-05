import { test, expect } from "@playwright/test";

test.describe("Family Health (صحة الأسرة) Platform E2E Suite", () => {
  test("1. Home opens as a care workspace", async ({ page }) => {
    await page.goto("/ar");
    await expect(page).toHaveTitle(/صحة الأسرة/);
    await expect(page.getByRole("heading", { name: "رعاية أقرب لك ولأسرتك" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ابحث عن الرعاية المناسبة" })).toBeVisible();
    await expect(page.locator("footer")).toHaveCount(0);
  });

  test("2. Language switching preserves page and search and mirrors direction", async ({ page }) => {
    await page.goto("/ar/directory?q=Tarek&category=doctors");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await page.getByRole("button", { name: "English", exact: true }).filter({ visible: true }).click();
    await page.waitForURL("**/en/directory?q=Tarek&category=doctors");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByPlaceholder("Search doctor, clinic, specialty or location...")).toHaveValue("Tarek");
    await page.getByRole("button", { name: "العربية", exact: true }).filter({ visible: true }).click();
    await page.waitForURL("**/ar/directory?q=Tarek&category=doctors");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  });

  test("App screens fit both languages without horizontal overflow", async ({ page }) => {
    for (const locale of ["ar", "en"]) {
      for (const path of ["", "/directory", "/login", "/providers/dr-tarek-el-banna", "/verify/FH-2025-998877"]) {
        await page.goto(`/${locale}${path}`);
        await expect(page.locator("main")).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    }
  });

  test("3. Directory search and category filter bar interactively filters providers", async ({ page }) => {
    await page.goto("/ar/directory");

    // Verify initial provider count
    await expect(page.getByText("مقدمو الخدمة المعتمدون")).toBeVisible();

    // Click 'أطباء' filter
    const doctorsBtn = page.getByRole("button", { name: "أطباء", exact: true });
    await doctorsBtn.click();

    // Verify sub-specialties appear and click 'عظام'
    const orthopedicsBtn = page.getByRole("button", { name: "عظام", exact: true });
    await expect(orthopedicsBtn).toBeVisible();
    await orthopedicsBtn.click();

    // Verify filtered card
    await expect(page.getByText("مركز النخبة لجراحة العظام والمفاصل")).toBeVisible();
  });

  test("4. WhatsApp booking modal generates live formatted 5-point template", async ({ page }) => {
    await page.goto("/ar/providers/dr-tarek-el-banna");

    await expect(page.getByText("عيادة د. طارق البنا - استشاري الباطنة والسكري")).toBeVisible();

    // Open booking modal
    const bookBtn = page.getByRole("button", { name: "حجز عبر واتساب" }).first();
    await bookBtn.click();

    // Verify modal elements
    await expect(page.getByText("تأكيد تفاصيل الحجز وتطبيق الخصم")).toBeVisible();
    await expect(page.getByText(/مرحباً، أرغب في حجز موعد عبر كارت صحة الأسرة/)).toBeVisible();
    await expect(page.getByText(/التخصص: استشاري الأمراض الباطنية والسكر والغدد الصماء/)).toBeVisible();
  });

  test("5. Patient login, 3D flip card, and dependent addition workflow", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/ar/login");

    // Fill credentials using input[name=...]
    await page.locator("input[name='nationalId']").fill("29901011234567");
    await page.locator("input[name='password']").fill("Patient@123");
    await page.getByRole("button", { name: "تسجيل الدخول", exact: true }).click();

    // Wait for redirection to /portal
    await page.waitForURL("**/ar/portal");

    // Check digital card front
    await expect(page.getByText("كارت صحة الأسرة الرقمي وإدارة التابعين")).toBeVisible();
    await expect(page.locator("main").getByText("محمود حسن عبد الرحيم").first()).toBeVisible();
    await expect(page.locator("main").getByText("FH-2025-998877").first()).toBeVisible();

    // Flip card to view back terms
    const flipBtn = page.getByRole("button", { name: "عرض ظهر الكارت" });
    await flipBtn.click();
    await expect(page.getByText("شروط وتعليمات استخدام كارت صحة الأسرة:")).toBeVisible();

    // Add family dependent
    const addMemberBtn = page.getByRole("button", { name: "إضافة فرد جديد للأسرة" });
    await addMemberBtn.click();

    await page.locator("input[name='fullNameAr']").fill("عمر محمود حسن");
    await page.locator("input[name='nationalId']").fill("32201011234567");
    await page.locator("select[name='relationAr']").selectOption("ابن");
    await page.getByRole("button", { name: "حفظ وإضافة التابع" }).click();

    // Verify added dependent appears in the dependents table
    await expect(page.getByText("عمر محمود حسن")).toBeVisible();
  });

  test("6. Public QR verification page verifies card validity at clinic reception", async ({ page }) => {
    await page.goto("/ar/verify/FH-2025-998877");

    await expect(page.getByText("بطاقة صحة الأسرة معتمدة وسارية 🌿")).toBeVisible();
    await expect(page.getByText("محمود حسن عبد الرحيم")).toBeVisible();
    await expect(page.getByText(/أفراد الأسرة المشمولون بالخصم/)).toBeVisible();
  });

  test("7. Admin login and dashboard administration management", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/ar/login");

    // Fill admin credentials
    await page.locator("input[name='nationalId']").fill("10000000000000");
    await page.locator("input[name='password']").fill("Admin@1234");
    await page.getByRole("button", { name: "تسجيل الدخول", exact: true }).click();

    // Wait for redirect to /admin
    await page.waitForURL("**/ar/admin");

    await expect(page.getByText("لوحة التحكم في شبكة صحة الأسرة")).toBeVisible();
    await expect(page.getByText("مقدمو الخدمة والعيادات").first()).toBeVisible();
    await expect(page.getByText("المرضى وبطاقات العائلة")).toBeVisible();
  });
});
