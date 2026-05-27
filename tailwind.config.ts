import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        brand: ["'Antique Olive'", "Impact", "Arial Black", "sans-serif"],
        ui:    ["'Inter'", "sans-serif"],
        body:  ["'DM Sans'", "'Inter'", "sans-serif"],
      },
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT:              "hsl(var(--sidebar-background))",
          foreground:           "hsl(var(--sidebar-foreground))",
          primary:              "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent:               "hsl(var(--sidebar-accent))",
          "accent-foreground":  "hsl(var(--sidebar-accent-foreground))",
          border:               "hsl(var(--sidebar-border))",
          ring:                 "hsl(var(--sidebar-ring))",
        },
        /* ── KM0 LAB palette ───────────────────────────────── */
        "km0-blue": {
          50:  "hsl(var(--km0-blue-50))",
          100: "hsl(var(--km0-blue-100))",
          200: "hsl(var(--km0-blue-200))",
          300: "hsl(var(--km0-blue-300))",
          400: "hsl(var(--km0-blue-400))",
          500: "hsl(var(--km0-blue-500))",
          600: "hsl(var(--km0-blue-600))",
          700: "hsl(var(--km0-blue-700))",
          800: "hsl(var(--km0-blue-800))",
          900: "hsl(var(--km0-blue-900))",
        },
        "km0-beige": {
          50:  "hsl(var(--km0-beige-50))",
          100: "hsl(var(--km0-beige-100))",
          200: "hsl(var(--km0-beige-200))",
          300: "hsl(var(--km0-beige-300))",
          400: "hsl(var(--km0-beige-400))",
          500: "hsl(var(--km0-beige-500))",
          600: "hsl(var(--km0-beige-600))",
          700: "hsl(var(--km0-beige-700))",
          800: "hsl(var(--km0-beige-800))",
          900: "hsl(var(--km0-beige-900))",
        },
        "km0-yellow": {
          50:  "hsl(var(--km0-yellow-50))",
          100: "hsl(var(--km0-yellow-100))",
          200: "hsl(var(--km0-yellow-200))",
          300: "hsl(var(--km0-yellow-300))",
          400: "hsl(var(--km0-yellow-400))",
          500: "hsl(var(--km0-yellow-500))",
          600: "hsl(var(--km0-yellow-600))",
          700: "hsl(var(--km0-yellow-700))",
          800: "hsl(var(--km0-yellow-800))",
          900: "hsl(var(--km0-yellow-900))",
        },
        "km0-teal": {
          50:  "hsl(var(--km0-teal-50))",
          100: "hsl(var(--km0-teal-100))",
          200: "hsl(var(--km0-teal-200))",
          300: "hsl(var(--km0-teal-300))",
          400: "hsl(var(--km0-teal-400))",
          500: "hsl(var(--km0-teal-500))",
          600: "hsl(var(--km0-teal-600))",
          700: "hsl(var(--km0-teal-700))",
          800: "hsl(var(--km0-teal-800))",
          900: "hsl(var(--km0-teal-900))",
        },
        "km0-coral": {
          50:  "hsl(var(--km0-coral-50))",
          100: "hsl(var(--km0-coral-100))",
          200: "hsl(var(--km0-coral-200))",
          300: "hsl(var(--km0-coral-300))",
          400: "hsl(var(--km0-coral-400))",
          500: "hsl(var(--km0-coral-500))",
          600: "hsl(var(--km0-coral-600))",
          700: "hsl(var(--km0-coral-700))",
          800: "hsl(var(--km0-coral-800))",
          900: "hsl(var(--km0-coral-900))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "pop-in": {
          "0%":   { transform: "scale(0) rotate(-20deg)", opacity: "0" },
          "60%":  { transform: "scale(1.15) rotate(8deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)",   opacity: "1" },
        },
        "float-up": {
          "0%":   { transform: "translateY(0) scale(0.8)",     opacity: "0" },
          "20%":  { opacity: "1" },
          "100%": { transform: "translateY(-80px) scale(1.1)", opacity: "0" },
        },
        "sparkle": {
          "0%, 100%": { transform: "scale(0)", opacity: "0" },
          "50%":      { transform: "scale(1)", opacity: "1" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%":      { transform: "rotate(3deg)" },
        },
        "fade-in-overlay": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "pop-in":          "pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "float-up":        "float-up 1.4s ease-out forwards",
        "sparkle":         "sparkle 1.2s ease-in-out infinite",
        "wiggle":          "wiggle 0.4s ease-in-out 3",
        "fade-in-overlay": "fade-in-overlay 0.25s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addVariant }: { addVariant: (name: string, definition: string | string[]) => void }) {
      // ─────────────────────────────────────────────────────────────
      // BREAKPOINTS OFICIALES — alineados 1:1 con producción y Playwright
      // Úsalos SIEMPRE para layout de pantallas.
      //
      // Cubren rangos amplios: cualquier resolución cae siempre en
      // exactamente un breakpoint. Las cuatro resoluciones canónicas
      // de validación visual quedan dentro de su rango respectivo:
      //
      //   vertical-mobile     → portrait + ≤767px   (canónica 375×667)
      //   vertical-tablet     → portrait + ≥768px   (canónica 768×1024)
      //   horizontal-mobile   → landscape + ≤1279px (canónica 667×375)
      //   horizontal-desktop  → landscape + ≥1280px (canónica 1280×550)
      //
      // NO MODIFICAR sin sincronizar también apps/km0lab/tailwind.config.js
      // del repo de producción (km0lab) y AGENTS.md / docs/CONVENTIONS.md.
      // ─────────────────────────────────────────────────────────────
      //
      // Cada variante acepta DOS activadores:
      //   1) La media-query oficial (comportamiento normal por viewport).
      //   2) Un selector basado en `[data-bp~="X"] &` que la fuerza cuando
      //      el elemento es descendiente de un contenedor con ese atributo.
      //      Este segundo activador tiene mayor especificidad (incluye un
      //      selector de atributo), así que GANA frente a la media-query
      //      cuando ambos disparan a la vez. Usado por <SimulatedDevice>
      //      en /preview-all para renderizar pantallas a tamaño fijo sin
      //      iframes y manteniendo Visual Edit funcional.
      //
      addVariant("vertical-mobile",    ["@media (orientation: portrait)  and (max-width: 767px)",  "[data-bp~='vertical-mobile'] &"]);
      addVariant("vertical-tablet",    ["@media (orientation: portrait)  and (min-width: 768px)",  "[data-bp~='vertical-tablet'] &"]);
      addVariant("horizontal-mobile",  ["@media (orientation: landscape) and (max-width: 1279px)", "[data-bp~='horizontal-mobile'] &"]);
      addVariant("horizontal-desktop", ["@media (orientation: landscape) and (min-width: 1280px)", "[data-bp~='horizontal-desktop'] &"]);

      // ─────────────────────────────────────────────────────────────
      // ALIASES DEPRECADOS (mantener hasta migrar todas las pantallas)
      // No usar en código nuevo. Equivalen a los oficiales de arriba.
      // ─────────────────────────────────────────────────────────────
      addVariant("short-landscape", ["@media (orientation: landscape) and (max-width: 1279px)", "[data-bp~='horizontal-mobile'] &"]);
      addVariant("wide-landscape",  ["@media (orientation: landscape) and (min-width: 1280px)", "[data-bp~='horizontal-desktop'] &"]);
      addVariant("tablet-portrait", ["@media (orientation: portrait)  and (min-width: 768px)",  "[data-bp~='vertical-tablet'] &"]);
    },
  ],
} satisfies Config;
