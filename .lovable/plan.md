## Objetivo

En portrait, el rango entre **375×667 (vertical-mobile)** y **768×1024 (vertical-tablet)** debe escalar de forma fluida. Hoy:

- A 375px todo está perfecto (cabe sin scroll, denso).
- Entre ~500–767px se ve apretado igual que a 375px porque todas las clases `vertical-mobile:` aplican el mismo valor fijo en todo el rango.
- A 768px (vertical-tablet) salta de golpe a tamaños base más grandes, pero antes de ese salto sobra mucho espacio inferior (visible en captura 759×919).

La solución es **interpolar fluidamente** los paddings, gaps y tamaños de los componentes principales dentro del rango 375→767px, usando `clamp()` con `vw` como interpolador. Así, según crece el ancho portrait, los componentes "respiran" gradualmente y rellenan el alto disponible sin dejar hueco al final.

## Estrategia

Mantener todas las clases existentes (no romper otros breakpoints) pero **sustituir los valores `vertical-mobile:`** que hoy son fijos por estilos inline `clamp(min, vw, max)` aplicados solo en portrait ≤767px (vía hook `useBreakpoint` o, más simple, mediante `style` con calc + media query CSS).

Enfoque elegido: **usar utilidades arbitrarias de Tailwind con `clamp()`** directamente en las clases base. Tailwind permite `p-[clamp(...)]`. Así no hace falta JS ni `style={}` y funciona en cualquier ancho portrait sin depender de breakpoint.

Las clases arbitrarias se aplicarán en el "valor base" (sin prefijo) y se sobreescribirán con `vertical-tablet:` para fijar el tope superior cuando entre ese breakpoint.

## Cambios concretos en `src/pages/Home.tsx`

### 1) AuthButton (líneas 337–359)
Reemplazar:
- `px-3 py-3` y `vertical-mobile:py-2 vertical-mobile:gap-1.5 vertical-mobile:px-2.5 vertical-mobile:text-xs vertical-mobile:rounded-xl`

Por:
- `gap-[clamp(0.375rem,2vw,0.5rem)] px-[clamp(0.625rem,3vw,0.75rem)] py-[clamp(0.5rem,2.4vw,0.75rem)] text-[clamp(0.75rem,3vw,0.875rem)] rounded-[clamp(0.75rem,3vw,1rem)]`
- Eliminar las clases `vertical-mobile:` (el clamp ya cubre 375→767).
- Mantener compatibilidad con `vertical-tablet:` añadiendo: `vertical-tablet:px-3 vertical-tablet:py-3 vertical-tablet:gap-2 vertical-tablet:text-sm vertical-tablet:rounded-2xl`.

Círculo del icono: cambiar `w-7 h-7` + `vertical-mobile:w-6 vertical-mobile:h-6` por:
- `w-[clamp(1.5rem,6vw,1.75rem)] h-[clamp(1.5rem,6vw,1.75rem)]`

Tamaño del icono Lucide (líneas 238/241): pasarlo de `size={16}` a `size={18}` y dejar que el contenedor escale (Lucide acepta solo número, así que mantenemos 16 y dejamos respirar el padding).

### 2) Sección CTAs (línea 232–244)
Reemplazar `mt-3 gap-3 vertical-mobile:mt-2 vertical-mobile:gap-2` por:
- `mt-[clamp(0.5rem,2.5vw,0.75rem)] gap-[clamp(0.5rem,2.5vw,0.75rem)]`
- Añadir `vertical-tablet:mt-4 vertical-tablet:gap-4` para que en tablet portrait respire más.

### 3) Sección Promos (línea 247–257)
Reemplazar `mt-4 vertical-mobile:mt-3` por:
- `mt-[clamp(0.75rem,3vw,1rem)]`
- Añadir `vertical-tablet:mt-5`.

Título h2: `mb-2 vertical-mobile:mb-1.5` →
- `mb-[clamp(0.375rem,1.5vw,0.5rem)]`
- Añadir `vertical-tablet:mb-3`.

Carrusel (línea 421): `aspect-[16/9] vertical-mobile:aspect-[2/1]` →
- Mantener `vertical-mobile:aspect-[2/1]` pero usar un aspect fluido: cambiar a `aspect-[2/1] vertical-tablet:aspect-[16/9]` (que es lo que ya hace pero al revés). Esto implica que entre 375 y 767 el card tiene 2:1 (más bajo) y a partir de 768 pasa a 16:9 (más alto). Para suavizar: usar `min-h-[clamp(120px,30vw,180px)]` además del aspect, de modo que crezca proporcional al ancho.

### 4) Sección "Esto es para ti" (línea 260–291)
Reemplazar `mt-4 vertical-mobile:mt-3` por:
- `mt-[clamp(0.75rem,3vw,1rem)]`
- Añadir `vertical-tablet:mt-5`.

Header `mb-2 vertical-mobile:mb-1.5` →
- `mb-[clamp(0.375rem,1.5vw,0.5rem)] vertical-tablet:mb-3`

Icono cupón (línea 268–276): `w-20 h-20 vertical-mobile:w-12 vertical-mobile:h-12` →
- `w-[clamp(3rem,12vw,5rem)] h-[clamp(3rem,12vw,5rem)]`
- Eliminar el `vertical-mobile:` redundante.

Título (línea 277): `text-base vertical-mobile:text-sm` →
- `text-[clamp(0.875rem,3.6vw,1rem)]`

### 5) ComercioCarousel (componente interno más abajo)
Necesito ver las líneas 440–613 para confirmar las clases exactas, pero el patrón será el mismo: cambiar `w-14 h-14 vertical-mobile:w-11 vertical-mobile:h-11` por `w-[clamp(2.75rem,9vw,3.5rem)] h-[clamp(2.75rem,9vw,3.5rem)]`, y los `mt-1`/`mt-1.5` por clamps equivalentes.

### 6) Contenedor scroll (línea 172)
Mantener `vertical-mobile:overflow-hidden vertical-mobile:pb-0` PERO añadir un padding-bottom fluido para que entre 500–767 portrait haya un cojín inferior que absorba el espacio sobrante de forma controlada en lugar de quedar bloque vacío:
- Cambiar `pb-2` por `pb-[clamp(0.5rem,3vw,1.5rem)]` y mantener `vertical-mobile:pb-0` SOLO cuando realmente haga falta — mejor eliminarlo y dejar que el clamp lo controle.

### 7) Hero (no tocar la imagen del skyline)
El hero ya escala por `aspect-[1920/716]`, así que se ajusta solo. No requiere cambios.

## Verificación

Después de aplicar:
1. **375×667** — debe verse igual que ahora (clamp empieza en min).
2. **500×800** portrait — los componentes deben verse algo más grandes, sin hueco inferior gigante.
3. **640×900** portrait — más respiración aún, transición suave.
4. **768×1024 (vertical-tablet)** — los `vertical-tablet:` toman el control y aplican los valores grandes.
5. **horizontal-mobile (667×375)** y **horizontal-desktop (1280×550)** — no deben cambiar (estos breakpoints usan landscape, los clamps con `vw` afectan poco porque el frame del portrait no se renderiza).

Tomaré screenshots en 375, 500, 640 y 760 portrait para confirmar la transición fluida.

## Notas técnicas

- Los `clamp(min, preferred, max)` con `vw` son la herramienta canónica de fluid typography/spacing. El `vw` se evalúa contra el viewport real, no contra el contenedor portrait simulado, así que las constantes están calculadas para que a 375px el valor coincida con el actual `vertical-mobile:` y a 767px coincida con el actual base/`vertical-tablet:`.
- No se modifica `tailwind.config.ts` ni los breakpoints (workspace knowledge).
- No se modifican landscape ni vertical-tablet sin necesidad: solo se les añaden overrides explícitos cuando el clamp pudiera extender un valor que en tablet ya estaba bien.
