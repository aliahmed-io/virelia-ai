"use client";

import React from "react";
import {
  Stethoscope,
  Pill,
  FlaskConical,
  ScanLine,
  Smile,
  Eye,
  Activity,
  HeartPulse,
  Bone,
  Scissors,
  Headphones,
  Heart,
  ShieldAlert,
  LayoutGrid,
} from "lucide-react";
import type { CategoryItem } from "@/lib/mock-data";

interface CategoryFilterBarProps {
  locale: string;
  topCategories: CategoryItem[];
  doctorSubSpecialties: CategoryItem[];
  selectedCategory: string;
  selectedSubSpecialty: string;
  onSelectCategory: (slug: string) => void;
  onSelectSubSpecialty: (slug: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Stethoscope,
  Pill,
  FlaskConical,
  ScanLine,
  Smile,
  Eye,
  Activity,
  HeartPulse,
  Bone,
  Scissors,
  Headphones,
  Heart,
  ShieldAlert,
};

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  locale,
  topCategories,
  doctorSubSpecialties,
  selectedCategory,
  selectedSubSpecialty,
  onSelectCategory,
  onSelectSubSpecialty,
}) => {
  const isAr = locale === "ar";

  const isDoctorsSelected = selectedCategory === "doctors";

  return (
    <div className="w-full space-y-4">
      {/* Primary Categories Scrollable Pill Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* All / Reset Pill */}
        <button
          type="button"
          onClick={() => {
            onSelectCategory("");
            onSelectSubSpecialty("");
          }}
          className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
            selectedCategory === ""
              ? "bg-brand-teal-600 text-white shadow-md shadow-brand-teal-600/20 scale-[1.02]"
              : "border border-slate-200 bg-white text-slate-700 hover:border-brand-teal-300 hover:bg-slate-50"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>{isAr ? "جميع الأقسام" : "All Categories"}</span>
        </button>

        {topCategories.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || Stethoscope;
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onSelectCategory("");
                  onSelectSubSpecialty("");
                } else {
                  onSelectCategory(cat.slug);
                  onSelectSubSpecialty("");
                }
              }}
              className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                isSelected
                  ? "bg-brand-teal-600 text-white shadow-md shadow-brand-teal-600/20 scale-[1.02]"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-brand-teal-300 hover:bg-slate-50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-brand-teal-600"}`} />
              <span>{isAr ? cat.nameAr : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Sub-filter for Doctors Sub-Specialties */}
      {isDoctorsSelected && (
        <div className="rounded-2xl border border-brand-teal-100 bg-brand-teal-50/60 p-4 transition-all animate-fadeIn">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-brand-teal-900">
              {isAr ? "تخصصات الأطباء الدقيقة:" : "Doctor Sub-Specialties:"}
            </span>
            {selectedSubSpecialty && (
              <button
                type="button"
                onClick={() => onSelectSubSpecialty("")}
                className="text-xs font-semibold text-brand-teal-700 hover:underline"
              >
                {isAr ? "عرض كل الأطباء" : "Show All Doctors"}
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {doctorSubSpecialties.map((sub) => {
              const SubIcon = ICON_MAP[sub.iconName] || HeartPulse;
              const isSubSelected = selectedSubSpecialty === sub.slug;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() =>
                    onSelectSubSpecialty(isSubSelected ? "" : sub.slug)
                  }
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    isSubSelected
                      ? "bg-brand-teal-700 text-white shadow-sm"
                      : "border border-brand-teal-200/80 bg-white text-brand-teal-900 hover:bg-brand-teal-100/60"
                  }`}
                >
                  <SubIcon className={`h-3.5 w-3.5 ${isSubSelected ? "text-white" : "text-brand-teal-600"}`} />
                  <span>{isAr ? sub.nameAr : sub.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
