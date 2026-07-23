import type { CategoriaAdherit, ComercAdherit } from "@/types/comercAdherit";
import shopBakery from "@/assets/shop-logos/shop-bakery.png";
import shopCafe from "@/assets/shop-logos/shop-cafe.png";
import shopFashion from "@/assets/shop-logos/shop-fashion.png";
import shopFlorist from "@/assets/shop-logos/shop-florist.png";
import shopHardware from "@/assets/shop-logos/shop-hardware.png";
import shopPharmacy from "@/assets/shop-logos/shop-pharmacy.png";
import shopWine from "@/assets/shop-logos/shop-wine.png";

/**
 * Mock de comerços adherits al programa de punts KM0.
 * No hi ha API real; les distàncies i punts són valors inventats.
 */
export const COMERCIOS_ADHERITS: ComercAdherit[] = [
  {
    id: "forn-rovira",
    nom: "Forn Rovira",
    categoriaSlug: "alimentacio",
    categoriaNom: { ca: "Alimentació", es: "Alimentación" },
    adreca: "C. de Mar, 14",
    distanciaM: 240,
    punts: 20,
    teQR: true,
    emoji: "🥐",
    imatge: shopBakery,
    bg: "bg-km0-yellow-100",
  },
  {
    id: "cafe-del-mar",
    nom: "Cafè del Mar",
    categoriaSlug: "restauracio",
    categoriaNom: { ca: "Restauració", es: "Restauración" },
    adreca: "Pg. Marítim, 3",
    distanciaM: 310,
    punts: 15,
    teQR: true,
    emoji: "☕",
    imatge: shopCafe,
    bg: "bg-km0-teal-100",
  },
  {
    id: "cal-sastre",
    nom: "Cal Sastre",
    categoriaSlug: "moda",
    categoriaNom: { ca: "Moda", es: "Moda" },
    adreca: "C. Girona, 22",
    distanciaM: 480,
    punts: 25,
    teQR: true,
    emoji: "👕",
    imatge: shopFashion,
    bg: "bg-km0-coral-100",
  },
  {
    id: "floristeria-nom",
    nom: "Floristeria Nom",
    categoriaSlug: "serveis",
    categoriaNom: { ca: "Serveis", es: "Servicios" },
    adreca: "Pl. Catalunya, 1",
    distanciaM: 520,
    punts: 20,
    teQR: false,
    emoji: "💐",
    imatge: shopFlorist,
    bg: "bg-km0-beige-100",
  },
  {
    id: "vins-champa",
    nom: "Vins Champa",
    categoriaSlug: "alimentacio",
    categoriaNom: { ca: "Alimentació", es: "Alimentación" },
    adreca: "C. Bruc, 8",
    distanciaM: 610,
    punts: 30,
    teQR: true,
    emoji: "🍷",
    imatge: shopWine,
    bg: "bg-km0-blue-50",
  },
  {
    id: "farmacia-plus",
    nom: "Farmàcia+",
    categoriaSlug: "salut",
    categoriaNom: { ca: "Salut i bellesa", es: "Salud y belleza" },
    adreca: "Av. Costa Brava, 45",
    distanciaM: 680,
    punts: 10,
    teQR: true,
    emoji: "💊",
    imatge: shopPharmacy,
    bg: "bg-km0-teal-50",
  },
  {
    id: "manitas",
    nom: "Manitas",
    categoriaSlug: "llar",
    categoriaNom: { ca: "Llar i decoració", es: "Hogar y decoración" },
    adreca: "C. Indústria, 12",
    distanciaM: 730,
    punts: 15,
    teQR: false,
    emoji: "🔧",
    imatge: shopHardware,
    bg: "bg-km0-yellow-50",
  },
  {
    id: "llibreria-vidal",
    nom: "Llibreria Vidal",
    categoriaSlug: "cultura",
    categoriaNom: { ca: "Cultura i lleure", es: "Cultura y ocio" },
    adreca: "Rbla. dels Pins, 5",
    distanciaM: 820,
    punts: 20,
    teQR: true,
    emoji: "📚",
    bg: "bg-km0-blue-100",
  },
];

/**
 * Mock de categories amb comptador. Total (32) coincideix amb la suma
 * teòrica del programa (encara que aquí només tinguem 8 comerços mock).
 */
export const CATEGORIES_ADHERITS: CategoriaAdherit[] = [
  { slug: "totes", nom: { ca: "Totes les categories", es: "Todas las categorías" }, count: 32, emoji: "🗂️" },
  { slug: "alimentacio", nom: { ca: "Alimentació", es: "Alimentación" }, count: 8, emoji: "🥐" },
  { slug: "restauracio", nom: { ca: "Restauració", es: "Restauración" }, count: 6, emoji: "☕" },
  { slug: "serveis", nom: { ca: "Serveis", es: "Servicios" }, count: 5, emoji: "🔧" },
  { slug: "moda", nom: { ca: "Moda", es: "Moda" }, count: 4, emoji: "👕" },
  { slug: "salut", nom: { ca: "Salut i bellesa", es: "Salud y belleza" }, count: 3, emoji: "💆" },
  { slug: "llar", nom: { ca: "Llar i decoració", es: "Hogar y decoración" }, count: 2, emoji: "🛋️" },
  { slug: "cultura", nom: { ca: "Cultura i lleure", es: "Cultura y ocio" }, count: 2, emoji: "🎭" },
  { slug: "esports", nom: { ca: "Esports", es: "Deportes" }, count: 1, emoji: "⚽" },
  { slug: "tecnologia", nom: { ca: "Tecnologia", es: "Tecnología" }, count: 1, emoji: "💻" },
];
