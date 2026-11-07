import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const SCREENSHOT_DIR = "d:/Virelia-AI/screenshots";
const TEMP_DIR = "d:/Virelia-AI/temp_pdf_pages";
const OUTPUT_PDF = "d:/Virelia-AI/Family_Health_Pages.pdf";
const ARTIFACT_DIR = "C:/Users/aliha/.gemini/antigravity/brain/98db4a88-d1d9-46d6-acf5-91e14216530d";

const pages = [
  {
    file: "01_home_ar.png",
    titleAr: "الصفحة الرئيسية (العرض العربي)",
    titleEn: "Homepage (Arabic RTL)",
  },
  {
    file: "02_home_en.png",
    titleAr: "الصفحة الرئيسية (العرض الإنجليزي)",
    titleEn: "Homepage (English LTR)",
  },
  {
    file: "14_support_widget_ar.png",
    titleAr: "نافذة الدعم الفني المباشر (01004315212 - 01117945122)",
    titleEn: "Direct Technical Support Hotline Widget (WhatsApp & Call)",
  },
  {
    file: "03_directory_ar.png",
    titleAr: "دليل شبكة الخصومات الطبية والمراكز",
    titleEn: "Medical Network Directory",
  },
  {
    file: "04_provider_detail_ar.png",
    titleAr: "صفحة المنشأة الطبية وقائمة الأسعار والخصومات",
    titleEn: "Provider Details & Price Catalog",
  },
  {
    file: "05_booking_modal_ar.png",
    titleAr: "نافذة حجز موعد عيادة عبر واتساب",
    titleEn: "WhatsApp Appointment Booking Modal",
  },
  {
    file: "11_companies_directory_ar.png",
    titleAr: "دليل الشركات الطبية والأجهزة والمستلزمات (بالتقسيط)",
    titleEn: "Medical Companies, Equipment & Installment Plans Directory",
  },
  {
    file: "12_company_detail_ar.png",
    titleAr: "صفحة الشركة وكتالوج الأجهزة وحاسبة الأقساط الشهرية",
    titleEn: "Company Catalog, Equipment Specs & Installment Calculator",
  },
  {
    file: "06_login_ar.png",
    titleAr: "بوابة تسجيل الدخول (بالرقم القومي ١٤ رقم للمرضى)",
    titleEn: "Authentication Portal (14-digit National ID Login)",
  },
  {
    file: "07_portal_patient_ar.png",
    titleAr: "بوابة المريض، كارت العائلة وخزينة المستندات الطبية (PDF، صور، Word)",
    titleEn: "Patient Portal, Family Card & Medical Document Vault",
  },
  {
    file: "08_verify_card_ar.png",
    titleAr: "التحقق من صلاحية الكارت لموظف الاستقبال (QR) وحالة المستفيد",
    titleEn: "Reception QR Card Verification & Beneficiary Status",
  },
  {
    file: "13_download_app_ar.png",
    titleAr: "صفحة تحميل وتثبيت التطبيق للكمبيوتر والموبايل (Desktop & Mobile PWA)",
    titleEn: "Download & Install Application (Desktop & Mobile)",
  },
  {
    file: "09_admin_dashboard_ar.png",
    titleAr: "لوحة الإدارة والتحكم المركزي (نظرة عامة ومؤشرات الأداء)",
    titleEn: "Admin Control Dashboard Overview & Key Metrics",
  },
  {
    file: "admin_tab_providers_ar.png",
    titleAr: "لوحة الإدارة: مقدمو الخدمة والعيادات وقوائم الأسعار",
    titleEn: "Admin: Providers & Clinics Management",
  },
  {
    file: "admin_modal_add_provider_ar.png",
    titleAr: "لوحة الإدارة: نافذة إضافة وتعديل منشأة طبية",
    titleEn: "Admin: Add Facility Modal",
  },
  {
    file: "admin_tab_companies_ar.png",
    titleAr: "لوحة الإدارة: شركات الأجهزة والكيماويات والأدوية بالتقسيط",
    titleEn: "Admin: Medical Companies & Equipment Management",
  },
  {
    file: "admin_modal_add_company_ar.png",
    titleAr: "لوحة الإدارة: نافذة تسجيل شركة ومعدات طبية بالتقسيط",
    titleEn: "Admin: Add Medical Company Modal",
  },
  {
    file: "admin_tab_patients_ar.png",
    titleAr: "لوحة الإدارة: المرضى وبطاقات العائلة وإدارة حالات الوفاة",
    titleEn: "Admin: Patients, Family Cards & Deceased Status Management",
  },
  {
    file: "admin_tab_categories_ar.png",
    titleAr: "لوحة الإدارة: الأقسام والتخصصات الطبية",
    titleEn: "Admin: Medical Categories & Specialties",
  },
  {
    file: "admin_tab_bookings_ar.png",
    titleAr: "لوحة الإدارة: سجل حجوزات الواتساب وتصدير CSV",
    titleEn: "Admin: WhatsApp Booking Logs & CSV Export",
  },
  {
    file: "admin_dashboard_en.png",
    titleAr: "لوحة الإدارة والتحكم (العرض الإنجليزي)",
    titleEn: "Admin Dashboard (English LTR View)",
  },
  {
    file: "10_mobile_home_ar.png",
    titleAr: "تجربة الهاتف المحمول وتطبيق الويب التقدمي",
    titleEn: "Mobile Responsive Experience (PWA)",
  },
];

async function main() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const generatedPdfs = [];

  for (let i = 0; i < pages.length; i++) {
    const item = pages[i];
    const imagePath = path.join(SCREENSHOT_DIR, item.file);
    if (!fs.existsSync(imagePath)) {
      console.warn(`File not found: ${imagePath}, skipping.`);
      continue;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/png;base64,${imageBuffer.toString("base64")}`;

    // Get image dimensions
    await page.setContent(`<img id="target" src="${base64Image}" />`);
    const dims = await page.evaluate(() => {
      const img = document.getElementById("target");
      return { width: img.naturalWidth, height: img.naturalHeight };
    });

    console.log(`[${i + 1}/${pages.length}] Processing ${item.file} (${dims.width}x${dims.height})...`);

    // Layout configuration
    const isMobile = dims.width < 600;
    const pageWidth = isMobile ? 800 : Math.max(dims.width, 1440);
    const headerHeight = 90;
    const pageHeight = dims.height + headerHeight + (isMobile ? 60 : 20);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Cairo', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            background: #f8fafc;
            width: ${pageWidth}px;
            height: ${pageHeight}px;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
          }
          .header {
            width: 100%;
            height: ${headerHeight}px;
            background: #ffffff;
            border-bottom: 3px solid #156570;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-badge {
            background: #156570;
            color: #ffffff;
            font-weight: 800;
            font-size: 16px;
            padding: 6px 14px;
            border-radius: 8px;
            letter-spacing: 0.5px;
          }
          .brand-text {
            font-size: 17px;
            font-weight: 700;
            color: #183b45;
          }
          .title-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .page-title-ar {
            font-size: 24px;
            font-weight: 800;
            color: #156570;
            line-height: 1.2;
          }
          .page-title-en {
            font-size: 15px;
            font-weight: 600;
            color: #64748b;
            font-family: 'Plus Jakarta Sans', sans-serif;
            letter-spacing: 0.3px;
          }
          .page-index {
            background: #e6f4f6;
            color: #156570;
            font-weight: 800;
            font-size: 16px;
            padding: 6px 16px;
            border-radius: 20px;
            border: 1px solid #bce1e6;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .image-wrapper {
            width: 100%;
            flex: 1;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: ${isMobile ? "30px" : "10px 0 0 0"};
            background: #f8fafc;
          }
          .screenshot {
            display: block;
            width: ${dims.width}px;
            height: ${dims.height}px;
            border-radius: ${isMobile ? "24px" : "0px"};
            box-shadow: ${isMobile ? "0 10px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)" : "none"};
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <span class="logo-badge">F.H</span>
            <span class="brand-text">صحة الأسرة • Family Health</span>
          </div>
          <div class="title-container">
            <div class="page-title-ar">${item.titleAr}</div>
            <div class="page-title-en">${item.titleEn}</div>
          </div>
          <div class="page-index">
            ${String(i + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}
          </div>
        </div>
        <div class="image-wrapper">
          <img class="screenshot" src="${base64Image}" alt="${item.titleEn}" />
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle" });
    const tempPdfPath = path.join(TEMP_DIR, `page_${String(i + 1).padStart(2, "0")}.pdf`);
    
    await page.pdf({
      path: tempPdfPath,
      width: `${pageWidth}px`,
      height: `${pageHeight}px`,
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    generatedPdfs.push(tempPdfPath);
  }

  await browser.close();

  console.log(`Generated ${generatedPdfs.length} individual page PDFs. Merging with Python pypdf...`);

  // Python merge script
  const pyScript = `
import pypdf
import os

pdf_files = ${JSON.stringify(generatedPdfs)}
output_path = r"${OUTPUT_PDF}"
artifact_dir = r"${ARTIFACT_DIR}"

writer = pypdf.PdfWriter()

for pdf_file in pdf_files:
    reader = pypdf.PdfReader(pdf_file)
    for p in reader.pages:
        writer.add_page(p)

with open(output_path, "wb") as f_out:
    writer.write(f_out)

print(f"Master PDF created successfully at {output_path} with {len(writer.pages)} pages.")

# Also copy to artifact directory if exists
if os.path.exists(artifact_dir):
    import shutil
    art_path = os.path.join(artifact_dir, "Family_Health_Pages.pdf")
    shutil.copyfile(output_path, art_path)
    print(f"Copied to artifact dir: {art_path}")
`;

  fs.writeFileSync("d:/Virelia-AI/merge_pdf.py", pyScript, "utf-8");
  execSync("python d:/Virelia-AI/merge_pdf.py", { stdio: "inherit" });

  console.log("PDF generation and merge complete!");
}

main().catch(console.error);
