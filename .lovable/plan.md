## Objetivo

Crear una página independiente `/components` dedicada al catálogo de componentes, reutilizando el mismo patrón visual de `/design-system` (top bar, sidebar de secciones, tarjetas blancas con borde beige, tipografía de marca).

`/design-system` queda como está: tokens, color, tipografía, spacing, breakpoints, animaciones, iconografía y export para IA. Los componentes desaparecen de allí y se enlazan a `/components`.

## Estructura de `/components`

Mismo chrome que Design System:
- Top bar sticky con "Volver" + título "KM0 LAB · Componentes" + botón "Copiar contexto IA componentes".
- Sidebar izquierdo con anchors por **categoría**.
- Main con secciones agrupadas.

### Categorías (= secciones del sidebar)

1. **Marca y layout** — `BrandedFrame`, `Km0Logo`, `FloatingDots`
2. **Navegación** — `BottomTabs`, `NavLink`, `LoginButton`
3. **Cabeceras** — `HomeHero`, `UserGreeting`, `ScreenTitle`, `NotificationBell`
4. **Home** — `HomeContent`, `HomeModules`, `PromoSection`, `PromoCarousel`, `ComerciosSection`, `ComercioCarousel`
5. **Agenda y evento** — `WhenTabs`, `EventCard`
6. **Chat** — `VoiceRecorder`
7. **Auth** — `SocialAuthButtons`
8. **Overlays** — `NotificationsOverlay`
9. **Idioma** — `LanguageCard`

Excluidos: `RequireAuth`, `TopLoadingBar` (técnicos) y `src/components/ui/*` (shadcn).

### Tarjeta por componente

```text
┌────────────────────────────────────────────────┐
│ ComponentName                    [categoría]   │
│ import { X } from "@/components/X"             │
│ Usado en: Home, Agenda                         │
│ ──────────────────────────────────────────────│
│ Descripción breve.                             │
│ ┌────────────────────────────────────────────┐ │
│ │           Preview en vivo                  │ │
│ │   (selector de variantes si aplica)        │ │
│ └────────────────────────────────────────────┘ │
│ Props · tabla (name · type · default · doc)    │
│ Responsive · chips por breakpoint con nota     │
│ Notas de uso · bullets                         │
└────────────────────────────────────────────────┘
```

## Archivos

1. **`src/design-system/componentsCatalog.ts`** (nuevo) — metadata tipada:
   ```ts
   type PropSpec = { name; type; required?; default?; description };
   type ResponsiveNote = { breakpoint; behavior };
   type ComponentSpec = {
     id; name; category; importPath; description;
     usedIn: string[]; props: PropSpec[];
     responsive: ResponsiveNote[]; notes?: string[];
   };
   ```
2. **`src/pages/Components.tsx`** (nuevo) — la página, con el mismo layout que `DesignSystem.tsx`. Importa los componentes reales para renderizar previews.
3. **`src/App.tsx`** — añadir `<Route path="/components" element={<Components />} />`.
4. **`src/pages/DesignSystem.tsx`** — quitar la sección `#components` actual (botones, inputs sueltos, BrandedFrame snippet) y dejar en su lugar un bloque con enlace destacado a `/components`. La entrada del sidebar pasa de "Componentes" a "Componentes →" con `href="/components"`.
5. **`src/design-system/aiContext.ts`** — añadir función `generateComponentsContext()` para el botón de copiar de la nueva página (no se mezcla con el contexto de tokens).

## Previews — detalles técnicos

- Previews con componentes reales importados; nada de capturas.
- Componentes que dependen del router ya están bajo `<BrowserRouter>` global.
- Componentes que solo cobran sentido dentro de `BrandedFrame` (`LanguageCard`, `ScreenTitle`) se previsualizan en un mini-frame contenedor con `max-w-sm` y `overflow-hidden`.
- Componentes anchos (`HomeHero`, `BottomTabs`) se renderizan dentro de un contenedor `max-w-[390px] mx-auto` para simular móvil.
- Cero scroll horizontal: previews siempre con `overflow-x-hidden`.
- Tokens semánticos en toda la página (sin hex crudos).

## Fuera de alcance

- No tocar APIs ni estilos de los componentes existentes.
- No documentar `components/ui/*` (shadcn).
- No añadir Storybook ni dependencias.

## Entrega por fases (sugerida)

Para no soltar 22 tarjetas de golpe:
- **Fase 1** (este turno tras aprobar): scaffolding de `/components` + catálogo de **Marca, Navegación, Agenda y Evento** (~7 componentes). Quitar la sección actual de DesignSystem y enlazar.
- **Fase 2**: Cabeceras + Home.
- **Fase 3**: Chat, Auth, Overlays, Idioma + export IA.

¿Te parece bien arrancar por la Fase 1 o prefieres que cubra los 22 de una sola tacada?
