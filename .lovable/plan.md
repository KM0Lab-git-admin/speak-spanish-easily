## Objetivo

En `horizontal-mobile` (≤1279 landscape, resolución test 667×375) los 4 módulos superiores (KM0 CHAT, Agenda, Ayuntamiento, Comercios) ocupan demasiado alto y empujan/solapan el contenido inferior. Hay que reducirlos solo para este breakpoint, sin tocar el resto.

## Cambios

**Archivo:** `src/components/HomeModules.tsx`

1. **Tamaño del círculo (líneas 129-131)**
   - Actual horizontal-mobile: `!w-[64px] !h-[64px]` (no enfatizado) y `!w-[66px] !h-[66px]` (enfatizado)
   - Nuevo: `!w-[44px] !h-[44px]` y `!w-[46px] !h-[46px]`

2. **Texto del label (línea 198)**
   - Actual: `horizontal-mobile:!text-[11px]`
   - Nuevo: `horizontal-mobile:!text-[9px]`
   - Padding del pill: `horizontal-mobile:px-1.5 horizontal-mobile:py-0`

3. **Margen vertical de la banda (línea 77)**
   - Mantener `my-[20px]` por defecto pero reducir en horizontal-mobile a `horizontal-mobile:!my-1` para no robar alto.

4. **Padding vertical interno banda**
   - Mantener `horizontal-mobile:!py-2` actual, sin cambio.

## Breakpoints no afectados

vertical-mobile, vertical-tablet y horizontal-desktop conservan los tamaños actuales sin cambios.

## Verificación

Validar visualmente en 667×375 que:
- Los 4 módulos caben en una sola fila sin solapamiento.
- Queda más espacio vertical para promo + comercios + tab bar sin solapes.
- Los labels siguen legibles.
