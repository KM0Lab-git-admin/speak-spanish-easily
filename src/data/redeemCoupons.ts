import type { Coupon } from "@/types/coupon";

/**
 * Cupones mock para la sección "Bescanvia amb punts" del Home
 * (spec docs/spec-home-c.md). Solo visual/aspiracional — el canje real
 * no está implementado.
 */
export const REDEEM_COUPONS: Coupon[] = [
  {
    id: "cafe-local-200",
    title: "Cafè gratis a Ca l'Antoni",
    validity: "Comerç adherit al centre",
    kind: "gift",
    costPoints: 200,
  },
  {
    id: "10pct-forn-500",
    title: "-10% al Forn del poble",
    validity: "Vàlid en tota la botiga",
    kind: "percent",
    costPoints: 500,
  },
  {
    id: "entrada-teatre-1200",
    title: "Entrada per al Teatre Principal",
    validity: "Una funció a triar",
    kind: "ticket",
    costPoints: 1200,
  },
];
