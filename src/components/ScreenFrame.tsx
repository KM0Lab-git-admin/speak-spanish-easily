import {
  getDefaultViewport,
  getViewportById,
  type ResponsiveOrientation,
  type ViewportId,
} from "@/design-system/viewports";

interface ScreenFrameProps {
  src: string;
  orientation?: ResponsiveOrientation;
  viewportId?: ViewportId;
  label?: string;
  /** Escala visual (0–1). El iframe se renderiza al tamaño REAL del
   *  viewport (las media queries no cambian) y se reduce con transform.
   *  Default: 1. */
  scale?: number;
}

/**
 * ScreenFrame — Embebe una ruta de la app en un iframe del tamaño EXACTO
 * de una resolución oficial de testing definida en
 * `src/design-system/viewports.ts`. Por defecto mantiene los dos
 * tamaños mínimos históricos:
 *   - portrait  → 375 × 667 (vertical-mobile)
 *   - landscape → 667 × 375 (horizontal-mobile)
 *
 * Se usa iframe (y no render directo) para que cada pantalla tenga su
 * propio viewport y los breakpoints `vertical-mobile`/`horizontal-mobile`
 * (basados en media queries) se evalúen correctamente.
 */
const ScreenFrame = ({ src, orientation = "portrait", viewportId, label, scale = 1 }: ScreenFrameProps) => {
  const viewport = viewportId ? getViewportById(viewportId) : getDefaultViewport(orientation);
  const { width, height, orientation: activeOrientation } = viewport;
  const dims = `${width}×${height}`;

  return (
    <div className="flex flex-col gap-2 items-start">
      <span className="font-ui text-xs text-muted-foreground">
        {label ? `${label} · ` : ""}{dims} · {activeOrientation}
        {scale !== 1 ? ` · ${Math.round(scale * 100)}%` : ""}
      </span>
      <div style={{ width: width * scale, height: height * scale }}>
        <div
          className="relative overflow-hidden rounded-xl border-2 border-km0-blue-700/40 shadow-[0_12px_32px_-12px_hsl(var(--km0-blue-700)/0.35)] bg-white"
          style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}
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
    </div>
  );
};

export default ScreenFrame;
