## Objetivo

En **vertical-mobile** y **vertical-tablet** el botón "Iniciar sesión" queda flotando con demasiado aire entre el hero (skyline) y la card de módulos. El usuario quiere mantener el botón con texto en su sitio actual, pero más compacto y pegado al hero, recortando el espacio vertical marcado en rojo en la captura.

Cambios SOLO en portrait (vertical-mobile + vertical-tablet). Landscape intacto.

## Cambios en `src/pages/Home.tsx`

### 1. Sección CTA portrait (líneas 278-293)

- Reducir margen superior: `mt-2 vertical-tablet:mt-4` → `-mt-3 vertical-tablet:-mt-4` para que el botón se acerque al borde del hero (incluso lo solape ligeramente, quedando "anclado" al skyline en lugar de flotando).
- Reducir tamaño del botón:
  - `text-sm px-5 py-2` → `text-xs px-4 py-1.5`
  - `vertical-tablet:text-base vertical-tablet:px-6 vertical-tablet:py-2.5` → `vertical-tablet:text-sm vertical-tablet:px-5 vertical-tablet:py-2`
- Mantener color amarillo, sombra, fuente y animación.

### 2. Sección de módulos (línea 297)

- Cambiar `-mt-8` (overlap fuerte sobre el hero) a `-mt-2 vertical-tablet:-mt-3` solo en portrait, para que la card de módulos suba menos y no genere el hueco visual entre botón y módulos. Landscape sigue con `horizontal-mobile:mt-0 horizontal-desktop:mt-0`.
- Resultado: botón pegado al hero por arriba, módulos pegados al botón por abajo, sin aire muerto.

### Verificación

- vertical-mobile (375×667): el botón debe quedar entre el final del skyline y el inicio de la card de módulos sin gap visible, y todo el contenido (hero + botón + módulos + carruseles + bottom nav) debe seguir cabiendo sin scroll excesivo.
- vertical-tablet (768×1024): mismo patrón, proporciones ligeramente mayores.
- horizontal-mobile (667×375) y horizontal-desktop (1280×550): SIN cambios — el botón sigue en el header (`landscape:inline-flex`) y la sección CTA portrait sigue oculta (`landscape:hidden`).

## Fuera de alcance

- Carrusel "Esto es para ti" cortado, bottom nav superpuesto, header skyline alto: NO se tocan en este turno.
