/**
 * Comerç adherit al programa de punts.
 * MOCK: sense API real; totes les dades vénen de `data/comerciosAdheridos.ts`.
 */
export interface ComercAdherit {
  id: string;
  nom: string;
  categoriaSlug: string;
  categoriaNom: { ca: string; es: string };
  adreca: string;
  /** Distància en metres (mock). */
  distanciaM: number;
  /** Punts que ofereix per compra (mock). */
  punts: number;
  /** Si dóna punts escanejant QR al comerç. */
  teQR: boolean;
  /** Emoji fallback quan no hi ha imatge. */
  emoji?: string;
  /** URL del logo/miniatura. Opcional. */
  imatge?: string;
  /** Classe Tailwind de fons de la miniatura (bg-km0-*). */
  bg?: string;
}

export interface CategoriaAdherit {
  slug: string;
  nom: { ca: string; es: string };
  count: number;
  emoji?: string;
}
