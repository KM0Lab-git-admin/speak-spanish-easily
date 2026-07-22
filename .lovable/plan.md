## Objetivo
Separar en `EventHeroCarousel` la navegación del carrusel de la acción "abrir evento".

## Cambios en `src/components/EventHeroCarousel.tsx`

1. **Botón chevron (esquina inferior derecha del panel)**
   - `onClick` pasa a `goTo(index + 1)` (avanza al siguiente evento del carrusel).
   - `aria-label` → "Següent esdeveniment".
   - Se mantiene el swipe horizontal como gesto equivalente.

2. **Abrir el detalle del evento**
   - La imagen y el bloque de texto (título/fecha/ubicación) se envuelven en un `<button>` que dispara `onOpen?.(promo.id)`.
   - `aria-label` → "Obrir {título}".
   - Los dots internos de imagen y el chevron siguen deteniendo la propagación para no abrir el detalle por error.

## Fuera de alcance
- No se toca el diseño visual del banner ni los datos de `PROMOS`.
- No se cambia la lógica de dots externos ni el swipe.
