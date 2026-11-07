export interface ServiceItem {
  id: string;
  nameAr: string;
  nameEn: string;
  originalPrice: number;
  discountedPrice: number;
}

export interface ProviderItem {
  id: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  categoryNameAr: string;
  categoryNameEn: string;
  parentCategorySlug?: string;
  nameAr: string;
  nameEn: string;
  specialtyTitleAr: string;
  specialtyTitleEn: string;
  bioAr: string;
  bioEn: string;
  discountPercent: number;
  servicesJson: ServiceItem[];
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  whatsapp: string;
  workingHoursAr?: string;
  workingHoursEn?: string;
  coverImageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CategoryItem {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  iconName: string;
  parentId?: string | null;
  sortOrder: number;
  children?: CategoryItem[];
}

export interface PatientDocumentItem {
  id: string;
  userId: string;
  title: string;
  category: "prescription" | "lab" | "radiology" | "report" | "other";
  fileType: "IMAGE" | "PDF" | "WORD";
  fileName: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
}

export interface UserItem {
  id: string;
  nationalId: string;
  passwordHash: string;
  fullNameAr: string;
  fullNameEn: string;
  phone: string;
  role: "ADMIN" | "PATIENT";
  membershipNo: string;
  isActive: boolean;
  isDeceased?: boolean;
  familyMembers: FamilyMemberItem[];
  documents: PatientDocumentItem[];
}

export interface FamilyMemberItem {
  id: string;
  parentUserId: string;
  fullNameAr: string;
  fullNameEn: string;
  nationalId: string;
  relationAr: string;
  relationEn: string;
  createdAt: string;
}

export interface BookingLogItem {
  id: string;
  providerId: string;
  providerNameAr: string;
  providerNameEn: string;
  userId?: string | null;
  patientName: string;
  patientPhone: string;
  nationalId?: string | null;
  createdAt: string;
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "cat-1", slug: "doctors", nameAr: "أطباء", nameEn: "Doctors", iconName: "Stethoscope", sortOrder: 1 },
  { id: "cat-2", slug: "pharmacies", nameAr: "صيدليات", nameEn: "Pharmacies", iconName: "Pill", sortOrder: 2 },
  { id: "cat-3", slug: "labs", nameAr: "معامل", nameEn: "Laboratories", iconName: "FlaskConical", sortOrder: 3 },
  { id: "cat-4", slug: "radiology", nameAr: "أشعة", nameEn: "Radiology", iconName: "ScanLine", sortOrder: 4 },
  { id: "cat-5", slug: "dental", nameAr: "أسنان", nameEn: "Dental", iconName: "Smile", sortOrder: 5 },
  { id: "cat-6", slug: "ophthalmology", nameAr: "عيون", nameEn: "Ophthalmology", iconName: "Eye", sortOrder: 6 },
  { id: "cat-7", slug: "physiotherapy", nameAr: "علاج طبيعي", nameEn: "Physical Therapy", iconName: "Activity", sortOrder: 7 },
];

export const INITIAL_DOCTOR_SUB_SPECIALTIES: CategoryItem[] = [
  { id: "sub-1", slug: "internal-medicine", parentId: "cat-1", nameAr: "باطنة", nameEn: "Internal Medicine", iconName: "HeartPulse", sortOrder: 1 },
  { id: "sub-2", slug: "orthopedics", parentId: "cat-1", nameAr: "عظام", nameEn: "Orthopedics", iconName: "Bone", sortOrder: 2 },
  { id: "sub-3", slug: "surgery", parentId: "cat-1", nameAr: "جراحة", nameEn: "Surgery", iconName: "Scissors", sortOrder: 3 },
  { id: "sub-4", slug: "ent", parentId: "cat-1", nameAr: "أنف وأذن", nameEn: "ENT (Ear, Nose & Throat)", iconName: "Headphones", sortOrder: 4 },
  { id: "sub-5", slug: "cardiology", parentId: "cat-1", nameAr: "قلب", nameEn: "Cardiology", iconName: "Heart", sortOrder: 5 },
  { id: "sub-6", slug: "urology", parentId: "cat-1", nameAr: "مسالك", nameEn: "Urology", iconName: "ShieldAlert", sortOrder: 6 },
];

export const INITIAL_PROVIDERS: ProviderItem[] = [
  {
    id: "prov-1",
    slug: "dr-tarek-el-banna",
    categoryId: "sub-1",
    categorySlug: "internal-medicine",
    categoryNameAr: "باطنة",
    categoryNameEn: "Internal Medicine",
    parentCategorySlug: "doctors",
    nameAr: "عيادة د. طارق البنا - استشاري الباطنة والسكري",
    nameEn: "Dr. Tarek El-Banna Internal Medicine Clinic",
    specialtyTitleAr: "استشاري الأمراض الباطنية والسكر والغدد الصماء",
    specialtyTitleEn: "Consultant of Internal Medicine, Diabetes & Endocrinology",
    bioAr: "عيادة متخصصة في التشخيص الشامل للأمراض الباطنية ومتابعة مرضى السكري وضغط الدم وأمراض الجهاز الهضمي بأحدث البروتوكولات العلاجية العالمية.",
    bioEn: "Specialized clinic in comprehensive internal medicine diagnosis, diabetes management, hypertension, and gastroenterology using modern global protocols.",
    discountPercent: 35,
    cityAr: "القاهرة",
    cityEn: "Cairo",
    addressAr: "45 شارع مصطفى النحاس، تقاطع مكرم عبيد، مدينة نصر، القاهرة",
    addressEn: "45 Mostafa El-Nahas St, Makram Ebeid Intersection, Nasr City, Cairo",
    phone: "01012345678",
    whatsapp: "201012345678",
    workingHoursAr: "يومياً من 4 عصراً إلى 10 مساءً (ماعدا الجمعة)",
    workingHoursEn: "Daily from 4:00 PM to 10:00 PM (Except Friday)",
    isFeatured: true,
    isActive: true,
    servicesJson: [
      { id: "s1", nameAr: "كشف استشاري وفحص سريري شامل", nameEn: "Consultant Examination & Clinical Checkup", originalPrice: 400, discountedPrice: 260 },
      { id: "s2", nameAr: "فحص السكر التراكمي ومتابعة السكري", nameEn: "HbA1c Analysis & Diabetes Review", originalPrice: 250, discountedPrice: 160 },
      { id: "s3", nameAr: "رسم قلب عادي مع تقرير فوري", nameEn: "Standard 12-Lead ECG with Report", originalPrice: 200, discountedPrice: 130 },
    ],
  },
  {
    id: "prov-2",
    slug: "el-nokhba-orthopedic-center",
    categoryId: "sub-2",
    categorySlug: "orthopedics",
    categoryNameAr: "عظام",
    categoryNameEn: "Orthopedics",
    parentCategorySlug: "doctors",
    nameAr: "مركز النخبة لجراحة العظام والمفاصل والعمود الفقري",
    nameEn: "El-Nokhba Orthopedics & Joint Surgery Center",
    specialtyTitleAr: "جراحة العظام والمفاصل والمناظير وعلاج آلام العمود الفقري",
    specialtyTitleEn: "Orthopedics, Arthroscopy & Spine Pain Management",
    bioAr: "مركز رائد يقدم رعاية متكاملة لإصابات الملاعب وخشونة الركبة والمفاصل وجراحات العظام بأعلى معدلات الأمان ونسب نجاح قياسية.",
    bioEn: "Premier center offering integrated care for sports injuries, knee osteoarthrosis, joint arthroscopy, and spine disorders with cutting-edge tech.",
    discountPercent: 40,
    cityAr: "الجيزة",
    cityEn: "Giza",
    addressAr: "12 شارع التحرير، أمام محطة مترو الدقي، الجيزة",
    addressEn: "12 El-Tahrir St, Opposite Dokki Metro Station, Giza",
    phone: "01023456789",
    whatsapp: "201023456789",
    workingHoursAr: "السبت إلى الخميس من 2 ظهراً حتى 9 مساءً",
    workingHoursEn: "Saturday to Thursday from 2:00 PM to 9:00 PM",
    isFeatured: true,
    isActive: true,
    servicesJson: [
      { id: "s4", nameAr: "كشف استشاري جراحة عظام ومفاصل", nameEn: "Orthopedic Consultant Examination", originalPrice: 500, discountedPrice: 300 },
      { id: "s5", nameAr: "حقن البلازما الغنية بالصفائح PRP للركبة", nameEn: "Knee PRP Plasma Injection", originalPrice: 1500, discountedPrice: 900 },
      { id: "s6", nameAr: "جبائر وتثبيت كسور بأحدث خامات الجبس الفايبر", nameEn: "Fiberglass Cast & Fracture Splint", originalPrice: 600, discountedPrice: 360 },
    ],
  },
  {
    id: "prov-3",
    slug: "nile-dental-center",
    categoryId: "cat-5",
    categorySlug: "dental",
    categoryNameAr: "أسنان",
    categoryNameEn: "Dental",
    nameAr: "مركز النيل التخصصي لطب وزراعة الأسنان",
    nameEn: "Nile Dental Specialty & Implantology Center",
    specialtyTitleAr: "طب وجراحة وزراعة وتقويم وتجميل الأسنان",
    specialtyTitleEn: "Dental Surgery, Implantology, Orthodontics & Aesthetics",
    bioAr: "مركز متكامل ومجهز بأحدث أجهزة الليزر والأشعة البانورامية للأسنان، مع بروتوكولات تعقيم ثلاثية صارمة وأطباء استشاريين.",
    bioEn: "Fully equipped dental center with modern laser units and digital panoramic radiology, featuring strict triple sterilization standards.",
    discountPercent: 30,
    cityAr: "الإسكندرية",
    cityEn: "Alexandria",
    addressAr: "88 طريق الحرية (شارع فؤاد)، أمام سينما ريو، زيزينيا، الإسكندرية",
    addressEn: "88 El-Horreya Rd (Fouad St), Opposite Rio Cinema, Zizinia, Alexandria",
    phone: "01034567890",
    whatsapp: "201034567890",
    workingHoursAr: "يومياً من 11 صباحاً حتى 10 مساءً",
    workingHoursEn: "Daily from 11:00 AM to 10:00 PM",
    isFeatured: true,
    isActive: true,
    servicesJson: [
      { id: "s7", nameAr: "جلسة تنظيف وتلميع وإزالة الجير بالموجات الصوتية", nameEn: "Ultrasonic Scaling & Teeth Polishing", originalPrice: 600, discountedPrice: 420 },
      { id: "s8", nameAr: "حشو كمبوزيت ضوئي تجميلي للأسنان", nameEn: "Cosmetic Composite Light-Cured Filling", originalPrice: 800, discountedPrice: 560 },
      { id: "s9", nameAr: "جلسة تبييض الأسنان بجهاز زووم 4 الأمريكي", nameEn: "Philips Zoom 4 In-Office Teeth Whitening", originalPrice: 3000, discountedPrice: 2100 },
    ],
  },
  {
    id: "prov-4",
    slug: "al-safwa-eye-center",
    categoryId: "cat-6",
    categorySlug: "ophthalmology",
    categoryNameAr: "عيون",
    categoryNameEn: "Ophthalmology",
    nameAr: "مركز الصفوة للعيون وتصحيح الإبصار بالفيمتو ليزك",
    nameEn: "Al-Safwa Eye & Femto-Lasik Vision Center",
    specialtyTitleAr: "طب وجراحة العيون والفيمتو ليزك والمياه البيضاء",
    specialtyTitleEn: "Ophthalmology, Femto-LASIK & Cataract Surgery",
    bioAr: "صرح طبي رائد لجراحات العيون بأحدث تقنيات الفيمتو سمايل والكونتورا فيجن لكفاءة رؤية فائقة ودقة متناهية.",
    bioEn: "Leading ophthalmic institution utilizing cutting-edge Femto-Smile and Contoura Vision technologies for sharp and precise visual correction.",
    discountPercent: 45,
    cityAr: "القاهرة",
    cityEn: "Cairo",
    addressAr: "20 شارع عباس العقاد، الدور الرابع، مدينة نصر، القاهرة",
    addressEn: "20 Abbas El-Akkad St, 4th Floor, Nasr City, Cairo",
    phone: "01045678901",
    whatsapp: "201045678901",
    workingHoursAr: "السبت إلى الخميس من 1 ظهراً حتى 9 مساءً",
    workingHoursEn: "Saturday to Thursday from 1:00 PM to 9:00 PM",
    isFeatured: true,
    isActive: true,
    servicesJson: [
      { id: "s10", nameAr: "فحص شامل لقاع العين وضغط العين والقرنية", nameEn: "Comprehensive Fundus, IOP & Cornea Exam", originalPrice: 500, discountedPrice: 275 },
      { id: "s11", nameAr: "فحص قياس النظر وتحديد سمك القرنية بالكمبيوتر", nameEn: "Computerized Refraction & Corneal Pachymetry", originalPrice: 200, discountedPrice: 110 },
      { id: "s12", nameAr: "عملية تصحيح الإبصار بالفيمتو ليزك للعينين", nameEn: "Bilateral Femto-LASIK Vision Correction", originalPrice: 12000, discountedPrice: 6600 },
    ],
  },
  {
    id: "prov-5",
    slug: "al-borg-laboratories",
    categoryId: "cat-3",
    categorySlug: "labs",
    categoryNameAr: "معامل",
    categoryNameEn: "Laboratories",
    nameAr: "معامل البرج للتحاليل الطبية والباثولوجيا",
    nameEn: "Al-Borg Medical Laboratories & Pathology",
    specialtyTitleAr: "التحاليل الطبية الشاملة والجينات والفحوصات الدورية",
    specialtyTitleEn: "Clinical Pathology, Genetics & Routine Checkups",
    bioAr: "أكبر شبكة معامل تحاليل طبية معتمدة وفقاً لمعايير الجودة الدولية ISO و CAP، لنتائج دقيقة وسريعة وموثوقة على مستوى الجمهورية.",
    bioEn: "The largest medical laboratory chain accredited under ISO & CAP standards, delivering rapid, accurate, and trusted diagnostic results.",
    discountPercent: 30,
    cityAr: "القاهرة",
    cityEn: "Cairo",
    addressAr: "فروع متعددة منتشرة بجميع أنحاء الجمهورية والمحافظات",
    addressEn: "Multiple Branches Nationwide Across All Governorates",
    phone: "01056789012",
    whatsapp: "201056789012",
    workingHoursAr: "خدمة 24 ساعة يومياً طوال الأسبوع مع خدمة السحب المنزلي",
    workingHoursEn: "24/7 Daily Service with Home Sample Collection",
    isFeatured: true,
    isActive: true,
    servicesJson: [
      { id: "s13", nameAr: "باقة الفحص الشامل للأسرة (24 تحليلاً دورياً)", nameEn: "Comprehensive Family Wellness Panel (24 Tests)", originalPrice: 1800, discountedPrice: 1260 },
      { id: "s14", nameAr: "تحليل صورة دم كاملة تفصيلية CBC", nameEn: "Complete Blood Count (CBC)", originalPrice: 250, discountedPrice: 175 },
      { id: "s15", nameAr: "وظائف كبد وكلى كاملة وسكر صائم وفاطر", nameEn: "Liver & Kidney Panel with Fasting Blood Sugar", originalPrice: 600, discountedPrice: 420 },
    ],
  },
  {
    id: "prov-6",
    slug: "cairo-scan-radiology",
    categoryId: "cat-4",
    categorySlug: "radiology",
    categoryNameAr: "أشعة",
    categoryNameEn: "Radiology",
    nameAr: "كايرو سكان للأشعة التخصصية والتحاليل",
    nameEn: "Cairo Scan Diagnostic Radiology Center",
    specialtyTitleAr: "الأشعة التشخيصية والتداخلية والرنين المغناطيسي والمقطعية",
    specialtyTitleEn: "Diagnostic & Interventional Radiology, MRI & CT",
    bioAr: "رواد التصوير الطبي التشخيصي في مصر بأحدث أجهزة الرنين المغناطيسي المغلق والمفتوح والأشعة المقطعية متعددة المقاطع.",
    bioEn: "Pioneers in diagnostic medical imaging equipped with state-of-the-art open/closed MRI systems and multi-slice CT scanners.",
    discountPercent: 35,
    cityAr: "الجيزة",
    cityEn: "Giza",
    addressAr: "75 شارع جامعة الدول العربية، ميدان مصطفى محمود، المهندسين",
    addressEn: "75 Gameat El-Dowal St, Mostafa Mahmoud Sq, Mohandessin",
    phone: "01067890123",
    whatsapp: "201067890123",
    workingHoursAr: "يومياً من 8 صباحاً حتى 12 منتصف الليل",
    workingHoursEn: "Daily from 8:00 AM to 12:00 Midnight",
    isFeatured: true,
    isActive: true,
    servicesJson: [
      { id: "s16", nameAr: "أشعة رنين مغناطيسي MRI على الفقرات القطنية أو العنقية", nameEn: "Lumbar or Cervical Spine MRI", originalPrice: 2200, discountedPrice: 1430 },
      { id: "s17", nameAr: "سونار رباعي الأبعاد 4D للاطمئنان على الجنين", nameEn: "4D Obstetric Ultrasound", originalPrice: 1000, discountedPrice: 650 },
      { id: "s18", nameAr: "أشعة مقطعية متعددة المقاطع CT على المخ أو الصدر", nameEn: "Multi-Slice Brain or Chest CT", originalPrice: 1800, discountedPrice: 1170 },
    ],
  },
  {
    id: "prov-7",
    slug: "dr-sherif-hegazy-cardiology",
    categoryId: "sub-5",
    categorySlug: "cardiology",
    categoryNameAr: "قلب",
    categoryNameEn: "Cardiology",
    parentCategorySlug: "doctors",
    nameAr: "عيادة د. شريف حجازي لأمراض وجراحة القلب والأوعية",
    nameEn: "Dr. Sherif Hegazy Cardiology & Heart Clinic",
    specialtyTitleAr: "استشاري أمراض القلب والأوعية الدموية والقسطرة العلاجية",
    specialtyTitleEn: "Consultant Cardiologist & Interventional Catheterization",
    bioAr: "عيادة قلب متطورة للكشف المبكر عن قصور الشرايين التاجية وعلاج اضطرابات نبضات القلب وإجراء فحوصات الإيكو بالموجات فوق الصوتية.",
    bioEn: "Advanced cardiology clinic dedicated to early detection of coronary artery disease, arrhythmia management, and color Doppler Echocardiography.",
    discountPercent: 40,
    cityAr: "المنصورة",
    cityEn: "Mansoura",
    addressAr: "شارع الجمهورية، برج الأطباء الاستشاريين، الدور الثالث، المنصورة",
    addressEn: "El-Gomhoureya St, Consultant Doctors Tower, 3rd Floor, Mansoura",
    phone: "01078901234",
    whatsapp: "201078901234",
    workingHoursAr: "الأحد والثلاثاء والخميس من 3 عصراً حتى 9 مساءً",
    workingHoursEn: "Sunday, Tuesday & Thursday from 3:00 PM to 9:00 PM",
    isFeatured: true,
    isActive: true,
    servicesJson: [
      { id: "s19", nameAr: "كشف استشاري قلب وأوعية دموية وفحص ضغط الدم", nameEn: "Cardiology Consultant Exam & BP Assessment", originalPrice: 600, discountedPrice: 360 },
      { id: "s20", nameAr: "موجات صوتية على القلب بالدوبلر الملون (إيكو)", nameEn: "Color Doppler Echocardiogram (Echo)", originalPrice: 900, discountedPrice: 540 },
      { id: "s21", nameAr: "رسم قلب بالمجهود على السير الكهربائي Stress ECG", nameEn: "Treadmill Stress Electrocardiogram (ECG)", originalPrice: 800, discountedPrice: 480 },
    ],
  },
  {
    id: "prov-8",
    slug: "care-pharmacy-group",
    categoryId: "cat-2",
    categorySlug: "pharmacies",
    categoryNameAr: "صيدليات",
    categoryNameEn: "Pharmacies",
    nameAr: "مجموعة صيدليات كير للأدوية والمستلزمات الطبية",
    nameEn: "Care Pharmacy Group & Medical Supplies",
    specialtyTitleAr: "صيدليات معتمدة للأدوية المحلية والمستوردة ومستحضرات العناية",
    specialtyTitleEn: "Certified Pharmacies for Local & Imported Rx & Wellness",
    bioAr: "صيدليات عصرية متكاملة توفر جميع الأصناف الدوائية ومستلزمات مرضى السكري وضغط الدم، مع خدمة استشارات دوائية مجانية وتوصيل منزلي.",
    bioEn: "Modern pharmacy network providing comprehensive pharmaceuticals, chronic illness care supplies, free consultations, and express delivery.",
    discountPercent: 20,
    cityAr: "القاهرة",
    cityEn: "Cairo",
    addressAr: "15 شارع شبرا الرئيسي، بجوار محطة مترو مسرة، القاهرة",
    addressEn: "15 Shubra Main St, Next to Massarra Metro Station, Cairo",
    phone: "01089012345",
    whatsapp: "201089012345",
    workingHoursAr: "خدمة صيدلية متواصلة على مدار 24 ساعة يومياً",
    workingHoursEn: "Continuous 24-hour daily pharmacy service",
    isFeatured: false,
    isActive: true,
    servicesJson: [
      { id: "s22", nameAr: "خصم فوري على مستحضرات التجميل والعناية بالبشرة", nameEn: "Direct Discount on Skincare & Cosmetics", originalPrice: 500, discountedPrice: 400 },
      { id: "s23", nameAr: "أجهزة قياس الضغط والسكر المنزلية الرقمية", nameEn: "Digital BP Monitors & Glucometers", originalPrice: 850, discountedPrice: 637 },
      { id: "s24", nameAr: "استشارة صيدلانية مع قياس ضغط وسكر وتوصيل مجاني", nameEn: "Pharmacist Consultation, BP/Glucose Check & Free Delivery", originalPrice: 100, discountedPrice: 50 },
    ],
  },
  {
    id: "prov-9",
    slug: "physiolife-rehab-center",
    categoryId: "cat-7",
    categorySlug: "physiotherapy",
    categoryNameAr: "علاج طبيعي",
    categoryNameEn: "Physical Therapy",
    nameAr: "مركز فيزيو لايف للعلاج الطبيعي والتأهيل الحركي",
    nameEn: "PhysioLife Physical Therapy & Rehabilitation Clinic",
    specialtyTitleAr: "العلاج الطبيعي وتأهيل ما بعد الجراحات وإصابات الملاعب",
    specialtyTitleEn: "Physical Therapy, Post-Op Rehab & Sports Recovery",
    bioAr: "أحدث أجهزة العلاج بالليزر البارد والموجات التصادمية وتأهيل العمود الفقري والانزلاق الغضروفي بإشراف نخبة من أساتذة العلاج الطبيعي.",
    bioEn: "Equipped with state-of-the-art cold laser and shockwave therapy units for spine rehab, disc decompression, and sports injuries.",
    discountPercent: 50,
    cityAr: "المعادي",
    cityEn: "Maadi",
    addressAr: "14 شارع النصر، أمام مطعم كورتيجيانو، المعادي الجديدة، القاهرة",
    addressEn: "14 El-Nasr St, Opposite Cortigiano, New Maadi, Cairo",
    phone: "01090123456",
    whatsapp: "201090123456",
    workingHoursAr: "السبت إلى الخميس من 10 صباحاً حتى 8 مساءً",
    workingHoursEn: "Saturday to Thursday from 10:00 AM to 8:00 PM",
    isFeatured: true,
    isActive: true,
    servicesJson: [
      { id: "s25", nameAr: "جلسة علاج طبيعي متكاملة (أجهزة + علاج يدوي)", nameEn: "Integrated Physical Therapy (Modalities + Manual)", originalPrice: 350, discountedPrice: 175 },
      { id: "s26", nameAr: "باقة 12 جلسة تأهيل للانزلاق الغضروفي والفقرات", nameEn: "12-Session Spine & Disc Decompression Package", originalPrice: 3600, discountedPrice: 1800 },
      { id: "s27", nameAr: "جلسة إبر صينية جافة Dry Needling لعلاج التقلصات", nameEn: "Dry Needling Session for Muscle Spasms", originalPrice: 450, discountedPrice: 225 },
    ],
  },
  {
    id: "prov-10",
    slug: "dr-youssef-nabil-surgery",
    categoryId: "sub-3",
    categorySlug: "surgery",
    categoryNameAr: "جراحة",
    categoryNameEn: "Surgery",
    parentCategorySlug: "doctors",
    nameAr: "عيادة د. يوسف نبيل للجراحة العامة وجراحة المناظير",
    nameEn: "Dr. Youssef Nabil General & Laparoscopic Surgery Clinic",
    specialtyTitleAr: "استشاري الجراحة العامة وجراحات المناظير والأورام",
    specialtyTitleEn: "Consultant General, Laparoscopic & Oncologic Surgeon",
    bioAr: "عيادة متخصصة في الفحص الدقيق والتشخيص الجراحي لجراحات الجهاز الهضمي والفتق والمرارة والغدة الدرقية بأحدث تقنيات المناظير الجراحية.",
    bioEn: "Specialized clinical evaluation for gastrointestinal, hernia, gallbladder, and thyroid surgical interventions with minimally invasive laparoscopy.",
    discountPercent: 35,
    cityAr: "طنطا",
    cityEn: "Tanta",
    addressAr: "شارع البحر، برج الشروق الطبي، الدور الثاني، ميدان الساعة، طنطا",
    addressEn: "El-Bahr St, El-Shorouk Medical Tower, 2nd Floor, El-Saa Sq, Tanta",
    phone: "01011223344",
    whatsapp: "201011223344",
    workingHoursAr: "السبت والاثنين والأربعاء من 5 مساءً حتى 10 مساءً",
    workingHoursEn: "Saturday, Monday & Wednesday from 5:00 PM to 10:00 PM",
    isFeatured: false,
    isActive: true,
    servicesJson: [
      { id: "s28", nameAr: "كشف استشاري جراحة عامة ومناظير ومتابعة", nameEn: "General & Laparoscopic Surgery Consultant Exam", originalPrice: 450, discountedPrice: 290 },
      { id: "s29", nameAr: "غيار جراحي معقم مع فحص التئام الجروح", nameEn: "Sterile Surgical Dressing & Wound Healing Check", originalPrice: 200, discountedPrice: 130 },
      { id: "s30", nameAr: "استئصال زوائد جلدية وأكياس دهنية صغرى جراحياً", nameEn: "Minor Surgical Excision of Sebaceous Cyst", originalPrice: 800, discountedPrice: 520 },
    ],
  },
];

export const INITIAL_USERS: UserItem[] = [
  {
    id: "usr-admin",
    nationalId: "10000000000000",
    passwordHash: "$2a$10$7R6t2j/Yh5d3t3X3j3t9E.e2K8fX8C9Y9k1X0.M2n4p6r8t0v2w4y", // Admin@1234
    fullNameAr: "مدير النظام العام",
    fullNameEn: "System Administrator",
    phone: "+201000000000",
    role: "ADMIN",
    membershipNo: "FH-ADM-100001",
    isActive: true,
    familyMembers: [],
    documents: [],
  },
  {
    id: "usr-patient",
    nationalId: "29901011234567",
    passwordHash: "$2a$10$7R6t2j/Yh5d3t3X3j3t9E.e2K8fX8C9Y9k1X0.M2n4p6r8t0v2w4y", // Patient@123
    fullNameAr: "محمود حسن عبد الرحيم",
    fullNameEn: "Mahmoud Hassan Abdelrahim",
    phone: "+201012345678",
    role: "PATIENT",
    membershipNo: "FH-2025-998877",
    isActive: true,
    familyMembers: [
      {
        id: "fam-1",
        parentUserId: "usr-patient",
        fullNameAr: "سارة إبراهيم القاضي",
        fullNameEn: "Sara Ibrahim El-Kady",
        nationalId: "29905051234568",
        relationAr: "زوجة",
        relationEn: "Spouse",
        createdAt: "2025-01-15T10:00:00.000Z",
      },
      {
        id: "fam-2",
        parentUserId: "usr-patient",
        fullNameAr: "ياسين محمود حسن",
        fullNameEn: "Yassin Mahmoud Hassan",
        nationalId: "31802021234569",
        relationAr: "ابن",
        relationEn: "Son",
        createdAt: "2025-01-15T10:05:00.000Z",
      },
    ],
    documents: [
      {
        id: "doc-1",
        userId: "usr-patient",
        title: "روشتة علاج السكري والضغط - عيادة د. طارق البنا",
        category: "prescription",
        fileType: "PDF",
        fileName: "prescription_internal_medicine.pdf",
        fileSize: 245760,
        fileUrl: "#",
        createdAt: "2025-01-20T11:30:00.000Z",
      },
      {
        id: "doc-2",
        userId: "usr-patient",
        title: "صورة فحص الركبة بالرنين المغناطيسي - كايرو سكان",
        category: "radiology",
        fileType: "IMAGE",
        fileName: "knee_mri_scan.jpg",
        fileSize: 1887436,
        fileUrl: "#",
        createdAt: "2025-01-22T14:15:00.000Z",
      },
      {
        id: "doc-3",
        userId: "usr-patient",
        title: "تقرير استشارة وفحص جراحي شامل - تقرير وورد",
        category: "report",
        fileType: "WORD",
        fileName: "surgical_consultation_summary.docx",
        fileSize: 104448,
        fileUrl: "#",
        createdAt: "2025-01-25T09:40:00.000Z",
      },
    ],
  },
];

export type CompanyType = "MEDICAL_EQUIPMENT" | "PHARMACEUTICAL" | "CHEMICAL_LAB_SUPPLY";

export interface InstallmentPlanItem {
  months: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  monthlyAmount: number;
}

export interface CompanyProductItem {
  id: string;
  companyId: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  specsAr: string;
  specsEn: string;
  cashPrice: number;
  minDownPaymentPercent: number;
  installmentPlans: InstallmentPlanItem[];
  imageUrl?: string;
  inStock: boolean;
}

export interface MedicalCompanyItem {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  type: CompanyType;
  typeNameAr: string;
  typeNameEn: string;
  phone: string;
  whatsapp: string;
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  bioAr: string;
  bioEn: string;
  isInstallmentAvailable: boolean;
  maxInstallmentMonths: number;
  coverImageUrl?: string;
  isActive: boolean;
  products: CompanyProductItem[];
}

export const INITIAL_MEDICAL_COMPANIES: MedicalCompanyItem[] = [
  {
    id: "comp-1",
    slug: "biomedix-medical-equipment",
    nameAr: "الشركة الهندسية للأجهزة والمعدات الطبية (BioMedix)",
    nameEn: "BioMedix Medical Systems & Equipment",
    type: "MEDICAL_EQUIPMENT",
    typeNameAr: "أجهزة ومعدات طبية",
    typeNameEn: "Medical Equipment",
    phone: "01004315212",
    whatsapp: "201004315212",
    cityAr: "القاهرة",
    cityEn: "Cairo",
    addressAr: "45 شارع مكرم عبيد، المنطقة السادسة، مدينة نصر، القاهرة",
    addressEn: "45 Makram Ebeid St, 6th Zone, Nasr City, Cairo",
    bioAr: "وكيل معتمد ومستورد كبرى الشركات العالمية في أجهزة الموجات الصوتية 4D، أجهزة رسم القلب، ومعدات غرف العمليات والعناية المركزة بتسهيلات تقسيط مباشرة للأطباء والمراكز الطبية حتى 36 شهراً.",
    bioEn: "Authorized distributor of cutting-edge 4D ultrasound, ECG systems, and ICU equipment with direct installment facilities for healthcare providers up to 36 months.",
    isInstallmentAvailable: true,
    maxInstallmentMonths: 36,
    isActive: true,
    products: [
      {
        id: "prod-1",
        companyId: "comp-1",
        nameAr: "جهاز موجات فوق صوتية وسونار رباعي الأبعاد (4D Ultrasound)",
        nameEn: "4D Color Doppler Ultrasound System",
        categoryAr: "أجهزة تشخيصية وأشعة",
        categoryEn: "Diagnostic Ultrasound",
        specsAr: "شاشة 21.5 بوصة عالية الدقة، 4 منافذ مجسات نشطة، مجس باطنة ومجس نساء وتوليد 4D، خاصية التظهير التلقائي للأوعية الدموية.",
        specsEn: "21.5 inch HD display, 4 active probe ports, convex & 4D volumetric probes with auto-vascular flow.",
        cashPrice: 380000,
        minDownPaymentPercent: 20,
        installmentPlans: [
          { months: 12, downPaymentPercent: 20, downPaymentAmount: 76000, monthlyAmount: 26800 },
          { months: 24, downPaymentPercent: 20, downPaymentAmount: 76000, monthlyAmount: 14200 },
          { months: 36, downPaymentPercent: 25, downPaymentAmount: 95000, monthlyAmount: 9500 },
        ],
        inStock: true,
      },
      {
        id: "prod-2",
        companyId: "comp-1",
        nameAr: "جهاز رسم قلب 12 قناة ديجيتال مع تحليل تلقائي (ECG 12-Ch)",
        nameEn: "12-Channel Digital ECG Machine with Auto Interpretation",
        categoryAr: "أجهزة قلب وباطنة",
        categoryEn: "Cardiology Equipment",
        specsAr: "شاشة لمس 10 بوصة، طابعة حرارية مدمجة، ذاكرة تسع أكثر من 1000 فحص، بطارية قابلة لإعادة الشحن تدوم 6 ساعات.",
        specsEn: "10 inch touch screen, integrated thermal printer, 1000+ patient memory, 6-hour rechargeable battery.",
        cashPrice: 48000,
        minDownPaymentPercent: 15,
        installmentPlans: [
          { months: 6, downPaymentPercent: 15, downPaymentAmount: 7200, monthlyAmount: 7100 },
          { months: 12, downPaymentPercent: 20, downPaymentAmount: 9600, monthlyAmount: 3400 },
        ],
        inStock: true,
      },
    ],
  },
  {
    id: "comp-2",
    slug: "royal-dental-tech",
    nameAr: "رويال دنتال لتجهيز عيادات ومراكز الأسنان",
    nameEn: "Royal Dental Tech Solutions",
    type: "MEDICAL_EQUIPMENT",
    typeNameAr: "تجهيزات ومعدات أسنان",
    typeNameEn: "Dental Equipment",
    phone: "01117945122",
    whatsapp: "201117945122",
    cityAr: "الجيزة",
    cityEn: "Giza",
    addressAr: "18 شارع التحرير، الدقي، الجيزة",
    addressEn: "18 El-Tahrir St, Dokki, Giza",
    bioAr: "متخصصون في التجهيز المتكامل لعيادات ومراكز جراحة وزراعة الأسنان، كراسي الأسنان الهيدروليكية الأوروبية، وأجهزة الأشعة البانورامية الرقمية مع أنظمة تقسيط ميسرة.",
    bioEn: "Turnkey dental clinic furnishings, European hydraulic dental chairs, and digital panoramic X-ray systems with flexible installment plans.",
    isInstallmentAvailable: true,
    maxInstallmentMonths: 24,
    isActive: true,
    products: [
      {
        id: "prod-3",
        companyId: "comp-2",
        nameAr: "وحدة كرسي أسنان هيدروليكي متكامل (Smart Dental Unit Pro)",
        nameEn: "Hydraulic Smart Dental Chair Unit",
        categoryAr: "تجهيز عيادات أسنان",
        categoryEn: "Dental Units",
        specsAr: "إضاءة ليد بدون ظلال مع حساس حركة، مبصقة خزفية متحركة، تابلوه طبيب متسع مع شاشة تحكم ديجيتال، موتور هيدروليكي فائق الهدوء.",
        specsEn: "Shadowless sensor LED light, rotatable ceramic spittoon, broad doctor table with touch control, quiet hydraulic motor.",
        cashPrice: 135000,
        minDownPaymentPercent: 20,
        installmentPlans: [
          { months: 12, downPaymentPercent: 20, downPaymentAmount: 27000, monthlyAmount: 9500 },
          { months: 24, downPaymentPercent: 25, downPaymentAmount: 33750, monthlyAmount: 4950 },
        ],
        inStock: true,
      },
    ],
  },
  {
    id: "comp-3",
    slug: "pharmacare-distribution",
    nameAr: "فارماكير لتجارة وتوزيع الأدوية والمستلزمات الطبية",
    nameEn: "PharmaCare Drug & Medical Distribution",
    type: "PHARMACEUTICAL",
    typeNameAr: "شركات ومخازن أدوية",
    typeNameEn: "Pharmaceutical Distribution",
    phone: "01004315212",
    whatsapp: "201004315212",
    cityAr: "القاهرة",
    cityEn: "Cairo",
    addressAr: "المنطقة الصناعية الثالثة، التجمع الخامس، القاهرة الجديدة",
    addressEn: "3rd Industrial Zone, 5th Settlement, New Cairo",
    bioAr: "توريد الأدوية والمحاليل الطبية ومستلزمات الطوارئ للعيادات والمراكز والمستشفيات، بأسعار الجملة المباشرة مع تسهيلات سداد ودفعات شهرية منتظمة.",
    bioEn: "Direct pharmaceutical supplies, emergency kits, and IV fluids for clinics and private hospitals with scheduled deferred payments.",
    isInstallmentAvailable: true,
    maxInstallmentMonths: 12,
    isActive: true,
    products: [
      {
        id: "prod-4",
        companyId: "comp-3",
        nameAr: "بكج حقيبة طوارئ متكاملة للعيادات والمراكز التخصصية",
        nameEn: "Comprehensive Clinic Emergency Crash Cart Kit",
        categoryAr: "أدوية ومستلزمات طوارئ",
        categoryEn: "Emergency Medical Supplies",
        specsAr: "تشمل أدوية الطوارئ المعتمدة، أمبولات الإنعاش، كانيولات مقاسات متنوعة، جهاز ضغط زئبقي وسماعة طبية معتمدة مع دولاب أدوية طوارئ معدني.",
        specsEn: "Includes crash cart medications, resuscitation ampoules, IV cannulas, certified sphygmomanometer & heavy duty storage cabinet.",
        cashPrice: 22000,
        minDownPaymentPercent: 20,
        installmentPlans: [
          { months: 6, downPaymentPercent: 20, downPaymentAmount: 4400, monthlyAmount: 3100 },
          { months: 12, downPaymentPercent: 25, downPaymentAmount: 5500, monthlyAmount: 1500 },
        ],
        inStock: true,
      },
    ],
  },
  {
    id: "comp-4",
    slug: "chemlab-supplies-egypt",
    nameAr: "المصرية لمستلزمات وكيماويات المعامل والتحاليل الطبية",
    nameEn: "Egypt ChemLab Supplies & Diagnostic Reagents",
    type: "CHEMICAL_LAB_SUPPLY",
    typeNameAr: "مستلزمات وكيماويات معامل",
    typeNameEn: "Chemical & Lab Supplies",
    phone: "01117945122",
    whatsapp: "201117945122",
    cityAr: "الإسكندرية",
    cityEn: "Alexandria",
    addressAr: "70 طريق الحرية، سموحة، الإسكندرية",
    addressEn: "70 Horreya Rd, Smouha, Alexandria",
    bioAr: "تجهيز معامل التحاليل الطبية بأجهزة كيمياء الدم التلقائية، كواشف التحاليل المعتمدة (ISO & CE)، أجهزة سنترفيوج وحاضنات ومستلزمات سحب العينات.",
    bioEn: "Equipping medical laboratories with automated blood chemistry analyzers, diagnostic reagents, centrifuges, and sample collection supplies with installment plans.",
    isInstallmentAvailable: true,
    maxInstallmentMonths: 24,
    isActive: true,
    products: [
      {
        id: "prod-5",
        companyId: "comp-4",
        nameAr: "جهاز كيمياء دم نصف أوتوماتيكي للمعامل (BioChem Semi-Auto)",
        nameEn: "Semi-Automated Clinical Chemistry Analyzer",
        categoryAr: "أجهزة معامل وتحاليل",
        categoryEn: "Laboratory Analyzers",
        specsAr: "طول موجي 340-670 نانومتر، كوفيت حراري مدمج، شاشة LCD ملونة، يدعم تحاليل وظائف الكبد والكلى والدهون والسكر بدقة مخبرية متناهية.",
        specsEn: "340-670nm wavelengths, integrated thermal cuvette, color LCD display, full hepatic, renal and lipid profiles.",
        cashPrice: 85000,
        minDownPaymentPercent: 20,
        installmentPlans: [
          { months: 12, downPaymentPercent: 20, downPaymentAmount: 17000, monthlyAmount: 6000 },
          { months: 24, downPaymentPercent: 25, downPaymentAmount: 21250, monthlyAmount: 3100 },
        ],
        inStock: true,
      },
    ],
  },
];
