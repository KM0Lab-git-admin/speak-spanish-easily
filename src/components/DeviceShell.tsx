import { ReactNode } from "react";

/**
 * DeviceShell — Marco "teléfono" reutilizable SIN header de marca.
 *
 * Aplica las MISMAS dimensiones/chrome que BrandedFrame (card centrada,
 * ratio 9:19.5 en portrait y 16:9 en landscape, mismo borde/sombra) para
 * que TODAS las pantallas de la app (incluidas Home y Chat, que no usan
 * BrandedFrame porque ya tienen su propio header) se visualicen dentro
 * de un contenedor que simula un dispositivo móvil.
 *
 * El contenido recibe 100% del alto/ancho del frame y gestiona su propio
 * scroll interno si lo necesita.
 */
interface DeviceShellProps {
  children: ReactNode;
}

const DeviceShell = ({ children }: DeviceShellProps) => {
  return (
    <div className="min-h-[100dvh] bg-background overflow-hidden flex items-center justify-center p-0 landscape:p-2 horizontal-desktop:p-4">
      {/* PORTRAIT — 9:19.5 (vertical-mobile + vertical-tablet) */}
      <div
        className="landscape:hidden relative flex flex-col bg-km0-beige-50 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden"
        style={{
          width: "min(100vw, 420px)",
          height: "min(100dvh, calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom)))",
        }}
      >
        {children}
      </div>

      {/* LANDSCAPE — 16:9 (horizontal-mobile + horizontal-desktop)
          Mismas dimensiones que BrandedFrame para que TODAS las pantallas
          (Home, Chat, PostalCode, Language, Onboarding…) se vean al mismo
          tamaño en una misma resolución de viewport. */}
      <div className="hidden landscape:flex relative flex-col w-full max-w-[1200px] h-[calc(100dvh-16px)] max-h-[375px] horizontal-desktop:h-[calc(100dvh-32px)] horizontal-desktop:max-h-[550px] rounded-3xl border-2 border-primary/80 bg-background overflow-hidden shadow-xl">
        {children}
      </div>
    </div>
  );
};

export default DeviceShell;
