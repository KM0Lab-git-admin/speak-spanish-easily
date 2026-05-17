import { cn } from "@/lib/utils";

/**
 * WhenTabs — Segmented control horizontal para filtrar por rango temporal
 * en la Agenda. Sigue el master design KM0:
 *   - contenedor: km0-beige-50 con borde km0-blue-700/20
 *   - pestaña activa: km0-blue-800 + texto km0-yellow-400 (acento marca)
 *   - pestaña inactiva: texto km0-blue-800
 */

export type WhenKey = "semana" | "mes" | "trimestre";

export interface WhenTabOption {
  key: WhenKey;
  label: string;
}

export const WHEN_TABS: WhenTabOption[] = [
  { key: "semana", label: "Esta semana" },
  { key: "mes", label: "Este mes" },
  { key: "trimestre", label: "Próximos 3 meses" },
];

interface WhenTabsProps {
  value: WhenKey;
  onChange: (key: WhenKey) => void;
  className?: string;
}

const WhenTabs = ({ value, onChange, className = "" }: WhenTabsProps) => {
  return (
    <div
      role="tablist"
      aria-label="Rango temporal"
      className={cn(
        "grid grid-cols-3 gap-1 bg-km0-beige-50 border border-km0-blue-700/20 rounded-full p-1",
        className,
      )}
    >
      {WHEN_TABS.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.key)}
            className={cn(
              "h-9 rounded-full font-ui text-xs vertical-tablet:text-sm font-bold transition-all active:scale-95 px-2 truncate",
              active
                ? "bg-km0-blue-800 text-km0-yellow-400 shadow-sm"
                : "text-km0-blue-800 hover:bg-km0-beige-100",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default WhenTabs;
