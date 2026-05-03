Comprendo el problema: no es el módulo superior de accesos rápidos, sino el carrusel de comercios dentro de “Esto es para ti”. En 375×667 los logos aparecen, pero los nombres Sanait, Vidal, Manitas y Champa quedan cortados por la tab bar inferior.

Plan de ajuste:

1. Aislar el fix únicamente en `vertical-mobile`
   - No tocaré `vertical-tablet`, `horizontal-mobile` ni `horizontal-desktop`.
   - Mantendré intacto el ajuste anterior del módulo superior.

2. Compactar verticalmente la sección “Esto es para ti” solo en 375×667
   - Reducir ligeramente el margen superior de esa sección en `vertical-mobile`.
   - Reducir el tamaño del icono/cupón del título solo en `vertical-mobile` si hace falta.
   - Reducir un poco el espacio entre título y logos.

3. Hacer que los textos de comercios entren completos
   - Ajustar el carrusel `ComercioCarousel` para reservar altura suficiente al texto.
   - Reducir mínimamente el tamaño de los círculos/logos y el margen entre logo y texto solo en `vertical-mobile`.
   - Mantener los nombres visibles: Sanait, Vidal, Manitas, Champa.

4. Evitar que la tab bar tape contenido
   - Reducir el spacer inferior en `vertical-mobile` o convertirlo en una altura más controlada.
   - Confirmar que la última línea de texto queda por encima del borde de la tab bar.

5. Verificación visual
   - Captura en `vertical-mobile` 375×667 confirmando que los 4 nombres se ven completos.
   - Captura en `vertical-tablet` 768×1024 para confirmar que no se ha degradado el layout tablet.

Archivos a tocar:
- `src/pages/Home.tsx`

Resultado esperado:
- En 375×667, la sección “Esto es para ti” mostrará iconos y textos completos por encima de la navegación inferior, sin scroll vertical y sin cortar Sanait, Vidal, Manitas ni Champa.