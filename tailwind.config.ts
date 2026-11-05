import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: {
            50: "#f0f8f9",
            100: "#dbeef1",
            200: "#b9dde3",
            300: "#8ac3cd",
            400: "#54a1b0",
            500: "#2d7f8f",
            600: "#156570", // Primary Medical Teal
            700: "#12515b",
            800: "#0f424b",
            900: "#0b3036",
            950: "#051a1e",
          },
          emerald: {
            50: "#ecfdf5",
            100: "#d1fae5",
            200: "#a7f3d0",
            300: "#6ee7b7",
            400: "#34d399",
            500: "#10b981", // Secondary Emerald
            600: "#059669",
            700: "#047857",
            800: "#065f46",
            900: "#064e3b",
          },
          mint: {
            light: "#a8d4b8",
            DEFAULT: "#72b088", // Olive Leaf Accent
            dark: "#548d68",
          },
          gold: {
            50: "#fef9ee",
            100: "#fdf2d5",
            200: "#fae2a7",
            300: "#f7cd71",
            400: "#f2b13b",
            500: "#e59a3c", // Warm Family Gold / Amber
            600: "#cb7c2c",
            700: "#a55922",
            800: "#854522",
            900: "#6d391f",
          },
          surface: {
            DEFAULT: "#f8fafc",
            muted: "#f1f5f9",
            card: "#ffffff",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        cairo: ["var(--font-cairo)", "Cairo", "sans-serif"],
        tajawal: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(21, 101, 112, 0.05)",
        card: "0 4px 20px rgba(15, 23, 42, 0.06)",
        hover: "0 10px 30px rgba(21, 101, 112, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
