import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neo-brutalist primary colors
        "primary": "#1a1a1a",
        "primary-yellow": "#ffcc00",
        "primary-red": "#e63b2e",
        "primary-blue": "#0055ff",
        "background": "#f5f0e8",
        "surface": "#f5f0e8",
        "surface-high": "#e8e3da",
        "surface-low": "#f2ede5",
        "surface-highest": "#e2ddd4",
        "surface-container": "#eee9e0",
        "surface-container-high": "#e8e3da",
        "surface-container-low": "#f2ede5",
        "surface-container-lowest": "#ffffff",
        "outline": "#1a1a1a",
        "outline-variant": "#d0cbc3",
        "on-surface": "#1a1a1a",
        "on-background": "#1a1a1a",
        "on-primary": "#ffffff",
        "on-primary-container": "#1a1a1a",
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Space Grotesk", "sans-serif"],
      },
      fontSize: {
        "xs": ["10px", "12px"],
        "sm": ["12px", "14px"],
        "base": ["14px", "16px"],
        "lg": ["16px", "18px"],
        "xl": ["20px", "22px"],
        "2xl": ["24px", "26px"],
        "3xl": ["32px", "34px"],
        "4xl": ["40px", "42px"],
        "5xl": ["48px", "50px"],
        "6xl": ["56px", "58px"],
        "7xl": ["64px", "66px"],
      },
      borderRadius: {
        "DEFAULT": "2px",
        "sm": "2px",
        "md": "4px",
        "lg": "6px",
        "xl": "8px",
        "full": "12px",
      },
      boxShadow: {
        "neo": "4px 4px 0px rgba(26, 26, 26, 1)",
        "neo-sm": "2px 2px 0px rgba(26, 26, 26, 1)",
        "neo-lg": "6px 6px 0px rgba(26, 26, 26, 1)",
      },
      animation: {
        "border": "border 4s linear infinite",
        "brutalist-hover": "brutalistHover 200ms ease-in-out",
        "brutalist-active": "brutalistActive 100ms ease-in-out",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
        brutalistHover: {
          "0%": { transform: "translate(0, 0)", boxShadow: "4px 4px 0px rgba(26, 26, 26, 1)" },
          "100%": { transform: "translate(-2px, -2px)", boxShadow: "6px 6px 0px rgba(26, 26, 26, 1)" },
        },
        brutalistActive: {
          "0%": { transform: "translate(0, 0)", boxShadow: "4px 4px 0px rgba(26, 26, 26, 1)" },
          "100%": { transform: "translate(2px, 2px)", boxShadow: "0px 0px 0px rgba(26, 26, 26, 1)" },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        neobrutalist: {
          primary: "#1a1a1a",
          secondary: "#ffcc00",
          accent: "#0055ff",
          neutral: "#f5f0e8",
          "base-100": "#f5f0e8",
          "base-200": "#e8e3da",
          "base-300": "#d6d1c9",
        },
      },
    ],
  },
};
