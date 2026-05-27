import { Trophy, Ticket, Store, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import chatMascot from "@/assets/chat-mascot.png";
import agendaIcon from "@/assets/agenda-icon.png";
import cityHallIcon from "@/assets/cityhall-icon.png";
import shopIcon from "@/assets/shop-icon.png";

/**
 * HomeModules — accesos rápidos estilo Glovo, recoloreado a marca KM0.
 *
 * Lectura de Glovo aplicada a nuestra paleta:
 *  - Banda monocromática vibrante (Glovo: naranja → KM0: azul institucional)
 *    como FONDO de la sección, no como card. Identidad de marca clara.
 *  - Curva orgánica inferior — la banda se "derrama" suavemente sobre el
 *    fondo beige de la pantalla, no es un rectángulo cerrado.
 *  - Círculos BLANCOS PUROS (no de color) → los iconos coloridos resaltan
 *    máximo sobre la banda azul saturada.
 *  - Borde fino del círculo en el mismo azul de la banda → el círculo
 *    "respira" con la banda.
 *  - Sombra suave PROYECTADA BAJO el círculo (no glow alrededor) → da
 *    elevación física como si los círculos flotaran sobre la banda.
 *  - Cada icono usa un color distinto del DS (azul, amarillo, coral) para
 *    crear ritmo cromático sin perder coherencia.
 *  - Label en pill blanco flotando sobre el borde inferior del círculo,
 *    altura reservada para 2 líneas → iconos siempre alineados.
 *  - Círculo central ligeramente más grande → rompe la monotonía y crea
 *    jerarquía focal en el módulo principal (KM0 CHAT cuando está en medio).
 *
 *  Solo soporta exactamente 3 módulos (3 al centro).
 */

export type HomeModuleId = "chat" | "agenda" | "ajuntament" | "punts" | "cupons" | "comerc";

export interface HomeModule {
  id: HomeModuleId;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const ICONS: Record<Exclude<HomeModuleId, "chat" | "agenda" | "ajuntament" | "comerc">, LucideIcon> = {
  punts: Trophy,
  cupons: Ticket,
};

/** Color del icono dentro del círculo blanco. Pensado como ritmo cromático
 *  — cada módulo "vibra" con un acento distinto del DS sobre fondo blanco. */
const ICON_COLOR: Record<HomeModuleId, string> = {
  chat:        "text-km0-blue-700",
  agenda:      "text-km0-teal-600",
  ajuntament:  "text-km0-blue-700",
  punts:       "text-km0-yellow-600",
  cupons:      "text-km0-coral-400",
  comerc:      "text-km0-blue-700",
};

interface HomeModulesProps {
  modules: HomeModule[];
  className?: string;
}

const HomeModules = ({ modules, className }: HomeModulesProps) => {
  if (modules.length === 0) return null;

  return (
    <div className={cn("relative w-full max-w-full", className)}>
      <div
        className={cn(
          "relative bg-km0-beige-100 rounded-t-3xl rounded-bl-[40%_24px] rounded-br-[40%_24px] px-3 opacity-100 my-0 py-0",
        )}
      >
        {/* Patrón decorativo sutil arriba — círculos translúcidos
            que dan textura sin distraer (Glovo lo usa con su ilustración).
            Aquí lo mantenemos minimalista. */}
        <div
          aria-hidden
          className="absolute top-3 right-4 w-12 h-12 rounded-full bg-white/5"
        />
        <div
          aria-hidden
          className="absolute -top-1 left-8 w-6 h-6 rounded-full bg-white/5"
        />

        {/* Iconos: el del medio crece un punto para crear jerarquía focal */}
        <div className="relative flex items-end justify-around gap-1">
          {modules.map((mod, idx) => (
            <ModuleItem key={mod.id} module={mod} emphasized={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Item individual ────────────────────────────────────────── */
interface ModuleItemProps {
  module: HomeModule;
  emphasized?: boolean;
}

const ModuleItem = ({ module, emphasized = false }: ModuleItemProps) => {
  const isChat = module.id.startsWith("chat");
  const isAgenda = module.id === "agenda";
  const isAjuntament = module.id === "ajuntament";
  const isComerc = module.id === "comerc";
  const isImage = isChat || isAgenda || isAjuntament || isComerc;
  const Icon = isImage ? null : ICONS[module.id as Exclude<HomeModuleId, "chat" | "agenda" | "ajuntament" | "comerc">];
  const iconColor = ICON_COLOR[module.id];
  const imageSrc = isChat
    ? chatMascot
    : isAgenda
      ? agendaIcon
      : isAjuntament
        ? cityHallIcon
        : shopIcon;
  const { active, label, onClick } = module;

  // El módulo central (emphasized) crece un poco para crear jerarquía.
  // Tamaño fluido: en vertical-mobile (375px) se reduce para que los 4 módulos
  // quepan sin recortar el label "Ayuntamiento".
  const sizeClasses = emphasized
    ? "w-[clamp(60px,17vw,78px)] h-[clamp(60px,17vw,78px)] vertical-tablet:w-[88px] vertical-tablet:h-[88px]"
    : "w-[clamp(54px,15vw,68px)] h-[clamp(54px,15vw,68px)] vertical-tablet:w-[78px] vertical-tablet:h-[78px]";

  const iconSize = emphasized ? 34 : 30;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "group relative flex flex-col items-center vertical-mobile:min-w-0 transition-transform cursor-pointer active:scale-95",
        !active && "opacity-50 grayscale-[0.4]",
      )}
    >
      {/* Wrapper con la sombra proyectada DEBAJO del círculo (no alrededor).
          Esto se consigue con una sombra muy desplazada hacia abajo y muy
          difuminada — el círculo parece flotar sobre la banda. */}
      <div className="relative flex flex-col items-center">
        {/* Sombra elíptica bajo el círculo (suelo del icono) */}
        <span
          aria-hidden
          className={cn(
            "absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-km0-blue-900/30 blur-md",
            emphasized ? "w-14 h-2 -bottom-1" : "w-12 h-1.5 -bottom-0.5",
          )}
        />

        {/* Círculo blanco con borde fino azul */}
        <span
          className={cn(
            "relative flex items-center justify-center rounded-full bg-white shrink-0",
            "border-2",
            isImage ? "border-km0-blue-400" : "border-km0-blue-300/60",
            sizeClasses,
          )}
        >
          {isImage ? (
            <img
              src={imageSrc}
              alt=""
              aria-hidden
              className={cn(
                "w-full h-full object-contain",
                (isAjuntament || isComerc) && "p-2.5",
                !active && "opacity-70",
              )}
            />
          ) : (
            Icon && (
              <Icon
                size={iconSize}
                strokeWidth={2.2}
                className={cn(iconColor, !active && "opacity-70")}
              />
            )
          )}
        </span>

        {/* Pill del label — flota sobre el borde inferior del círculo,
            blanco con borde azul para que destaque sobre la banda azul. */}
        <span
          className={cn(
            "relative -mt-2.5 z-10",
            "px-2.5 vertical-mobile:px-[clamp(0.375rem,1.7vw,0.625rem)] py-0.5 rounded-full bg-white",
            "border border-km0-blue-300/60",
            "shadow-[0_2px_6px_-2px_hsl(var(--km0-blue-900)/0.25)]",
            "font-ui font-bold text-[10px] vertical-mobile:text-[clamp(8px,2.45vw,10px)] leading-tight text-km0-blue-800",
            "text-center whitespace-nowrap max-w-[120%]",
          )}
        >
          {label}
        </span>
      </div>
    </button>
  );
};

export default HomeModules;
