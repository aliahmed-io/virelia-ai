import { prisma } from "./prisma";
import {
  INITIAL_CATEGORIES,
  INITIAL_DOCTOR_SUB_SPECIALTIES,
  INITIAL_PROVIDERS,
  INITIAL_USERS,
  INITIAL_MEDICAL_COMPANIES,
  type CategoryItem,
  type ProviderItem,
  type UserItem,
  type BookingLogItem,
  type FamilyMemberItem,
  type PatientDocumentItem,
  type ServiceItem,
  type MedicalCompanyItem,
  type CompanyProductItem,
  type CompanyType,
} from "./mock-data";

// In-memory runtime state fallback attached to globalThis to share state across RSC and Server Actions
declare global {
  var __fh_runtimeUsers: UserItem[] | undefined;
  var __fh_runtimeProviders: ProviderItem[] | undefined;
  var __fh_runtimeBookings: BookingLogItem[] | undefined;
  var __fh_runtimeCategories: CategoryItem[] | undefined;
  var __fh_runtimeDoctorSubSpecialties: CategoryItem[] | undefined;
  var __fh_runtimeCompanies: MedicalCompanyItem[] | undefined;
}

const runtimeUsers: UserItem[] =
  globalThis.__fh_runtimeUsers ??
  (globalThis.__fh_runtimeUsers = JSON.parse(JSON.stringify(INITIAL_USERS)));
const runtimeProviders: ProviderItem[] =
  globalThis.__fh_runtimeProviders ??
  (globalThis.__fh_runtimeProviders = JSON.parse(JSON.stringify(INITIAL_PROVIDERS)));
const runtimeBookings: BookingLogItem[] =
  globalThis.__fh_runtimeBookings ??
  (globalThis.__fh_runtimeBookings = []);
const runtimeCategories: CategoryItem[] =
  globalThis.__fh_runtimeCategories ??
  (globalThis.__fh_runtimeCategories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES)));
const runtimeDoctorSubSpecialties: CategoryItem[] =
  globalThis.__fh_runtimeDoctorSubSpecialties ??
  (globalThis.__fh_runtimeDoctorSubSpecialties = JSON.parse(JSON.stringify(INITIAL_DOCTOR_SUB_SPECIALTIES)));
const runtimeCompanies: MedicalCompanyItem[] =
  globalThis.__fh_runtimeCompanies ??
  (globalThis.__fh_runtimeCompanies = JSON.parse(JSON.stringify(INITIAL_MEDICAL_COMPANIES)));

// Circuit breaker for database availability to prevent connection hang
let isDbOnline: boolean | null = null;
let lastDbCheck = 0;

async function isDatabaseReachable(): Promise<boolean> {
  const now = Date.now();
  if (isDbOnline === false && now - lastDbCheck < 30000) {
    return false;
  }
  try {
    const checkPromise = prisma.$queryRaw`SELECT 1`.then(
      () => true,
      () => false
    );
    const timeoutPromise = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), 200)
    );
    const result = await Promise.race([checkPromise, timeoutPromise]);
    isDbOnline = result;
    lastDbCheck = now;
    return result;
  } catch {
    isDbOnline = false;
    lastDbCheck = now;
    return false;
  }
}

/**
 * Fetch all categories with optional doctor sub-specialties attached
 */
export async function getCategories(): Promise<{
  topCategories: CategoryItem[];
  doctorSubSpecialties: CategoryItem[];
}> {
  if (await isDatabaseReachable()) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { children: true },
      });

      if (categories.length > 0) {
        const topCategories: CategoryItem[] = categories
          .filter((c) => !c.parentId)
          .map((c) => ({
            id: c.id,
            slug: c.slug,
            nameAr: c.nameAr,
            nameEn: c.nameEn,
            iconName: c.iconName,
            parentId: c.parentId,
            sortOrder: c.sortOrder,
          }));

        const doctorSubSpecialties: CategoryItem[] = categories
          .filter((c) => Boolean(c.parentId))
          .map((c) => ({
            id: c.id,
            slug: c.slug,
            nameAr: c.nameAr,
            nameEn: c.nameEn,
            iconName: c.iconName,
            parentId: c.parentId,
            sortOrder: c.sortOrder,
          }));

        return { topCategories, doctorSubSpecialties };
      }
    } catch {
      // Fallback
    }
  }

  return {
    topCategories: runtimeCategories,
    doctorSubSpecialties: runtimeDoctorSubSpecialties,
  };
}

/**
 * Fetch providers with search, category and subcategory filtering
 */
export async function getProviders(filters?: {
  categorySlug?: string;
  subSpecialtySlug?: string;
  searchQuery?: string;
  city?: string;
  onlyActive?: boolean;
}): Promise<ProviderItem[]> {
  if (await isDatabaseReachable()) {
    try {
      const whereClause: Record<string, unknown> = {};
      if (filters?.onlyActive !== false) {
        whereClause.isActive = true;
      }

      const providers = await prisma.provider.findMany({
        where: whereClause,
        include: { category: { include: { parent: true } } },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      });

      if (providers.length > 0) {
        let mapped: ProviderItem[] = providers.map((p) => {
          return {
            id: p.id,
            slug: p.slug,
            categoryId: p.categoryId,
            categorySlug: p.category.slug,
            categoryNameAr: p.category.nameAr,
            categoryNameEn: p.category.nameEn,
            parentCategorySlug: p.category.parent?.slug,
            nameAr: p.nameAr,
            nameEn: p.nameEn,
            specialtyTitleAr: p.specialtyTitleAr,
            specialtyTitleEn: p.specialtyTitleEn,
            bioAr: p.bioAr,
            bioEn: p.bioEn,
            discountPercent: p.discountPercent,
            servicesJson: p.servicesJson as unknown as ServiceItem[],
            cityAr: p.cityAr,
            cityEn: p.cityEn,
            addressAr: p.addressAr,
            addressEn: p.addressEn,
            phone: p.phone,
            whatsapp: p.whatsapp,
            workingHoursAr: p.workingHoursAr ?? undefined,
            workingHoursEn: p.workingHoursEn ?? undefined,
            coverImageUrl: p.coverImageUrl ?? undefined,
            isFeatured: p.isFeatured,
            isActive: p.isActive,
          };
        });

        if (filters?.categorySlug) {
          mapped = mapped.filter(
            (p) =>
              p.categorySlug === filters.categorySlug ||
              p.parentCategorySlug === filters.categorySlug
          );
        }

        if (filters?.subSpecialtySlug) {
          mapped = mapped.filter((p) => p.categorySlug === filters.subSpecialtySlug);
        }

        if (filters?.searchQuery) {
          const q = filters.searchQuery.toLowerCase().trim();
          mapped = mapped.filter(
            (p) =>
              p.nameAr.toLowerCase().includes(q) ||
              p.nameEn.toLowerCase().includes(q) ||
              p.specialtyTitleAr.toLowerCase().includes(q) ||
              p.specialtyTitleEn.toLowerCase().includes(q) ||
              p.cityAr.toLowerCase().includes(q) ||
              p.cityEn.toLowerCase().includes(q)
          );
        }

        if (filters?.city) {
          const c = filters.city.toLowerCase();
          mapped = mapped.filter(
            (p) => p.cityAr.toLowerCase() === c || p.cityEn.toLowerCase() === c
          );
        }

        return mapped;
      }
    } catch {
      // Fallback
    }
  }

  let list = runtimeProviders.filter((p) => (filters?.onlyActive !== false ? p.isActive : true));

  if (filters?.categorySlug) {
    list = list.filter(
      (p) =>
        p.categorySlug === filters.categorySlug ||
        p.parentCategorySlug === filters.categorySlug
    );
  }

  if (filters?.subSpecialtySlug) {
    list = list.filter((p) => p.categorySlug === filters.subSpecialtySlug);
  }

  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.specialtyTitleAr.toLowerCase().includes(q) ||
        p.specialtyTitleEn.toLowerCase().includes(q) ||
        p.cityAr.toLowerCase().includes(q) ||
        p.cityEn.toLowerCase().includes(q)
    );
  }

  if (filters?.city) {
    const c = filters.city.toLowerCase();
    list = list.filter(
      (p) => p.cityAr.toLowerCase() === c || p.cityEn.toLowerCase() === c
    );
  }

  return list;
}

/**
 * Fetch a single provider by slug
 */
export async function getProviderBySlug(slug: string): Promise<ProviderItem | null> {
  if (await isDatabaseReachable()) {
    try {
      const p = await prisma.provider.findUnique({
        where: { slug },
        include: { category: { include: { parent: true } } },
      });

      if (p) {
        return {
          id: p.id,
          slug: p.slug,
          categoryId: p.categoryId,
          categorySlug: p.category.slug,
          categoryNameAr: p.category.nameAr,
          categoryNameEn: p.category.nameEn,
          parentCategorySlug: p.category.parent?.slug,
          nameAr: p.nameAr,
          nameEn: p.nameEn,
          specialtyTitleAr: p.specialtyTitleAr,
          specialtyTitleEn: p.specialtyTitleEn,
          bioAr: p.bioAr,
          bioEn: p.bioEn,
          discountPercent: p.discountPercent,
          servicesJson: p.servicesJson as unknown as ServiceItem[],
          cityAr: p.cityAr,
          cityEn: p.cityEn,
          addressAr: p.addressAr,
          addressEn: p.addressEn,
          phone: p.phone,
          whatsapp: p.whatsapp,
          workingHoursAr: p.workingHoursAr ?? undefined,
          workingHoursEn: p.workingHoursEn ?? undefined,
          coverImageUrl: p.coverImageUrl ?? undefined,
          isFeatured: p.isFeatured,
          isActive: p.isActive,
        };
      }
    } catch {
      // Fallback
    }
  }

  const found = runtimeProviders.find((p) => p.slug === slug);
  return found ?? null;
}

/**
 * Fetch a user by National ID
 */
export async function getUserByNationalId(nationalId: string): Promise<UserItem | null> {
  if (await isDatabaseReachable()) {
    try {
      const u = await prisma.user.findUnique({
        where: { nationalId },
        include: { familyMembers: true, documents: true },
      });

      if (u) {
        return {
          id: u.id,
          nationalId: u.nationalId,
          passwordHash: u.passwordHash,
          fullNameAr: u.fullNameAr,
          fullNameEn: u.fullNameEn ?? "",
          phone: u.phone,
          role: u.role,
          membershipNo: u.membershipNo,
          isActive: u.isActive,
          familyMembers: u.familyMembers.map((f) => ({
            id: f.id,
            parentUserId: f.parentUserId,
            fullNameAr: f.fullNameAr,
            fullNameEn: f.fullNameEn ?? "",
            nationalId: f.nationalId,
            relationAr: f.relationAr,
            relationEn: f.relationEn,
            createdAt: f.createdAt.toISOString(),
          })),
          documents: u.documents.map((d) => ({
            id: d.id,
            userId: d.userId,
            title: d.title,
            category: d.category as PatientDocumentItem["category"],
            fileType: d.fileType as PatientDocumentItem["fileType"],
            fileName: d.fileName,
            fileSize: d.fileSize,
            fileUrl: d.fileUrl,
            createdAt: d.createdAt.toISOString(),
          })),
        };
      }
    } catch {
      // Fallback
    }
  }

  const found = runtimeUsers.find((u) => u.nationalId === nationalId);
  return found ?? null;
}

/**
 * Fetch user by Membership Number for verification page
 */
export async function getUserByMembershipNo(membershipNo: string): Promise<UserItem | null> {
  if (await isDatabaseReachable()) {
    try {
      const u = await prisma.user.findUnique({
        where: { membershipNo },
        include: { familyMembers: true, documents: true },
      });

      if (u) {
        return {
          id: u.id,
          nationalId: u.nationalId,
          passwordHash: u.passwordHash,
          fullNameAr: u.fullNameAr,
          fullNameEn: u.fullNameEn ?? "",
          phone: u.phone,
          role: u.role,
          membershipNo: u.membershipNo,
          isActive: u.isActive,
          familyMembers: u.familyMembers.map((f) => ({
            id: f.id,
            parentUserId: f.parentUserId,
            fullNameAr: f.fullNameAr,
            fullNameEn: f.fullNameEn ?? "",
            nationalId: f.nationalId,
            relationAr: f.relationAr,
            relationEn: f.relationEn,
            createdAt: f.createdAt.toISOString(),
          })),
          documents: u.documents.map((d) => ({
            id: d.id,
            userId: d.userId,
            title: d.title,
            category: d.category as PatientDocumentItem["category"],
            fileType: d.fileType as PatientDocumentItem["fileType"],
            fileName: d.fileName,
            fileSize: d.fileSize,
            fileUrl: d.fileUrl,
            createdAt: d.createdAt.toISOString(),
          })),
        };
      }
    } catch {
      // Fallback
    }
  }

  const found = runtimeUsers.find((u) => u.membershipNo === membershipNo);
  return found ?? null;
}

/**
 * Add a family member to an existing patient
 */
export async function addFamilyMember(data: {
  parentUserId: string;
  fullNameAr: string;
  fullNameEn?: string;
  nationalId: string;
  relationAr: string;
  relationEn: string;
}): Promise<FamilyMemberItem> {
  if (await isDatabaseReachable()) {
    try {
      const created = await prisma.familyMember.create({
        data: {
          parentUserId: data.parentUserId,
          fullNameAr: data.fullNameAr,
          fullNameEn: data.fullNameEn ?? null,
          nationalId: data.nationalId,
          relationAr: data.relationAr,
          relationEn: data.relationEn,
        },
      });

      return {
        id: created.id,
        parentUserId: created.parentUserId,
        fullNameAr: created.fullNameAr,
        fullNameEn: created.fullNameEn ?? "",
        nationalId: created.nationalId,
        relationAr: created.relationAr,
        relationEn: created.relationEn,
        createdAt: created.createdAt.toISOString(),
      };
    } catch {
      // Fallback
    }
  }

  const newMember: FamilyMemberItem = {
    id: `fam-${Date.now()}`,
    parentUserId: data.parentUserId,
    fullNameAr: data.fullNameAr,
    fullNameEn: data.fullNameEn ?? "",
    nationalId: data.nationalId,
    relationAr: data.relationAr,
    relationEn: data.relationEn,
    createdAt: new Date().toISOString(),
  };

  const user = runtimeUsers.find((u) => u.id === data.parentUserId || u.nationalId === data.parentUserId);
  if (user) {
    user.familyMembers.push(newMember);
  }

  return newMember;
}

/**
 * Remove a family member
 */
export async function deleteFamilyMember(id: string): Promise<boolean> {
  if (await isDatabaseReachable()) {
    try {
      await prisma.familyMember.delete({ where: { id } });
      return true;
    } catch {
      // Fallback
    }
  }

  for (const user of runtimeUsers) {
    const idx = user.familyMembers.findIndex((m) => m.id === id);
    if (idx !== -1) {
      user.familyMembers.splice(idx, 1);
      return true;
    }
  }

  return true;
}

/**
 * Record a WhatsApp booking dispatch log
 */
export async function recordBookingLog(data: {
  providerId: string;
  userId?: string | null;
  patientName: string;
  patientPhone: string;
  nationalId?: string | null;
}): Promise<BookingLogItem> {
  if (await isDatabaseReachable()) {
    try {
      const log = await prisma.bookingLog.create({
        data: {
          providerId: data.providerId,
          userId: data.userId ?? null,
          patientName: data.patientName,
          patientPhone: data.patientPhone,
          nationalId: data.nationalId ?? null,
        },
        include: { provider: true },
      });

      return {
        id: log.id,
        providerId: log.providerId,
        providerNameAr: log.provider.nameAr,
        providerNameEn: log.provider.nameEn,
        userId: log.userId,
        patientName: log.patientName,
        patientPhone: log.patientPhone,
        nationalId: log.nationalId,
        createdAt: log.createdAt.toISOString(),
      };
    } catch {
      // Fallback
    }
  }

  const prov = runtimeProviders.find((p) => p.id === data.providerId || p.slug === data.providerId);
  const logItem: BookingLogItem = {
    id: `log-${Date.now()}`,
    providerId: data.providerId,
    providerNameAr: prov?.nameAr ?? "مركز طبي",
    providerNameEn: prov?.nameEn ?? "Medical Center",
    userId: data.userId,
    patientName: data.patientName,
    patientPhone: data.patientPhone,
    nationalId: data.nationalId,
    createdAt: new Date().toISOString(),
  };
  runtimeBookings.unshift(logItem);
  return logItem;
}

/**
 * Fetch booking logs for admin dashboard
 */
export async function getBookingLogs(): Promise<BookingLogItem[]> {
  if (await isDatabaseReachable()) {
    try {
      const logs = await prisma.bookingLog.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: { provider: true },
      });

      if (logs.length > 0) {
        return logs.map((l) => ({
          id: l.id,
          providerId: l.providerId,
          providerNameAr: l.provider.nameAr,
          providerNameEn: l.provider.nameEn,
          userId: l.userId,
          patientName: l.patientName,
          patientPhone: l.patientPhone,
          nationalId: l.nationalId,
          createdAt: l.createdAt.toISOString(),
        }));
      }
    } catch {
      // Fallback
    }
  }

  return runtimeBookings;
}

/**
 * Fetch all users for Admin panel
 */
export async function getAllUsers(): Promise<UserItem[]> {
  if (await isDatabaseReachable()) {
    try {
      const users = await prisma.user.findMany({
        include: { familyMembers: true, documents: true },
        orderBy: { createdAt: "desc" },
      });

      if (users.length > 0) {
        return users.map((u) => ({
          id: u.id,
          nationalId: u.nationalId,
          passwordHash: u.passwordHash,
          fullNameAr: u.fullNameAr,
          fullNameEn: u.fullNameEn ?? "",
          phone: u.phone,
          role: u.role,
          membershipNo: u.membershipNo,
          isActive: u.isActive,
          familyMembers: u.familyMembers.map((f) => ({
            id: f.id,
            parentUserId: f.parentUserId,
            fullNameAr: f.fullNameAr,
            fullNameEn: f.fullNameEn ?? "",
            nationalId: f.nationalId,
            relationAr: f.relationAr,
            relationEn: f.relationEn,
            createdAt: f.createdAt.toISOString(),
          })),
          documents: u.documents.map((d) => ({
            id: d.id,
            userId: d.userId,
            title: d.title,
            category: d.category as PatientDocumentItem["category"],
            fileType: d.fileType as PatientDocumentItem["fileType"],
            fileName: d.fileName,
            fileSize: d.fileSize,
            fileUrl: d.fileUrl,
            createdAt: d.createdAt.toISOString(),
          })),
        }));
      }
    } catch {
      // Fallback
    }
  }

  return runtimeUsers;
}

/**
 * Create or update provider (Admin)
 */
export async function upsertProvider(provider: Partial<ProviderItem> & { nameAr: string; nameEn: string; categoryId: string; slug: string }): Promise<ProviderItem> {
  const existingIdx = runtimeProviders.findIndex((p) => p.slug === provider.slug || p.id === provider.id);
  
  const formatted: ProviderItem = {
    id: provider.id ?? `prov-${Date.now()}`,
    slug: provider.slug,
    categoryId: provider.categoryId,
    categorySlug: provider.categorySlug ?? "general",
    categoryNameAr: provider.categoryNameAr ?? "عام",
    categoryNameEn: provider.categoryNameEn ?? "General",
    nameAr: provider.nameAr,
    nameEn: provider.nameEn,
    specialtyTitleAr: provider.specialtyTitleAr ?? provider.nameAr,
    specialtyTitleEn: provider.specialtyTitleEn ?? provider.nameEn,
    bioAr: provider.bioAr ?? "",
    bioEn: provider.bioEn ?? "",
    discountPercent: provider.discountPercent ?? 20,
    servicesJson: provider.servicesJson ?? [],
    cityAr: provider.cityAr ?? "القاهرة",
    cityEn: provider.cityEn ?? "Cairo",
    addressAr: provider.addressAr ?? "",
    addressEn: provider.addressEn ?? "",
    phone: provider.phone ?? "",
    whatsapp: provider.whatsapp ?? "",
    workingHoursAr: provider.workingHoursAr,
    workingHoursEn: provider.workingHoursEn,
    isFeatured: provider.isFeatured ?? false,
    isActive: provider.isActive ?? true,
  };

  if (existingIdx !== -1) {
    runtimeProviders[existingIdx] = formatted;
  } else {
    runtimeProviders.push(formatted);
  }

  return formatted;
}

/**
 * Delete provider (Admin)
 */
export async function deleteProvider(id: string): Promise<boolean> {
  const idx = runtimeProviders.findIndex((p) => p.id === id);
  if (idx !== -1) {
    runtimeProviders.splice(idx, 1);
    return true;
  }
  return false;
}

/**
 * Fetch patient documents
 */
export async function getPatientDocuments(userId: string): Promise<PatientDocumentItem[]> {
  if (await isDatabaseReachable()) {
    try {
      const docs = await prisma.patientDocument.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (docs.length > 0) {
        return docs.map((d) => ({
          id: d.id,
          userId: d.userId,
          title: d.title,
          category: d.category as PatientDocumentItem["category"],
          fileType: d.fileType as PatientDocumentItem["fileType"],
          fileName: d.fileName,
          fileSize: d.fileSize,
          fileUrl: d.fileUrl,
          createdAt: d.createdAt.toISOString(),
        }));
      }
    } catch {
      // Fallback
    }
  }

  const user = runtimeUsers.find((u) => u.id === userId || u.nationalId === userId);
  return user?.documents ?? [];
}

/**
 * Add a patient document (Images, Word, PDF)
 */
export async function addPatientDocument(data: {
  userId: string;
  title: string;
  category: PatientDocumentItem["category"];
  fileType: PatientDocumentItem["fileType"];
  fileName: string;
  fileSize: number;
  fileUrl: string;
}): Promise<PatientDocumentItem> {
  if (await isDatabaseReachable()) {
    try {
      const created = await prisma.patientDocument.create({
        data: {
          userId: data.userId,
          title: data.title,
          category: data.category,
          fileType: data.fileType,
          fileName: data.fileName,
          fileSize: data.fileSize,
          fileUrl: data.fileUrl,
        },
      });

      return {
        id: created.id,
        userId: created.userId,
        title: created.title,
        category: created.category as PatientDocumentItem["category"],
        fileType: created.fileType as PatientDocumentItem["fileType"],
        fileName: created.fileName,
        fileSize: created.fileSize,
        fileUrl: created.fileUrl,
        createdAt: created.createdAt.toISOString(),
      };
    } catch {
      // Fallback
    }
  }

  const newDoc: PatientDocumentItem = {
    id: `doc-${Date.now()}`,
    userId: data.userId,
    title: data.title,
    category: data.category,
    fileType: data.fileType,
    fileName: data.fileName,
    fileSize: data.fileSize,
    fileUrl: data.fileUrl,
    createdAt: new Date().toISOString(),
  };

  const user = runtimeUsers.find((u) => u.id === data.userId || u.nationalId === data.userId);
  if (user) {
    if (!user.documents) user.documents = [];
    user.documents.unshift(newDoc);
  }

  return newDoc;
}

/**
 * Delete a patient document
 */
export async function deletePatientDocument(id: string): Promise<boolean> {
  if (await isDatabaseReachable()) {
    try {
      await prisma.patientDocument.delete({ where: { id } });
      return true;
    } catch {
      // Fallback
    }
  }

  for (const user of runtimeUsers) {
    if (user.documents) {
      const idx = user.documents.findIndex((d) => d.id === id);
      if (idx !== -1) {
        user.documents.splice(idx, 1);
        return true;
      }
    }
  }

  return true;
}

/**
 * Register a new patient account (Admin)
 */
export async function createPatientUser(data: {
  nationalId: string;
  passwordHash: string;
  fullNameAr: string;
  fullNameEn?: string;
  phone: string;
}): Promise<UserItem> {
  const membershipNo = `FH-2025-${Math.floor(100000 + Math.random() * 900000)}`;

  if (await isDatabaseReachable()) {
    try {
      const created = await prisma.user.create({
        data: {
          nationalId: data.nationalId,
          passwordHash: data.passwordHash,
          fullNameAr: data.fullNameAr,
          fullNameEn: data.fullNameEn ?? null,
          phone: data.phone,
          role: "PATIENT",
          membershipNo,
          isActive: true,
        },
        include: { familyMembers: true, documents: true },
      });

      return {
        id: created.id,
        nationalId: created.nationalId,
        passwordHash: created.passwordHash,
        fullNameAr: created.fullNameAr,
        fullNameEn: created.fullNameEn ?? "",
        phone: created.phone,
        role: created.role,
        membershipNo: created.membershipNo,
        isActive: created.isActive,
        familyMembers: [],
        documents: [],
      };
    } catch {
      // Fallback
    }
  }

  const newUser: UserItem = {
    id: `usr-${Date.now()}`,
    nationalId: data.nationalId,
    passwordHash: data.passwordHash,
    fullNameAr: data.fullNameAr,
    fullNameEn: data.fullNameEn ?? data.fullNameAr,
    phone: data.phone,
    role: "PATIENT",
    membershipNo,
    isActive: true,
    familyMembers: [],
    documents: [],
  };

  runtimeUsers.unshift(newUser);
  return newUser;
}

/**
 * Toggle user active status (Admin)
 */
export async function toggleUserActive(userId: string): Promise<boolean> {
  const target = runtimeUsers.find((u) => u.id === userId || u.nationalId === userId);
  const newStatus = target ? !target.isActive : true;

  if (await isDatabaseReachable()) {
    try {
      const user = await prisma.user.findFirst({
        where: { OR: [{ id: userId }, { nationalId: userId }] },
      });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isActive: !user.isActive },
        });
        return !user.isActive;
      }
    } catch {
      // Fallback
    }
  }

  if (target) {
    target.isActive = newStatus;
  }
  return newStatus;
}

/**
 * Toggle provider active status (Admin)
 */
export async function toggleProviderActive(providerId: string): Promise<boolean> {
  const target = runtimeProviders.find((p) => p.id === providerId || p.slug === providerId);
  const newStatus = target ? !target.isActive : true;

  if (await isDatabaseReachable()) {
    try {
      const prov = await prisma.provider.findFirst({
        where: { OR: [{ id: providerId }, { slug: providerId }] },
      });
      if (prov) {
        await prisma.provider.update({
          where: { id: prov.id },
          data: { isActive: !prov.isActive },
        });
        return !prov.isActive;
      }
    } catch {
      // Fallback
    }
  }

  if (target) {
    target.isActive = newStatus;
  }
  return newStatus;
}

/**
 * Create a new category or sub-specialty (Admin)
 */
export async function createCategory(data: {
  slug: string;
  nameAr: string;
  nameEn: string;
  iconName: string;
  parentId?: string | null;
  sortOrder?: number;
}): Promise<CategoryItem> {
  if (await isDatabaseReachable()) {
    try {
      const cat = await prisma.category.create({
        data: {
          slug: data.slug,
          nameAr: data.nameAr,
          nameEn: data.nameEn,
          iconName: data.iconName,
          parentId: data.parentId ?? null,
          sortOrder: data.sortOrder ?? 10,
        },
      });

      return {
        id: cat.id,
        slug: cat.slug,
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        iconName: cat.iconName,
        parentId: cat.parentId,
        sortOrder: cat.sortOrder,
      };
    } catch {
      // Fallback
    }
  }

  const newCat: CategoryItem = {
    id: `cat-${Date.now()}`,
    slug: data.slug,
    nameAr: data.nameAr,
    nameEn: data.nameEn,
    iconName: data.iconName,
    parentId: data.parentId ?? null,
    sortOrder: data.sortOrder ?? 10,
  };

  if (data.parentId) {
    runtimeDoctorSubSpecialties.push(newCat);
  } else {
    runtimeCategories.push(newCat);
  }

  return newCat;
}

/**
 * Fetch all medical companies with optional filtering by type and search query
 */
export async function getMedicalCompanies(filter?: {
  type?: string;
  search?: string;
  activeOnly?: boolean;
}): Promise<MedicalCompanyItem[]> {
  const activeOnly = filter?.activeOnly ?? true;

  if (await isDatabaseReachable()) {
    try {
      const companies = await prisma.medicalCompany.findMany({
        where: {
          ...(activeOnly ? { isActive: true } : {}),
          ...(filter?.type && filter.type !== "ALL" ? { type: filter.type as any } : {}),
          ...(filter?.search
            ? {
                OR: [
                  { nameAr: { contains: filter.search, mode: "insensitive" } },
                  { nameEn: { contains: filter.search, mode: "insensitive" } },
                  { cityAr: { contains: filter.search, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        include: { products: true },
        orderBy: { createdAt: "desc" },
      });

      return companies.map((c) => ({
        id: c.id,
        slug: c.slug,
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        type: c.type as CompanyType,
        typeNameAr: c.typeNameAr,
        typeNameEn: c.typeNameEn,
        phone: c.phone,
        whatsapp: c.whatsapp,
        cityAr: c.cityAr,
        cityEn: c.cityEn,
        addressAr: c.addressAr,
        addressEn: c.addressEn,
        bioAr: c.bioAr,
        bioEn: c.bioEn,
        isInstallmentAvailable: c.isInstallmentAvailable,
        maxInstallmentMonths: c.maxInstallmentMonths,
        coverImageUrl: c.coverImageUrl ?? undefined,
        isActive: c.isActive,
        products: c.products.map((p) => ({
          id: p.id,
          companyId: p.companyId,
          nameAr: p.nameAr,
          nameEn: p.nameEn,
          categoryAr: p.categoryAr,
          categoryEn: p.categoryEn,
          specsAr: p.specsAr,
          specsEn: p.specsEn,
          cashPrice: p.cashPrice,
          minDownPaymentPercent: p.minDownPaymentPercent,
          installmentPlans: (p.installmentPlans as any) || [],
          imageUrl: p.imageUrl ?? undefined,
          inStock: p.inStock,
        })),
      }));
    } catch {
      // Fallback
    }
  }

  // In-memory fallback
  let list = [...runtimeCompanies];
  if (activeOnly) {
    list = list.filter((c) => c.isActive);
  }
  if (filter?.type && filter.type !== "ALL") {
    list = list.filter((c) => c.type === filter.type);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.nameAr.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.cityAr.toLowerCase().includes(q)
    );
  }
  return list;
}

/**
 * Fetch a single medical company by slug
 */
export async function getMedicalCompanyBySlug(slug: string): Promise<MedicalCompanyItem | null> {
  if (await isDatabaseReachable()) {
    try {
      const c = await prisma.medicalCompany.findUnique({
        where: { slug },
        include: { products: true },
      });
      if (c) {
        return {
          id: c.id,
          slug: c.slug,
          nameAr: c.nameAr,
          nameEn: c.nameEn,
          type: c.type as CompanyType,
          typeNameAr: c.typeNameAr,
          typeNameEn: c.typeNameEn,
          phone: c.phone,
          whatsapp: c.whatsapp,
          cityAr: c.cityAr,
          cityEn: c.cityEn,
          addressAr: c.addressAr,
          addressEn: c.addressEn,
          bioAr: c.bioAr,
          bioEn: c.bioEn,
          isInstallmentAvailable: c.isInstallmentAvailable,
          maxInstallmentMonths: c.maxInstallmentMonths,
          coverImageUrl: c.coverImageUrl ?? undefined,
          isActive: c.isActive,
          products: c.products.map((p) => ({
            id: p.id,
            companyId: p.companyId,
            nameAr: p.nameAr,
            nameEn: p.nameEn,
            categoryAr: p.categoryAr,
            categoryEn: p.categoryEn,
            specsAr: p.specsAr,
            specsEn: p.specsEn,
            cashPrice: p.cashPrice,
            minDownPaymentPercent: p.minDownPaymentPercent,
            installmentPlans: (p.installmentPlans as any) || [],
            imageUrl: p.imageUrl ?? undefined,
            inStock: p.inStock,
          })),
        };
      }
    } catch {
      // Fallback
    }
  }

  return runtimeCompanies.find((c) => c.slug === slug) ?? null;
}

/**
 * Toggle medical company active status (Admin only)
 */
export async function toggleMedicalCompanyActive(id: string): Promise<boolean> {
  if (await isDatabaseReachable()) {
    try {
      const company = await prisma.medicalCompany.findUnique({ where: { id } });
      if (company) {
        const updated = await prisma.medicalCompany.update({
          where: { id },
          data: { isActive: !company.isActive },
        });
        return updated.isActive;
      }
    } catch {
      // Fallback
    }
  }

  const comp = runtimeCompanies.find((c) => c.id === id);
  if (comp) {
    comp.isActive = !comp.isActive;
    return comp.isActive;
  }
  return false;
}

/**
 * Delete medical company (Admin only)
 */
export async function deleteMedicalCompany(id: string): Promise<boolean> {
  if (await isDatabaseReachable()) {
    try {
      await prisma.medicalCompany.delete({ where: { id } });
      return true;
    } catch {
      // Fallback
    }
  }

  const idx = runtimeCompanies.findIndex((c) => c.id === id);
  if (idx !== -1) {
    runtimeCompanies.splice(idx, 1);
    return true;
  }
  return false;
}

/**
 * Create a new medical company (Admin only)
 */
export async function createMedicalCompany(data: {
  nameAr: string;
  nameEn: string;
  slug: string;
  type: CompanyType;
  phone: string;
  whatsapp: string;
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  bioAr: string;
  bioEn: string;
  maxInstallmentMonths?: number;
}): Promise<MedicalCompanyItem> {
  const typeMap: Record<CompanyType, { ar: string; en: string }> = {
    MEDICAL_EQUIPMENT: { ar: "أجهزة ومعدات طبية", en: "Medical Equipment" },
    PHARMACEUTICAL: { ar: "شركات ومخازن أدوية", en: "Pharmaceuticals" },
    CHEMICAL_LAB_SUPPLY: { ar: "مستلزمات وكيماويات معامل", en: "Chemical & Lab Supplies" },
  };

  const typeNameAr = typeMap[data.type]?.ar || "شركة طبية";
  const typeNameEn = typeMap[data.type]?.en || "Medical Company";

  const newCompany: MedicalCompanyItem = {
    id: `comp-${Date.now()}`,
    slug: data.slug,
    nameAr: data.nameAr,
    nameEn: data.nameEn,
    type: data.type,
    typeNameAr,
    typeNameEn,
    phone: data.phone,
    whatsapp: data.whatsapp,
    cityAr: data.cityAr,
    cityEn: data.cityEn,
    addressAr: data.addressAr,
    addressEn: data.addressEn,
    bioAr: data.bioAr,
    bioEn: data.bioEn,
    isInstallmentAvailable: true,
    maxInstallmentMonths: data.maxInstallmentMonths || 24,
    isActive: true,
    products: [],
  };

  if (await isDatabaseReachable()) {
    try {
      const created = await prisma.medicalCompany.create({
        data: {
          slug: data.slug,
          nameAr: data.nameAr,
          nameEn: data.nameEn,
          type: data.type as any,
          typeNameAr,
          typeNameEn,
          phone: data.phone,
          whatsapp: data.whatsapp,
          cityAr: data.cityAr,
          cityEn: data.cityEn,
          addressAr: data.addressAr,
          addressEn: data.addressEn,
          bioAr: data.bioAr,
          bioEn: data.bioEn,
          isInstallmentAvailable: true,
          maxInstallmentMonths: data.maxInstallmentMonths || 24,
          isActive: true,
        },
        include: { products: true },
      });

      return {
        ...newCompany,
        id: created.id,
      };
    } catch {
      // Fallback
    }
  }

  runtimeCompanies.push(newCompany);
  return newCompany;
}

/**
 * Toggle patient deceased status (حالة الوفاة) - Admin only
 * If deceased, the card is immediately suspended, and cannot be used at receptions or logged into.
 */
export async function togglePatientDeceased(userId: string): Promise<UserItem | null> {
  if (await isDatabaseReachable()) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const newDeceased = !user.isDeceased;
        const updated = await prisma.user.update({
          where: { id: userId },
          data: {
            isDeceased: newDeceased,
            isActive: newDeceased ? false : true, // automatically deactivate if deceased
          },
          include: {
            familyMembers: true,
            documents: true,
          },
        });

        return {
          id: updated.id,
          nationalId: updated.nationalId,
          passwordHash: updated.passwordHash,
          fullNameAr: updated.fullNameAr,
          fullNameEn: updated.fullNameEn || "",
          phone: updated.phone,
          role: updated.role as "ADMIN" | "PATIENT",
          membershipNo: updated.membershipNo,
          isActive: updated.isActive,
          isDeceased: updated.isDeceased,
          familyMembers: updated.familyMembers.map((fm) => ({
            id: fm.id,
            parentUserId: fm.parentUserId,
            fullNameAr: fm.fullNameAr,
            fullNameEn: fm.fullNameEn || "",
            nationalId: fm.nationalId,
            relationAr: fm.relationAr,
            relationEn: fm.relationEn,
            createdAt: fm.createdAt.toISOString(),
          })),
          documents: updated.documents.map((d) => ({
            id: d.id,
            userId: d.userId,
            title: d.title,
            category: d.category as any,
            fileType: d.fileType as any,
            fileName: d.fileName,
            fileSize: d.fileSize,
            fileUrl: d.fileUrl,
            createdAt: d.createdAt.toISOString(),
          })),
        };
      }
    } catch {
      // Fallback
    }
  }

  const u = runtimeUsers.find((user) => user.id === userId);
  if (u) {
    u.isDeceased = !u.isDeceased;
    if (u.isDeceased) {
      u.isActive = false; // suspend card
    } else {
      u.isActive = true;
    }
    return u;
  }
  return null;
}

/**
 * Delete patient user completely (حذف الحساب) - Admin only
 */
export async function deletePatientUser(userId: string): Promise<boolean> {
  if (await isDatabaseReachable()) {
    try {
      await prisma.user.delete({ where: { id: userId } });
      return true;
    } catch {
      // Fallback
    }
  }

  const idx = runtimeUsers.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    runtimeUsers.splice(idx, 1);
    return true;
  }
  return false;
}


