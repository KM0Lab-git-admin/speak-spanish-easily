import { ReactNode } from "react";
import { BreakpointProvider, type Breakpoint } from "@/hooks/use-breakpoint";

interface SimulatedDeviceProps {
  orientation: "portrait" | "landscape";
  label?: string;
  children: ReactNode;
}

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
 * Tamaños fijos:
 *   - portrait  → 375 × 667 (vertical-mobile canónico)
 *   - landscape → 667 × 375 (horizontal-mobile canónico)
 */
const SimulatedDevice = ({ orientation, label, children }: SimulatedDeviceProps) => {
  const width  = orientation === "portrait" ? 375 : 667;
  const height = orientation === "portrait" ? 667 : 375;
  const bp: Breakpoint = orientation === "portrait" ? "vertical-mobile" : "horizontal-mobile";
  const dims = `${width}×${height}`;

  return (
    <div className="flex flex-col gap-2 items-start">
      <span className="font-ui text-xs text-muted-foreground">
        {label ? `${label} · ` : ""}{dims} · {orientation}
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
