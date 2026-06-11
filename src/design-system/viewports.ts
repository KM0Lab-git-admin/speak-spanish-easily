export type ViewportOrientation = "portrait" | "landscape";

export type ViewportName =
  | "mobilePortraitBase"
  | "mobilePortraitModern"
  | "mobileLandscape"
  | "tabletPortrait"
  | "tabletLandscape"
  | "desktopLandscape"
  | "desktopWide";

export interface ViewportDefinition {
  name: ViewportName;
  label: string;
  width: number;
  height: number;
  orientation: ViewportOrientation;
  purpose: string;
}

/**
 * Tamaños objetivo compartidos para previews, QA visual y herramientas internas.
 *
 * Mantener aquí cualquier nuevo viewport evita que componentes de preview como
 * `ScreenFrame` o `SimulatedDevice` acumulen dimensiones hardcodeadas.
 */
export const VIEWPORTS: Record<ViewportName, ViewportDefinition> = {
  mobilePortraitBase: {
    name: "mobilePortraitBase",
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
    purpose: "Base móvil vertical mínima; valida el ancho más restrictivo del layout principal.",
  },
  mobilePortraitModern: {
    name: "mobilePortraitModern",
    breakpoint: "vertical-mobile",
    purpose: "Contrato mínimo: toda pantalla debe ser usable sin desbordes laterales.",
  },
  {
    id: "mobile-portrait-modern",
    label: "Mobile portrait moderno",
    width: 390,
    height: 844,
    orientation: "portrait",
    purpose: "Móvil vertical actual; referencia para previews de componentes compactos modernos.",
  },
  mobileLandscape: {
    name: "mobileLandscape",
    label: "Mobile landscape",
    width: 667,
    height: 375,
    orientation: "landscape",
    purpose: "Móvil rotado; valida la altura más restrictiva en layouts horizontales.",
  },
  tabletPortrait: {
    name: "tabletPortrait",
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
    purpose: "Tablet vertical; comprueba el salto a layouts con más espacio en columna.",
  },
  tabletLandscape: {
    name: "tabletLandscape",
    breakpoint: "vertical-tablet",
    purpose: "Valida escalado vertical sin convertir tarjetas en bloques demasiado anchos.",
  },
  {
    id: "tablet-landscape",
    label: "Tablet landscape",
    width: 1024,
    height: 768,
    orientation: "landscape",
    purpose: "Tablet horizontal; revisa layouts intermedios antes del desktop amplio.",
  },
  desktopLandscape: {
    name: "desktopLandscape",
    breakpoint: "horizontal-mobile",
    purpose: "Cubre landscape amplio antes del salto a layout desktop.",
  },
  {
    id: "desktop-landscape",
    label: "Desktop landscape",
    width: 1280,
    height: 720,
    orientation: "landscape",
    purpose: "Desktop 16:9 base; valida pantallas horizontales estándar.",
  },
  desktopWide: {
    name: "desktopWide",
    breakpoint: "horizontal-desktop",
    purpose: "Primer tamaño desktop: valida columnas, densidad y composición 16:9.",
  },
  {
    id: "desktop-wide",
    label: "Desktop amplio",
    width: 1440,
    height: 900,
    orientation: "landscape",
    purpose: "Desktop amplio; comprueba composición y respiración en pantallas grandes.",
  },
};

export const TARGET_VIEWPORTS = Object.values(VIEWPORTS);

export const DEFAULT_PREVIEW_VIEWPORT_BY_ORIENTATION: Record<ViewportOrientation, ViewportName> = {
  portrait: "mobilePortraitBase",
  landscape: "mobileLandscape",
};

export const COMPONENT_PREVIEW_VIEWPORT = VIEWPORTS.mobilePortraitModern;

export const formatViewportSize = ({ width, height }: Pick<ViewportDefinition, "width" | "height">) =>
  `${width}×${height}`;
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
