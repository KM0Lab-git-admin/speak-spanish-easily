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

export interface ResponsiveViewport {
  id: ViewportId;
  label: string;
  width: number;
  height: number;
  orientation: ResponsiveOrientation;
  breakpoint: Breakpoint;
  purpose: string;
}

/**
 * Matriz oficial de viewports para validar maquetación responsive.
 *
 * Mantén esta lista sincronizada con:
 * - `tailwind.config.ts` (variantes vertical/horizontal)
 * - `src/hooks/use-breakpoint.tsx` (detección JS)
 * - `docs/responsive-layout-process.md` (proceso de QA)
 */
export const RESPONSIVE_VIEWPORTS: ResponsiveViewport[] = [
  {
    id: "mobile-portrait-base",
    label: "Mobile portrait base",
    width: 375,
    height: 667,
    orientation: "portrait",
    breakpoint: "vertical-mobile",
    purpose: "Contrato mínimo: toda pantalla debe ser usable sin desbordes laterales.",
  },
  {
    id: "mobile-portrait-modern",
    label: "Mobile portrait moderno",
    width: 390,
    height: 844,
    orientation: "portrait",
    breakpoint: "vertical-mobile",
    purpose: "Comprueba que el aire extra no rompe proporciones ni jerarquía visual.",
  },
  {
    id: "mobile-landscape-base",
    label: "Mobile landscape base",
    width: 667,
    height: 375,
    orientation: "landscape",
    breakpoint: "horizontal-mobile",
    purpose: "Contrato compacto horizontal: evita alturas rígidas y contenido cortado.",
  },
  {
    id: "tablet-portrait",
    label: "Tablet portrait",
    width: 768,
    height: 1024,
    orientation: "portrait",
    breakpoint: "vertical-tablet",
    purpose: "Valida escalado vertical sin convertir tarjetas en bloques demasiado anchos.",
  },
  {
    id: "tablet-landscape",
    label: "Tablet landscape",
    width: 1024,
    height: 768,
    orientation: "landscape",
    breakpoint: "horizontal-mobile",
    purpose: "Cubre landscape amplio antes del salto a layout desktop.",
  },
  {
    id: "desktop-landscape",
    label: "Desktop landscape",
    width: 1280,
    height: 720,
    orientation: "landscape",
    breakpoint: "horizontal-desktop",
    purpose: "Primer tamaño desktop: valida columnas, densidad y composición 16:9.",
  },
  {
    id: "desktop-wide",
    label: "Desktop amplio",
    width: 1440,
    height: 900,
    orientation: "landscape",
    breakpoint: "horizontal-desktop",
    purpose: "Asegura que el layout no se estira de forma incómoda en pantallas grandes.",
  },
];

export const DEFAULT_VIEWPORT_BY_ORIENTATION: Record<ResponsiveOrientation, ResponsiveViewport> = {
  portrait: RESPONSIVE_VIEWPORTS[0],
  landscape: RESPONSIVE_VIEWPORTS[2],
};

export const getViewportById = (id: ViewportId): ResponsiveViewport => {
  const viewport = RESPONSIVE_VIEWPORTS.find((item) => item.id === id);

  if (!viewport) {
    throw new Error(`Viewport responsive no encontrado: ${id}`);
  }

  return viewport;
};

export const getDefaultViewport = (orientation: ResponsiveOrientation): ResponsiveViewport =>
  DEFAULT_VIEWPORT_BY_ORIENTATION[orientation];
