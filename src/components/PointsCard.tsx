import { Star } from "lucide-react";
import { motion } from "framer-motion";

/**
 * PointsCard — tarjeta prominente con puntos del usuario y barra de
 * progreso al siguiente nivel. Inspirada en el mockup de la nueva home:
 *
 *  ┌─────────────────────────────────────────────┐
 *  │  ★   1259           Nivel Local              │
 *  │     puntos         1259/3000 p               │
 *  │                    ██████░░░░░░░             │
 *  └─────────────────────────────────────────────┘
 *
 * Mantiene tokens KM0 (sin colores hex), tipografía de marca y la
 * barra de progreso en teal.
 */
export interface PointsCardProps {
  points: number;
  nextLevel: number;
  levelName?: string;
}

const PointsCard = ({
  points,
  nextLevel,
  levelName = "Nivel Local",
}: PointsCardProps) => {
  const safePoints = Math.max(0, points);
  const safeNext = Math.max(safePoints + 1, nextLevel);
  const pct = Math.min(100, Math.round((safePoints / safeNext) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full rounded-2xl bg-white border border-km0-blue-700/10 shadow-[0_8px_24px_-12px_hsl(var(--km0-blue-900)/0.18)] px-4 py-3 vertical-tablet:px-5 vertical-tablet:py-4 horizontal-mobile:!px-3 horizontal-mobile:!py-2 flex items-center gap-4 horizontal-mobile:!gap-3"
    >
      {/* Estrella + puntos */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="w-10 h-10 vertical-tablet:w-12 vertical-tablet:h-12 horizontal-mobile:!w-8 horizontal-mobile:!h-8 rounded-full bg-km0-yellow-100 flex items-center justify-center">
          <Star
            className="w-5 h-5 vertical-tablet:w-6 vertical-tablet:h-6 horizontal-mobile:!w-4 horizontal-mobile:!h-4 text-km0-yellow-500 fill-km0-yellow-400"
            strokeWidth={2}
          />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-brand font-black text-km0-blue-800 text-2xl vertical-tablet:text-3xl horizontal-mobile:!text-xl">
            {safePoints.toLocaleString("es-ES")}
          </span>
          <span className="font-body text-km0-blue-700/70 text-xs vertical-tablet:text-sm horizontal-mobile:!text-[10px] -mt-0.5">
            puntos
          </span>
        </div>
      </div>

      {/* Separador vertical sutil */}
      <span aria-hidden className="w-px self-stretch bg-km0-blue-700/10" />

      {/* Nivel + barra */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5 horizontal-mobile:!gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-ui font-bold text-km0-blue-800 text-xs vertical-tablet:text-sm horizontal-mobile:!text-[11px]">
            {levelName}
          </span>
          <span className="font-body text-km0-blue-700/70 text-[11px] vertical-tablet:text-xs horizontal-mobile:!text-[10px] whitespace-nowrap">
            {safePoints.toLocaleString("es-ES")}/{safeNext.toLocaleString("es-ES")} p
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={safeNext}
          aria-valuenow={safePoints}
          className="h-2 vertical-tablet:h-2.5 horizontal-mobile:!h-1.5 w-full rounded-full bg-km0-beige-200 overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="h-full rounded-full bg-gradient-to-r from-km0-teal-500 to-km0-teal-600"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PointsCard;
