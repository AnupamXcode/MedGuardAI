/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Clinical Healthcare-Tech Palette (Teal Accents & Dark Navy Typography)
        "brand-teal": "#0d9488",
        "brand-teal-dark": "#0f766e",
        "brand-teal-light": "#f0fdfa",
        "brand-navy": "#0f172a",
        "brand-blue": "#0284c7",

        "primary": "#0d9488", // Teal primary
        "primary-container": "#f0fdfa",
        "on-primary": "#ffffff",
        "on-primary-container": "#0f766e",
        "primary-fixed": "#ccfbf1",
        "primary-fixed-dim": "#99f6e4",
        "on-primary-fixed": "#042f2e",
        "on-primary-fixed-variant": "#115e59",

        "secondary": "#0284c7", // Clinical blue secondary
        "secondary-container": "#f0f9ff",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#0369a1",
        "secondary-fixed": "#e0f2fe",
        "secondary-fixed-dim": "#bae6fd",
        "on-secondary-fixed": "#082f49",
        "on-secondary-fixed-variant": "#075985",

        "tertiary": "#475569", // Slate
        "tertiary-container": "#f1f5f9",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#1e293b",
        "tertiary-fixed": "#e2e8f0",
        "tertiary-fixed-dim": "#cbd5e1",
        "on-tertiary-fixed": "#0f172a",
        "on-tertiary-fixed-variant": "#334155",

        "background": "#ffffff", // Pure white / soft off-white
        "on-background": "#0f172a", // Dark navy text

        "surface": "#ffffff",
        "surface-bright": "#ffffff",
        "surface-dim": "#f8fafc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8fafc",
        "surface-container": "#f1f5f9",
        "surface-container-high": "#e2e8f0",
        "surface-container-highest": "#cbd5e1",
        "surface-variant": "#f1f5f9",
        "on-surface": "#0f172a",
        "on-surface-variant": "#334155",
        "surface-tint": "#0d9488",

        "outline": "#94a3b8",
        "outline-variant": "#e2e8f0",

        "error": "#dc2626",
        "error-container": "#fef2f2",
        "on-error": "#ffffff",
        "on-error-container": "#991b1b",

        "charcoal": "#0f172a", // Dark navy text
        "charcoal-muted": "#64748b", // Slate muted
        "navy": "#0f172a",
        "teal": {
          DEFAULT: "#0d9488",
          light: "#f0fdfa",
          dark: "#0f766e",
        },
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "gutter-mobile": "1rem",
        margin: "2rem",
        "space-lg": "1.5rem",
        gutter: "1.5rem",
        "space-xl": "2.5rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "margin-mobile": "1rem",
        "space-md": "1rem"
      },
      fontFamily: {
        "label-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "display-lg": ["Plus Jakarta Sans", "sans-serif"],
        "title-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-sm": ["Plus Jakarta Sans", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "title-lg": ["Plus Jakarta Sans", "sans-serif"],
        "label-lg": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Plus Jakarta Sans", "sans-serif"]
      },
      fontSize: {
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
        "headline-lg-mobile": ["26px", { lineHeight: "34px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "body-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "title-md": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", letterSpacing: "-0.005em", fontWeight: "600" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "title-lg": ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "display-lg-mobile": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }]
      }
    },
  },
  plugins: [],
}
