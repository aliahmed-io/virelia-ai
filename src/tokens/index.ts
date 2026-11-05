/**
 * Family Health (صحة الأسرة) Design System Tokens
 * Strict typing and constants for colors, typography, radii, spacing, and transitions.
 */

export const colors = {
  primary: {
    teal: "#156570",
    tealDark: "#0b3036",
    tealLight: "#2d7f8f",
    tealUltraLight: "#f0f8f9",
  },
  accent: {
    emerald: "#10b981",
    emeraldDark: "#047857",
    emeraldLight: "#d1fae5",
    mint: "#72b088",
    gold: "#e59a3c",
    goldDark: "#a55922",
    goldLight: "#fef9ee",
  },
  surface: {
    background: "#f8fafc",
    card: "#ffffff",
    muted: "#f1f5f9",
    border: "#e2e8f0",
  },
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    muted: "#94a3b8",
    inverse: "#ffffff",
  },
} as const;

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem",  // 8px (8pt baseline)
  md: "1rem",    // 16px
  lg: "1.5rem",  // 24px
  xl: "2rem",    // 32px
  "2xl": "3rem",  // 48px
  "3xl": "4rem",  // 64px
} as const;

export const radii = {
  none: "0px",
  sm: "0.375rem", // 6px
  md: "0.5rem",   // 8px
  lg: "0.75rem",  // 12px
  xl: "1rem",     // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const motion = {
  durations: {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",
  },
  easings: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    emphasized: "cubic-bezier(0.2, 0, 0, 1)",
  },
} as const;

export type BrandColors = typeof colors;
export type SpacingTokens = typeof spacing;
export type RadiiTokens = typeof radii;
export type MotionTokens = typeof motion;
