
## Objetivo

Crear una pantalla de **catálogo visual** que renderice todas las pantallas de la app (Language, Onboarding, PostalCode, Chat, Home, Agenda, Evento, Profile, Login, CheckEmail) dentro de "marcos" de tamaño FIJO equivalentes a las dos resoluciones mínimas de testing:

- **vertical-mobile** → `375 × 667` (portrait)
- **horizontal-mobile** → `667 × 375` (landscape)

Cada pantalla aparecerá DOS veces (una por orientación), lado a lado, para poder revisarlas de un vistazo sin tener que cambiar de viewport.

Empezamos por **Language** y, una vez validado el patrón, replicamos para el resto.

---

## Ruta y archivos

- Nueva ruta: `/preview-all` (registrada en `src/App.tsx`)
- Nueva página: `src/pages/PreviewAll.tsx`
- Nuevo componente envoltorio: `src/components/ScreenFrame.tsx`

No se toca ninguna pantalla existente.

---

## Cómo funciona `ScreenFrame`

Wrapper que recibe:
- `label`: nombre de la pantalla ("Language", "Agenda"…)
- `orientation`: `"portrait" | "landscape"`
- `children`: la pantalla a renderizar

Renderiza un `div` con tamaño FIJO en píxeles:
- portrait  → `width: 375px; height: 667px`
- landscape → `width: 667px; height: 375px`

Reglas clave:
- `overflow: hidden` y `position: relative` para que la pantalla embebida no desborde.
- Para que las pantallas detecten correctamente la orientación (sus `landscape:` queries de Tailwind dependen del **viewport real**, no del contenedor), el frame usa **`<iframe src="/idioma-suelto">`**. Esto garantiza que cada frame tenga su propio `window.matchMedia` con el aspect-ratio correcto.

```text
┌─────────────────────────────────────────────┐
│ Language                                    │
│ ┌───────────┐  ┌──────────────────────┐    │
│ │ 375×667   │  │ 667×375              │    │
│ │ portrait  │  │ landscape            │    │
│ │           │  │                      │    │
│ │           │  └──────────────────────┘    │
│ └───────────┘                              │
└─────────────────────────────────────────────┘
```

### Por qué iframe y no render directo

Las pantallas usan los breakpoints oficiales `vertical-mobile` / `horizontal-mobile` que se evalúan con `@media (orientation: portrait/landscape) and (max-width: …)`. Estas queries **solo miran el viewport del documento**, no el tamaño del contenedor padre. Si renderizamos `<Language />` dentro de un `div` de 667×375 en un viewport portrait, los estilos landscape NO se aplicarían.

Con un `<iframe>` cada pantalla obtiene su propio viewport del tamaño exacto del frame, y los breakpoints funcionan correctamente. Además aísla estilos globales y evita conflictos de routers anidados.

Para que esto funcione, cada pantalla debe ser accesible por URL (ya lo son: `/`, `/agenda`, `/evento`, `/profile`, etc.). El iframe simplemente apunta a la URL de cada pantalla.

---

## Estructura de `PreviewAll.tsx`

```text
PreviewAll
├── Header sticky con título "Preview · todas las pantallas"
└── Lista vertical de bloques, uno por pantalla:
    ├── <h2>Language</h2>
    └── <div flex gap-6>
        ├── <ScreenFrame label="375×667" orientation="portrait"  src="/" />
        └── <ScreenFrame label="667×375" orientation="landscape" src="/" />
```

En esta primera iteración solo se incluye Language (`src="/"`). Una vez aprobado, se añaden las demás (`/agenda`, `/evento`, `/profile`, `/chat`, `/onboarding`, `/postal-code`, `/login`, `/check-email`, `/home`).

---

## Detalles técnicos

- **Sin cambios** en pantallas existentes ni en breakpoints.
- El iframe usa atributos `width=375 height=667` (o `667/375`) y CSS `border: 0; display: block;`.
- Estilos del fondo de `PreviewAll`: gris claro neutro para que destaquen los frames.
- Etiqueta encima de cada frame con dimensiones para facilitar QA.
- Sin scroll horizontal: si los dos frames no caben en fila se apilan con `flex-wrap`.
- La página `/preview-all` no se enlaza desde la app; solo se accede manualmente.

---

## Alcance de esta primera entrega

1. Crear `ScreenFrame.tsx`.
2. Crear `PreviewAll.tsx` con SOLO Language en portrait + landscape.
3. Registrar la ruta `/preview-all` en `App.tsx`.

Después, en un segundo paso, añadiremos el resto de pantallas (una línea por pantalla, mismo patrón).
