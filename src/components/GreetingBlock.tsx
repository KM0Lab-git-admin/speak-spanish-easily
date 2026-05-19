import { Heart } from "lucide-react";

/**
 * GreetingBlock — saludo personalizado limpio para la nueva home.
 *
 *   👋 ¡Hola, {name}!
 *      Gracias por apoyar lo local 💙
 *
 * Sustituye al UserGreeting tradicional (que mezclaba puntos+nivel).
 * Aquí solo se enfoca en el saludo emocional; los puntos viven en
 * PointsCard.
 */
export interface GreetingBlockProps {
  name?: string | null;
  subtitle?: string;
}

const GreetingBlock = ({
  name,
  subtitle = "Gracias por apoyar lo local",
}: GreetingBlockProps) => {
  return (
    <div className="w-full flex flex-col gap-0.5 horizontal-mobile:gap-0">
      <h2 className="font-brand font-black text-km0-blue-800 text-xl vertical-tablet:text-2xl horizontal-mobile:!text-base flex items-center gap-2 leading-tight">
        <span aria-hidden className="text-[1.15em]">👋</span>
        <span>
          ¡Hola{name ? `, ${name}` : ""}!
        </span>
      </h2>
      <p className="font-body text-km0-blue-700/80 text-sm vertical-tablet:text-base horizontal-mobile:!text-xs flex items-center gap-1.5 leading-snug pl-[1.85em]">
        {subtitle}
        <Heart
          className="w-3.5 h-3.5 horizontal-mobile:!w-3 horizontal-mobile:!h-3 text-km0-blue-700 fill-km0-blue-700"
          strokeWidth={2}
        />
      </p>
    </div>
  );
};

export default GreetingBlock;
