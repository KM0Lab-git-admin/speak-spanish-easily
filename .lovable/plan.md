Plan: refinar la zona del header + botón "Iniciar sessió" en `/home-no-registrado` sin afectar al home registrado.

Ámbito: solo estado no registrado (`showLogin === true` / `/home-no-registrado`). El home registrado y el resto de pantallas permanecen sin cambios.

### 1. Diagnóstico visual actual
En la captura se ve:
- Fila superior: escudo + "Malgrat de Mar" + KM0 LAB + campana.
- Debajo: subtítulo "Gràcies per recolzar el comerç local".
- Más abajo: botón amarillo "Iniciar sessió" centrado.

Problemas detectados:
- El botón de login del `HomeHero` está oculto en portrait (`hidden landscape:inline-flex`), pero aparece un botón centrado en el contenido, lo que genera dos botones visuales distintos según orientación.
- La fila superior usa varios paddings/márgenes mixtos (`px-0 py-0` en el contenedor vs `pt-2` / `pb-1` en breakpoints), lo que dificulta la alineación vertical exacta.
- El escudo y el texto de la ciudad no están perfectamente centrados en el eje vertical.
- El botón centrado en el contenido desconecta la acción de login del header; pierde jerarquía.
- En tablet portrait hay espacio suficiente para integrar el login en el header o justo debajo de él, evitando un bloque aislado en el medio del scroll.

### 2. Propuesta de mejora
A) Unificar el CTA de login
- Reutilizar el `LoginButton` existente del `HomeHero` para portrait también.
- En estado no registrado mostrar "Iniciar sessió" en el header (fila superior), alineado con la campana y el logo KM0.
- Eliminar el botón de login centrado del `HomeContent` en el estado no registrado, para que no haya duplicidad visual.

B) Revisar la alineación vertical de la fila header
- Asegurar que escudo, texto ciudad y logo KM0 compartan la misma línea de base/centro en todos los breakpoints.
- Aplicar `items-center` estricto y evitar mezclas de `pt-*` / `pb-*` que desplacen el contenido.
- Ajustar tamaños de tipografía/logo para que el conjunto quede compacto en mobile y no se vea desproporcionado en tablet.

C) Revisar el espaciado entre header y contenido
- Reducir el gap entre la fila header y el subtítulo/bloque de módulos para evitar el vacío que se ve en la captura.
- Mantener el subtítulo, pero darle un poco más de proximidad al header o a los módulos.

D) Refinar el botón de login
- Mantener el estilo amarillo/azul del design system.
- Considerar una variante "outline" o "ghost" solo si el amarillo compite demasiado con el resto del header; por defecto, conservar el amarillo para que sea claramente la acción principal.
- Asegurar `min-height` / `touch-target` accesible (mínimo 44 px en mobile).

E) Validación responsive
- Testear en las 4 resoluciones canónicas: 375×667, 768×1024, 667×375 y 1280×550.
- Verificar que no aparezca scroll vertical en 1280×550 por la reorganización del header.
- Asegurar que el estado registrado sigue igual (no se mueve el botón de login, no cambia espaciado).

### 3. Archivos a tocar
- `src/components/HomeHero.tsx`: exponer el botón de login también en portrait, alinear fila header.
- `src/components/HomeContent.tsx`: eliminar o condicionar el botón de login centrado en el estado no registrado.
- `src/components/HomeContentLandscape.tsx`: revisar que el login en landscape siga funcionando (ya estaba presente).
- `src/components/LoginButton.tsx`: si es necesario, ajustar tamaño/touch-target.
- `src/pages/PreviewAll.tsx` y `src/preview-manifest.ts`: actualizar árboles si la composición de Home cambia.

### 4. Cómo validaremos
- Capturas de pantalla en Playwright para las 4 resoluciones oficiales comparando antes/después.
- Verificación de que `/home-registrado` no tiene el botón de login en el header.
- Lighthouse o inspección visual para confirmar touch targets accesibles.