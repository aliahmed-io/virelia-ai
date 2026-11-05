# 🌿 Family Health (صحة الأسرة — F.H)
### رعاية شاملة لكل جيل • Comprehensive Care for Every Generation

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Logical_RTL%2FLTR-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?logo=prisma)](https://www.prisma.io/)
[![Playwright](https://img.shields.io/badge/Playwright-16%2F16_Tests_Passing-brightgreen?logo=playwright)](https://playwright.dev/)
[![Production Ready](https://img.shields.io/badge/Quality_Gates-Clean_Build_%26_Lint-emerald)](#)

---

## 📖 Overview

**Family Health (صحة الأسرة — F.H)** is a production-ready, natively bilingual (**Arabic RTL / English LTR**) healthcare platform combining:
1. **Instant Medical Discount Network (HealthTag Model):** "خصومات حقيقية من أول استخدام" (Real discounts from first use), "بدون موافقات أو حد أقصى" (No approvals or caps), "أسعار أقل وأماكن أقرب" (Lower prices, closer locations).
2. **Centralized Admin Control (`أنا المتحكم بالإضافة والحذف`):** Providers and patients cannot self-publish; the administrator controls all clinic listings, discount rates, pricing catalogs, and card activations.
3. **Direct WhatsApp Booking Engine (`مرتبط بالواتس للحجز`):** Direct 5-point appointment dispatch to doctors via WhatsApp with asynchronous tracking.
4. **Family Membership Card (`الإضافة للكل`):** A digital 3D card covering the primary member and all family dependents with instant QR verification for clinic receptionists.
5. **Patient Medical Document Vault (`قسم مساحة التخزين الطبي`):** Private patient cloud storage for Prescriptions, Lab Results, Radiology, and Medical Reports in **Images**, **Word (.docx)**, and **PDF** formats.

---

## 🎨 Visual Identity & Design Tokens

* **Primary Medical Teal:** `#156570` (Inspired by the Family Health brand identity).
* **Secondary Emerald / Mint:** `#10B981` / `#72B088` (Used for discount badges and active card status).
* **Warm Amber / Gold:** `#E59A3C` (Highlight accent from the family heart logo).
* **Ink & Line Tokens:** `--app-ink: #183b45`, `--app-line: #dce6e9`, `--app-surface: #f3f7f8`.
* **Directional Discipline:** 100% strict Tailwind CSS logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`, `start-*`, `end-*`) with zero physical classes (`ml`, `mr`, `left`, `right`).
* **Typography:** **Cairo** for Arabic (`dir="rtl"`), **Plus Jakarta Sans** for English (`dir="ltr"`).

---

## 📱 Page-by-Page Feature Tour & Screenshots

---

### 1. Public Homepage & Care Workspace (`/[locale]`)

| Arabic View (RTL) | English View (LTR) |
|---|---|
| ![Homepage Arabic](screenshots/01_home_ar.png) | ![Homepage English](screenshots/02_home_en.png) |

#### Features:
* **Brand Hero Banner:** Prominently highlights the 3 value pillars: *خصومات حقيقية من أول استخدام*, *بدون موافقات أو حد أقصى*, *أسعار أقل وأماكن أقرب*.
* **Smart Search Bar:** Instant query by clinic name, doctor specialty, or city with immediate autocomplete.
* **Interactive Category Pills:** 7 top-level health categories with live Lucide icons.
* **Dual-Language Switcher:** Instant AR/EN toggle preserving active search parameters and mirroring document direction (`dir="rtl"` $\leftrightarrow$ `dir="ltr"`).
* **Featured Providers Showcase:** High-discount clinics and medical centers displayed with savings percentage.
* **Network Statistics Ticker:** Highlights accredited doctors, labs, pharmacies, and patients served.

---

### 2. Healthcare Network Directory (`/[locale]/directory`)

![Medical Directory](screenshots/03_directory_ar.png)

#### Features:
* **Comprehensive Search Filter:** Filter by keywords, clinic title, doctor name, and city.
* **Two-Tier Category Selector:**
  * **Top Categories (7):** `أطباء` (Doctors), `صيدليات` (Pharmacies), `معامل` (Laboratories), `أشعة` (Radiology), `أسنان` (Dental), `عيون` (Ophthalmology), `علاج طبيعي` (Physical Therapy).
  * **Dynamic Doctor Sub-Specialties (6):** When *Doctors* is selected, a secondary row smoothly reveals: `باطنة` (Internal Medicine), `عظام` (Orthopedics), `جراحة` (Surgery), `أنف وأذن` (ENT), `قلب` (Cardiology), `مسالك` (Urology).
* **3-Column Provider Showcase Cards:**
  * Provider name, specialty subtitle, and category badge.
  * Prominent emerald discount badge (e.g. **35% OFF**, **50% OFF**).
  * Address, phone, and working hours.
  * **"View Clinic & Prices / عرض العيادة والأسعار"** link.
  * Direct green **"Book via WhatsApp / حجز عبر واتساب"** button.

---

### 3. Dedicated Provider Showcase & Price Catalog (`/[locale]/providers/[slug]`)

![Provider Showcase Page](screenshots/04_provider_detail_ar.png)

#### Features:
* **Comprehensive Clinical Bio:** Full description of equipment, clinical experience, and medical specializations.
* **HealthTag-Inspired Discounted Price Table:**
  * Procedure Name (e.g., Consultant Exam, 4D Ultrasound, Color Doppler Echo).
  * **Before Price:** Strikethrough original price in red/grey.
  * **After Family Health Price:** Highlighted in bold teal/emerald.
  * **Discount Percentage:** Explicit savings badge.
* **Contact & Location Card:** Full address, operating hours, telephone, and international WhatsApp number.
* **Sticky WhatsApp Booking Action:** Fixed bottom bar on mobile / sticky card on desktop for frictionless appointment dispatch.

---

### 4. Direct WhatsApp Booking Engine (Modal)

![WhatsApp Booking Modal](screenshots/05_booking_modal_ar.png)

#### Features:
* **Interactive Patient Selector:**
  * If logged in: Automatically pre-fills name and phone, allowing the patient to pick whether the appointment is for themselves or an attached family dependent.
  * If guest: Prompts for name and contact phone number.
* **Live Message Template Preview:** Real-time formatting of the exact 5-point dispatch message:
  ```text
  مرحباً، أرغب في حجز موعد عبر كارت صحة الأسرة (Family Health) 🌿
  • الاسم: [Patient Name]
  • التخصص: [Provider Specialty] - [Provider Name]
  • العنوان: [Provider Address]
  • التليفون: [Patient Phone]
  • رقم العضوية / الرقم القومي: [National ID or Card Number]
  ```
* **Asynchronous Audit Logging:** Submits request to `BookingLog` in the database via Server Actions before launching `wa.me`.

---

### 5. Patient & Admin Authentication (`/[locale]/login`)

![Login Portal](screenshots/06_login_ar.png)

#### Features:
* **National ID & Password Authentication:** Login using **14-digit National ID (`الرقم القومي`)** and **Password (`الباسورد`)**.
* **Role-Based Redirection:** Authenticated patients are routed to `/portal`, while system administrators are routed to `/admin`.
* **1-Click Demo Sign-In Buttons:** Fast evaluation shortcuts for Admin (`10000000000000`) and Patient (`29901011234567`).
* **HTTP-Only Secure Cookie:** Signed 30-day JWT sessions powered by `jose` and `bcryptjs`.

---

### 6. Patient Portal & Medical Document Vault (`/[locale]/portal`)

![Patient Portal](screenshots/07_portal_patient_ar.png)

#### Features:
1. **Interactive 3D Digital Family Health Card:**
   - **Front Face:** Displays Family Health logo, Primary Member Name, 14-digit National ID, Card Number (`FH-2025-998877`), "Active / ساري" badge, and scannable QR Code.
   - **Back Face (3D Flip):** Cardholder usage instructions, hotline (19000), and terms.
   - **Actions:** Copy card number, Print/Save PDF, and open direct Reception QR link.
2. **Patient Medical Document Vault (`مساحة المستندات والملفات الطبية`):**
   - **Multi-Format Storage:** Upload and store **Images (`JPG`, `PNG`, `WEBP`)**, **Word documents (`.docx`, `.doc`)**, and **PDF** files.
   - **Storage Meter:** Visual progress bar showing used quota (e.g. `2.1 MB / 50 MB`).
   - **Categorization Pills:** Filter by `Prescriptions`, `Lab Results`, `Radiology Scans`, `Medical Reports`, or `Other`.
   - **Live Search:** Instant search across document titles and file names.
   - **In-App Modal Preview:** View PDFs, full-resolution images, and Word summaries inside the app.
   - **Download & Delete:** One-click download of the original file and optimistic deletion.
3. **Family Dependents Manager (`الإضافة للكل`):**
   - Add family dependents (Spouse, Son, Daughter, Father, Mother) with their 14-digit National ID.
   - All added dependents automatically inherit the discount network and appear on reception verification scans.

---

### 7. Public Reception QR Card Verification (`/[locale]/verify/[membershipNo]`)

![Reception Verification](screenshots/08_verify_card_ar.png)

#### Features:
* **Public Reception Portal:** Scanned by clinic receptionists using any smartphone camera without requiring login.
* **Instant Validity Check:** Displays verified active cardholder badge (`بطاقة صحة الأسرة معتمدة وسارية 🌿`).
* **Covered Family Dependents Table:** Lists all registered family members eligible for the discount.
* **Fraud Prevention:** Confirms cardholder identity and national ID in real-time against the database.

---

### 8. Central Admin Control Dashboard (`/[locale]/admin`)

| Providers & Clinics Tab | Add / Edit Facility Modal |
|---|---|
| ![Admin Providers](screenshots/admin_tab_providers_ar.png) | ![Admin Add Provider Modal](screenshots/admin_modal_add_provider_ar.png) |

| Patients & Family Cards Tab | Categories & Specialties Tab |
|---|---|
| ![Admin Patients](screenshots/admin_tab_patients_ar.png) | ![Admin Categories](screenshots/admin_tab_categories_ar.png) |

| WhatsApp Conversion Logs Tab | English Dashboard View (LTR) |
|---|---|
| ![Admin Bookings](screenshots/admin_tab_bookings_ar.png) | ![Admin Dashboard English](screenshots/admin_dashboard_en.png) |

#### Features:
* **Strict Admin Protection (`أنا المتحكم بالإضافة والحذف`):** Restricted to `role === 'ADMIN'`. Clinics and patients cannot self-publish.
* **Tab 1: Providers & Clinics (`مقدمو الخدمة والعيادات`):**
  - Search by facility name, doctor, or city.
  - **1-Click Status Toggle:** Switch clinic status between `نشط` (Active) and `موقوف` (Inactive).
  - **Dynamic Price List Builder:** Configure procedures with Before/After discounted prices.
  - Edit and Delete provider capabilities.
* **Tab 2: Patients & Family Memberships (`المرضى وبطاقات العائلة`):**
  - Search by patient name, National ID, or card number.
  - **Register Patient Modal (`+ تسجيل مريض جديد`):** Provision new patient accounts with initial password and auto-generated card ID.
  - **1-Click Card Status Toggle:** Instantly activate (`ساري`) or suspend (`معطل`) patient discount cards.
  - **Admin Family Dependents Drawer:** View, add, or remove dependents for any cardholder directly.
  - **QR Reception Link:** Direct shortcut to the public verification view.
* **Tab 3: Taxonomy & Categories (`الأقسام والتخصصات`):**
  - Visual hierarchy of the 7 core categories and 6 doctor subspecialties.
  - **Add Category Modal (`+ إضافة قسم / تخصص جديد`):** Create new top-level categories or child doctor specialties with custom slugs and Lucide icons.
* **Tab 4: WhatsApp Booking Logs (`سجل حجوزات الواتساب`):**
  - Real-time audit log of all outbound booking dispatches.
  - Displays patient name, phone, target clinic, card ID, and timestamp.
  - **One-Click CSV Export (`تحميل سجل الحجوزات CSV`):** Instant downloadable spreadsheet for partner clinic billing and audit reconciliation.

---

### 9. Mobile-First Responsive PWA & Capacitor Readiness

![Mobile Viewport](screenshots/10_mobile_home_ar.png)

#### Features:
* **Ergonomic Bottom Navigation Bar:** Quick access to Home, Directory, and Family Card on mobile devices.
* **44px+ Touch Targets:** Fully compliant with mobile accessibility standards.
* **Horizontal Scroll Guard:** Zero layout overflow across 320px to 4K viewports.
* **PWA Web App Manifest:** Configured via `manifest.json` for home-screen installation or wrapping with Capacitor / React Native.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 15+ (App Router) | Server Components, Server Actions, Route Handlers |
| **Language** | TypeScript (Strict Mode) | `noImplicitAny`, zero `any` types |
| **Styling** | Tailwind CSS + `shadcn/ui` | Exclusively logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) |
| **Icons** | `lucide-react` | Scalable vector medical icons |
| **i18n** | `next-intl` | Localized dynamic routes (`/ar` default, `/en` secondary) |
| **Database & ORM** | PostgreSQL + Prisma ORM | Explicit bilingual fields (`*Ar`, `*En`) for zero-latency queries |
| **Auth** | `jose` + `bcryptjs` + Cookies | 30-day HTTP-only JWT sessions, National ID + Password login |
| **Testing** | Vitest + Playwright | 6/6 unit tests + 16/16 end-to-end tests across Chrome and Mobile |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v20+ or v22+
- **pnpm** v9+ or v10+

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/aliahmed-io/virelia-ai.git
cd virelia-ai

# Install dependencies
pnpm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/family_health?schema=public"
JWT_SECRET="family-health-super-secure-jwt-secret-key-32chars-minimum-2025"
```

### 4. Database Setup & Seed Data
```bash
# Generate Prisma Client
pnpm prisma generate

# Push schema to database (or run migrations)
pnpm prisma db push

# Seed initial admin, patient, categories, and 10 medical clinics
pnpm prisma db seed
```

### 5. Run Development Server
```bash
pnpm dev
# Open http://localhost:3000 in your browser
```

### 6. Production Build & Quality Gates
```bash
# Run lint check
pnpm lint

# Run unit tests
pnpm test

# Build production bundle
pnpm build

# Start production server
pnpm start -p 3000

# Run Playwright E2E test suite (16 tests)
pnpm test:e2e
```

---

## 🔐 Default Demo Accounts

| Role | National ID (`الرقم القومي`) | Password (`الباسورد`) | Initial Access & Permissions |
|---|---|---|---|
| **System Admin** | `10000000000000` | `Admin@1234` | Full CRUD Control over Clinics, Patients, Categories, and Logs |
| **Sample Patient** | `29901011234567` | `Patient@123` | Digital 3D Card (`FH-2025-998877`), 2 Dependents, Medical Vault |

---

## 📄 License
This project is proprietary software developed for **Family Health (صحة الأسرة — F.H)**. All rights reserved.
