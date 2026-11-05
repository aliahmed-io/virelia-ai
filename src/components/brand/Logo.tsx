import React from "react";
import Link from "next/link";

interface LogoProps {
  locale: string;
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  locale,
  className = "",
  iconOnly = false,
  size = "md",
}) => {
  const isAr = locale === "ar";

  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  const taglineSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <Link
      href={`/${locale}`}
      className={`inline-flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
    >
      {/* Handcrafted Emblem Matching Brand Sketch (Heart, Family Silhouette, Olive Leaves) */}
      <div className={`relative aspect-square flex-shrink-0 ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-sm"
        >
          {/* Top Olive Leaf Garland (Green / Mint) */}
          <path
            d="M50 12C45 6 36 8 33 13C38 15 44 14 50 12Z"
            fill="#72B088"
          />
          <path
            d="M50 12C55 6 64 8 67 13C62 15 56 14 50 12Z"
            fill="#72B088"
          />
          <path
            d="M38 18C33 14 24 18 23 24C28 24 33 22 38 18Z"
            fill="#10B981"
          />
          <path
            d="M62 18C67 14 76 18 77 24C72 24 67 22 62 18Z"
            fill="#10B981"
          />
          <path
            d="M29 27C23 26 18 32 19 39C24 37 27 33 29 27Z"
            fill="#72B088"
          />
          <path
            d="M71 27C77 26 82 32 81 39C76 37 73 33 71 27Z"
            fill="#72B088"
          />

          {/* Golden Care Heart Arch */}
          <path
            d="M50 88C50 88 84 66 84 45C84 32 73 24 62 27C55 29 50 36 50 36C50 36 45 29 38 27C27 24 16 32 16 45C16 66 50 88 50 88Z"
            fill="#F8FAFC"
            stroke="#156570"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Warm Amber / Gold Right Embracing Arc */}
          <path
            d="M50 36C50 36 55 28 63 27C72 26 81 33 81 44C81 60 55 78 50 84"
            stroke="#E59A3C"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Family Silhouette (Father, Mother & Child) */}
          {/* Father Head & Body (Teal) */}
          <circle cx="42" cy="48" r="6" fill="#156570" />
          <path
            d="M32 68C32 58 37 57 42 57C47 57 52 58 52 68"
            fill="#156570"
          />

          {/* Mother Head & Body (Teal Light) */}
          <circle cx="58" cy="51" r="5" fill="#2D7F8F" />
          <path
            d="M50 68C50 60 54 59 58 59C62 59 66 60 66 68"
            fill="#2D7F8F"
          />

          {/* Child Head & Body (Warm Amber Gold) */}
          <circle cx="50" cy="62" r="4" fill="#E59A3C" />
          <path
            d="M44 76C44 70 47 69 50 69C53 69 56 70 56 76"
            fill="#E59A3C"
          />

          {/* Protective Base Leaves (Olive green base) */}
          <path
            d="M50 88C43 82 40 76 43 73C47 75 49 81 50 88Z"
            fill="#72B088"
          />
          <path
            d="M50 88C57 82 60 76 57 73C53 75 51 81 50 88Z"
            fill="#72B088"
          />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col text-start leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold tracking-tight text-brand-teal-800 ${textSizes[size]} ${
                isAr ? "font-cairo font-bold" : "font-sans font-extrabold"
              }`}
            >
              {isAr ? "صحة الأسرة" : "Family Health"}
            </span>
            <span className="rounded-full bg-brand-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-teal-600 border border-brand-teal-200">
              F.H
            </span>
          </div>
          <span
            className={`text-slate-500 font-medium ${taglineSizes[size]} ${
              isAr ? "font-tajawal" : "font-sans"
            }`}
          >
            {isAr ? "رعاية شاملة لكل جيل" : "Comprehensive Care for Every Generation"}
          </span>
        </div>
      )}
    </Link>
  );
};
