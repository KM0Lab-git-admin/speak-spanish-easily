# Proceso de maquetación responsive

Este proyecto se maqueta contra una matriz fija de resoluciones, no contra la
idea genérica de "mobile" o "desktop". Cada cambio visual tiene un contrato
verificable antes de aceptar el resultado, y ese contrato lo automatiza
Playwright (ver más abajo).

## Matriz oficial de viewports

La fuente de verdad está en `src/design-system/viewports.ts`. Cada viewport
tiene un **tier**:

- **contract** → la pantalla debe verse BIEN: composición, jerarquía,
  espaciados. Playwright captura screenshot y compara píxeles.
- **smoke** → la pantalla solo debe NO ROMPERSE: sin overflow lateral ni
  contenido inaccesible. No se invierte tiempo de diseño aquí.

| Viewport | Tamaño | Breakpoint | Tier | Uso |
| --- | ---: | --- | --- | --- |
| Mobile portrait base | 375×667 | `vertical-mobile` | contract | Contrato mínimo de usabilidad. |
| Mobile portrait moderno | 390×844 | `vertical-mobile` | contract | Comprueba aire vertical extra. |
| Mobile landscape base | 667×375 | `horizontal-mobile` | **smoke** | Solo no-rotura (ver decisión abajo). |
| Tablet portrait | 768×1024 | `vertical-tablet` | contract | Valida escalado vertical. |
| Tablet landscape | 1024×768 | `horizontal-mobile` | contract | Landscape amplio antes de desktop. |
| Desktop landscape | 1280×720 | `horizontal-desktop` | contract | Primer contrato desktop. |
| Desktop amplio | 1440×900 | `horizontal-desktop` | contract | Evita layouts demasiado estirados. |

> **Decisión de producto (2026-06): el móvil en landscape NO es un requisito.**
> Basta con que no haya overflow horizontal y todo el contenido sea accesible
> con scroll. NO se diseñan ni optimizan composiciones específicas para
> 667×375, y NO se acepta complejidad extra en el código solo para ese caso.
> Las pantallas que ya tienen layout landscape elaborado se mantienen, pero
> los cambios nuevos no están obligados a cuidarlo más allá del smoke test.

## Jerarquía de responsabilidades

1. **Frame de pantalla** (`ScreenFrame`, `SimulatedDevice`, shells de página):
   controla anchura, altura, `overflow`, safe area y breakpoint forzado en previews.
2. **Layout de página** (`HomeContent`, `HomeContentLandscape`, `Agenda`, `Chat`):
   decide columnas, filas, zonas con scroll y orden de bloques.
3. **Componente de sección** (`HomeHero`, `EventHeroCarousel`, `ComercioCarousel`):
   resuelve composición interna, espaciados y densidad dentro del espacio recibido.
4. **Componente atómico** (`CouponCard`, `PointsCard`, botones):
   no debería imponer alturas globales de pantalla ni reglas de layout de página.

## Orden obligatorio para cambios visuales

1. Identificar el bloque objetivo y qué nivel de la jerarquía controla el problema.
2. Mantener estable el contrato base portrait (`375×667`) y comprobar `390×844`.
3. Revisar tablet portrait (`768×1024`) y tablet landscape (`1024×768`).
4. Ajustar desktop (`1280×720`, `1440×900`) solo cuando los tamaños pequeños
   sean estables.
5. Smoke final en móvil landscape (`667×375`): sin overflow, contenido
   accesible. Nada más.
6. Evitar "parches cruzados": si una variante necesita un override, documentar por qué.

## Reglas de implementación

- Preferir layout fluido: `flex-1`, `min-h-0`, `min-w-0`, `overflow-auto` y `clamp()`.
- Evitar alturas fijas salvo en elementos realmente constantes (headers, barras, iconos).
- Si un bloque tiene que hacer scroll, debe haber una única zona scroll clara por pantalla.
- Usar los breakpoints oficiales: `vertical-mobile`, `vertical-tablet`,
  `horizontal-mobile`, `horizontal-desktop`.
- No introducir breakpoints ad hoc sin actualizar `src/design-system/viewports.ts`,
  `src/hooks/use-breakpoint.tsx` y `tailwind.config.ts`.
- Mantener el JSX legible: si una clase responsive se vuelve difícil de razonar,
  extraer un componente o una constante de clases.

## Registro de pantallas y estados (OBLIGATORIO)

`src/design-system/preview-manifest.ts` es la fuente única de pantallas y
estados visuales. La consumen `/preview-all` (catálogo visual) y Playwright
(regresión). **Una tarea que añade una pantalla nueva o un estado visual
nuevo (variante con más/menos componentes según sesión, datos o query param)
no está terminada hasta registrarlo en el manifest.** Detalle de cada estado
y cómo forzarlo: `docs/screen-states.md`.

## Validación automática (Playwright)

Matriz `pantallas × estados × viewports` definida por el manifest y
`viewports.ts`. Cada test comprueba: (1) sin overflow horizontal en TODOS los
viewports, (2) captura px-a-px contra baseline en los viewports `contract`
(salvo pantallas `dynamicContent`).

- `npm run test:visual:local` → en local: levanta el dev server y valida todo
  EXCEPTO las capturas (las baselines son de Linux/CI y en Windows difieren).
- `npm run test:visual` → en CI compara también las capturas. Se ejecuta en
  cada push/PR a `main` (`.github/workflows/visual-regression.yml`).
- Cambio visual **intencionado** → ejecutar a mano el workflow
  `visual-regression` en GitHub Actions con `update_baselines: true`; las
  baselines nuevas se commitean solas. Revisar el diff de imágenes en el PR.
- Informe con diffs: artifact `playwright-report` del workflow, o
  `npm run test:visual:report` en local.

## Checklist antes de aceptar una maqueta

- [ ] No hay scroll horizontal accidental en ningún viewport de la matriz.
- [ ] Los textos importantes no quedan cortados en `375×667`.
- [ ] Las tarjetas tienen `min-w-0` cuando viven dentro de grids/flex.
- [ ] Las zonas con scroll usan `min-h-0` en todos sus padres flex/grid.
- [ ] Desktop mejora la composición, pero no redefine el comportamiento base.
- [ ] Pantalla/estado nuevos registrados en `preview-manifest.ts`.
- [ ] `npm run build` y `npm run test:visual:local` pasan después del cambio.

## Prompts para Lovable

Plantillas completas y reglas de redacción: `docs/lovable-prompting-guide.md`.
