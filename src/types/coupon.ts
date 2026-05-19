/**
 * Coupon — cupón/promo individual para la sección "Promos para ti".
 *
 * Visual de tarjeta horizontal: icono (% / regalo) + título + validez
 * + chevron. Sin imagen externa, todo se resuelve con tokens KM0.
 */
export interface Coupon {
  id: string;
  /** Texto principal (ej.: "10% dto. en comercios locales"). */
  title: string;
  /** Validez legible (ej.: "Válido hasta el 30/06/2026"). */
  validity: string;
  /** Tipo visual del icono: porcentaje (default), regalo o ticket. */
  kind?: "percent" | "gift" | "ticket";
}
