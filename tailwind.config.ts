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
        // ─────────────────────────────────────────────────
        // SEMANTIC TOKENS — all reference CSS variables
        // To switch theme: edit :root in globals.css only
        // ─────────────────────────────────────────────────

        // ── Brand primary ─────────────────────────────────
        // Change --color-primary-* in globals.css to rebrand
        primary: {
          50:      "rgb(var(--color-primary-50)  / <alpha-value>)",
          100:     "rgb(var(--color-primary-100) / <alpha-value>)",
          200:     "rgb(var(--color-primary-200) / <alpha-value>)",
          300:     "rgb(var(--color-primary-300) / <alpha-value>)",
          400:     "rgb(var(--color-primary-400) / <alpha-value>)",
          500:     "rgb(var(--color-primary-500) / <alpha-value>)",
          600:     "rgb(var(--color-primary-600) / <alpha-value>)",
          700:     "rgb(var(--color-primary-700) / <alpha-value>)",
          800:     "rgb(var(--color-primary-800) / <alpha-value>)",
          900:     "rgb(var(--color-primary-900) / <alpha-value>)",
          950:     "rgb(var(--color-primary-950) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-primary-500) / <alpha-value>)",
        },

        // ── Background surfaces ───────────────────────────
        // Light: white/near-white. Dark: slate-900/950 equiv.
        bg: {
          DEFAULT: "rgb(var(--color-bg)         / <alpha-value>)",
          subtle:  "rgb(var(--color-bg-subtle)  / <alpha-value>)",
          muted:   "rgb(var(--color-bg-muted)   / <alpha-value>)",
          inverse: "rgb(var(--color-bg-inverse) / <alpha-value>)",
        },

        // ── Text ─────────────────────────────────────────
        // Light: gray-900 base. Dark: slate-50 base.
        text: {
          DEFAULT: "rgb(var(--color-text)       / <alpha-value>)",
          muted:   "rgb(var(--color-text-muted) / <alpha-value>)",
          faint:   "rgb(var(--color-text-faint) / <alpha-value>)",
          inverse: "rgb(var(--color-text-inverse)/ <alpha-value>)",
          onprimary: "rgb(var(--color-text-onprimary) / <alpha-value>)",
        },

        // ── Border ───────────────────────────────────────
        border: {
          DEFAULT: "rgb(var(--color-border)       / <alpha-value>)",
          strong:  "rgb(var(--color-border-strong) / <alpha-value>)",
          subtle:  "rgb(var(--color-border-subtle) / <alpha-value>)",
        },

        // ── Accent colours (secondary palette) ───────────
        accent: {
          cyan:   "rgb(var(--color-accent-cyan)   / <alpha-value>)",
          violet: "rgb(var(--color-accent-violet) / <alpha-value>)",
          green:  "rgb(var(--color-accent-green)  / <alpha-value>)",
          amber:  "rgb(var(--color-accent-amber)  / <alpha-value>)",
          rose:   "rgb(var(--color-accent-rose)   / <alpha-value>)",
        },

        // ── Status colours ────────────────────────────────
        success: {
          DEFAULT: "rgb(var(--color-success)    / <alpha-value>)",
          bg:      "rgb(var(--color-success-bg) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--color-warning)    / <alpha-value>)",
          bg:      "rgb(var(--color-warning-bg) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--color-danger)    / <alpha-value>)",
          bg:      "rgb(var(--color-danger-bg) / <alpha-value>)",
        },

        // ── Card / surface overlays ───────────────────────
        card: {
          DEFAULT: "rgb(var(--color-card)        / <alpha-value>)",
          hover:   "rgb(var(--color-card-hover)  / <alpha-value>)",
          border:  "rgb(var(--color-card-border) / <alpha-value>)",
        },
      },

      // ─────────────────────────────────────────────────────
      // TYPOGRAPHY
      // ─────────────────────────────────────────────────────
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        space: ["var(--font-space)", "sans-serif"],
      },

      // ─────────────────────────────────────────────────────
      // BACKGROUND IMAGES
      // ─────────────────────────────────────────────────────
      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-warm":        "linear-gradient(135deg, rgb(var(--color-primary-50)) 0%, rgb(var(--color-bg)) 50%, rgb(var(--color-primary-50)) 100%)",
        "gradient-primary": "linear-gradient(135deg, rgb(var(--color-primary-500)), rgb(var(--color-primary-600)))",
      },

      // ─────────────────────────────────────────────────────
      // SHADOWS — use CSS vars so dark mode glows update
      // ─────────────────────────────────────────────────────
      boxShadow: {
        "glow-primary": "0 0 25px rgb(var(--color-primary-500) / 35%)",
        "glow-primary-sm": "0 0 12px rgb(var(--color-primary-500) / 25%)",
        "glow-cyan":    "0 0 25px rgb(var(--color-accent-cyan)   / 35%)",
        "glow-violet":  "0 0 25px rgb(var(--color-accent-violet) / 35%)",
        "card":         "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
        "card-hover":   "0 4px 12px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.08)",
        "nav":          "0 1px 0 rgb(var(--color-border) / 100%)",
        "inner-top":    "inset 0 1px 0 rgba(255,255,255,0.08)",
      },

      // ─────────────────────────────────────────────────────
      // ANIMATIONS
      // ─────────────────────────────────────────────────────
      animation: {
        "pulse-ring":     "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
        "gradient":       "gradient-shift 8s ease infinite",
        "float":          "float 5s ease-in-out infinite",
        "fade-in":        "fadeIn 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
      },
      keyframes: {
        "pulse-ring": {
          "0%":   { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgb(var(--color-primary-500) / 40%)" },
          "70%":  { transform: "scale(1)",    boxShadow: "0 0 0 12px rgb(var(--color-primary-500) / 0%)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgb(var(--color-primary-500) / 0%)" },
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

      // ─────────────────────────────────────────────────────
      // EASING
      // ─────────────────────────────────────────────────────
      transitionTimingFunction: {
        spring:  "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth:  "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;