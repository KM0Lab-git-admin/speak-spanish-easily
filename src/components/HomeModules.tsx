import { MessageSquarePlus, Trophy, Ticket, Calendar, Store, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * HomeModules — bloque de accesos rápidos de la Home.
 *
 * Layouts según número de módulos (alineado con la captura de referencia):
 *  - 3 módulos → fila única, distribución equitativa
 *  - 4 módulos → fila única, distribución equitativa
 *  - 5 módulos → jerárquico: 3 primarios arriba (full width)
 *                + 2 secundarios abajo en card interna más clara
 *
 *  1 ó 2 módulos no se contemplan (ver brief).
 *
 * Estado por módulo:
 *  - active   → fondo amarillo principal, icono blanco con icono azul (alta prominencia)
 *  - inactive → fondo amarillo desaturado (km0-yellow-200) + opacity, no clickable
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

interface HomeModulesProps {
  modules: HomeModule[];
  className?: string;
}

const HomeModules = ({ modules, className }: HomeModulesProps) => {
  const count = modules.length;

  if (count < 3 || count > 5) {
    // Defensivo: el diseño solo cubre 3, 4 y 5
    return null;
  }

  // 5 módulos → layout jerárquico 3 + 2
  if (count === 5) {
    const primary = modules.slice(0, 3);
    const secondary = modules.slice(3);

    return (
      <div
        className={cn(
          "rounded-3xl bg-km0-yellow-500 p-3 shadow-[0_4px_14px_-4px_hsl(var(--km0-yellow-700)/0.4)]",
          className,
        )}
      >
        <ModuleRow modules={primary} />

        {/* Sub-card secundarios */}
        <div className="mt-3 rounded-2xl bg-km0-yellow-300/80 p-2 mx-2">
          <ModuleRow modules={secondary} compact />
        </div>
      </div>
    );
  }

  // 3 ó 4 → fila única
  return (
    <div
      className={cn(
        "rounded-3xl bg-km0-yellow-500 p-3 shadow-[0_4px_14px_-4px_hsl(var(--km0-yellow-700)/0.4)]",
        className,
      )}
    >
      <ModuleRow modules={modules} />
    </div>
  );
};

/* ─── Row con divisores verticales entre módulos ─────────────── */
interface ModuleRowProps {
  modules: HomeModule[];
  compact?: boolean;
}

const ModuleRow = ({ modules, compact = false }: ModuleRowProps) => (
  <div className="flex items-stretch">
    {modules.map((mod, idx) => (
      <div key={mod.id} className="flex-1 flex items-stretch">
        <ModuleItem module={mod} compact={compact} />
        {idx < modules.length - 1 && (
          <div
            aria-hidden
            className="w-px my-2 bg-km0-blue-700/15 shrink-0"
          />
        )}
      </div>
    ))}
  </div>
);

/* ─── Item individual ────────────────────────────────────────── */
interface ModuleItemProps {
  module: HomeModule;
  compact?: boolean;
}

const ModuleItem = ({ module, compact }: ModuleItemProps) => {
  const Icon = ICONS[module.id];
  const { active, label, onClick } = module;

  const iconWrap = compact ? "w-10 h-10" : "w-12 h-12";
  const iconSize = compact ? 20 : 24;
  const labelSize = compact ? "text-xs" : "text-sm";

  return (
    <button
      type="button"
      onClick={active ? onClick : undefined}
      disabled={!active}
      aria-disabled={!active}
      aria-label={label}
      className={cn(
        "group flex-1 flex flex-col items-center justify-center gap-1.5 px-1 py-2 rounded-xl transition-transform",
        active && "active:scale-95 cursor-pointer",
        !active && "opacity-55 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-white shadow-sm",
          iconWrap,
        )}
      >
        <Icon
          size={iconSize}
          strokeWidth={2.4}
          className={cn(
            "text-km0-blue-700",
            !active && "text-km0-blue-700/60",
          )}
        />
      </span>
      <span
        className={cn(
          "font-ui font-bold uppercase tracking-tight text-km0-blue-800 leading-none text-center",
          labelSize,
          !active && "text-km0-blue-800/70",
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default HomeModules;
