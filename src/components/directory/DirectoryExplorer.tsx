"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, SlidersHorizontal, RotateCcw } from "lucide-react";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { ProviderCard } from "./ProviderCard";
import { WhatsAppBookingModal } from "../booking/WhatsAppBookingModal";
import type { ProviderItem, CategoryItem, UserItem } from "@/lib/mock-data";

interface DirectoryExplorerProps {
  providers: ProviderItem[];
  topCategories: CategoryItem[];
  doctorSubSpecialties: CategoryItem[];
  locale: string;
  currentUser: UserItem | null;
  initialSearch?: string;
  initialCategory?: string;
}

export const DirectoryExplorer: React.FC<DirectoryExplorerProps> = ({
  providers,
  topCategories,
  doctorSubSpecialties,
  locale,
  currentUser,
  initialSearch = "",
  initialCategory = "",
}) => {
  const isAr = locale === "ar";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubSpecialty, setSelectedSubSpecialty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [bookingProvider, setBookingProvider] = useState<ProviderItem | null>(null);

  // Extract unique cities
  const cities = useMemo(() => {
    const set = new Set<string>();
    providers.forEach((p) => {
      set.add(isAr ? p.cityAr : p.cityEn);
    });
    return Array.from(set);
  }, [providers, isAr]);

  // Client-side filtering for snappy instant interactions
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      // Category filter
      if (selectedCategory) {
        const matchesCategory =
          p.categorySlug === selectedCategory ||
          p.parentCategorySlug === selectedCategory;
        if (!matchesCategory) return false;
      }

      // Sub-specialty filter
      if (selectedSubSpecialty) {
        if (p.categorySlug !== selectedSubSpecialty) return false;
      }

      // City filter
      if (selectedCity) {
        const cityValue = isAr ? p.cityAr : p.cityEn;
        if (cityValue !== selectedCity) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName =
          p.nameAr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
        const matchesSpecialty =
          p.specialtyTitleAr.toLowerCase().includes(q) ||
          p.specialtyTitleEn.toLowerCase().includes(q);
        const matchesCity =
          p.cityAr.toLowerCase().includes(q) || p.cityEn.toLowerCase().includes(q);
        const matchesAddress =
          p.addressAr.toLowerCase().includes(q) ||
          p.addressEn.toLowerCase().includes(q);

        if (!matchesName && !matchesSpecialty && !matchesCity && !matchesAddress) {
          return false;
        }
      }

      return true;
    });
  }, [
    providers,
    selectedCategory,
    selectedSubSpecialty,
    selectedCity,
    searchQuery,
    isAr,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSubSpecialty("");
    setSelectedCity("");
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedCategory) ||
    Boolean(selectedSubSpecialty) ||
    Boolean(selectedCity);

  return (
    <div className="space-y-8">
      {/* Search Bar & City Selector Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              aria-label={isAr ? "ابحث عن مقدم خدمة" : "Search providers"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? "ابحث باسم الطبيب، المستشفى، التخصص، أو العنوان..."
                  : "Search doctor, clinic, specialty or location..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 ps-11 pe-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            />
            <Search className="absolute start-4 top-4 h-5 w-5 text-slate-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute end-4 top-4 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                {isAr ? "مسح" : "Clear"}
              </button>
            )}
          </div>

          {/* City Filter */}
          <div className="relative min-w-[180px]">
            <select
              aria-label={isAr ? "المدينة" : "City"}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 ps-10 pe-8 py-3.5 text-sm font-bold text-slate-700 focus:border-brand-teal-500 focus:bg-white focus:outline-none"
            >
              <option value="">{isAr ? "جميع المدن" : "All Cities"}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <MapPin className="absolute start-3.5 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{isAr ? "إعادة ضبط" : "Reset"}</span>
            </button>
          )}
        </div>

        {/* Category Pill Bar */}
        <div className="mt-6 border-t border-slate-100 pt-6">
          <CategoryFilterBar
            locale={locale}
            topCategories={topCategories}
            doctorSubSpecialties={doctorSubSpecialties}
            selectedCategory={selectedCategory}
            selectedSubSpecialty={selectedSubSpecialty}
            onSelectCategory={(slug) => setSelectedCategory(slug)}
            onSelectSubSpecialty={(slug) => setSelectedSubSpecialty(slug)}
          />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <div className="text-start">
          <h2 className="text-lg font-bold text-slate-900">
            {isAr ? "مقدمو الخدمة المعتمدون" : "Accredited Medical Providers"}
          </h2>
          <p className="text-xs font-medium text-slate-500">
            {isAr
              ? `عرض ${filteredProviders.length} منشأة طبية مؤهلة للخصم المباشر`
              : `Showing ${filteredProviders.length} facilities offering instant discount`}
          </p>
        </div>
      </div>

      {/* 3-Column Provider Showcase Grid */}
      {filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map((prov) => (
            <ProviderCard
              key={prov.id}
              provider={prov}
              locale={locale}
              onBookWhatsApp={(p) => setBookingProvider(p)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <SlidersHorizontal className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">
            {isAr ? "لا توجد نتائج تطابق بحثك الحالي" : "No providers found matching your criteria"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {isAr
              ? "جرب إزالة بعض الفلاتر أو البحث باسم تخصص آخر أو مدينة أخرى."
              : "Try clearing some filters or searching for another specialty or city."}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-teal-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isAr ? "إظهار كافة المنشآت الطبية" : "Show All Medical Facilities"}</span>
          </button>
        </div>
      )}

      {/* WhatsApp Booking Modal */}
      <WhatsAppBookingModal
        isOpen={Boolean(bookingProvider)}
        onClose={() => setBookingProvider(null)}
        provider={bookingProvider}
        locale={locale}
        currentUser={currentUser}
      />
    </div>
  );
};
