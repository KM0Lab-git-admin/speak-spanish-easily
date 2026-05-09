import type { Promo } from "@/types/promo";

/** Promos demo para el carrusel del Home. */
export const PROMOS: Promo[] = [
  {
    id: "festa-major",
    title1: { text: "FESTA", color: "text-km0-yellow-400" },
    title2: { text: "MAJOR", color: "text-white" },
    title3: { text: "ROMANA", color: "text-km0-coral-400" },
    subtitle: "MALGRAT DE MAR · 2026",
    gradient: "from-km0-blue-700 via-km0-blue-600 to-km0-blue-800",
  },
  {
    id: "mercat-nit",
    title1: { text: "MERCAT", color: "text-white" },
    title2: { text: "DE NIT", color: "text-km0-yellow-400" },
    title3: { text: "ESTIU", color: "text-km0-beige-100" },
    subtitle: "PASSEIG MARÍTIM · JULIOL",
    gradient: "from-km0-teal-600 via-km0-teal-500 to-km0-blue-700",
  },
  {
    id: "concert",
    title1: { text: "CONCERT", color: "text-km0-blue-800" },
    title2: { text: "JAZZ", color: "text-white" },
    title3: { text: "PLAÇA", color: "text-km0-blue-800" },
    subtitle: "PLAÇA CATALUNYA · SETEMBRE",
    gradient: "from-km0-yellow-400 via-km0-yellow-500 to-km0-coral-400",
  },
  {
    id: "fira",
    title1: { text: "FIRA", color: "text-white" },
    title2: { text: "GASTRO", color: "text-km0-yellow-400" },
    title3: { text: "KM0", color: "text-white" },
    subtitle: "CENTRE HISTÒRIC · OCTUBRE",
    gradient: "from-km0-coral-400 via-km0-coral-500 to-km0-blue-700",
  },
];
