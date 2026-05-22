# Landscape Home — sin afectar Portrait

## Objetivo

Entregar una versión landscape definitiva del Home (referencia: captura `image-145.png` con layout 2 columnas) que **NO modifique absolutamente nada** del Portrait actual (375×667 ni 768×1024).

## Regla de oro (texto sugerido para tus instrucciones / memoria del proyecto)

Copia esto tal cual a `mem://estilo/aislamiento-landscape-vs-portrait` y referénciala desde el index:

> **Aislamiento Landscape ↔ Portrait.** Cuando se maquete o ajuste landscape (`horizontal-mobile` y/o `horizontal-desktop`), Portrait (`vertical-mobile` y `vertical-tablet`) debe quedar **byte a byte idéntico**. Reglas obligatorias:
> 1. **Prohibido** modificar clases base o clases con prefijos `vertical-mobile:` / `vertical-tablet:` en cualquier componente compartido. Solo se pueden añadir/cambiar clases con prefijo `horizontal-mobile:` / `horizontal-desktop:`.
> 2. **Prohibido** cambiar la firma, los defaults de props, el orden de renderizado o la estructura JSX de componentes compartidos (HomeHero, HomeContent, HomeModules, EventHeroCarousel, ComercioCarousel, CouponCard, PointsCard, GreetingBlock, BottomTabs, UserGreeting).
> 3. Si el landscape necesita una distribución radicalmente distinta (ej. 2 columnas), **crear un componente nuevo** `HomeContentLandscape.tsx` y renderizarlo solo dentro del frame landscape de `Home.tsx`. El frame portrait sigue usando `HomeContent` sin tocar.
> 4. `Home.tsx` ya tiene dos contenedores hermanos (`landscape:hidden` y `hidden landscape:flex`). Toda la divergencia visual vive ahí: portrait → `<HomeContent />`, landscape → `<HomeContentLandscape />`.
> 5. QA obligatorio tras cualquier cambio landscape: diff visual de las 4 resoluciones Playwright (375×667, 768×1024, 667×375, 1280×550). Las dos primeras deben dar diff = 0.

## Plan de implementación

### 1. Crear `src/components/HomeContentLandscape.tsx` (nuevo, aislado)

Componente espejo de `HomeContent` con la **misma interfaz `HomeContentProps`** (para que `Home.tsx` reutilice `sharedProps` sin cambios), pero con layout propio de 2 columnas inspirado en `image-145.png`:

```text
┌────────────────────────────────────────────────────────────────┐
│ Header full-width: escudo + Malgrat + KM0LAB · saludo center · bell │
├────────────────────────────────────────────────────────────────┤
│ PointsCard full-width (estrella + 1259 puntos + Nivel Local)   │
│                  [Iniciar sesión]  (solo si !user)             │
├──────────────────────────────┬─────────────────────────────────┤
│ COL IZQUIERDA (scroll-y)     │ COL DERECHA (scroll-y)          │
│ • Accesos rápidos (4 chips)  │ • Descubre lo nuestro (carousel)│
│ • Eventos destacados (card)  │ • Promos para ti (cupones)      │
├──────────────────────────────┴─────────────────────────────────┤
│ BottomTabs full-width                                          │
└────────────────────────────────────────────────────────────────┘
```

Detalle:
- Header reutiliza **piezas internas** (logo escudo, Km0Logo, NotificationBell, GreetingBlock) **sin pasar por `HomeHero`**, para no añadirle props nuevas a un componente compartido.
- PointsCard, HomeModules, EventHeroCarousel, ComercioCarousel, CouponCard, LoginButton se importan tal cual y se usan con sus props públicas actuales. Cero modificación a esos componentes.
- Las dos columnas internas usan `grid grid-cols-2 gap-3` + `overflow-y-auto` cada una. Sin scroll horizontal nunca.
- Tipografías compactas con `horizontal-mobile:` para 667×375 y un poco más de aire con `horizontal-desktop:` para 1280×550.

### 2. Editar `src/pages/Home.tsx` (cambio mínimo, 2 líneas)

- Importar `HomeContentLandscape`.
- Sustituir `<HomeContent {...sharedProps} />` **solo dentro del div `hidden landscape:flex`** por `<HomeContentLandscape {...sharedProps} />`.
- El div `landscape:hidden` (portrait) sigue usando `<HomeContent />` exactamente igual.

### 3. Lo que NO se toca (lista cerrada)

- `src/components/HomeContent.tsx`
- `src/components/HomeHero.tsx`
- `src/components/HomeModules.tsx`
- `src/components/EventHeroCarousel.tsx`
- `src/components/ComercioCarousel.tsx`
- `src/components/CouponCard.tsx`
- `src/components/PointsCard.tsx`
- `src/components/GreetingBlock.tsx`
- `src/components/BottomTabs.tsx`
- `src/components/LoginButton.tsx`
- `tailwind.config.ts` (breakpoints intocables)
- Cualquier archivo en `src/data/`

### 4. QA post-cambio

Capturas en las 4 resoluciones Playwright:
- 375×667 portrait → **debe coincidir pixel a pixel** con el estado actual.
- 768×1024 portrait → **debe coincidir pixel a pixel** con el estado actual.
- 667×375 landscape → nuevo layout 2 columnas, sin scroll-x, BottomTabs visible.
- 1280×550 landscape → mismo layout escalado, respira mejor.

Si las dos primeras divergen aunque sea 1px → bug, revertir y volver al plan.

## Resumen

Un solo archivo nuevo (`HomeContentLandscape.tsx`) + 2 líneas cambiadas en `Home.tsx`. Cero ediciones en componentes compartidos. Portrait queda blindado por construcción, no por disciplina.
