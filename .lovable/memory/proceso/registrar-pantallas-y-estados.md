---
name: Registrar pantallas y estados en preview-manifest
description: Toda pantalla nueva o estado visual nuevo (variantes según sesión/datos/params) debe registrarse en src/design-system/preview-manifest.ts — alimenta /preview-all y la regresión visual de Playwright
type: preference
---
`src/design-system/preview-manifest.ts` es la fuente única de verdad de pantallas y estados visuales. La consumen el catálogo `/preview-all` y los tests de Playwright (`tests/visual/screens.spec.ts`). Una tarea que crea una pantalla o un estado visual NO está terminada hasta registrarlo ahí.

**Why:** si una pantalla/estado no está en el manifest, no aparece en el preview ni la cubre la regresión visual — los cambios futuros la romperán sin que nadie lo detecte.

**How to apply:**
- Pantalla nueva → entrada en `PREVIEW_SCREENS` (id, label, path, states) + árbol de componentes en `TREES` de `src/pages/PreviewAll.tsx`.
- Estado visual nuevo (componentes que aparecen/desaparecen según sesión, datos o query param) → entrada en `states[]` de su pantalla, con `src` que lo fuerce por URL (preferir query params; si depende de sesión, marcar `seedSession: true`).
- Estados imposibles de forzar por URL → `src: null` y soporte en el sandbox de PreviewAll (como `reward-welcome` de Home).
- Pantallas con contenido no determinista (datos remotos, fecha actual) → `dynamicContent: true` hasta que se mockeen.
- El manifest es DATA PURA: sin imports de React ni side-effects (lo carga Playwright fuera de Vite).
