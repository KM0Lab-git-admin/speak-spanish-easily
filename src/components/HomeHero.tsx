import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Km0Logo from "./Km0Logo";
import NotificationBell from "./NotificationBell";
import LoginButton from "./LoginButton";
import UserGreeting from "./UserGreeting";
import skylineMalgrat from "@/assets/skyline-malgrat.png";
import coatMalgrat from "@/assets/coat-malgrat.png";

/**
 * HomeHero — header superior del Home.
 *
 * Estructura: el gradiente beige y el skyline son fondo del propio
 * `<section>`. El contenido (fila header + UserGreeting) se apila
 * en flujo normal con `relative`, así los márgenes/paddings funcionan
 * de verdad entre componentes (sin posiciones absolutas frágiles).
 *
 * En landscape el Hero se vuelve `absolute inset-0` para servir de
 * fondo del body; el contenido interno mantiene `pointer-events-auto`.
 */
export interface HomeHeroProps {
  cityName: string;
  hasAlerts: boolean;
  onToggleAlerts: () => void;
  showLogin: boolean;
  onLogin: () => void;
  /** Si se pasa, muestra el botón Back a la izquierda (pantallas interiores: agenda, chat…). */
  onBack?: () => void;
  backAriaLabel?: string;
  /** Si false, oculta el saludo de usuario (útil en pantallas interiores). */
  showGreeting?: boolean;
  /** Si se pasa, sustituye al UserGreeting manteniendo el mismo contenedor (misma altura/fondo). */
  greetingSlot?: ReactNode;
  /** Si true, fuerza al hero a fluir en el flujo normal (no absolute) en todos los breakpoints.
   *  Necesario para el nuevo HomeContent con scroll vertical, donde el hero ya no actúa como
   *  fondo del cuerpo sino como cabecera apilada. */
  inline?: boolean;
}

const HomeHero = ({
  cityName,
  hasAlerts,
  onToggleAlerts,
  showLogin,
  onLogin,
  onBack,
  backAriaLabel = "Volver",
  showGreeting = true,
  greetingSlot,
  inline = false,
}: HomeHeroProps) => {
  return (
    <motion.section
      className={
        inline
          ? "relative shrink-0 flex flex-col overflow-hidden bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 pb-[25%]"
          : "relative shrink-0 flex flex-col overflow-hidden bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 pb-[25%] horizontal-mobile:absolute horizontal-mobile:inset-0 horizontal-mobile:pointer-events-none horizontal-mobile:pb-0 horizontal-desktop:absolute horizontal-desktop:inset-0 horizontal-desktop:pointer-events-none horizontal-desktop:pb-0"
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >

      {/* Skyline como capa de fondo del hero: independiente del contenido superpuesto */}
      <img
        src={skylineMalgrat}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full object-cover object-bottom z-0 select-none opacity-25"
      />

      {/* Fila header: escudo + nombre + KM0 + login + bell */}
      <div className="relative z-10 flex items-center justify-between gap-3 pl-2 pr-4 pt-4 vertical-mobile:!pt-2 vertical-mobile:!pb-1 horizontal-mobile:pointer-events-auto horizontal-mobile:pt-2 horizontal-mobile:pl-3 horizontal-mobile:pr-3 horizontal-desktop:pointer-events-auto">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label={backAriaLabel}
              className="shrink-0 w-9 h-9 vertical-tablet:w-10 vertical-tablet:h-10 horizontal-mobile:!w-7 horizontal-mobile:!h-7 flex items-center justify-center rounded-xl border-2 border-dashed border-km0-yellow-500 text-km0-yellow-600 bg-white/70 hover:bg-km0-yellow-50 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={20} strokeWidth={2.5} className="horizontal-mobile:!w-4 horizontal-mobile:!h-4" />
            </button>
          )}
          <img
            src={coatMalgrat}
            alt={`Escudo de ${cityName}`}
            className="w-12 h-12 vertical-tablet:w-14 vertical-tablet:h-14 horizontal-mobile:!w-7 horizontal-mobile:!h-7 object-contain shrink-0 drop-shadow-[0_2px_4px_hsl(0_0%_100%/0.5)]"
          />
          <div className="flex flex-col leading-[0.95] min-w-0 horizontal-mobile:!flex-row horizontal-mobile:items-center horizontal-mobile:gap-2">
            <h1 className="font-brand font-black text-km0-blue-700 whitespace-pre-line text-left border-0 text-lg horizontal-mobile:!text-sm horizontal-mobile:whitespace-nowrap">
              {cityName}
            </h1>
            <div className="flex items-center mt-2 horizontal-mobile:!mt-0">
              <Km0Logo className="h-4 vertical-tablet:h-5 horizontal-mobile:!h-3 w-auto" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 horizontal-mobile:gap-1.5">
          {showLogin && (
            <LoginButton
              onClick={onLogin}
              size="md"
              className="hidden landscape:inline-flex horizontal-mobile:!text-[11px] horizontal-mobile:!px-2.5 horizontal-mobile:!py-1"
            />
          )}
          <NotificationBell
            hasAlerts={hasAlerts}
            onClick={onToggleAlerts}
            ariaLabel={hasAlerts ? "Tienes notificaciones nuevas" : "Sin notificaciones"}
            className="shrink-0"
          />
        </div>
      </div>

      {/* Slot inferior: UserGreeting (Home) o contenido custom (pantallas interiores).
          Mantiene SIEMPRE el mismo contenedor para preservar altura y fondo. */}
      {(greetingSlot || showGreeting) && (
        <div className="relative z-10 horizontal-mobile:pointer-events-auto horizontal-desktop:pointer-events-auto bg-white/55">
          {greetingSlot ?? <UserGreeting name="Albert" points={1259} nextLevel={3000} />}
        </div>
      )}
    </motion.section>
  );
};

export default HomeHero;
