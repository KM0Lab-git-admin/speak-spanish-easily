/**
 * Promo — entrada del carrusel "Eventos destacados".
 *
 * Cada promo ahora se renderiza como una event-card con:
 *  - badge de categoría (pill superior izquierdo)
 *  - título grande en 1-2 líneas
 *  - fecha (rango legible) y ubicación
 *  - fondo: gradiente decorativo (sin imagen externa) que mantiene
 *    la identidad KM0 sin depender de assets nuevos.
 */
export interface PromoBadge {
  /** Texto del badge (p.ej. "Fiesta"). */
  text: string;
  /** Clases Tailwind del fondo del badge (p.ej. "bg-km0-coral-400"). */
  bg: string;
  /** Clases Tailwind del color del texto del badge. */
  text_color: string;
  /** Emoji opcional a la izquierda del texto (p.ej. "🎉"). */
  emoji?: string;
}

export interface Promo {
  id: string;
  /** Título principal en 1-2 líneas (ej.: "Festa Major\nRomana 2026"). */
  title: string;
  /** Rango de fechas legible (ej.: "Del 15 al 19 de julio"). */
  dateRange: string;
  /** Ubicación corta (ej.: "Malgrat de Mar"). */
  location: string;
  /** Badge de categoría que aparece arriba a la izquierda. */
  badge: PromoBadge;
  /** Clases Tailwind del gradiente de fondo. */
  gradient: string;
}
