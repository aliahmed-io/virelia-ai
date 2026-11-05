import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function generateIcons() {
  const browser = await chromium.launch({ headless: true });

  const svgHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #156570;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
          }
          .app-icon {
            width: 80%;
            height: 80%;
          }
        </style>
      </head>
      <body>
        <svg class="app-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Heart Outer Arch in Warm Gold -->
          <path
            d="M50 88C50 88 18 68 18 42C18 28 29 20 40 24C44 25.5 48 29 50 32C52 29 56 25.5 60 24C71 20 82 28 82 42C82 68 50 88 50 88Z"
            stroke="#E59A3C"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <!-- Family Silhouette Center in Clean White -->
          <circle cx="50" cy="40" r="6" fill="#FFFFFF" />
          <path
            d="M40 60C40 53 45 49 50 49C55 49 60 53 60 60"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="38" cy="45" r="4.5" fill="#72B088" />
          <path
            d="M31 62C31 56 35 53 38 53"
            stroke="#72B088"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="62" cy="45" r="4.5" fill="#72B088" />
          <path
            d="M69 62C69 56 65 53 62 53"
            stroke="#72B088"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <!-- Olive Leaf Sprigs -->
          <path
            d="M30 75C24 72 20 65 22 58"
            stroke="#72B088"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M70 75C76 72 80 65 78 58"
            stroke="#72B088"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </body>
    </html>
  `;

  // Generate 192x192
  const page192 = await browser.newPage({ viewport: { width: 192, height: 192 } });
  await page192.setContent(svgHtml);
  await page192.screenshot({ path: path.join(process.cwd(), "public", "icon-192.png") });
  await page192.close();
  console.log("✓ Generated public/icon-192.png");

  // Generate 512x512
  const page512 = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await page512.setContent(svgHtml);
  await page512.screenshot({ path: path.join(process.cwd(), "public", "icon-512.png") });
  await page512.close();
  console.log("✓ Generated public/icon-512.png");

  // Also apple-touch-icon.png (180x180)
  const pageApple = await browser.newPage({ viewport: { width: 180, height: 180 } });
  await pageApple.setContent(svgHtml);
  await pageApple.screenshot({ path: path.join(process.cwd(), "public", "apple-touch-icon.png") });
  await pageApple.close();
  console.log("✓ Generated public/apple-touch-icon.png");

  await browser.close();
  console.log("✨ All PWA mobile app icons generated successfully!");
}

generateIcons().catch((err) => {
  console.error("Icon generation error:", err);
  process.exit(1);
});
