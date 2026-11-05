import { chromium } from "playwright";
import path from "path";

const SCREENSHOT_DIR = "d:/Virelia-AI/screenshots";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
  });
  const page = await context.newPage();

  // Login as Admin
  await page.goto("http://localhost:3000/ar/login", { waitUntil: "networkidle" });
  await page.locator("button:has-text('حساب مدير النظام')").click();
  await page.waitForTimeout(200);
  await page.locator("button[type='submit']").click();
  await page.waitForURL("**/admin");
  await page.waitForTimeout(800);

  // 1. Providers Tab
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_tab_providers_ar.png"), fullPage: true });

  // 2. Open Add Provider Modal
  await page.locator("button:has-text('إضافة عيادة / مركز طبي جديد')").click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_modal_add_provider_ar.png") });
  // Close modal
  await page.locator("button:has-text('✕')").first().click();
  await page.waitForTimeout(300);

  // 3. Patients & Cards Tab
  await page.locator("button:has-text('المرضى وبطاقات العائلة')").click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_tab_patients_ar.png"), fullPage: true });

  // 4. Categories & Specialties Tab
  await page.locator("button:has-text('الأقسام والتخصصات')").click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_tab_categories_ar.png"), fullPage: true });

  // 5. WhatsApp Bookings Tab
  await page.locator("button:has-text('سجل حجوزات الواتساب')").click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_tab_bookings_ar.png"), fullPage: true });

  // 6. English Admin Dashboard
  await page.goto("http://localhost:3000/en/admin", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_dashboard_en.png"), fullPage: true });

  await browser.close();
  console.log("All admin screenshots captured!");
}

main().catch(console.error);
