## Objetivo

Completar `/components` con TODOS los componentes propios del proyecto (22 en total), no solo los 8 actuales. Cada componente tendrá nombre, import path, descripción, preview en vivo, tabla de props y notas de responsive — para que puedas referirte a ellos por nombre cuando pidas cambios.

## Componentes a añadir (14 nuevos)

**Cabeceras**
- `HomeHero` — hero del Home (mascota + saludo + campana + login)
- `UserGreeting` — saludo dinámico según sesión
- `ScreenTitle` — título de pantalla dentro de BrandedFrame. **Documentar prop `onBack`** (si se pasa, muestra back amarillo a la izquierda del título — responde a tu pregunta del "giro").
- `NotificationBell` — campana con badge de no leídas

**Home**
- `HomeContent` — orquestador interno (portrait/landscape)
- `HomeModules` — grid de módulos activables
- `PromoSection` — sección "Ofertas destacadas"
- `PromoCarousel` — carrusel horizontal de promos
- `ComerciosSection` — sección "Comercios"
- `ComercioCarousel` — carrusel horizontal de comercios

**Chat**
- `VoiceRecorder` — botón micrófono (Web Speech API, stub en preview)

**Auth**
- `SocialAuthButtons` — Google / Apple

**Overlays**
- `NotificationsOverlay` — panel deslizante (con toggle abrir/cerrar en la preview)

**Idioma**
- `LanguageCard` — card de selección de idioma (preview dentro de mini-BrandedFrame con varios estados: idle / selected / disabled)

Excluidos: `RequireAuth`, `TopLoadingBar` (técnicos) y `components/ui/*` (shadcn).

## Trabajo

1. **`src/design-system/componentsCatalog.ts`** — añadir las 14 specs leyendo las props REALES de cada `src/components/*.tsx`. Cada spec con: id, categoría, importPath, descripción, usedIn, props (name · type · required · default · description), responsive en los 4 breakpoints oficiales, notas de uso.

2. **`src/pages/Components.tsx`** — añadir una tarjeta con preview en vivo por componente:
   - Anchos (`HomeHero`, `HomeContent`, `HomeModules`, carruseles, `NotificationsOverlay`) → contenedor `max-w-[390px] mx-auto overflow-x-hidden` con datos mock de `src/data/`.
   - Necesitan contexto de marca (`LanguageCard`, `ScreenTitle`) → mini-`BrandedFrame` envolvente.
   - `ScreenTitle` con 2 variantes: con `onBack` y sin él, para que se vea la diferencia.
   - `LanguageCard` con 3 variantes: normal, selected, disabled.
   - `NotificationsOverlay` con toggle local "Abrir / Cerrar".
   - `VoiceRecorder` y `SocialAuthButtons` con handlers no-op.

3. **`src/design-system/aiContext.ts`** — `generateComponentsContext()` ya recorre el catálogo, se actualiza solo. Verificar el markdown resultante.

## Fuera de alcance

- No tocar APIs ni estilos de componentes existentes.
- No añadir Storybook ni dependencias.
- No documentar `components/ui/*`.

## Entrega

Un solo turno: catálogo completo de los 22 componentes con previews y props, sidebar con todas las categorías pobladas.
