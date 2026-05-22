# Home landscape — versión definitiva

## Problema actual

En landscape (667×375 y 1280×550) la Home reutiliza tal cual el apilado vertical del portrait. Resultado visible en la captura:

- El header + saludo + PointsCard ocupa casi toda la altura del viewport (≈300 de 375px).
- PointsCard se estira a todo el ancho y consume espacio que no necesita.
- "Accesos rápidos" aparece justo en el borde inferior, casi tapado por los BottomTabs.
- "Eventos destacados", "Descubre lo nuestro" y "Promos para ti" quedan totalmente bajo el fold.
- El texto del saludo y del nivel se corta o queda apretado.

El landscape necesita un layout propio, no una adaptación del portrait.

## Layout objetivo

Aprovechar la anchura: dos columnas con el header full-width arriba y BottomTabs full-width abajo. La izquierda concentra identidad (saludo, puntos, login). La derecha concentra el contenido funcional con scroll-y interno.

```text
┌──────────────────────────────────────────────────────────────┐
│ Header KM0 compacto: escudo · ciudad · KM0LAB · bell         │  ~44px
├────────────────────┬─────────────────────────────────────────┤
│ COL IZQ (~38%)     │ COL DER (~62%, scroll-y, sin scroll-x)  │
│ skyline de fondo   │                                         │
│                    │ Accesos rápidos (4 iconos en fila)      │
│ ¡Hola, Aina!       │                                         │
│ Gracias por...     │ Eventos destacados ── Ver todos →       │
│                    │ [carousel min-h-[120px]]                │
│ ┌──────────────┐   │                                         │
│ │ ★ 1259 pts   │   │ Descubre lo nuestro ── Ver todos →      │
│ │ Nivel Local  │   │ [comercios carousel]                    │
│ │ ▓▓▓▓▓░░ 3000 │   │                                         │
│ └──────────────┘   │ Promos para ti ── Ver todas →           │
│                    │ [cupones]                               │
│ [Iniciar sesión]   │                                         │
├────────────────────┴─────────────────────────────────────────┤
│ BottomTabs: Inicio · Información · Ofertas · Perfil          │  ~52px
└──────────────────────────────────────────────────────────────┘
```

Reglas concretas:

- Columna izquierda fija, sin scroll. Ancho `w-[38%]` (≈253px en 667, ≈487px en 1280). El skyline de Malgrat se mantiene como fondo recortado a la columna.
- PointsCard rediseñado en variante compacta (vertical, no full-width): icono + puntos arriba, barra de nivel debajo. Ya no se estira a 100% del frame.
- Saludo en dos líneas (`¡Hola, Aina!` + `Gracias por apoyar lo local`) con tamaño reducido (`text-base` en 667, `text-lg` en 1280).
- "Iniciar sesión" como CTA al pie de la columna izquierda, no flotando entre header y secciones.
- Columna derecha: scroll-y interno, `px-3 py-2 gap-3` en 667, `px-5 py-3 gap-4` en 1280. SectionHeader con tipografía reducida (`text-sm` en 667, `text-base` en 1280).
- BottomTabs full-width abajo, intacto.
- Nunca scroll-x en ninguna resolución.

## Reglas de aislamiento por breakpoint

- Solo se modifican `horizontal-mobile` (667×375) y `horizontal-desktop` (1280×550).
- `vertical-mobile` (375×667) y `vertical-tablet` (768×1024) quedan idénticos al actual. Visual diff = 0 en portrait.
- Tras el cambio, validar las 4 resoluciones Playwright. Aceptación:
  - 667×375: las 4 secciones de la columna derecha son alcanzables por scroll interno, la columna izquierda muestra saludo + PointsCard + Iniciar sesión sin recortes, BottomTabs visible sin solaparse.
  - 1280×550: mismo layout escalado con más aire, todo respira, sin scroll en la izquierda y scroll mínimo en la derecha.

## Detalles técnicos

Cambios concentrados, sin tocar lógica ni datos:

1. `src/components/HomeContent.tsx` — devolver dos árboles hermanos:
   - `landscape:hidden` → el contenido actual (portrait) tal cual.
   - `hidden landscape:flex flex-col` → nuevo layout landscape con header compacto arriba, grid de dos columnas en medio (`flex-1 flex min-h-0`), BottomTabs abajo.
2. `src/components/HomeHero.tsx` — añadir una variante `compact` (o nueva prop `landscapeCompact`) que en landscape renderice solo la fila escudo+ciudad+bell, sin greetingSlot, con `pb-1` en lugar de `pb-4`. El saludo y PointsCard se renderizan dentro de la columna izquierda, no como `greetingSlot`.
3. `src/components/PointsCard.tsx` — añadir variante `compact` que se active vía prop (`variant="compact"`) o vía clases `horizontal-mobile:` / `horizontal-desktop:` para mostrar el contenido apilado verticalmente en vez de en fila, sin estirar a 100% del frame.
4. La columna izquierda renderiza: `GreetingBlock` (reducido) + `PointsCard` compact + `LoginButton` (si `showLogin`). Fondo: gradiente actual + skyline recortado por overflow-hidden de la columna.
5. La columna derecha reusa los mismos componentes que el portrait (`HomeModules`, `EventHeroCarousel`, `ComercioCarousel`, `CouponCard`, `SectionHeader`) con paddings/gaps reducidos vía clases `horizontal-mobile:` / `horizontal-desktop:`.
6. No se tocan: `Home.tsx`, `HomeSandbox.tsx`, `BottomTabs`, `HomeModules`, `EventHeroCarousel`, `ComercioCarousel`, `CouponCard`, `GreetingBlock` (solo se reutilizan), ni la data en `src/data/`.

## QA post-cambio

- 375×667 portrait: idéntico al actual.
- 768×1024 portrait: idéntico al actual.
- 667×375 landscape: layout de dos columnas, saludo y puntos completos en la izquierda, secciones accesibles por scroll en la derecha, BottomTabs visible.
- 1280×550 landscape: mismo layout escalado, todo respira, tipografías más generosas.
