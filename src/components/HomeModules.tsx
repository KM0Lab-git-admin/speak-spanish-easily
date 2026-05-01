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

/** Tratamiento cromático del círculo del icono por módulo. */
const ICON_TREATMENT: Record<
  HomeModuleId,
  { bg: string; icon: string }
> = {
  chat:   { bg: "bg-km0-blue-700",   icon: "text-white" },
  agenda: { bg: "bg-km0-teal-500",   icon: "text-white" },
  punts:  { bg: "bg-km0-yellow-500", icon: "text-km0-blue-800" },
  cupons: { bg: "bg-km0-blue-700",   icon: "text-white" },
  comerc: { bg: "bg-km0-coral-400",  icon: "text-white" },
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
        "rounded-3xl bg-white p-3 shadow-[0_12px_30px_-12px_hsl(var(--km0-blue-700)/0.25)]",
        className,
      )}
    >
      <div className="flex items-stretch">
        {modules.map((mod, idx) => (
          <div key={mod.id} className="flex-1 flex items-stretch">
            <ModuleItem module={mod} />
            {idx < modules.length - 1 && (
              <div
                aria-hidden
                className="w-px my-2 bg-km0-blue-700/15 shrink-0"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Item individual ────────────────────────────────────────── */
interface ModuleItemProps {
  module: HomeModule;
}

const ModuleItem = ({ module }: ModuleItemProps) => {
  const Icon = ICONS[module.id];
  const { bg, icon } = ICON_TREATMENT[module.id];
  const { active, label, onClick } = module;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "group flex-1 flex flex-col items-center px-1 py-2 rounded-xl transition-transform cursor-pointer active:scale-95",
        !active && "opacity-45 grayscale-[0.3]",
      )}
    >
      {/* Icono — altura fija para que SIEMPRE quede al mismo nivel,
          independientemente de cuántas líneas ocupe el label debajo. */}
      <span
        className={cn(
          "flex items-center justify-center rounded-full shadow-[0_4px_10px_-2px_hsl(var(--km0-blue-700)/0.25)] shrink-0 w-12 h-12",
          bg,
        )}
      >
        <Icon size={24} strokeWidth={2.4} className={icon} />
      </span>

      {/* Label con altura reservada para 2 líneas → así los iconos
          de módulos con 1 línea quedan alineados con los de 2 líneas. */}
      <span
        className={cn(
          "mt-2 font-ui font-bold uppercase tracking-tight text-km0-blue-800 text-center leading-tight line-clamp-2 flex items-start justify-center text-xs min-h-[2rem]",
          !active && "text-km0-blue-800/70",
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default HomeModules;
