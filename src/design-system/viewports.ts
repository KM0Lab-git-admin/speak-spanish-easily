import type { Breakpoint } from "@/hooks/use-breakpoint";

export type ResponsiveOrientation = "portrait" | "landscape";

export type ViewportId =
  | "mobile-portrait-base"
  | "mobile-portrait-modern"
  | "mobile-landscape-base"
  | "tablet-portrait"
  | "tablet-landscape"
  | "desktop-landscape"
  | "desktop-wide";

/**
 * Nivel de exigencia de cada viewport:
 *  - `contract`: la pantalla debe verse BIEN aquí (composición, jerarquía,
 *    espaciados). Playwright hace captura de pantalla y compara píxeles.
 *  - `smoke`: la pantalla solo debe NO ROMPERSE aquí (sin overflow lateral,
 *    sin contenido inaccesible). No se optimiza diseño para este viewport
 *    y Playwright solo ejecuta asserts estructurales, sin captura.
 */
export type ViewportTier = "contract" | "smoke";

export interface ResponsiveViewport {
  id: ViewportId;
  label: string;
  width: number;
  height: number;
  orientation: ResponsiveOrientation;
  breakpoint: Breakpoint;
  tier: ViewportTier;
  purpose: string;
}

/**
 * Matriz oficial de viewports para validar maquetación responsive.
 *
 * Mantén esta lista sincronizada con:
 * - `tailwind.config.ts` (variantes vertical/horizontal)
 * - `src/hooks/use-breakpoint.tsx` (detección JS)
 * - `docs/responsive-layout-process.md` (proceso de QA)
 * - `playwright.config.ts` (genera un project por viewport de esta lista)
 */
export const RESPONSIVE_VIEWPORTS: ResponsiveViewport[] = [
  {
    id: "mobile-portrait-base",
    label: "Mobile portrait base",
    width: 375,
    height: 667,
    orientation: "portrait",
    breakpoint: "vertical-mobile",
    tier: "contract",
    purpose: "Contrato mínimo: toda pantalla debe ser usable sin desbordes laterales.",
  },
  {
    id: "mobile-portrait-modern",
    label: "Mobile portrait moderno",
    width: 390,
    height: 844,
    orientation: "portrait",
    breakpoint: "vertical-mobile",
    tier: "contract",
    purpose: "Comprueba que el aire extra no rompe proporciones ni jerarquía visual.",
  },
  {
    id: "mobile-landscape-base",
    label: "Mobile landscape base",
    width: 667,
    height: 375,
    orientation: "landscape",
    breakpoint: "horizontal-mobile",
    tier: "smoke",
    purpose:
      "Solo no-rotura: sin overflow lateral ni contenido inaccesible. No se optimiza diseño para móvil apaisado (decisión de producto, 2026-06).",
  },
  {
    id: "tablet-portrait",
    label: "Tablet portrait",
    width: 768,
    height: 1024,
    orientation: "portrait",
    breakpoint: "vertical-tablet",
    tier: "contract",
    purpose: "Valida escalado vertical sin convertir tarjetas en bloques demasiado anchos.",
  },
  {
    id: "tablet-landscape",
    label: "Tablet landscape",
    width: 1024,
    height: 768,
    orientation: "landscape",
    breakpoint: "horizontal-mobile",
    tier: "contract",
    purpose: "Cubre landscape amplio antes del salto a layout desktop.",
  },
  {
    id: "desktop-landscape",
    label: "Desktop landscape",
    width: 1280,
    height: 720,
    orientation: "landscape",
    breakpoint: "horizontal-desktop",
    tier: "contract",
    purpose: "Primer tamaño desktop: valida columnas, densidad y composición 16:9.",
  },
  {
    id: "desktop-wide",
    label: "Desktop amplio",
    width: 1440,
    height: 900,
    orientation: "landscape",
    breakpoint: "horizontal-desktop",
    tier: "contract",
    purpose: "Asegura que el layout no se estira de forma incómoda en pantallas grandes.",
  },
];

export const DEFAULT_VIEWPORT_BY_ORIENTATION: Record<ResponsiveOrientation, ResponsiveViewport> = {
  portrait: RESPONSIVE_VIEWPORTS[0],
  landscape: RESPONSIVE_VIEWPORTS[2],
};

/**
 * Vista por nombre camelCase de la misma matriz (consumida por
 * `tokens.ts` y otros sitios donde indexar por id literal es incómodo).
 * Derivada de RESPONSIVE_VIEWPORTS: no duplicar datos aquí.
 */
export const VIEWPORTS = {
  mobilePortraitBase: RESPONSIVE_VIEWPORTS[0],
  mobilePortraitModern: RESPONSIVE_VIEWPORTS[1],
  mobileLandscape: RESPONSIVE_VIEWPORTS[2],
  tabletPortrait: RESPONSIVE_VIEWPORTS[3],
  tabletLandscape: RESPONSIVE_VIEWPORTS[4],
  desktopLandscape: RESPONSIVE_VIEWPORTS[5],
  desktopWide: RESPONSIVE_VIEWPORTS[6],
} as const satisfies Record<string, ResponsiveViewport>;

export type ViewportName = keyof typeof VIEWPORTS;

export const formatViewportSize = (viewport: ResponsiveViewport): string =>
  `${viewport.width}×${viewport.height}`;

/** Viewport de referencia para previews de componentes sueltos (/components). */
export const COMPONENT_PREVIEW_VIEWPORT = VIEWPORTS.mobilePortraitBase;

export const getViewportById = (id: ViewportId): ResponsiveViewport => {
  const viewport = RESPONSIVE_VIEWPORTS.find((item) => item.id === id);

  if (!viewport) {
    throw new Error(`Viewport responsive no encontrado: ${id}`);
  }

  return viewport;
};

export const getDefaultViewport = (orientation: ResponsiveOrientation): ResponsiveViewport =>
  DEFAULT_VIEWPORT_BY_ORIENTATION[orientation];
