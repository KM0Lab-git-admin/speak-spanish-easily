---
name: Móvil landscape no es requisito (solo no-rotura)
description: El viewport 667×375 (horizontal-mobile en móvil) es tier "smoke" — basta con que no se rompa; no se diseña ni se optimiza para él
type: preference
---
Decisión de producto (2026-06): el móvil en orientación landscape NO es un requisito real de la app. El viewport 667×375 pasa de contrato de diseño a smoke test.

**Why:** optimizar cada pantalla para 375px de alto cuesta mucha maquetación vertical (headers compactos, alturas dvh, layouts paralelos) y no aporta valor: los usuarios usan la app en portrait. El esfuerzo va a portrait + tablet + desktop.

**How to apply:**
- En 667×375 solo se exige: sin overflow horizontal y todo el contenido accesible mediante scroll. Nada más.
- NO añadir complejidad de código (layouts paralelos, overrides `horizontal-mobile:` elaborados) solo para mejorar móvil landscape.
- Los layouts landscape ya existentes (HomeContentLandscape, etc.) se mantienen, pero cambios nuevos no están obligados a extenderlos.
- `horizontal-mobile` sigue siendo contrato en TABLET landscape (1024×768): ahí sí debe verse bien.
- La fuente de verdad del tier de cada viewport es `src/design-system/viewports.ts` (campo `tier`).
