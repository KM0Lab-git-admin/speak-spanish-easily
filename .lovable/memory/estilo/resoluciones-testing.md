---
name: Matriz de viewports responsive
description: Matriz oficial de 7 viewports (contract + smoke) usada por Playwright y QA manual; fuente de verdad src/design-system/viewports.ts
type: preference
---
La fuente única de verdad es `src/design-system/viewports.ts` (consumida por `playwright.config.ts`). Detalle del proceso en `docs/responsive-layout-process.md`.

**Tier `contract`** (deben verse BIEN; Playwright compara píxeles):
- 375×667 → `vertical-mobile` — contrato base mobile-first
- 390×844 → `vertical-mobile` — aire vertical extra
- 768×1024 → `vertical-tablet` — escalado vertical
- 1024×768 → `horizontal-mobile` — landscape amplio
- 1280×720 → `horizontal-desktop` — primer contrato desktop
- 1440×900 → `horizontal-desktop` — desktop amplio

**Tier `smoke`** (solo no-rotura, NO se optimiza diseño):
- 667×375 → `horizontal-mobile` — móvil landscape NO es requisito (decisión de producto 2026-06): basta sin overflow ni contenido inaccesible.

**Reglas:**
- Mobile-first: el contrato base es 375×667 con clases SIN prefijo; overrides solo con prefijo de breakpoint oficial y solo donde la estructura cambia.
- Sin scroll horizontal en ningún viewport (excepción Chat scroll vertical interno).
- Cambios scoped por orientación y resolución: corregir una NUNCA toca clases base que afecten a otra.
- No introducir viewports ad hoc sin actualizar `viewports.ts` + `tailwind.config.ts` + `use-breakpoint.tsx`.
