import { ReactNode } from "react";
import { BreakpointProvider, type Breakpoint } from "@/hooks/use-breakpoint";
import {
  DEFAULT_PREVIEW_VIEWPORT_BY_ORIENTATION,
  VIEWPORTS,
  formatViewportSize,
  type ViewportName,
} from "@/design-system/viewports";

interface SimulatedDeviceProps {
  orientation: "portrait" | "landscape";
  viewportName?: ViewportName;
import { BreakpointProvider } from "@/hooks/use-breakpoint";
import {
  getDefaultViewport,
  getViewportById,
  type ResponsiveOrientation,
  type ViewportId,
} from "@/design-system/viewports";

interface SimulatedDeviceProps {
  orientation?: ResponsiveOrientation;
  viewportId?: ViewportId;
  label?: string;
  children: ReactNode;
}

const BREAKPOINT_BY_VIEWPORT: Record<ViewportName, Breakpoint> = {
  mobilePortraitBase: "vertical-mobile",
  mobilePortraitModern: "vertical-mobile",
  mobileLandscape: "horizontal-mobile",
  tabletPortrait: "vertical-tablet",
  tabletLandscape: "horizontal-mobile",
  desktopLandscape: "horizontal-desktop",
  desktopWide: "horizontal-desktop",
};

/**
 * SimulatedDevice — render directo (sin iframe) de una pantalla a tamaño
 * fijo de teléfono, equivalente a `<ScreenFrame />` pero accesible para
 * Visual Edit (los iframes bloquean la selección de elementos).
 *
 * Truco para que los breakpoints `vertical-mobile` / `horizontal-mobile`
 * se evalúen correctamente aunque el viewport real del navegador sea
 * `horizontal-desktop`:
 *
 *   1. Atributo `data-bp="<bp>"` en el wrapper → las variantes de
 *      tailwind aceptan también el selector `[data-bp~='X'] &` (ver
 *      `tailwind.config.ts`). El selector basado en atributo tiene mayor
 *      especificidad que la media-query, así que GANA el override
 *      forzado sobre el real.
 *   2. `<BreakpointProvider value="<bp>" />` → el hook `useBreakpoint()`
 *      devuelve el breakpoint forzado dentro de este subárbol, así los
 *      componentes que ramifican layout en JS (Home, BrandedFrame…)
 *      eligen el mismo branch.
 *
 * Tamaños fijos: usa los nombres compartidos de `src/design-system/viewports.ts`
 * para evitar dimensiones hardcodeadas en herramientas de preview.
 */
const SimulatedDevice = ({
  orientation,
  viewportName = DEFAULT_PREVIEW_VIEWPORT_BY_ORIENTATION[orientation],
  label,
  children,
}: SimulatedDeviceProps) => {
  const viewport = VIEWPORTS[viewportName];
  const { width, height } = viewport;
  const bp = BREAKPOINT_BY_VIEWPORT[viewportName];
  const dims = formatViewportSize(viewport);
 * Los tamaños oficiales viven en `src/design-system/viewports.ts`.
 */
const SimulatedDevice = ({ orientation = "portrait", viewportId, label, children }: SimulatedDeviceProps) => {
  const viewport = viewportId ? getViewportById(viewportId) : getDefaultViewport(orientation);
  const { width, height, breakpoint: bp } = viewport;
  const dims = `${width}×${height}`;

  return (
    <div className="flex flex-col gap-2 items-start">
      <span className="font-ui text-xs text-muted-foreground">
        {label ? `${label} · ` : ""}{viewport.label} · {dims} · {viewport.orientation}
      </span>
      <BreakpointProvider value={bp}>
        <div
          data-bp={bp}
          className="relative overflow-hidden rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] bg-km0-beige-50 flex flex-col"
          style={{ width, height }}
        >
          {children}
        </div>
      </BreakpointProvider>
    </div>
  );
};

export default SimulatedDevice;
