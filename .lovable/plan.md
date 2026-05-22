# Versión landscape del Home

Hoy en landscape (667×375 y 1280×550) se reutiliza el mismo apilado vertical del portrait dentro del frame fijo de teléfono. Resultado: el header con escudo + saludo + PointsCard ocupa casi toda la altura visible y todas las secciones (Accesos rápidos, Eventos, Comercios, Promos) quedan debajo del fold y se acceden por scroll vertical largo. Mala lectura, mucho desperdicio horizontal.

La propuesta es darle al landscape un layout propio de dos columnas, pensado para 667×375 y escalando bien a 1280×550, manteniendo intacto el portrait.

## Layout objetivo

```text
┌──────────────────────────────────────────────────────────────┐
│ Header KM0 compacto (escudo + ciudad + KM0LAB + bell)        │
├────────────────────────┬─────────────────────────────────────┤
│ COL IZQUIERDA (≈40%)   │ COL DERECHA (≈60%, scroll-y)        │
│                        │                                     │
│ Saludo "¡Hola Aina!"   │ Accesos rápidos (4 iconos en fila)  │
│ PointsCard (1259 p)    │                                     │
│ [Iniciar sesión]       │ Eventos destacados (carousel)       │
│ (skyline de fondo      │                                     │
│  recortado a la card)  │ Descubre lo nuestro (comercios)     │
│                        │                                     │
│                        │ Promos para ti (cupones)            │
├────────────────────────┴─────────────────────────────────────┤
│ BottomTabs (Inicio · Información · Ofertas · Perfil)         │
└──────────────────────────────────────────────────────────────┘
```

- Columna izquierda: marca + identidad del usuario. Fija (no scrollea), siempre visible. Reúne el "quién soy y cuántos puntos llevo" + el CTA de login si no hay sesión.
- Columna derecha: contenido funcional, scroll-y interno, sin scroll-x. Permite ver Accesos rápidos sin perder el saludo y los puntos.
- Header KM0 y BottomTabs se mantienen full-width arriba y abajo, idénticos al patrón actual.

## Reglas de aislamiento por breakpoint

- Solo se tocan los breakpoints `horizontal-mobile` y `horizontal-desktop`.
- `vertical-mobile` (375×667) y `vertical-tablet` (768×1024) quedan EXACTAMENTE como están hoy. Cero cambios visuales en portrait.
- Validar las 4 resoluciones Playwright tras el cambio.

## Detalles técnicos

Cambios concentrados en `src/components/HomeContent.tsx`:

1. Renderizar dos árboles hermanos: el actual (portrait) envuelto en `landscape:hidden`, y uno nuevo en `hidden landscape:flex` con el grid de dos columnas.
2. La columna izquierda usa `HomeHero` con `inline`, `showGreeting={false}` y el mismo `greetingSlot` (GreetingBlock + PointsCard) que ya existe, más el `LoginButton` cuando `showLogin` esté activo. Ancho: `w-[40%]`, sin scroll, separador derecho sutil con `border-r border-km0-beige-200`.
3. La columna derecha es un `flex-1 overflow-y-auto overflow-x-hidden` con las 4 secciones (Accesos rápidos, Eventos, Comercios, Promos) reutilizando los componentes ya existentes (`HomeModules`, `EventHeroCarousel`, `ComercioCarousel`, `CouponCard`, `SectionHeader`). Padding compacto: `px-3 py-2 gap-3`.
4. En `horizontal-mobile` (667×375) reducir tipografías de section headers a `text-xs` y compactar el carousel de eventos a la altura mínima ya definida (120px). En `horizontal-desktop` (1280×550) escalar a `text-sm`/`text-base` y permitir más aire (`gap-4`).
5. Header KM0 sigue arriba (HomeHero parte superior, sin greetingSlot en landscape porque el saludo va dentro de la columna izquierda) o, alternativa más limpia: el HomeHero entero se renderiza dentro de la columna izquierda y el header superior solo lleva el escudo + bell. Decisión: usar HomeHero completo dentro de la columna izquierda y NO repetir header arriba, así se gana altura. El bell se mueve al top-right absoluto del frame.
6. `BottomTabs` se queda como hoy, full-width abajo. No se duplica.

No se tocan: `HomeHero`, `HomeModules`, `EventHeroCarousel`, `ComercioCarousel`, `CouponCard`, `PointsCard`, `GreetingBlock`, `BottomTabs`, `Home.tsx`, `HomeSandbox.tsx`, ni la data en `src/data/`.

## QA post-cambio

- 375×667 portrait: idéntico al actual (visual diff = 0).
- 768×1024 portrait: idéntico al actual.
- 667×375 landscape: dos columnas, columna izquierda fija con saludo + puntos + login, derecha con scroll de secciones, sin scroll-x, BottomTabs visible.
- 1280×550 landscape: mismo layout escalado, todo respira.
