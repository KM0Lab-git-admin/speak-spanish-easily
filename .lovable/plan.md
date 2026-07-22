## Objetivo

Poder abrir `/home-no-registrado` (y más adelante el resto de pantallas) con un **panel de preview** al lado que permita:
1. Cambiar el **estado** (guest / registered / reward-welcome…).
2. Cambiar la **resolución** (los 6 viewports de contrato: 375×667, 390×844, 768×1024, 1024×768, 1280×720, 1440×900).
3. Ver el **árbol de componentes** de esa pantalla (el mismo TREE que ya vive en `PreviewAll.tsx`), para poder señalar qué componente tocar.

Empezamos SOLO por Home no-registrado; después el mismo patrón se aplica al resto.

## Qué construyo

### 1. Extraer TREES y estados a fuente de verdad
- Mover el objeto `TREES` de `src/pages/PreviewAll.tsx` a `src/design-system/screen-trees.ts` (export `SCREEN_TREES: Record<string, string>`).
- `PreviewAll.tsx` pasa a importarlo (sin cambios visuales).

### 2. Nuevo componente `ScreenInspector`
Ruta: `src/components/ScreenInspector.tsx`. Es un layout de página con dos zonas:

```text
┌──────────────────────────────────────────────────────────┐
│ Header: título pantalla + selector estado + selector viewport │
├───────────────────────────┬──────────────────────────────┤
│                           │                              │
│   Frame de la pantalla    │   Árbol de componentes       │
│   (viewport elegido,      │   (pre/mono, scroll-y,       │
│    escalado para caber)   │    copiable)                 │
│                           │                              │
└───────────────────────────┴──────────────────────────────┘
```

Props:
- `screenId: string` (para leer `SCREEN_TREES[screenId]`)
- `title: string`
- `states: { id: string; label: string }[]`
- `defaultStateId: string`
- `renderScreen: (stateId: string) => ReactNode` — devuelve el contenido a meter en el frame (sin `DeviceShell`, el inspector pone el frame).

Comportamiento:
- Selector de estado y selector de viewport en el header (chips tipo PreviewAll).
- El estado y viewport se persisten en query params (`?state=...&vp=...`) para poder compartir enlace.
- El frame reutiliza `ScreenFrame` + escalado como en PreviewAll, así el tamaño es idéntico al resto del proyecto.
- Panel derecho: `<pre>` con `SCREEN_TREES[screenId]`, botón "Copiar" arriba, colapsable en viewports estrechos.
- En pantallas < `vertical-tablet`, el árbol pasa debajo del frame (stack vertical) para no romper la vista.

### 3. Ruta nueva `/inspect/home`
- Crear `src/pages/InspectHome.tsx` que usa `ScreenInspector` con:
  - `screenId="home"`
  - `states = [{id:"guest",label:"No registrado"},{id:"registered",label:"Registrado"},{id:"reward-welcome",label:"Reward welcome"}]`
  - `renderScreen(stateId)` → `<HomeSandbox state={stateId as HomeSandboxState} />` (mismo path que usa PreviewAll para los estados de Home, así garantiza equivalencia visual).
- Registrar la ruta en `src/App.tsx`: `/inspect/home`.
- `Home.tsx` y las rutas `/home-registrado` / `/home-no-registrado` **no se tocan** (siguen funcionando como hasta ahora).

### 4. Enlace de acceso
- Añadir un enlace "Inspect" en `/preview-all` sobre la tarjeta de Home que abra `/inspect/home` en nueva pestaña. Nada más de UI global por ahora.

## Qué NO hago en este paso

- No aplico el patrón al resto de pantallas todavía: solo Home. Una vez lo valides, replicamos `Inspect<Pantalla>` para Language, Onboarding, PostalCode, Chat, Agenda, etc.
- No modifico `HomeContent`, `HomeContentLandscape`, `HomeHero`, ni la lógica de auth.
- No añado nuevas dependencias.

## Detalles técnicos

- Viewport list: uso `VIEWPORTS` de `src/design-system/viewports.ts` filtrando los 6 de contract (excluyo el smoke 667×375, aunque queda disponible como opción con etiqueta "smoke" si lo necesitas).
- Escalado del frame: misma fórmula que PreviewAll (`scale` con transform-origin top-left dentro de un contenedor con ancho/alto calculado), para no romper el layout responsive de la pantalla.
- Persistencia en URL con `useSearchParams` (ya en uso en el repo).
- Registrar la nueva pantalla en `src/design-system/preview-manifest.ts` solo si hace falta para navegación; el TREE ya se comparte vía `SCREEN_TREES`.

## Checklist final antes de cerrar

- `/inspect/home?state=guest&vp=mobile-portrait-base` renderiza igual que Home no-registrado a 375×667 y muestra el árbol a la derecha.
- Cambiar de estado y viewport no recarga página y actualiza la URL.
- `/preview-all`, `/home`, `/home-registrado`, `/home-no-registrado` siguen igual.
