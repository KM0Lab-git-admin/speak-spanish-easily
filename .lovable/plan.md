## Objetivo

En **landscape** (`horizontal-mobile` y `horizontal-desktop`), reorganizar el modo Home para que:

- El **skyline** quede como **fondo absoluto** del scroll body (no ocupa flujo, no empuja contenido).
- Los **HomeModules** suban hasta justo debajo de la cabecera (~22% desde arriba), sobreimpresos sobre el skyline.
- Cabecera (escudo + Malgrat de Mar + KM0 LAB + campana) y resto del flujo (CTAs, Promos, Comercios, tab bar) se mantienen tal cual.

El **modo vertical (vertical-mobile + vertical-tablet) NO se toca**. Toda regla nueva irá prefijada con `horizontal-mobile:` / `horizontal-desktop:`.

## Cambios en `src/pages/Home.tsx`

### 1. Hero `<motion.section>` (la sección que envuelve skyline + cabecera)

- Mantener todo igual en vertical.
- En landscape: añadir `horizontal-mobile:absolute horizontal-mobile:inset-0 horizontal-mobile:pointer-events-none` (mismo para `horizontal-desktop:`) para sacarlo del flujo y que cubra todo el scroll body como fondo. La cabecera (overlay) se reactivará con `pointer-events-auto` solo donde es interactiva (la campana).

### 2. Div del fondo skyline (línea 185)

- Vertical: queda con su `aspect-[1920/716]` actual.
- Landscape: anular el aspect y darle altura completa: `horizontal-mobile:!aspect-auto horizontal-mobile:h-full horizontal-desktop:!aspect-auto horizontal-desktop:h-full`. Quitar el `h-[35dvh]/h-[42dvh]` previo.

### 3. Padding-top del scroll body en landscape

- Reservar espacio para la cabecera absoluta arriba: `horizontal-mobile:pt-[clamp(56px,12dvh,72px)] horizontal-desktop:pt-[clamp(64px,14dvh,88px)]`.
- Esto asegura que los módulos arrancan justo por debajo de la cabecera (la línea roja del usuario).

### 4. Sección HomeModules (línea 222-229)

- Vertical: mantener `-mt-8` (overlap actual con el hero).
- Landscape: anular ese margin negativo (`horizontal-mobile:mt-0 horizontal-desktop:mt-0`) ya que el skyline ya no está en el flujo.

### 5. Sin cambios en CTAs, Promos, Comercios, tab bar

- Su composición vertical actual sigue intacta. Al desaparecer el hueco que ocupaba el hero en flujo, todo el bloque sube de manera natural y queda mejor repartido.

## Resultado esperado en landscape

```text
┌──────────────────────────────────────────────┐
│ escudo Malgrat KM0LAB              campana   │  ← cabecera (overlay)
│ ─────────── línea roja del usuario ──────── │
│ [chat] [agenda] [ayunt.] [comercios]         │  ← HomeModules (sobre skyline)
│                                              │
│ [Iniciar sesión]    [Registro]               │
│                                              │
│ Promos y eventos destacados                  │
│ [─── banner ───]                             │
│                                              │
│ Esto es para ti                              │
│ [card] [card] [card]                         │
│                                              │
│ [Inicio] [Info] [Ofertas] [Perfil]           │  ← tab bar
└──────────────────────────────────────────────┘
       (skyline beige al fondo, opacity-25)
```

## Garantías de no-regresión vertical

- Todas las reglas nuevas usan exclusivamente prefijos `horizontal-mobile:` / `horizontal-desktop:`.
- Se mantiene el `aspect-[1920/716]`, el `-mt-8` de los módulos, y los spacers `vertical-mobile:flex-1` tal cual.
- Verificación con screenshot en las 4 resoluciones canónicas: 375×667, 768×1024, 667×375, 1280×550. Vertical debe quedar pixel-idéntico.

## Archivos a tocar

- `src/pages/Home.tsx` (3 ediciones puntuales en líneas 174-185, 195-218 y 222-228 aproximadamente).