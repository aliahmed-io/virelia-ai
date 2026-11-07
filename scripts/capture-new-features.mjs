import { chromium } from "playwright";
import path from "path";

const SCREENSHOT_DIR = "d:/Virelia-AI/screenshots";
const BASE_URL = "http://localhost:3005";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
  });
  const page = await context.newPage();

  // 1. Companies Directory
  console.log("Capturing companies directory...");
  await page.goto(`${BASE_URL}/ar/companies`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "11_companies_directory_ar.png"), fullPage: true });

  // 2. Company Detail & Installments
  console.log("Capturing company detail...");
  await page.goto(`${BASE_URL}/ar/companies/biomedix-medical-equipment`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "12_company_detail_ar.png"), fullPage: true });

  // 3. Download App Page
  console.log("Capturing download app page...");
  await page.goto(`${BASE_URL}/ar/download`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "13_download_app_ar.png"), fullPage: true });

  // 4. Admin login & capture tabs
  console.log("Logging into admin...");
  await page.goto(`${BASE_URL}/ar/login`, { waitUntil: "networkidle" });
  await page.locator("button:has-text('حساب مدير النظام')").click();
  await page.waitForTimeout(200);
  await page.locator("button[type='submit']").click();
  await page.waitForURL("**/admin");
  await page.waitForTimeout(800);

  // Tab 4: Patients (showing new deceased management status/toggle)
  console.log("Capturing admin patients tab with deceased management...");
  await page.locator("button:has-text('المرضى وبطاقات العائلة')").click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_tab_patients_ar.png"), fullPage: true });

  // Tab 5: Companies & Installments
  console.log("Capturing admin companies tab...");
  await page.locator("button:has-text('الشركات والمعدات (بالتقسيط)')").click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_tab_companies_ar.png"), fullPage: true });

  // Open Add Company modal
  console.log("Capturing add company modal...");
  const addBtn = page.locator("button:has-text('إضافة شركة / مورد أجهزة جديد')");
  if (await addBtn.count() > 0) {
    await addBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "admin_modal_add_company_ar.png") });
    // Close modal
    await page.locator("button:has-text('✕')").first().click();
    await page.waitForTimeout(300);
  }

  // 5. Floating Tech Support widget on homepage
  console.log("Capturing floating support widget...");
  await page.goto(`${BASE_URL}/ar`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const supportBtn = page.locator("button[aria-label='فتح الدعم الفني'], button:has-text('الدعم الفني')").first();
  if (await supportBtn.count() > 0) {
    await supportBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "14_support_widget_ar.png") });
  }

  await browser.close();
  console.log("All new feature screenshots captured successfully!");
}

main().catch(console.error);
