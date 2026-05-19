import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, MapPin, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Promo } from "@/types/promo";

/**
 * EventHeroCarousel — hero de "Eventos destacados".
 *
 * Cada slide se compone como en el mockup de la nueva home:
 *  - Fondo: gradiente decorativo + "fuegos artificiales" sutiles.
 *  - Top-left: badge pill (categoría) con emoji + texto.
 *  - Bottom-left: título grande (2 líneas), fecha y ubicación.
 *  - Bottom-right: círculo blanco con chevron (call to action).
 *  - Debajo: dots de paginación.
 *
 * Swipe horizontal con framer-motion; dots clicables.
 */
export interface EventHeroCarouselProps {
  promos: Promo[];
  onOpen?: (id: string) => void;
}

const EventHeroCarousel = ({ promos, onOpen }: EventHeroCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const total = promos.length;
  if (total === 0) return null;

  const goTo = (next: number) => {
    const safe = (next + total) % total;
    setDirection(safe > index || (index === total - 1 && safe === 0) ? 1 : -1);
    setIndex(safe);
  };

  const promo = promos[index];

  return (
    <div className="w-full">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_12px_28px_-14px_hsl(var(--km0-blue-900)/0.4)] aspect-[16/10] vertical-tablet:aspect-[16/9] horizontal-mobile:!aspect-[2/1] horizontal-desktop:!aspect-[16/7]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={promo.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) goTo(index + 1);
              else if (info.offset.x > 50) goTo(index - 1);
            }}
            className={cn(
              "absolute inset-0 bg-gradient-to-br cursor-grab active:cursor-grabbing",
              promo.gradient,
            )}
          >
            {/* Decoración: motas de "fuegos artificiales" */}
            <div aria-hidden className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-km0-yellow-300 shadow-[0_0_12px_hsl(var(--km0-yellow-400))]" />
            <div aria-hidden className="absolute top-8 left-16 w-1 h-1 rounded-full bg-white/70" />
            <div aria-hidden className="absolute top-5 right-20 w-2 h-2 rounded-full bg-km0-coral-300 shadow-[0_0_14px_hsl(var(--km0-coral-400))]" />
            <div aria-hidden className="absolute top-12 right-10 w-1 h-1 rounded-full bg-white/80" />
            <div aria-hidden className="absolute top-2 right-32 w-1.5 h-1.5 rounded-full bg-km0-yellow-200/80" />

            {/* Overlay sutil para que el texto contraste bien */}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

            {/* Badge categoría (top-left) */}
            <div className="absolute top-3 left-3 horizontal-mobile:!top-2 horizontal-mobile:!left-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-ui font-bold text-xs horizontal-mobile:!text-[10px] horizontal-mobile:!px-2 horizontal-mobile:!py-0.5 shadow-md",
                  promo.badge.bg,
                  promo.badge.text_color,
                )}
              >
                {promo.badge.emoji && <span aria-hidden>{promo.badge.emoji}</span>}
                {promo.badge.text}
              </span>
            </div>

            {/* Contenido inferior izquierdo */}
            <div className="absolute left-4 right-16 bottom-3 vertical-tablet:left-5 vertical-tablet:bottom-4 horizontal-mobile:!left-2.5 horizontal-mobile:!bottom-2 horizontal-mobile:!right-12 pointer-events-none select-none">
              <h3 className="font-brand font-black text-white leading-[1.05] whitespace-pre-line text-2xl vertical-tablet:text-3xl horizontal-mobile:!text-base">
                {promo.title}
              </h3>
              <div className="mt-1.5 horizontal-mobile:!mt-1 flex flex-col gap-0.5 font-body text-white/95 text-xs vertical-tablet:text-sm horizontal-mobile:!text-[10px]">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} className="shrink-0 horizontal-mobile:!w-3 horizontal-mobile:!h-3" strokeWidth={2.2} />
                  {promo.dateRange}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="shrink-0 horizontal-mobile:!w-3 horizontal-mobile:!h-3" strokeWidth={2.2} />
                  {promo.location}
                </span>
              </div>
            </div>

            {/* CTA chevron circle */}
            <button
              type="button"
              onClick={() => onOpen?.(promo.id)}
              aria-label={`Ver detalle de ${promo.title.replace(/\n/g, " ")}`}
              className="absolute bottom-3 right-3 horizontal-mobile:!bottom-2 horizontal-mobile:!right-2 w-10 h-10 horizontal-mobile:!w-8 horizontal-mobile:!h-8 rounded-full bg-white shadow-[0_4px_14px_-2px_hsl(var(--km0-blue-900)/0.5)] flex items-center justify-center active:scale-95 hover:scale-105 transition-transform"
            >
              <ChevronRight size={20} strokeWidth={2.5} className="text-km0-blue-700 horizontal-mobile:!w-4 horizontal-mobile:!h-4" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5 horizontal-mobile:mt-1">
        {promos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir al evento ${i + 1}`}
            className={cn(
              "rounded-full transition-all",
              i === index
                ? "w-5 h-1.5 bg-km0-blue-700"
                : "w-1.5 h-1.5 bg-km0-blue-700/25 hover:bg-km0-blue-700/50",
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default EventHeroCarousel;
