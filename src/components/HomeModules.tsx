import { MessageSquarePlus, Trophy, Ticket, Calendar, Store, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * HomeModules — bloque de accesos rápidos de la Home.
 *
 * Cada módulo tiene:
 *  - icono lucide sobre círculo de color (azul / amarillo / azul) para dar
 *    personalidad sin salirnos del design system.
 *  - label en font-ui, mayúsculas, alineado por baseline gracias a min-h
 *    fija en el contenedor del label (esto evita el bug de iconos
 *    desalineados cuando un label ocupa 2 líneas, ej "KM0 CHAT").
 *
 * Estado:
 *  - active   → color sólido + label km0-blue-800
 *  - inactive → opacity reducida (mantiene el grid estable)
 *
 * Layout: 3 módulos en fila única, separadores verticales suaves.
 */

export type HomeModuleId = "chat" | "agenda" | "punts" | "cupons" | "comerc";

export interface HomeModule {
  id: HomeModuleId;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const ICONS: Record<HomeModuleId, LucideIcon> = {
  chat: MessageSquarePlus,
  agenda: Calendar,
  punts: Trophy,
  cupons: Ticket,
  comerc: Store,
};

/** Color del icono dentro del círculo blanco (estilo Glovo: círculo blanco
 *  grande con borde de color, icono colorido dentro). */
const ICON_COLOR: Record<HomeModuleId, string> = {
  chat:   "text-km0-blue-700",
  agenda: "text-km0-teal-600",
  punts:  "text-km0-yellow-600",
  cupons: "text-km0-blue-700",
  comerc: "text-km0-coral-400",
};

interface HomeModulesProps {
  modules: HomeModule[];
  className?: string;
}

const HomeModules = ({ modules, className }: HomeModulesProps) => {
  if (modules.length !== 3) return null;

  return (
    <div
      className={cn(
        // Banda cálida tipo Glovo (su naranja → nuestro amarillo suave),
        // bordes redondeados, sin sombra de card para que parezca un
        // "área temática" más que un widget.
        "rounded-3xl bg-km0-yellow-300/70 px-3 pt-5 pb-7",
        className,
      )}
    >
      <div className="flex items-start justify-around gap-2">
        {modules.map((mod) => (
          <ModuleItem key={mod.id} module={mod} />
        ))}
      </div>
    </div>
  );
};

/* ─── Item individual estilo Glovo ───────────────────────────── */
interface ModuleItemProps {
  module: HomeModule;
}

const ModuleItem = ({ module }: ModuleItemProps) => {
  const Icon = ICONS[module.id];
  const iconColor = ICON_COLOR[module.id];
  const { active, label, onClick } = module;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "group flex flex-col items-center w-[28%] transition-transform cursor-pointer active:scale-95",
        !active && "opacity-45 grayscale-[0.3]",
      )}
    >
      {/* Wrapper relativo: el label flota sobre el borde inferior del círculo */}
      <div className="relative flex flex-col items-center w-full">
        {/* Círculo blanco con borde — contenedor del icono */}
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-white shrink-0",
            "w-[72px] h-[72px] vertical-tablet:w-20 vertical-tablet:h-20",
            "border-2 border-km0-yellow-500",
            "shadow-[0_6px_14px_-6px_hsl(var(--km0-yellow-700)/0.45)]",
          )}
        >
          <Icon
            size={32}
            strokeWidth={2.2}
            className={cn(iconColor, !active && "opacity-70")}
          />
        </span>

        {/* Pill del label — flota sobre el borde inferior, altura fija
            para 2 líneas → mantiene los círculos siempre alineados aunque
            "KM0 CHAT" o "Farmacia y Belleza" ocupen 2 líneas. */}
        <span
          className={cn(
            "absolute -bottom-3.5 left-1/2 -translate-x-1/2",
            "px-2 py-0.5 rounded-full bg-white",
            "border border-km0-yellow-500",
            "font-ui font-bold text-[10px] leading-tight text-km0-blue-800",
            "text-center whitespace-nowrap max-w-[110%]",
          )}
        >
          {label}
        </span>
      </div>
    </button>
  );
};

export default HomeModules;

