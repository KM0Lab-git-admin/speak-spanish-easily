import type { Promo } from "@/types/promo";

/** Eventos destacados demo para el hero del Home. */
export const PROMOS: Promo[] = [
  {
    id: "festa-major",
    title: "Festa Major\nRomana 2026",
    dateRange: "Del 15 al 19 de julio",
    location: "Malgrat de Mar",
    badge: { text: "Fiesta", emoji: "🎉", bg: "bg-km0-coral-400", text_color: "text-white" },
    gradient: "from-km0-blue-800 via-km0-blue-700 to-km0-blue-900",
  },
  {
    id: "mercat-nit",
    title: "Mercat de Nit\nd'Estiu",
    dateRange: "Cada divendres de juliol",
    location: "Passeig Marítim",
    badge: { text: "Mercado", emoji: "🛍️", bg: "bg-km0-yellow-500", text_color: "text-km0-blue-900" },
    gradient: "from-km0-teal-700 via-km0-teal-600 to-km0-blue-800",
  },
  {
    id: "concert",
    title: "Concert de Jazz\na la Plaça",
    dateRange: "12 de setembre · 20:00",
    location: "Plaça Catalunya",
    badge: { text: "Música", emoji: "🎷", bg: "bg-km0-blue-700", text_color: "text-white" },
    gradient: "from-km0-yellow-400 via-km0-coral-400 to-km0-coral-500",
  },
  {
    id: "fira",
    title: "Fira Gastro\nKM0",
    dateRange: "Del 10 al 12 d'octubre",
    location: "Centre Històric",
    badge: { text: "Gastro", emoji: "🍴", bg: "bg-km0-teal-600", text_color: "text-white" },
    gradient: "from-km0-coral-500 via-km0-coral-400 to-km0-blue-700",
  },
];
