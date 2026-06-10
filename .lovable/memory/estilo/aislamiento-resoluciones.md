---
name: Aislamiento por resolución dentro de la misma orientación
description: Cambios en una resolución (ej. horizontal-desktop) NUNCA deben tocar clases base que afecten a otra resolución de la misma orientación (ej. horizontal-mobile)
type: preference
---
Al maquetar para una resolución concreta (vertical-mobile, vertical-tablet, horizontal-mobile, horizontal-desktop), TODOS los cambios deben ir con su prefijo de breakpoint correspondiente. NUNCA modificar clases base sin prefijo si afectan a otra resolución de la misma orientación.

**Why:** corregir la versión grande no debe estropear la pequeña, ni viceversa. El loop "arreglo desktop → rompo mobile → arreglo mobile → rompo desktop" es inaceptable.

**How to apply:**
- Cambio que solo aplica a `horizontal-desktop` → usar SIEMPRE prefijo `horizontal-desktop:` (con `!` si hay que sobrescribir).
- Cambio que solo aplica a `horizontal-mobile` → usar SIEMPRE prefijo `horizontal-mobile:`.
- Layout grid/flex/spacing base solo se toca si el cambio debe aplicar a TODAS las resoluciones de esa orientación.
- Antes de cambiar una clase sin prefijo, preguntarse: "¿esto afecta a las otras 3 resoluciones?". Si sí, scope con prefijo.
- Verificar SIEMPRE las 4 resoluciones Playwright (375×667, 768×1024, 667×375, 1280×550) antes de cerrar la tarea.
