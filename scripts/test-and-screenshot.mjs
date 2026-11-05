import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const SCREENSHOT_DIR = "d:/Virelia-AI/screenshots";
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log("🚀 Launching Playwright browser testing and visual verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Test 1: Arabic Homepage
  console.log("📸 Capturing: 01_home_ar.png");
  await page.goto("http://localhost:3000/ar", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01_home_ar.png"), fullPage: true });

  // Test 2: English Homepage
  console.log("📸 Capturing: 02_home_en.png");
  await page.goto("http://localhost:3000/en", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "02_home_en.png"), fullPage: true });

  // Test 3: Directory in Arabic + Category selection
  console.log("📸 Capturing: 03_directory_ar.png");
  await page.goto("http://localhost:3000/ar/directory", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "03_directory_ar.png"), fullPage: true });

  // Test 4: Provider Detail Page with Discount Table
  console.log("📸 Capturing: 04_provider_detail_ar.png");
  await page.goto("http://localhost:3000/ar/providers/dr-tarek-el-banna", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04_provider_detail_ar.png"), fullPage: true });

  // Test 5: Open WhatsApp Booking Modal
  console.log("📸 Capturing: 05_booking_modal_ar.png");
  const bookButton = page.locator("button:has-text('حجز عبر واتساب')").first();
  if (await bookButton.isVisible()) {
    await bookButton.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "05_booking_modal_ar.png") });
    // Close modal
    await page.keyboard.press("Escape");
  }

  // Test 6: Login Screen
  console.log("📸 Capturing: 06_login_ar.png");
  await page.goto("http://localhost:3000/ar/login", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "06_login_ar.png") });

  // Test 7: Log in as Patient using 1-Click Demo
  console.log("🔐 Testing 1-click patient sign-in...");
  const patientDemoBtn = page.locator("button:has-text('حساب مريض + عائلة')");
  await patientDemoBtn.click();
  await page.waitForTimeout(200);
  await page.locator("button[type='submit']").click();
  await page.waitForURL("**/portal", { timeout: 10000 });
  await page.waitForTimeout(1000);
  console.log("📸 Capturing: 07_portal_patient_ar.png");
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "07_portal_patient_ar.png"), fullPage: true });

  // Test 8: Public Card Verification Page (QR link)
  console.log("📸 Capturing: 08_verify_card_ar.png");
  await page.goto("http://localhost:3000/ar/verify/FH-2025-998877", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "08_verify_card_ar.png"), fullPage: true });

  // Test 9: Log in as Admin
  console.log("🔐 Testing Admin sign-in...");
  await page.goto("http://localhost:3000/ar/login", { waitUntil: "networkidle" });
  // Logout existing session if needed or clear cookies
  await context.clearCookies();
  await page.goto("http://localhost:3000/ar/login", { waitUntil: "networkidle" });
  const adminDemoBtn = page.locator("button:has-text('حساب مدير النظام')");
  await adminDemoBtn.click();
  await page.waitForTimeout(200);
  await page.locator("button[type='submit']").click();
  await page.waitForURL("**/admin", { timeout: 10000 });
  await page.waitForTimeout(1000);
  console.log("📸 Capturing: 09_admin_dashboard_ar.png");
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "09_admin_dashboard_ar.png"), fullPage: true });

  // Test 10: Mobile Viewport (iPhone 14)
  console.log("📱 Testing Mobile Responsive Viewport (390x844)...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3000/ar", { waitUntil: "networkidle" });
  console.log("📸 Capturing: 10_mobile_home_ar.png");
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, "10_mobile_home_ar.png"), fullPage: true });

  await browser.close();
  console.log("✅ All visual testing and screenshot captures completed successfully!");
}

run().catch((err) => {
  console.error("❌ Test error:", err);
  process.exit(1);
});
