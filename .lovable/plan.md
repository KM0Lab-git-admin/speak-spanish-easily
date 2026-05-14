## Problema confirmado en horizontal-mobile (667×375)

A partir de tu captura:

1. **Promos** ("FESTA MAJOR ROMANA") aparece recortado por abajo — la card hero ocupa más alto del que tiene la columna disponible.
2. **"Esto es para ti"** muestra solo la primera fila de comercios; el resto queda fuera del frame.
3. **Títulos desalineados horizontalmente**: "Promos y eventos destacados" arranca pegado a la izquierda (sin icono), mientras que "Esto es para ti" lleva el icono cupón delante, por lo que su texto arranca varios píxeles más a la derecha y además su fila tiene más alto. Las dos cabeceras deberían quedar a la misma altura y con el texto en la misma X.

## Causas en código

- En `HomeContent.tsx` la grid landscape (`landscape:grid landscape:grid-cols-2 landscape:flex-1 landscape:min-h-0`) sí limita altura, pero los hijos (`PromoSection` y `ComerciosSection`) ya rellenan `h-full` solo en horizontal; el problema real es que **dentro** de cada sección los carruseles usan altura fija por aspect-ratio:
  - `PromoCarousel` → `horizontal-mobile:aspect-[16/5] horizontal-mobile:flex-none` ⇒ no se adapta al alto disponible.
  - `ComercioCarousel` (no mostrado, mismo patrón) ⇒ mismo recorte.
- Los títulos no comparten altura ni padding-left:
  - `PromoSection` cabecera = solo `<h2>` con `min-h-12` (en vertical) y sin icono.
  - `ComerciosSection` cabecera = icono 7×7 + `<h2>` + botón "Ver todos" → más alta y con texto desplazado por el icono.

## Cambios propuestos (solo `horizontal-mobile`, sin tocar otros breakpoints)

### 1. Alinear cabeceras de las dos secciones
- Misma altura fija `h-6` y mismo `mb` en horizontal-mobile.
- Mismo punto de inicio del texto: en horizontal-mobile **ocultar** el icono cupón de `ComerciosSection` (`horizontal-mobile:hidden` en `<img couponIcon>`) para que ambos títulos arranquen en X=0 de su columna. El botón "Ver todos" se mantiene a la derecha.
- Igualar tamaño de fuente y peso ya están iguales (`text-xs font-brand font-black text-km0-blue-700`), solo falta igualar la caja contenedora.

### 2. Que los carruseles rellenen el alto de la columna
- `PromoCarousel.tsx`: en horizontal-mobile cambiar `aspect-[16/5] flex-none` por `aspect-auto flex-1 min-h-0` (igual que ya hace en horizontal-desktop). Así la card hero se ajusta al hueco real.
- `ComercioCarousel.tsx`: aplicar el mismo patrón — quitar altura/aspect fijo en horizontal-mobile y usar `flex-1 min-h-0` para que los logos se reescalen al alto disponible (reduciendo tamaño de iconos si hace falta con `horizontal-mobile:!w-10 horizontal-mobile:!h-10` o similar).
- En ambos, los dots de paginación deben quedar `shrink-0` para no comerse el alto.

### 3. Compactar ligeramente el contenedor de la grid
- En `HomeContent.tsx`, en horizontal-mobile bajar `pt-[clamp(48px,12dvh,72px)]` a algo como `pt-[clamp(40px,10dvh,60px)]` y reducir `gap` de la grid landscape a `landscape:gap-2 horizontal-mobile:!gap-2` para liberar 8–12 px verticales que hoy faltan.

## Verificación
- Probar a 667×375 (horizontal-mobile) con Playwright/manual: ambas secciones deben verse completas (card promo entera + al menos una fila completa de comercios) y los dos títulos deben quedar alineados en X y a la misma altura.
- Verificar que **vertical-mobile (375×667)**, **vertical-tablet (768×1024)** y **horizontal-desktop (1280×550)** quedan idénticos a hoy (cambios encapsulados con `horizontal-mobile:`).

## Archivos a tocar
- `src/components/ComerciosSection.tsx` — ocultar icono cupón en horizontal-mobile, igualar caja del header.
- `src/components/PromoSection.tsx` — igualar caja del header (mismo `h-6` y `mb` en horizontal-mobile).
- `src/components/PromoCarousel.tsx` — quitar aspect fijo en horizontal-mobile, usar `flex-1 min-h-0`.
- `src/components/ComercioCarousel.tsx` — mismo patrón flex.
- `src/components/HomeContent.tsx` — pequeño ajuste de `pt` y `gap` solo en horizontal-mobile.
