# Proceso de maquetación responsive

Este proyecto se debe maquetar contra una matriz fija de resoluciones, no contra
la idea genérica de “mobile” o “desktop”. El objetivo es que cada cambio visual
tenga un contrato verificable antes de aceptar el resultado.

## Matriz oficial de viewports

La fuente de verdad está en `src/design-system/viewports.ts`.

| Viewport | Tamaño | Breakpoint | Uso |
| --- | ---: | --- | --- |
| Mobile portrait base | 375×667 | `vertical-mobile` | Contrato mínimo de usabilidad. |
| Mobile portrait moderno | 390×844 | `vertical-mobile` | Comprueba aire vertical extra. |
| Mobile landscape base | 667×375 | `horizontal-mobile` | Contrato compacto horizontal. |
| Tablet portrait | 768×1024 | `vertical-tablet` | Valida escalado vertical. |
| Tablet landscape | 1024×768 | `horizontal-mobile` | Landscape amplio antes de desktop. |
| Desktop landscape | 1280×720 | `horizontal-desktop` | Primer contrato desktop. |
| Desktop amplio | 1440×900 | `horizontal-desktop` | Evita layouts demasiado estirados. |

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
2. Mantener estable el contrato base portrait (`375×667`).
3. Validar el contrato landscape compacto (`667×375`).
4. Revisar tablet portrait y tablet landscape.
5. Ajustar desktop solo después de que los tamaños pequeños sean estables.
6. Evitar “parches cruzados”: si una variante necesita un override, documentar por qué.

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

## Checklist antes de aceptar una maqueta

- [ ] No hay scroll horizontal accidental.
- [ ] Los textos importantes no quedan cortados en `375×667` ni `667×375`.
- [ ] Las tarjetas tienen `min-w-0` cuando viven dentro de grids/flex.
- [ ] Las zonas con scroll usan `min-h-0` en todos sus padres flex/grid.
- [ ] Desktop mejora la composición, pero no redefine el comportamiento base.
- [ ] `npm run build` pasa después del cambio.

## Plantilla de prompt para Lovable/Codex

```txt
Modifica solo [bloque/componente].

Antes de cambiar código, identifica:
1. qué componente controla el frame,
2. qué componente controla el layout,
3. qué componente controla el contenido.

El cambio debe verse correctamente en la matriz oficial:
- 375×667 mobile portrait base
- 390×844 mobile portrait moderno
- 667×375 mobile landscape base
- 768×1024 tablet portrait
- 1024×768 tablet landscape
- 1280×720 desktop landscape
- 1440×900 desktop amplio

No uses alturas fijas salvo que estén justificadas.
No arregles una orientación rompiendo otra.
Usa solo los breakpoints oficiales del proyecto.
Lista los archivos tocados y explica cómo se validó el responsive.
```
