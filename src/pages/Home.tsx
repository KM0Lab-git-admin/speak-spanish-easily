import { useState } from "react";
import { motion } from "framer-motion";
import Km0Logo from "@/components/Km0Logo";
import NotificationBell from "@/components/NotificationBell";
import coatMalgrat from "@/assets/coat-malgrat.png";

/**
 * Home — pantalla principal post-onboarding (sin registro).
 *
 * Construcción incremental: por ahora solo la cabecera.
 *  - Halo azul + fondo beige (mismo tratamiento que el resto de pantallas).
 *  - Header reutiliza la estructura del Chat:
 *      [escudo del pueblo]  [Nombre del pueblo + logo KM0 LAB]  [campana]
 *  - La campana hace toggle entre estado activo (con alerta coral) e inactivo
 *    para poder validar ambos estados en vivo.
 */
const Home = () => {
  const cityName = "Malgrat de Mar";
  const [hasAlerts, setHasAlerts] = useState(true);

  return (
    <div className="fixed inset-0 w-full flex justify-center items-stretch landscape:items-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 landscape:p-4 horizontal-mobile:p-2">
      {/* ── PORTRAIT (vertical-mobile / vertical-tablet) ─────── */}
      <div className="w-full max-w-[420px] h-full flex flex-col overflow-hidden landscape:hidden">
        {/* Header */}
        <motion.header
          className="flex items-center gap-3 px-4 pt-3 pb-2"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HeaderContent
            cityName={cityName}
            hasAlerts={hasAlerts}
            onToggleAlerts={() => setHasAlerts((v) => !v)}
          />
        </motion.header>

        {/* Body — placeholder hasta que vayamos añadiendo módulos */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="font-body text-sm text-muted-foreground text-center">
            (Aquí irán los módulos de la Home)
          </p>
        </div>
      </div>

      {/* ── LANDSCAPE (horizontal-mobile / horizontal-desktop) ─ */}
      <div className="hidden landscape:flex w-full max-w-[1200px] h-full max-h-[min(95dvh,calc(100vw*9/16))] aspect-video bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden flex-col relative">
        <motion.header
          className="flex items-center gap-3 px-4 horizontal-desktop:px-6 horizontal-mobile:px-3 pt-3 pb-2 horizontal-desktop:pt-4 horizontal-desktop:pb-3 horizontal-mobile:pt-2 horizontal-mobile:pb-1.5 shrink-0 border-b border-km0-beige-200"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HeaderContent
            cityName={cityName}
            hasAlerts={hasAlerts}
            onToggleAlerts={() => setHasAlerts((v) => !v)}
            compact
          />
        </motion.header>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 horizontal-desktop:px-8 horizontal-mobile:px-3 py-4">
          <p className="font-body text-sm text-muted-foreground text-center">
            (Aquí irán los módulos de la Home)
          </p>
        </div>
      </div>
    </div>
  );
};

interface HeaderContentProps {
  cityName: string;
  hasAlerts: boolean;
  onToggleAlerts: () => void;
  compact?: boolean;
}

/**
 * Cabecera de la Home — calcada en estructura a la del Chat para
 * mantener consistencia visual:
 *   [izquierda] escudo del pueblo (en lugar del back button)
 *   [centro]    nombre del pueblo + logo KM0 LAB
 *   [derecha]   campana con toggle de alertas
 */
const HeaderContent = ({ cityName, hasAlerts, onToggleAlerts, compact = false }: HeaderContentProps) => {
  const shieldSize = compact ? "w-11 h-11" : "w-12 h-12";

  return (
    <>
      {/* Bloque marca: escudo + (nombre pueblo / KM0 LAB) pegados a la izquierda */}
      <div className="flex-1 flex items-center gap-2.5 min-w-0">
        <div
          className={`${shieldSize} flex items-center justify-center shrink-0`}
          aria-label={`Escudo de ${cityName}`}
        >
          <img
            src={coatMalgrat}
            alt={`Escudo de ${cityName}`}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col min-w-0 leading-none">
          <h1 className="font-brand text-xl vertical-tablet:text-2xl horizontal-mobile:text-lg font-black text-km0-blue-700 truncate">
            {cityName}
          </h1>
          <div className="flex items-center mt-0.5">
            <Km0Logo className="h-3 vertical-tablet:h-4 horizontal-mobile:h-3 w-auto" />
          </div>
        </div>
      </div>

      {/* Campana — clickable, alterna estado activo / inactivo */}
      <NotificationBell
        hasAlerts={hasAlerts}
        onClick={onToggleAlerts}
        ariaLabel={hasAlerts ? "Tienes notificaciones nuevas" : "Sin notificaciones"}
      />
    </>
  );
};

export default Home;
