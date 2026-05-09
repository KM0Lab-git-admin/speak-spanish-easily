## Objetivo

Hacer que `horizontal-mobile` (captura 2, 965×663) se parezca visualmente a `horizontal-desktop` (captura 1, 1319×787): módulos superiores más grandes y card de promo más pequeña en proporción.

## Diagnóstico

En la última iteración se redujeron los círculos de los 4 módulos a 44/46px en `horizontal-mobile`. La captura 2 que comparte el usuario probablemente refleja un estado donde esos módulos ya se ven pequeños frente a la promo card que ocupa demasiado.

En `horizontal-desktop` los círculos son 70/72px y la promo card usa `flex-1` con `aspect-auto`, así que la proporción es más equilibrada.

## Cambios

**Archivo:** `src/components/HomeModules.tsx`

1. **Tamaño círculo módulos en horizontal-mobile**
   - Líneas 129-131
   - `!w-[44px] !h-[44px]` → `!w-[60px] !h-[60px]` (no enfatizado)
   - `!w-[46px] !h-[46px]` → `!w-[62px] !h-[62px]` (enfatizado)

2. **Texto del label en horizontal-mobile**
   - Línea ~198
   - `horizontal-mobile:!text-[9px]` → `horizontal-mobile:!text-[10px]`

3. **Margen vertical de la banda en horizontal-mobile**
   - Línea ~77
   - `horizontal-mobile:!my-1` → quitar (mantener `my-[20px]` base) o `horizontal-mobile:!my-2`

**Archivo:** `src/pages/Home.tsx`

4. **Reducir tamaño relativo de la promo card en horizontal-mobile**
   - PromoCarousel línea ~460: en `horizontal-mobile` actualmente usa `aspect-auto flex-1`. Para que la card sea más pequeña y deje más espacio a los comercios, cambiar a un `max-h` o usar `flex-[0_1_auto]` con `aspect-[16/8]` (más bajo que ancho, sin estirar tanto).
   - Alternativa: que el wrapper grid en línea 274 use `items-center` en horizontal-mobile y la promo respete su aspect ratio natural.

## Breakpoints no afectados

vertical-mobile, vertical-tablet y horizontal-desktop se quedan exactamente como están.

## Verificación

Comparar en 965×663 que:
- Los 4 módulos superiores se ven con tamaño similar al de 1280×550.
- La promo card ocupa proporcionalmente menos espacio vertical.
- No hay solapes con la tab bar.
