## Objetivo

En el Home, fijar `HomeHero` arriba y `BottomTabs` abajo en las 4 resoluciones, y repartir los componentes intermedios (Login CTA — solo portrait —, `HomeModules`, `PromoSection`, `ComerciosSection`) con distribución equitativa flex, sin scroll, ocupando todo el espacio entre hero y tabs.

## Estado actual (resumen)

- **Portrait**: el frame del Home es `flex flex-col`. `HomeHero` vive **dentro** del scroll body de `HomeContent` (scrollea con el contenido). `BottomTabs` ya queda anclado abajo (`shrink-0`).
- **Landscape**: `HomeHero` está posicionado **`absolute inset-0`** como fondo del scroll body, y los módulos/promos/comercios se solapan encima con `relative z-10`. El hero NO es una franja superior fija, es la imagen de fondo de toda la zona de contenido.

El cambio aprobado implica **rediseñar el landscape**: dejar de usar el hero como fondo absoluto y convertirlo en una franja superior fija (igual que portrait). El bloque inferior (promos + comercios en 2 columnas) y los módulos quedan distribuidos verticalmente con `justify-evenly` en el espacio restante.

## Cambios

### 1. `src/components/HomeContent.tsx` — Reestructurar layout

Reemplazar el actual scroll body único por una estructura de **3 zonas fijas**:

```text
┌───────────────────────────┐
│  HomeHero  (shrink-0)     │  ← fijo arriba, altura natural
├───────────────────────────┤
│  Middle    (flex-1)       │  ← flex-col justify-evenly
│   · LoginButton (portrait)│
│   · HomeModules           │
│   · PromoSection          │
│   · ComerciosSection      │
├───────────────────────────┤
│  BottomTabs (shrink-0)    │  ← fijo abajo (ya lo está)
└───────────────────────────┘
```

- Quitar `flex-1 min-h-0 overflow-y-auto` del wrapper actual; el frame externo ya es `flex flex-col` con altura fija.
- `HomeHero`: envolver en un contenedor `shrink-0` (en landscape también, sin `absolute`).
- `Middle`: `flex-1 min-h-0 flex flex-col justify-evenly overflow-hidden` con un `gap` proporcional (`gap-[clamp(8px,2vh,20px)]`).
- En landscape, mantener la rejilla de 2 columnas para PromoSection + ComerciosSection dentro del bloque Middle, pero ahora como un único hijo del flex que ocupa una "fila" del reparto vertical.

### 2. `src/components/HomeHero.tsx` — Quitar modo "fondo absoluto"

- Eliminar las clases `horizontal-mobile:absolute horizontal-mobile:inset-0 horizontal-mobile:pointer-events-none` (y equivalentes `horizontal-desktop:`).
- Eliminar también las variantes que forzaban `aspect-auto h-full` en landscape (el hero pasa a ser una banda con altura natural, no toda la pantalla).
- El skyline + escudo + nombre + KM0 + login + bell quedan dentro de la franja, no flotando sobre el contenido.
- Ajustar la altura del fondo en landscape para que sea proporcional (ej. `horizontal-mobile:h-[22%]` no — preferimos altura natural compacta vía padding y `aspect` controlado).

### 3. `src/components/HomeModules.tsx`, `PromoSection.tsx`, `ComerciosSection.tsx`

- Quitar márgenes verticales propios (`mt-*`, `mb-*`, `my-*`) en los wrappers `<section>` y dejar que el `gap` + `justify-evenly` del padre haga todo el trabajo. Mantener solo padding **horizontal**.
- En landscape, `PromoSection` y `ComerciosSection` ya no necesitan `h-full` porque su contenedor padre les da una fila concreta del reparto.
- Limpiar variantes `horizontal-mobile:!mt-*` / `horizontal-desktop:mt-*` que ya no aplican.

### 4. Login CTA portrait

- Sigue siendo un hijo del bloque Middle solo en portrait (`landscape:hidden`), sin márgenes propios.

## Garantías

- Sin scroll vertical en las 4 resoluciones (375×667, 768×1024, 667×375, 1280×550).
- Espaciado simétrico entre Hero→Modules→Promos→Comercios→Tabs gracias a `justify-evenly`.
- Aislamiento por breakpoint: el reparto se hace con la misma técnica en las 4, ajustando solo el `gap` con `clamp` para que escale.

## Detalles técnicos

- Frame externo (en `Home.tsx`) ya define la altura fija del "móvil/landscape" — no se toca.
- `overflow-hidden` en el bloque Middle para garantizar que si en alguna resolución el contenido es ligeramente mayor, se recorte en lugar de generar scroll. Validaremos visualmente las 4 resoluciones tras el cambio.
- Las animaciones Framer Motion existentes en cada sección se conservan.

## Verificación

Tras implementar, revisar en preview a 375×667, 768×1024, 667×375 y 1280×550 que:
- Hero y Tabs no se mueven al cambiar contenido.
- Los espacios entre los 3-4 bloques intermedios son visualmente equivalentes.
- No aparece scroll.
