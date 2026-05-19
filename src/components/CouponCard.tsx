import { ChevronRight, Percent, Gift, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Coupon } from "@/types/coupon";

/**
 * CouponCard — tarjeta horizontal para "Promos para ti".
 *
 * Estructura:
 *   ┌──────────────────────────────────────────────┐
 *   │ [icono]  Título principal                  ›│
 *   │          Validez                             │
 *   └──────────────────────────────────────────────┘
 *
 * Fondo beige cálido + icono en pill coral/yellow según tipo.
 */
export interface CouponCardProps {
  coupon: Coupon;
  onClick?: () => void;
  delay?: number;
}

const ICON_BY_KIND = {
  percent: Percent,
  gift:    Gift,
  ticket:  Ticket,
} as const;

const STYLE_BY_KIND = {
  percent: { bg: "bg-km0-coral-100", fg: "text-km0-coral-500" },
  gift:    { bg: "bg-km0-yellow-100", fg: "text-km0-yellow-600" },
  ticket:  { bg: "bg-km0-teal-100", fg: "text-km0-teal-700" },
} as const;

const CouponCard = ({ coupon, onClick, delay = 0 }: CouponCardProps) => {
  const Icon = ICON_BY_KIND[coupon.kind ?? "percent"];
  const style = STYLE_BY_KIND[coupon.kind ?? "percent"];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="w-full rounded-2xl bg-km0-beige-100 border border-km0-blue-700/10 shadow-[0_4px_14px_-8px_hsl(var(--km0-blue-900)/0.2)] px-3 py-2.5 vertical-tablet:px-4 vertical-tablet:py-3 horizontal-mobile:!px-2 horizontal-mobile:!py-2 flex items-center gap-3 horizontal-mobile:!gap-2 active:scale-[0.99] hover:bg-km0-beige-50 transition-all text-left"
    >
      <span
        className={cn(
          "shrink-0 w-11 h-11 vertical-tablet:w-12 vertical-tablet:h-12 horizontal-mobile:!w-8 horizontal-mobile:!h-8 rounded-xl flex items-center justify-center",
          style.bg,
        )}
      >
        <Icon
          size={22}
          strokeWidth={2.4}
          className={cn("horizontal-mobile:!w-4 horizontal-mobile:!h-4", style.fg)}
        />
      </span>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="font-ui font-bold text-km0-blue-800 text-sm vertical-tablet:text-base horizontal-mobile:!text-xs leading-tight truncate">
          {coupon.title}
        </span>
        <span className="font-body text-km0-blue-700/70 text-[11px] vertical-tablet:text-xs horizontal-mobile:!text-[10px] leading-tight truncate">
          {coupon.validity}
        </span>
      </div>

      <ChevronRight
        size={18}
        strokeWidth={2.4}
        className="shrink-0 text-km0-blue-700/60 horizontal-mobile:!w-4 horizontal-mobile:!h-4"
      />
    </motion.button>
  );
};

export default CouponCard;
