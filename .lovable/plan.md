## Objetivo

Convertir `src/pages/Home.tsx` (659 líneas, 6 componentes inline + 3 mocks + 3 interfaces) en una **página fina orquestadora** que solo gestiona estado y compone componentes. Cada componente extraído debe ser una **unidad aislada con props tipadas**, lista para tests unitarios y de integración, y portable a otro proyecto sin arrastrar dependencias de la página.

## Arquitectura final

### 1. Tipos compartidos — `src/types/`

```text
src/types/
  promo.ts        → interface Promo (id, title1/2/3, subtitle, gradient)
  comercio.ts     → interface Comercio (id, name, logo, bg)
```

(Los tipos `HomeModule` / `HomeModuleId` ya están en `src/components/HomeModules.tsx` — se mantienen donde están.)

### 2. Datos mock — `src/data/`

```text
src/data/
  promos.ts       → export const PROMOS: Promo[]
  comercios.ts    → export const COMERCIOS: Comercio[]
  homeModules.ts  → export const INITIAL_MODULES: HomeModule[]
```

Cada archivo exporta solo datos, sin lógica. Permite swap por fixtures en tests y por datos reales (API) en producción.

### 3. Componentes — `src/components/`

Cada componente: archivo propio, props tipadas, sin acceso a estado global de la página, sin imports de `src/pages/`. Acepta sus datos por props.

```text
src/components/
  HomeModules.tsx          (ya existe — sin cambios)
  NotificationBell.tsx     (ya existe — sin cambios)
  PromoCarousel.tsx        ← NUEVO. Props: { promos: Promo[] }
  ComercioCarousel.tsx     ← NUEVO. Props: { comercios: Comercio[]; perPage?: number }
  BottomTabs.tsx           ← NUEVO. Props: { activeTab, onTabChange, onLogin, onProfile, showProfile }
                              Incluye TabItem como subcomponente interno (no exportado).
  HomeHero.tsx             ← NUEVO. Header con escudo + nombre + KM0 logo + bell + login CTA.
                              Props: { cityName, hasAlerts, onToggleAlerts, showLogin, onLogin }
  PromoSection.tsx         ← NUEVO. Wrapper con título "Promos y eventos destacados" + PromoCarousel.
                              Props: { promos, title? }
  ComerciosSection.tsx     ← NUEVO. Wrapper con icono cupón + "Esto es para ti" + "Ver todos" + ComercioCarousel.
                              Props: { comercios, title?, onSeeAll? }
  HomeContent.tsx          ← NUEVO. Layout responsive (portrait + landscape) que compone Hero/Modules/PromoSection/ComerciosSection.
                              Props: las que hoy recibe el HomeContent interno.
```

### 4. Página final — `src/pages/Home.tsx`

Queda en ~80 líneas. Solo:
- Hooks (`useAuth`, `useNotifications`, `useNavigate`, `useState` para tab y módulos).
- Importa datos de `src/data/`.
- Renderiza el frame portrait/landscape + `<HomeContent />` + `<NotificationsOverlay />`.

## Beneficios para testing

| Tipo de test | Cómo se beneficia |
|---|---|
| **Unitario** de `PromoCarousel` | Renderizas con `promos={[fixture]}` y verificas dots, swipe, botones prev/next sin montar Home entera. |
| **Unitario** de `ComercioCarousel` | Pasas `perPage={2}` o `perPage={4}` y testeas paginación con distintas longitudes. |
| **Unitario** de `BottomTabs` | Mockeas `onTabChange` y verificas qué se invoca según `showProfile`. |
| **Integración** de `HomeContent` | Pasas todos los props mockeados y verificas composición sin hooks de auth/router. |
| **Pantalla completa** de `Home` | Solo aquí montas `BrowserRouter` + `QueryClient` + mocks de Supabase. |

Sin esta separación, cualquier test de `PromoCarousel` arrastra `useAuth`, `useNavigate` y `useNotifications`.

## Plan de ejecución (orden seguro)

1. **Crear tipos** en `src/types/promo.ts` y `src/types/comercio.ts`.
2. **Crear datos** en `src/data/promos.ts`, `src/data/comercios.ts`, `src/data/homeModules.ts`. Importan los tipos del paso 1.
3. **Extraer componentes "hoja"** (sin dependencias entre ellos):
   - `PromoCarousel.tsx`
   - `ComercioCarousel.tsx`
   - El `TabItem` queda dentro de `BottomTabs.tsx`.
4. **Extraer wrappers de sección**:
   - `PromoSection.tsx` (usa `PromoCarousel`)
   - `ComerciosSection.tsx` (usa `ComercioCarousel`)
   - `BottomTabs.tsx`
   - `HomeHero.tsx`
5. **Extraer `HomeContent.tsx`** componiendo todo lo anterior.
6. **Adelgazar `src/pages/Home.tsx`** a página orquestadora. Importa datos de `src/data/` y compone con `HomeContent`.
7. **Verificar visualmente** las 4 resoluciones canónicas (375×667, 768×1024, 667×375, 1280×550) — cero regresiones de layout.

## Lo que NO se toca

- `HomeModules`, `NotificationBell`, `NotificationsOverlay`, `Km0Logo` — ya están bien.
- Tokens del design system (`tailwind.config.ts`, `index.css`).
- Breakpoints oficiales.
- Lógica de auth, notificaciones o navegación.
- Estilos: cada componente conserva exactamente las clases Tailwind que ya tiene.

## Convenciones aplicadas

- **PascalCase** en archivos de componentes (`PromoCarousel.tsx`).
- **camelCase** en archivos de datos (`promos.ts`).
- Cada componente exporta `default` el componente y `named` su `interface Props`, para que los tests puedan tiparlos: `import PromoCarousel, { type PromoCarouselProps } from "@/components/PromoCarousel"`.
- Los datos mock se exportan como `const` tipados, no como funciones.

## Resultado esperado

- `Home.tsx`: ~80 líneas (orquestador).
- 8 componentes nuevos en `src/components/`, cada uno < 200 líneas y testeable en aislamiento.
- 3 archivos de datos en `src/data/` y 2 de tipos en `src/types/`.
- Cero cambios visuales en ninguno de los 4 breakpoints.
- Base lista para añadir `PromoCarousel.test.tsx`, `ComercioCarousel.test.tsx`, etc., y para portar componente a componente al proyecto km0lab (RN/Expo) sin arrastrar la página entera.
