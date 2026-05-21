## Objetivo

En `/preview-all`, mostrar la Home en portrait (375×667) y landscape (667×375) **sin iframes**, para que Visual Edit pueda seleccionar y editar elementos directamente. Las demás pantallas seguirán con iframe hasta que repitamos el patrón.

## Problema técnico que resolvemos

Los iframes existen porque los breakpoints (`vertical-mobile`, `landscape:`, etc.) son **media queries** que dependen del viewport del navegador. Sin iframe, un `<div style="width:375px">` no activa `vertical-mobile`: todos los frames cogerían `horizontal-desktop` (viewport real 1468px).

La solución: un **contexto que fuerza el breakpoint** + un hook `useBreakpoint()` que respeta ese override + un pequeño refactor de los componentes de Home para usar `cn()` con clases condicionales en vez de los modificadores responsive de Tailwind.

## Cambios

### 1. Contexto de breakpoint forzado
- Nuevo archivo `src/hooks/use-breakpoint.tsx`: añadir `<BreakpointProvider value="vertical-mobile">` y modificar `useBreakpoint()` para que, si está dentro de un Provider, devuelva ese valor en lugar de leer media queries.
- No rompe nada: si no hay Provider (uso normal en `/home`, `/chat`, etc.), funciona igual que ahora.

### 2. Wrapper `<SimulatedDevice>`
- Nuevo `src/components/SimulatedDevice.tsx`: pinta un marco de tamaño fijo (375×667 o 667×375) con borde y sombra (igual look que `ScreenFrame`), y envuelve sus children en `<BreakpointProvider value={...}>`.
- Props: `orientation: "portrait" | "landscape"`, `label?: string`, `children`.

### 3. Refactor mínimo en la subárbol de Home
Los componentes que usan variantes `landscape:` / `vertical-mobile:` / `horizontal-mobile:` / `horizontal-desktop:` para layout deben pasar a leer el breakpoint vía hook:
- `src/components/HomeContent.tsx` — sustituir las clases responsive de espaciado por `cn()` con `useBreakpoint()`.
- `src/components/HomeHero.tsx` — idem (header del skyline).
- `src/components/GreetingBlock.tsx`, `PointsCard.tsx`, `EventHeroCarousel.tsx`, `CouponCard.tsx`, `BottomTabs.tsx`, `HomeModules.tsx`, `ComercioCarousel.tsx`, `SectionHeader` interno — solo los que usen variantes responsive de Tailwind. Los que no, intactos.
- Las clases que **no son responsive** (colores, tipografía, paddings base) se quedan tal cual.

Para el `<Home>` real (`/home`) no cambia nada visualmente: el hook devuelve el breakpoint del viewport como hasta ahora.

### 4. `/preview-all` — sección Home sin iframes
En `src/pages/PreviewAll.tsx`, reemplazar los dos `<ScreenFrame src="/home" ... />` de la Home por:

```tsx
<SimulatedDevice orientation="portrait" label="Home">
  <HomeSandbox />
</SimulatedDevice>
<SimulatedDevice orientation="landscape" label="Home">
  <HomeSandbox />
</SimulatedDevice>
```

Donde `HomeSandbox` es un wrapper minimal que monta `<HomeContent />` con datos mock (los mismos `PROMOS`, `COMERCIOS`, `COUPONS`, `INITIAL_MODULES` que usa `pages/Home.tsx`) y estado local básico (`useState` para tab y notif). Sin `useAuth` ni `useNavigate` para evitar dependencias laterales.

El resto de pantallas en `/preview-all` (Chat, Agenda, Login, etc.) **se quedan con iframe** en esta iteración.

## Validación

- En `/home` (1468×1214): se renderiza igual que ahora (hook lee viewport real → `horizontal-desktop`).
- En `/preview-all`: dos marcos Home sin iframe, uno portrait y otro landscape, con el layout correcto en cada uno gracias al contexto.
- Visual Edit: clicar dentro de los marcos selecciona componentes reales (GreetingBlock, PointsCard, EventHeroCarousel…).

## Siguiente paso (no incluido)

Si la prueba en Home funciona, replicar el patrón en Chat, Agenda y resto de pantallas de `/preview-all` (refactor incremental, una pantalla por iteración).
