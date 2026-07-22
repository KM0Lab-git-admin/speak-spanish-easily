## Objetivo
En la Home (`vertical-mobile`, 375×667, usuario registrado), poner en una única fila horizontal: escudo de Malgrat + "Malgrat de Mar" + logo KM0 LAB + campana de notificaciones.

## Estado actual
En `src/components/HomeHero.tsx`, el bloque `flex flex-col leading-[0.95] ...` apila verticalmente el nombre de la ciudad y el logo KM0 en portrait. Solo en `horizontal-mobile` se fuerza `flex-row` con `!flex-row items-center gap-2`. La campana ya está en la misma row (flex principal).

## Cambio
Scoped a `vertical-mobile` (sin tocar tablet portrait ni landscapes):

- Aplicar `flex-row items-center gap-2` como base del contenedor del nombre + logo, en vez de `flex-col`.
- Reset del margin-top del logo en base (`mt-0`) porque ya no está apilado.
- Ajustar tamaños si el logo KM0 queda demasiado grande junto al título (probablemente `h-4` sirve; si desborda, bajar a `h-3.5` solo en vertical-mobile).
- Verificar que `vertical-tablet` sigue apilado como hasta ahora (mantener overrides `vertical-tablet:flex-col vertical-tablet:items-start vertical-tablet:gap-0` si es necesario para no romper esa resolución).

## Archivo
- `src/components/HomeHero.tsx` (línea del contenedor `flex flex-col leading-[0.95] min-w-0 horizontal-mobile:!flex-row ...` y sus hijos `h1` + wrapper del `Km0Logo`).

## Fuera de alcance
- No se toca `HomeContent`, `PointsCard`, ni el resto del Home.
- No se cambia landscape (`horizontal-mobile` / `horizontal-desktop`) ni `vertical-tablet`.

## Validación
Playwright screenshots del Home en las 4 resoluciones canónicas (375×667, 768×1024, 667×375, 1280×550) para confirmar que:
- 375×667: escudo, "Malgrat de Mar", KM0 LAB y campana en la misma row.
- Resto de resoluciones sin cambios visibles.
