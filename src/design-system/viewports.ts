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
    label: "Mobile portrait base",
    width: 375,
    height: 667,
    orientation: "portrait",
    purpose: "Base móvil vertical mínima; valida el ancho más restrictivo del layout principal.",
  },
  mobilePortraitModern: {
    name: "mobilePortraitModern",
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
    label: "Tablet portrait",
    width: 768,
    height: 1024,
    orientation: "portrait",
    purpose: "Tablet vertical; comprueba el salto a layouts con más espacio en columna.",
  },
  tabletLandscape: {
    name: "tabletLandscape",
    label: "Tablet landscape",
    width: 1024,
    height: 768,
    orientation: "landscape",
    purpose: "Tablet horizontal; revisa layouts intermedios antes del desktop amplio.",
  },
  desktopLandscape: {
    name: "desktopLandscape",
    label: "Desktop landscape",
    width: 1280,
    height: 720,
    orientation: "landscape",
    purpose: "Desktop 16:9 base; valida pantallas horizontales estándar.",
  },
  desktopWide: {
    name: "desktopWide",
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
