## Objetivo

Refactorizar `src/components/HomeHero.tsx` para que **el gradiente beige y el skyline sean fondo del `<section>`**, y los componentes internos (header con escudo+KM0+bell y el `UserGreeting`) se apilen **en flujo normal de arriba a abajo** con `position: relative`. Así los márgenes/paddings/gaps funcionan de verdad entre ellos y desaparece la fragilidad de `top-[60px]`, `mb-[10px]` sobre absolutos, etc.

## Estructura propuesta

```text
<section class="relative ... [fondo gradiente + skyline]">
  ├── header row   (flex relative, padding propio)
  │     ├── escudo + cityName + KM0Logo
  │     └── LoginButton (landscape) + NotificationBell
  └── UserGreeting  (relative, con padding/margen propio)
</section>
```

Cambios concretos:

1. **Mover el gradiente al `<section>`**
   - Quitar el `<div className="relative w-full aspect-[1920/716] bg-gradient-to-b ...">` que actuaba como "fondo".
   - Añadir las clases de gradiente directamente al `motion.section`: `bg-gradient-to-b from-km0-beige-50 to-km0-beige-100`.

2. **Mover el skyline a fondo absoluto del `<section>`** (única excepción `absolute`, porque debe quedar *detrás* del contenido como capa de fondo)
   - Mantener el `<img>` del skyline con `absolute inset-0 ... -z-0 pointer-events-none opacity-25 object-contain object-bottom`.
   - El contenido encima irá con `relative z-10`.

3. **Header en flujo normal**
   - Quitar `absolute inset-x-0 top-0` y `mb-[10px]` del overlay actual.
   - Sustituir por `relative z-10 flex items-center justify-between gap-3` + paddings (`pl-2 pr-4 pt-4` portrait, ajustes por breakpoint).

4. **`UserGreeting` en flujo normal**
   - Quitar `absolute left-0 right-0 top-[60px] vertical-tablet:top-[72px] horizontal-mobile:top-[44px]`.
   - Envolver en `<div className="relative z-10 px-3 mt-2 vertical-tablet:mt-3">` (gap real entre header y greeting controlado por `mt-*`).
   - Eliminar el `bg-white/50` que se añadió para debug.

5. **Altura del Hero**
   - Quitar `min-h-[90px]` y los `aspect-[1920/716]` / `h-[78px]` que dependían del div de fondo.
   - La altura la dará el contenido (header + greeting + paddings). En landscape, donde el Hero estaba `absolute inset-0` ocupando todo, se mantiene ese comportamiento pero con el contenido apilado dentro vía `flex flex-col`.

6. **Variantes responsive (mantener comportamiento actual sin regresiones)**
   - `vertical-mobile` (≤767 portrait): paddings reducidos (`pt-2 pb-1`).
   - `vertical-tablet` (≥768 portrait): tamaños actuales del escudo (`w-14 h-14`) y KM0 (`h-5`).
   - `horizontal-mobile` (≤1279 landscape): escudo `w-7 h-7`, KM0 `h-3`, fila compacta (lo que ya estaba). El Hero sigue siendo `absolute inset-0` para superponerse al body en landscape, pero con contenido en flujo `flex-col`.
   - `horizontal-desktop` (≥1280 landscape): igual que horizontal-mobile pero con paddings algo mayores.

## Resultado esperado

- Cambiar `mt-2` → `mt-4` en el wrapper del `UserGreeting` separa de verdad header y saludo.
- Sin `top-[60px]` mágico que se descuadra si cambia el alto del header (p. ej. si el `cityName` ocupa 2 líneas).
- Skyline + gradiente siguen cubriendo todo el Hero como fondo.

## Verificación

- Revisar visualmente en las 4 resoluciones oficiales: 375×667, 768×1024, 667×375, 1280×550.
- Confirmar que en landscape el Hero sigue ocupando todo el frame como fondo del body (el `horizontal-mobile:absolute horizontal-mobile:inset-0` del section se mantiene).
- Confirmar que `pointer-events-none` del Hero en landscape sigue dejando clicar los módulos del body, y que header+greeting recuperan `pointer-events-auto`.

## Archivos afectados

- `src/components/HomeHero.tsx` (reescritura del JSX y clases; sin cambios de API/props).

No se tocan `HomeContent.tsx`, `UserGreeting.tsx` ni datos.