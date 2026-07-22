import { Calendar as CalendarIcon } from "lucide-react";

/**
 * ScreenTitle — sustituye al UserGreeting dentro del HomeHero en pantallas
 * interiores (Agenda, Chat…). Mantiene la MISMA altura visual que
 * UserGreeting para que el Hero no cambie de tamaño.
 *
 * Muestra: icono + título de la pantalla + fecha actual destacada.
 */
export interface ScreenTitleProps {
  title: string;
  /** Si se omite, se usa la fecha de hoy. */
  date?: Date;
  className?: string;
}

const MONTHS_LONG = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const WEEKDAYS = [
  "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado",
];

const ScreenTitle = ({ title, date, className = "" }: ScreenTitleProps) => {
  const d = date ?? new Date();
  const dayNum = d.getDate();
  const monthName = MONTHS_LONG[d.getMonth()];
  const weekday = WEEKDAYS[d.getDay()];

  return (
    <div
      className={`w-full flex items-center gap-2 vertical-tablet:gap-3 my-0 px-[10px] ${className}`.trim()}
    >
      {/* Bloque 1: icono + título */}
      <div className="flex items-center gap-2 min-w-0">
        <div
          aria-hidden
          className="shrink-0 w-9 h-9 vertical-tablet:w-10 vertical-tablet:h-10 horizontal-mobile:!w-8 horizontal-mobile:!h-8 rounded-full bg-km0-beige-50 border-2 border-km0-blue-700/15 shadow-sm flex items-center justify-center overflow-hidden"
        >
          <CalendarIcon
            className="w-4 h-4 vertical-tablet:w-5 vertical-tablet:h-5 horizontal-mobile:!w-3.5 horizontal-mobile:!h-3.5 text-km0-blue-700"
            strokeWidth={2.5}
          />
        </div>

        <div className="flex flex-col leading-tight min-w-0">
          <p className="font-brand font-black text-km0-blue-700 text-sm vertical-tablet:text-base horizontal-mobile:!text-xs whitespace-nowrap truncate">
            {title}
          </p>
          <span className="font-ui text-km0-blue-800 capitalize text-sm vertical-tablet:text-base bg-transparent truncate">
            {weekday}
          </span>
        </div>
      </div>

      {/* Bloque 2: tarjeta con fecha (mismo "slot derecho" que UserGreeting) */}
      <div className="ml-auto shrink-0 rounded-xl px-2 py-1 vertical-tablet:px-2.5 vertical-tablet:py-1.5 horizontal-mobile:!px-2 horizontal-mobile:!py-1 text-right">
        <p className="font-body text-km0-blue-800 whitespace-nowrap leading-tight text-xs vertical-tablet:text-sm">
          Hoy
        </p>
        <p className="font-brand text-km0-blue-700 whitespace-nowrap leading-tight mt-0.5 text-xl vertical-tablet:text-2xl">
          {dayNum} {monthName}
        </p>
      </div>
    </div>
  );
};

export default ScreenTitle;
