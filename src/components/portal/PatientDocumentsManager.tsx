"use client";

import React, { useState, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  UploadCloud,
  FileImage,
  FileSpreadsheet,
  Download,
  Trash2,
  Eye,
  AlertCircle,
  Loader2,
  FolderOpen,
  Filter,
  Search,
  X,
  CheckCircle2,
  HardDrive,
  FileCheck,
} from "lucide-react";
import {
  uploadDocumentAction,
  deleteDocumentAction,
  type DocumentActionResult,
} from "@/actions/documents";
import type { PatientDocumentItem } from "@/lib/mock-data";

interface PatientDocumentsManagerProps {
  documents: PatientDocumentItem[];
  locale: string;
}

export const PatientDocumentsManager: React.FC<PatientDocumentsManagerProps> = ({
  documents: initialDocuments,
  locale,
}) => {
  const router = useRouter();
  const isAr = locale === "ar";
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<string>("prescription");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDoc, setPreviewDoc] = useState<PatientDocumentItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [documentsList, setDocumentsList] = useState<PatientDocumentItem[]>(initialDocuments);
  const [, startTransition] = useTransition();

  React.useEffect(() => {
    setDocumentsList((prev) => {
      const serverIds = new Set(initialDocuments.map((d) => d.id));
      const optimisticOnly = prev.filter((d) => !serverIds.has(d.id));
      return [...initialDocuments, ...optimisticOnly];
    });
  }, [initialDocuments]);

  const [state, formAction, isPending] = useActionState<DocumentActionResult | null, FormData>(
    async (prevState, formData) => {
      const res = await uploadDocumentAction(locale, prevState, formData);
      if (res.success && res.document) {
        const doc = res.document;
        setDocumentsList((prev) => [doc, ...prev]);
        setIsUploading(false);
        setSelectedFile(null);
        setTitleInput("");
        startTransition(() => {
          router.refresh();
        });
      }
      return res;
    },
    null
  );

  const handleDelete = async (docId: string) => {
    if (
      !confirm(
        isAr
          ? "هل أنت متأكد من حذف هذا المستند من سجلك الطبي؟"
          : "Are you sure you want to delete this document?"
      )
    ) {
      return;
    }

    setDeletingId(docId);
    setDocumentsList((prev) => prev.filter((d) => d.id !== docId));
    try {
      await deleteDocumentAction(locale, docId);
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalBytesUsed = documentsList.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);
  const storageCapacityBytes = 50 * 1024 * 1024; // 50 MB quota
  const storagePercentage = Math.min(100, Math.round((totalBytesUsed / storageCapacityBytes) * 100));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!titleInput) {
        const rawName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        setTitleInput(rawName.replace(/[-_]/g, " "));
      }
    }
  };

  const categories = [
    { id: "all", labelAr: "جميع المستندات", labelEn: "All Documents" },
    { id: "prescription", labelAr: "روشتات طبية", labelEn: "Prescriptions" },
    { id: "lab", labelAr: "نتائج تحاليل", labelEn: "Lab Results" },
    { id: "radiology", labelAr: "صور أشعة", labelEn: "Radiology Scans" },
    { id: "report", labelAr: "تقارير طبية", labelEn: "Medical Reports" },
    { id: "other", labelAr: "أخرى", labelEn: "Other" },
  ];

  const getCategoryLabel = (cat: string) => {
    const found = categories.find((c) => c.id === cat);
    return isAr ? found?.labelAr || cat : found?.labelEn || cat;
  };

  const filteredDocs = documentsList.filter((doc) => {
    const matchesCategory =
      activeCategoryFilter === "all" || doc.category === activeCategoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  const renderFileBadge = (fileType: string) => {
    if (fileType === "PDF") {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
          <FileText className="h-3 w-3 text-rose-600" />
          <span>PDF</span>
        </span>
      );
    }
    if (fileType === "WORD") {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
          <FileSpreadsheet className="h-3 w-3 text-blue-600" />
          <span>WORD</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
        <FileImage className="h-3 w-3 text-emerald-600" />
        <span>IMG</span>
      </span>
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="text-start space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-teal-50 text-brand-teal-700">
              <FolderOpen className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {isAr ? "مساحة المستندات والملفات الطبية" : "Medical Records & Storage"}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            {isAr
              ? "مساحة تخزين آمنة وخاصة لحفظ الروشتات، نتائج التحاليل، صور الأشعة والتقارير الطبية (صور، Word، PDF)."
              : "Secure storage for your prescriptions, lab tests, radiology scans and medical reports (Images, Word, PDF)."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploading(!isUploading)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-teal-700 transition-colors self-start sm:self-auto min-h-[44px]"
        >
          <UploadCloud className="h-4 w-4" />
          <span>{isAr ? "رفع مستند جديد" : "Upload Document"}</span>
        </button>
      </div>

      {/* Storage Capacity Gauge & Supported Types Info */}
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <HardDrive className="h-4 w-4 text-brand-teal-600" />
            <span>
              {isAr
                ? `المساحة المستخدمة: ${formatFileSize(totalBytesUsed)} من أصل 50 MB (${documentsList.length} مستند)`
                : `Storage Used: ${formatFileSize(totalBytesUsed)} of 50 MB (${documentsList.length} documents)`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>{isAr ? "الصيغ المدعومة:" : "Supported Formats:"}</span>
            <span className="font-semibold text-slate-700">JPG, PNG, PDF, Word (.docx)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand-teal-600 transition-all duration-500"
            style={{ width: `${Math.max(4, storagePercentage)}%` }}
          />
        </div>
      </div>

      {/* Upload Drawer Form */}
      {isUploading && (
        <form
          action={formAction}
          className="mt-6 rounded-2xl border border-brand-teal-200 bg-brand-teal-50/40 p-6 space-y-4"
        >
          <div className="text-start">
            <h4 className="text-sm font-bold text-brand-teal-950 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-brand-teal-700" />
              <span>{isAr ? "رفع مستند أو فحص طبي جديد" : "Upload New Medical Document"}</span>
            </h4>
            <p className="text-xs text-brand-teal-800 mt-0.5">
              {isAr
                ? "يمكنك رفع صورة للروشتة أو الأشعة، أو ملف PDF للتحليل، أو ملف Word للتقرير الطبي (الحد الأقصى 10MB)."
                : "Upload prescription images, lab PDFs, radiology scans, or Word reports (max 10MB)."}
            </p>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title Input */}
            <div className="text-start">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isAr ? "اسم أو وصف المستند *" : "Document Title / Description *"}
              </label>
              <input
                type="text"
                name="title"
                required
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder={isAr ? "مثال: روشتة د. طارق، تحليل سكر صائم" : "e.g. Lab results, Prescription"}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none min-h-[44px]"
              />
            </div>

            {/* Category Select */}
            <div className="text-start">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isAr ? "تصنيف المستند *" : "Category *"}
              </label>
              <select
                name="category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:outline-none min-h-[44px]"
              >
                <option value="prescription">{isAr ? "روشتة طبية" : "Prescription"}</option>
                <option value="lab">{isAr ? "نتائج تحاليل" : "Lab Results"}</option>
                <option value="radiology">{isAr ? "صور وفحوصات أشعة" : "Radiology Scans"}</option>
                <option value="report">{isAr ? "تقرير طبي واستشارة" : "Medical Report"}</option>
                <option value="other">{isAr ? "مستندات أخرى" : "Other Documents"}</option>
              </select>
            </div>
          </div>

          {/* File Selector Dropzone */}
          <div className="text-start">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isAr ? "الملف المراد رفعه (صور، Word، PDF) *" : "Choose File (Images, Word, PDF) *"}
            </label>
            <div className="relative rounded-2xl border-2 border-dashed border-brand-teal-300 bg-white p-6 text-center hover:bg-slate-50 transition-colors">
              <input
                type="file"
                name="file"
                required
                accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="mx-auto h-8 w-8 text-brand-teal-600 mb-2" />
              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-brand-teal-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">
                    {isAr ? "اضغط لاختيار ملف من جهازك أو اسحبه هنا" : "Click to select a file or drag & drop"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    JPG, PNG, WEBP, PDF, DOC, DOCX ({isAr ? "حتى 10 ميجابايت" : "up to 10MB"})
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsUploading(false);
                setSelectedFile(null);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 min-h-[44px]"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-teal-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-teal-700 disabled:opacity-50 min-h-[44px]"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isAr ? "تأكيد ورفع المستند" : "Upload Document"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <Filter className="h-3.5 w-3.5 text-slate-400 me-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`rounded-xl px-3 py-1.5 font-bold transition-colors min-h-[36px] ${
                activeCategoryFilter === cat.id
                  ? "bg-brand-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "بحث في المستندات..." : "Search files..."}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 ps-9 pe-3 py-2 text-xs font-semibold text-slate-900 focus:border-brand-teal-500 focus:bg-white focus:outline-none min-h-[40px]"
          />
          <Search className="absolute start-3 top-3 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="mt-6">
        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-brand-teal-400 hover:shadow-md transition-all text-start"
              >
                <div>
                  {/* Top Row: File Badge + Category */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    {renderFileBadge(doc.fileType)}
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {getCategoryLabel(doc.category)}
                    </span>
                  </div>

                  {/* Document Title */}
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {doc.title}
                  </h4>

                  {/* File Name & Size */}
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="truncate max-w-[140px]" title={doc.fileName}>
                      {doc.fileName}
                    </span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-brand-teal-50 hover:text-brand-teal-700 hover:border-brand-teal-300 transition-colors"
                      title={isAr ? "معاينة الملف" : "Preview"}
                    >
                      <Eye className="h-3 w-3" />
                      <span>{isAr ? "معاينة" : "View"}</span>
                    </button>

                    {/* Download Link */}
                    <a
                      href={doc.fileUrl}
                      download={doc.fileName}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      title={isAr ? "تحميل المستند" : "Download"}
                    >
                      <Download className="h-3 w-3" />
                      <span>{isAr ? "تحميل" : "Save"}</span>
                    </a>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    title={isAr ? "حذف الملف" : "Delete"}
                  >
                    {deletingId === doc.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <FolderOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h4 className="mt-3 text-sm font-bold text-slate-800">
              {isAr ? "لا توجد مستندات في هذا التصنيف" : "No documents found in this section"}
            </h4>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              {isAr
                ? "يمكنك البدء برفع الروشتات، نتائج التحاليل، صور الأشعة أو مستندات Word لحفظها بسجلك الطبي."
                : "You can upload prescriptions, lab reports, radiology scans or Word docs to keep your medical history organized."}
            </p>
            <button
              type="button"
              onClick={() => setIsUploading(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-teal-700 min-h-[44px]"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>{isAr ? "رفع مستند الآن" : "Upload File Now"}</span>
            </button>
          </div>
        )}
      </div>

      {/* In-App Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative flex flex-col w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:px-6">
              <div className="text-start">
                <div className="flex items-center gap-2">
                  {renderFileBadge(previewDoc.fileType)}
                  <h4 className="text-sm font-bold text-slate-900 truncate max-w-md">
                    {previewDoc.title}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {previewDoc.fileName} • {formatFileSize(previewDoc.fileSize)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: File Type Dependent */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50 text-center flex items-center justify-center min-h-[300px]">
              {previewDoc.fileType === "IMAGE" ? (
                previewDoc.fileUrl && previewDoc.fileUrl.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-sm"
                  />
                ) : (
                  <div className="space-y-3 py-8">
                    <FileImage className="mx-auto h-16 w-16 text-emerald-600" />
                    <p className="text-xs font-bold text-slate-700">
                      {isAr ? "معاينة صورة الفحص الطبي" : "Medical Image Preview"}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">{previewDoc.fileName}</p>
                  </div>
                )
              ) : previewDoc.fileType === "PDF" ? (
                <div className="space-y-3 py-8">
                  <FileText className="mx-auto h-16 w-16 text-rose-600" />
                  <p className="text-xs font-bold text-slate-800">
                    {isAr ? "مستند بصيغة PDF (روشتة / تقرير طبي)" : "PDF Medical Document"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">{previewDoc.fileName}</p>
                  <a
                    href={previewDoc.fileUrl}
                    download={previewDoc.fileName}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-teal-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isAr ? "تحميل وفتح المستند" : "Download & Open"}</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-3 py-8">
                  <FileSpreadsheet className="mx-auto h-16 w-16 text-blue-600" />
                  <p className="text-xs font-bold text-slate-800">
                    {isAr ? "مستند وورد طبي (.doc / .docx)" : "Word Medical Document (.docx)"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">{previewDoc.fileName}</p>
                  <a
                    href={previewDoc.fileUrl}
                    download={previewDoc.fileName}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-teal-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isAr ? "تحميل ملف الوورد" : "Download Word File"}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 p-4 bg-white">
              <span className="text-[11px] text-slate-500">
                {isAr ? "مستند مشفر ومخزن بأمان" : "Encrypted & securely stored"}
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="rounded-xl border border-slate-300 px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
