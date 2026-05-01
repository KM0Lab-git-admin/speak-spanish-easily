import * as React from "react";

/**
 * Breakpoints oficiales del proyecto, alineados 1:1 con Playwright.
 *
 *  vertical-mobile     → 375 × 667   (portrait, width < 768)
 *  vertical-tablet     → 768 × 1024  (portrait, width ≥ 768)
 *  horizontal-mobile   → 667 × 375   (landscape, width < 1000)
 *  horizontal-desktop  → 1280 × 550  (landscape, width ≥ 1000)
 *
 * Estos nombres deben coincidir con las variantes definidas en
 * `tailwind.config.ts` (plugins → addVariant).
 */
export type Breakpoint =
  | "vertical-mobile"
  | "vertical-tablet"
  | "horizontal-mobile"
  | "horizontal-desktop";

const QUERIES: Record<Breakpoint, string> = {
  "vertical-mobile":    "(orientation: portrait)  and (max-width: 767px)",
  "vertical-tablet":    "(orientation: portrait)  and (min-width: 768px)",
  "horizontal-mobile":  "(orientation: landscape) and (max-width: 999px)",
  "horizontal-desktop": "(orientation: landscape) and (min-width: 1000px)",
};

function detect(): Breakpoint {
  if (typeof window === "undefined") return "vertical-mobile";
  for (const key of Object.keys(QUERIES) as Breakpoint[]) {
    if (window.matchMedia(QUERIES[key]).matches) return key;
  }
  return "vertical-mobile";
}

/**
 * Devuelve el breakpoint activo. Reactivo a cambios de tamaño/orientación.
 *
 * @example
 *   const bp = useBreakpoint();
 *   if (bp === "horizontal-desktop") { ... }
 */
export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = React.useState<Breakpoint>(() => detect());

  React.useEffect(() => {
    const mqls = (Object.keys(QUERIES) as Breakpoint[]).map((key) => ({
      key,
      mql: window.matchMedia(QUERIES[key]),
    }));
    const onChange = () => setBp(detect());
    mqls.forEach(({ mql }) => mql.addEventListener("change", onChange));
    setBp(detect());
    return () => {
      mqls.forEach(({ mql }) => mql.removeEventListener("change", onChange));
    };
  }, []);

  return bp;
}

/** Helpers booleanos para casos puntuales. */
export const useIsVerticalMobile    = () => useBreakpoint() === "vertical-mobile";
export const useIsVerticalTablet    = () => useBreakpoint() === "vertical-tablet";
export const useIsHorizontalMobile  = () => useBreakpoint() === "horizontal-mobile";
export const useIsHorizontalDesktop = () => useBreakpoint() === "horizontal-desktop";
