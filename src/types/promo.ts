/**
 * Promo — entrada del carrusel "Promos y eventos destacados".
 *
 * Cada promo se compone de tres líneas de título coloreables
 * independientemente, un subtítulo y un gradiente de fondo.
 */
export interface PromoTitle {
  text: string;
  /** Clase Tailwind de color (p.ej. "text-km0-yellow-400"). */
  color: string;
}

export interface Promo {
  id: string;
  title1: PromoTitle;
  title2: PromoTitle;
  title3: PromoTitle;
  subtitle: string;
  /** Clases Tailwind del gradiente (p.ej. "from-... via-... to-..."). */
  gradient: string;
}
