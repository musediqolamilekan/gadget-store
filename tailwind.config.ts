import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary palette
        slate: {
          950: "#0F172A",
        },
        // Accent overrides (extend default)
        cyan:    { DEFAULT: "#06B6D4" },
        violet:  { DEFAULT: "#7C3AED" },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        space: ["var(--font-space)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-ring":   "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
        "gradient":     "gradient-shift 8s ease infinite",
        "float":        "float 5s ease-in-out infinite",
        "fade-in":      "fadeIn 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
      },
      keyframes: {
        "pulse-ring": {
          "0%":   { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(6,182,212,0.4)" },
          "70%":  { transform: "scale(1)",    boxShadow: "0 0 0 12px rgba(6,182,212,0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(6,182,212,0)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        "fadeIn": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slideInRight": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "glow-cyan":   "0 0 25px rgba(6, 182, 212, 0.4)",
        "glow-violet": "0 0 25px rgba(124, 58, 237, 0.4)",
        "inner-top":   "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
