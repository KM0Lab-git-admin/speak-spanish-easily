
# Layout horizontal — Pantalla de selección de idioma

## Objetivo

Adaptar `src/pages/Index.tsx` para que, cuando el dispositivo esté en **orientación horizontal** (o pantallas anchas y bajas), los mismos componentes (logo KM0, mascota con FloatingDots y las 3 LanguageCards) se reorganicen en **dos columnas** en lugar de apilarse verticalmente. La versión vertical (móvil portrait) se mantiene exactamente igual.

## Estrategia de detección

Usaremos un hook propio `useOrientation` (o un media query Tailwind con la variante `landscape:`) para diferenciar:

- **Portrait / vertical**: layout actual sin cambios.
- **Landscape / horizontal**: layout en dos columnas.

Tailwind ya soporta `landscape:` y `portrait:` de forma nativa, así que lo más limpio es usar esas variantes directamente en las clases. No hace falta JS adicional.

## Diseño propuesto (landscape)

```text
┌──────────────────────────────────────────────────────────┐
│  [Km0Logo centrado arriba, compacto]                     │
├──────────────────────────────┬───────────────────────────┤
│                              │                           │
│   ·  · FloatingDots ·        │   ┌─────────────────────┐ │
│      ┌──────────┐            │   │ 🇪🇸  Català        →│ │
│      │  ROBOT   │            │   └─────────────────────┘ │
│      │ flotando │            │   ┌─────────────────────┐ │
│      └──────────┘            │   │ 🇪🇸  Español       →│ │
│   ·         ·  ·             │   └─────────────────────┘ │
│                              │   ┌─────────────────────┐ │
│                              │   │ 🇬🇧  English (off) →│ │
│                              │   └─────────────────────┘ │
└──────────────────────────────┴───────────────────────────┘
```

- **Columna izquierda (≈45%)**: mascota + FloatingDots, centrada vertical y horizontalmente.
- **Columna derecha (≈55%)**: las 3 LanguageCards apiladas y centradas verticalmente.
- **Logo KM0**: en una franja superior reducida (altura menor que en vertical para ahorrar espacio), centrado.
- Ancho máximo del contenedor ampliado a `max-w-[760px]` solo en landscape (en vertical sigue siendo `max-w-[390px]`).

## Cambios técnicos

Único archivo modificado: **`src/pages/Index.tsx`**

1. **Contenedor raíz**
   - Reemplazar `pt-3 pb-6` por padding adaptativo: `landscape:py-2 portrait:pt-3 portrait:pb-6`.
   - Cambiar `items-start` por `items-start landscape:items-center` para que en landscape el bloque quede centrado verticalmente.

2. **Wrapper interno**
   - Ancho: `max-w-[390px] landscape:max-w-[760px]`.
   - Altura: quitar el `h-[620px]` fijo en landscape (`landscape:h-auto`) para que se adapte al alto disponible.
   - Cambiar `gap-8` por `gap-4 landscape:gap-3`.

3. **Logo**
   - Mantener centrado, pero reducir altura en landscape: `h-9 landscape:h-7`.
   - Reducir altura del wrapper: `h-11 landscape:h-9`.

4. **Bloque de dos columnas (mascota + cards)**
   - Envolver mascota y cards en un nuevo `<div>` con clases:
     `flex flex-col gap-8 landscape:flex-row landscape:gap-6 landscape:items-center landscape:flex-1`.
   - Mascota: añadir `landscape:flex-1 landscape:h-full landscape:max-h-[280px]` y reducir tamaño del robot en landscape (`h-56 landscape:h-44`).
   - Bloque de cards: añadir `landscape:flex-1 landscape:justify-center landscape:flex landscape:flex-col`.

5. **LanguageCards**
   - No requieren cambios internos; los paddings actuales (`px-4 py-4`) ya funcionan bien al estrecharse la columna.
   - Reducir `gap-3` entre cards a `landscape:gap-2` para que entren las 3 sin scroll.

## Comportamiento en otros dispositivos

- **Móvil portrait** (390×844, etc.): sin cambios visuales, sigue idéntico al actual.
- **Móvil landscape** (≈844×390): aplica el nuevo layout en dos columnas.
- **Tablet portrait/landscape**: hereda el layout según orientación, con el ancho limitado a 760px máx.
- **Desktop**: se ve siempre como landscape al ser pantalla ancha y baja en proporción → layout dos columnas centrado.

## Lo que NO se toca

- `LanguageCard.tsx`: sin cambios.
- `FloatingDots.tsx`: sin cambios (ya es `absolute inset-0`, se adapta solo).
- `Km0Logo.tsx`: sin cambios.
- Lógica de navegación, estado `selected`, animaciones de entrada: idénticos.
- Resto de pantallas (Onboarding, PostalCode, Chat): se abordarán en pasos siguientes una a una.

## Próximos pasos (después de esta)

Una vez aprobado y aplicado este, seguimos con:
1. Onboarding horizontal
2. PostalCode horizontal
3. Chat horizontal (el más complejo: sidebar + área conversación)

¿Apruebas este plan para empezar por la selección de idioma?
