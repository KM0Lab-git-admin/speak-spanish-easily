## Objetivo

Añadir un tercer estado al `HomeSandbox` (`reward-welcome`) que monta la Home registered y dispara automáticamente el overlay de recompensa de +500 pts ("¡Bienvenido!"). Sirve para visualizar el prompt de puntos ejecutado sobre la Home real.

## Cambios

### 1. Asset
- Esperar el PNG de estrella que vas a adjuntar y copiarlo a `src/assets/icon-star-rewards.png`. Si tarda, fallback temporal: reutilizar `src/assets/icon-hand-star.png`.

### 2. Tailwind (`tailwind.config.ts`)
Añadir en `theme.extend.keyframes` y `theme.extend.animation` los 4 keyframes del prompt: `pop-in`, `float-up`, `sparkle`, `wiggle` (y sus animations correspondientes). No tocar breakpoints.

### 3. Dependencia
- `canvas-confetti` + `@types/canvas-confetti`.

### 4. Componente `src/components/PointsRewardOverlay.tsx`
- Misma estructura que el prompt (overlay + tarjeta + estrella + sparkles + badge flotante + contador animado + confeti + botón "¡Genial!").
- **Colores mapeados a tokens KM0** (no hex crudos):
  - navy → `km0-blue-700`
  - amarillo → `km0-yellow-500`
  - coral → `km0-coral-400`
  - confeti: leer los HSL de `tailwind.config.ts` y convertir a hex en una constante local (canvas-confetti necesita hex, no clases).
- Tipografías: `font-brand` para el número de puntos, `font-ui` para el botón, `font-body` para el mensaje. Sin `font-bold/black` añadidos.
- Props: `points`, `message?`, `onClose`.
- Cierre por backdrop, botón y tecla Escape.

### 5. `HomeSandbox.tsx`
- Ampliar `HomeSandboxState` a `"guest" | "registered" | "reward-welcome"`.
- `reward-welcome` se comporta como `registered` (login oculto, perfil + puntos visibles) y monta `<PointsRewardOverlay points={500} message="¡Bienvenido!" />` la primera vez que el sandbox se monta con ese estado. Botón "¡Genial!" lo desmonta.
- No tocar `HomeContent` ni `HomeContentLandscape`.

### 6. Catálogo (`src/design-system/componentsCatalog.ts`)
- Añadir un preview extra de `HomeSandbox` con `state="reward-welcome"` para que aparezca en `/preview-all`.
- Añadir entrada propia para `PointsRewardOverlay` (preview con +500/"¡Bienvenido!").

## Fuera de alcance
- Conectarlo a flujos reales (registro, pedido, reto). Solo se monta el escenario de bienvenida.
- Hook `useRewardPoints` opcional del prompt: lo dejo para una iteración futura.

## Dudas resueltas
- Estado nuevo: solo `reward-welcome` (+500).
- Icono: el que adjuntes; mientras no llegue, fallback a `icon-hand-star.png`.
- Colores: tokens KM0 (no hex literales).
