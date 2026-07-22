# Prompt — Layout portrait-first (arreglo landscape/tablet)

> Aplica el patrón "un sol layout, centrat i limitat" (regla de
> docs/KNOWLEDGE.md §3). Úsalo cuando una pantalla se rompa en landscape
> o tablet, empezando por la Home.

```
Adopta en la Home el patrón "un sol layout, centrat i limitat" y retira
el layout landscape bespoke (regla de docs/KNOWLEDGE.md §3).

Antes de tocar código, léete docs/KNOWLEDGE.md y confírmame el plan en
3-4 líneas; espera mi OK.

Problema: hoy la Home tiene dos maquetaciones separadas —
HomeContent (portrait, aprobada) y HomeContentLandscape (2 columnas)—.
La landscape no hereda los cambios del portrait y se rompe; en tablet
portrait (768×1024) el contenido se estira y el carrusel se desborda.

Cambio:
- Renderiza SIEMPRE la columna única de HomeContent, en todas las
  orientaciones. Elimina el uso de HomeContentLandscape y su rama
  `hidden landscape:flex` en Home.tsx (borra el componente si no lo usa
  nadie más).
- Envuelve el contenido en un contenedor centrado con ancho máximo
  (~430px) usando clases/tokens del proyecto: en viewports más anchos el
  fondo (skyline beige) rellena los laterales y la columna queda
  centrada, idéntica al portrait aprobado.
- Los carruseles y bloques anchos hacen scroll DENTRO de su propio
  contenedor (overflow-x contenido); el cuerpo de la página nunca
  desborda en horizontal.

Alcance / intocable:
- NO rediseñes el contenido: la columna portrait ya está aprobada, solo
  cambia cómo se contiene en pantallas anchas.
- Respeta docs/KNOWLEDGE.md: solo tokens, breakpoints semánticos, copy
  en i18n. No toques el contrato de API ni los primitivos de ui.

Validación: las 4 resoluciones canónicas deben verse coherentes con el
portrait — 375×667 idéntico; 667×375, 768×1024 y 1280×550 muestran la
misma columna centrada, sin desbordes ni layout de 2 columnas.
```
