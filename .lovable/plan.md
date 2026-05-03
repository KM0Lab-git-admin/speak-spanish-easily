## Objetivo

A 667×375 (horizontal-mobile), las secciones **Promos y eventos destacados** y **Esto es para ti** quedan tapadas por la tab bar. Hay que liberar altura comprimiendo el bloque superior, **sin tocar** los otros 3 breakpoints (`vertical-mobile`, `vertical-tablet`, `horizontal-desktop`).

## Cambios (todos con prefijo `horizontal-mobile:`)

### `src/pages/Home.tsx`

1. **Padding superior del scroll body**: `pt-[clamp(48px,10dvh,64px)]` → `pt-7` (~28 px). Libera ~25 px.
2. **Header (escudo + título "Malgrat de Mar" + KM0 LAB)**: reducir escudo a `w-9 h-9`, título a `text-sm`, logo KM0 a `h-3`, padding-top del overlay a `pt-2`. Libera ~15 px.
3. **Módulos (HomeModules)**: en `horizontal-mobile` reducir círculos a ~50 px y label más pequeño. Libera ~15 px.
4. **CTAs Iniciar sesión / Registro**: reducir padding vertical y `text-xs`. Libera ~10 px.
5. **Gap del grid 2 columnas y `mt-3`**: bajar a `gap-2` y `mt-2`. Libera ~6 px.
6. **Tab bar inferior**: `pt-1 pb-1.5` y label `text-[9px]` solo en este breakpoint. Libera ~10 px.
7. **Aspect-ratio promos / "Esto es para ti"**: si después de los puntos 1-6 sigue justo, bajar `aspect-[16/7]` → `aspect-[16/6]` en `horizontal-mobile`.

### `src/components/HomeModules.tsx`

- Añadir variantes `horizontal-mobile` para `sizeClasses` (círculo ~50 px) y label (text-[9px], padding más fino).

## Verificación

Tras los cambios verifico visualmente las **4 resoluciones**:
- vertical-mobile 375×667
- vertical-tablet 768×1024
- horizontal-mobile 667×375 ← objetivo
- horizontal-desktop 1280×550

Los puntos 2-6 son aditivos: si el primer pase libera suficiente altura, no aplico el punto 7 para mantener proporción.

## Riesgos

- Densidad visual alta en horizontal-mobile (es esperable: 375 px de alto es muy poco).
- Cambios aislados con `horizontal-mobile:` → no hay regresión en los otros 3 breakpoints.
