# Landscape Home — un solo componente, Portrait blindado por regla

## Objetivo

Entregar una versión landscape definitiva del Home (referencia: `image-145.png`, layout 2 columnas) reusando el mismo `HomeContent.tsx`, sin duplicar archivos, y sin afectar Portrait (375×667 ni 768×1024).

## Regla de oro (texto para añadir a la memoria del proyecto)

Guardar en `mem://estilo/aislamiento-orientacion` y referenciar desde el index como Core:

> **Aislamiento por orientación al maquetar responsive.**
> Cuando un cambio aplica solo a una orientación (portrait o landscape), está PROHIBIDO modificar:
> 1. Clases base de Tailwind (las que no llevan prefijo de breakpoint).
> 2. Clases con prefijo de la orientación que NO se está tocando.
>
> Reglas concretas:
> - Cambio solo-landscape → solo se añaden o editan clases con prefijo `horizontal-mobile:`, `horizontal-desktop:` o `landscape:`. NO se tocan clases base ni `vertical-mobile:` / `vertical-tablet:`.
> - Cambio solo-portrait → simétrico: solo `vertical-mobile:`, `vertical-tablet:` o `portrait:`. NO clases base ni `horizontal-*:`.
> - Para reordenar bloques en landscape sin romper portrait: usar `flex-col landscape:grid landscape:grid-cols-2` + `order-*` con prefijo landscape. El flujo natural del DOM lo dicta portrait.
> - Si una clase base necesita cambiar de verdad (caso raro), verificar antes que el nuevo valor sigue siendo correcto en los 4 breakpoints Playwright (375×667, 768×1024, 667×375, 1280×550). Si no, mover el valor antiguo al prefijo opuesto antes de cambiar la base.
> - QA obligatorio tras cualquier cambio responsive: capturas en las 4 resoluciones. La orientación no tocada debe dar diff visual = 0.

## Plan de implementación

Todo el trabajo concentrado en `src/components/HomeContent.tsx`. Cero archivos nuevos. Cero cambios en componentes hijos (`HomeHero`, `HomeModules`, `EventHeroCarousel`, `ComercioCarousel`, `CouponCard`, `PointsCard`, `GreetingBlock`, `BottomTabs`, `LoginButton`). Cero cambios en `Home.tsx`.

### Layout objetivo en landscape

```text
┌──────────────────────────────────────────────────────────────┐
│ Header: escudo + Malgrat + KM0LAB · saludo centrado · bell   │
├──────────────────────────────────────────────────────────────┤
│ PointsCard full-width (estrella · 1259 · Nivel Local)        │
│              [Iniciar sesión]  (solo si !user)               │
├────────────────────────────┬─────────────────────────────────┤
│ COL IZQUIERDA (scroll-y)   │ COL DERECHA (scroll-y)          │
│ · Accesos rápidos          │ · Descubre lo nuestro           │
│ · Eventos destacados       │ · Promos para ti                │
├────────────────────────────┴─────────────────────────────────┤
│ BottomTabs full-width                                        │
└──────────────────────────────────────────────────────────────┘
```

Portrait sigue idéntico al actual: header con saludo + puntos dentro del hero, body con scroll-y y las 4 secciones apiladas.

### Cambios técnicos en `HomeContent.tsx`

1. **`greetingSlot` del `HomeHero`**: el saludo y la PointsCard pasan a renderizarse con `flex-col landscape:hidden` (saludo) + `hidden landscape:flex landscape:items-center landscape:justify-center` (saludo en línea para landscape). PointsCard se mueve fuera del hero en landscape usando `order-*` y `landscape:px-3`. Alternativa más simple: dejar `greetingSlot` solo para portrait con `landscape:hidden`, y en landscape renderizar saludo + PointsCard como primer bloque del body (también con `hidden landscape:flex`).
2. **Contenedor de las 4 secciones**: cambiar
   `flex flex-col gap-4 ... px-2 pt-3 pb-5`
   por
   `flex flex-col gap-4 ... landscape:grid landscape:grid-cols-2 landscape:gap-x-3 landscape:gap-y-2 px-2 pt-3 pb-5 horizontal-mobile:!pt-2 horizontal-mobile:!pb-3`
3. **Orden en landscape** (con `order-*` solo prefijados):
   - Accesos rápidos: `landscape:order-1`
   - Eventos destacados: `landscape:order-2` (queda debajo de Accesos en col izquierda)
   - Descubre lo nuestro: `landscape:order-3` (arriba col derecha)
   - Promos para ti: `landscape:order-4` (debajo col derecha)
   En CSS grid de 2 columnas con orden 1,2,3,4 el flujo natural ya rellena izquierda→derecha por filas. Para forzar col-fill ("1 y 2 izquierda, 3 y 4 derecha") se usa `landscape:grid-flow-col landscape:grid-rows-2` en el contenedor.
4. **Tipografías y paddings landscape**: ajustes con `horizontal-mobile:!text-xs` para 667×375 y `horizontal-desktop:!text-sm` para 1280×550 donde haga falta (SectionHeader, separación entre secciones). Sin tocar clases base.
5. **Scroll**: el body sigue siendo `flex-1 min-h-0 overflow-y-auto overflow-x-hidden`. En landscape el grid de 2 columnas vive dentro de ese mismo scroll-y, no se crean scrolls anidados.

### Lo que NO se toca

- Cualquier clase sin prefijo dentro de `HomeContent.tsx` que ya estuviera funcionando en portrait.
- Cualquier clase `vertical-mobile:` o `vertical-tablet:` existente.
- Todos los componentes hijos listados arriba.
- `Home.tsx`, `tailwind.config.ts`, `src/data/`.

## QA post-cambio

Capturas obligatorias en las 4 resoluciones Playwright:
- 375×667 portrait → **diff visual = 0** vs estado actual.
- 768×1024 portrait → **diff visual = 0** vs estado actual.
- 667×375 landscape → nuevo layout 2 columnas, BottomTabs visible, sin scroll-x.
- 1280×550 landscape → mismo layout escalado, respira.

Si portrait diverge aunque sea 1px → bug, revertir esa clase concreta.
