import type { Coupon } from "@/types/coupon";

/** Cupones demo para la sección "Promos para ti" del Home. */
export const COUPONS: Coupon[] = [
  {
    id: "10pct-local",
    title: "10% dto. en comercios locales",
    validity: "Válido hasta el 30/06/2026",
    kind: "percent",
  },
  {
    id: "regalo-1259",
    title: "Regalo al llegar a 1500 puntos",
    validity: "Te faltan 241 puntos",
    kind: "gift",
  },
  {
    id: "2x1-festa",
    title: "2x1 entrada Festa Major",
    validity: "Válido del 15 al 19 de julio",
    kind: "ticket",
  },
];
