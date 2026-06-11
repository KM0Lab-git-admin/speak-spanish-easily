import {
  DEFAULT_PREVIEW_VIEWPORT_BY_ORIENTATION,
  VIEWPORTS,
  formatViewportSize,
  type ViewportName,
} from "@/design-system/viewports";

interface ScreenFrameProps {
  src: string;
  orientation: "portrait" | "landscape";
  viewportName?: ViewportName;
  label?: string;
}

/**
 * ScreenFrame — Embebe una ruta de la app en un iframe del tamaño EXACTO
 * de las resoluciones oficiales de testing definidas en
 * `src/design-system/viewports.ts`.
 *
 * Se usa iframe (y no render directo) para que cada pantalla tenga su
 * propio viewport y los breakpoints `vertical-mobile`/`horizontal-mobile`
 * (basados en media queries) se evalúen correctamente.
 */
const ScreenFrame = ({
  src,
  orientation,
  viewportName = DEFAULT_PREVIEW_VIEWPORT_BY_ORIENTATION[orientation],
  label,
}: ScreenFrameProps) => {
  const viewport = VIEWPORTS[viewportName];
  const { width, height } = viewport;
  const dims = formatViewportSize(viewport);

  return (
    <div className="flex flex-col gap-2 items-start">
      <span className="font-ui text-xs text-muted-foreground">
        {label ? `${label} · ` : ""}{viewport.label} · {dims} · {viewport.orientation}
      </span>
      <div
        className="relative overflow-hidden rounded-xl border-2 border-km0-blue-700/40 shadow-[0_12px_32px_-12px_hsl(var(--km0-blue-700)/0.35)] bg-white"
        style={{ width, height }}
      >
        <iframe
          src={src}
          title={`${label ?? src} (${dims})`}
          width={width}
          height={height}
          style={{ border: 0, display: "block", width, height }}
        />
      </div>
    </div>
  );
};

export default ScreenFrame;
