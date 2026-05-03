## Objetivo

En portrait 375×667 (vertical-mobile), la Home no debe generar scroll vertical ni horizontal. Todo el contenido (hero + módulos + CTAs + promos + tab bar) debe caber dentro del frame. El bloque "Esto es para ti" se oculta en esta resolución y reaparece en pantallas más altas (vertical-tablet en adelante).

## Cambios en `src/pages/Home.tsx`

### 1) CTAs "Iniciar sesión" / "Registro" más compactos
En `AuthButton` (línea ~337-357):
- Reducir padding vertical: `py-3` → `py-2` en vertical-mobile, `vertical-tablet:py-3` para mantener tamaño en pantallas mayores.
- Reducir el círculo del icono: `w-7 h-7` → `w-6 h-6` en mobile.
- Tamaño del icono Lucide: `size={18}` → `size={16}` (pasar como prop o ajustar al render).
- Texto: mantener `text-sm`, pero permitir `text-xs` en vertical-mobile si hace falta margen extra.

Sección que envuelve los CTAs (línea ~232-244):
- `mt-3` → `mt-2` en vertical-mobile.
- `gap-3` → `gap-2`.

Ahorro estimado: ~12-16 px de alto.

### 2) Carrusel "Promos y eventos destacados" más bajo
Sección (línea ~247-257):
- `mt-4` → `mt-3` en vertical-mobile.
- Título `mb-2` → `mb-1.5`.

Carrusel (línea ~419):
- `aspect-[16/9]` → `aspect-[16/8]` (≈2:1) solo en vertical-mobile vía `aspect-[2/1] vertical-tablet:aspect-[16/9]`.
- Reducir tamaño de las tipografías internas del PromoCard si quedan apretadas (revisar líneas posteriores no mostradas; ajuste fino al implementar).

Ahorro estimado: ~25-35 px de alto.

### 3) Ocultar bloque "Esto es para ti" en vertical-mobile
Sección comerciantes (línea ~260-291):
- Añadir `hidden vertical-tablet:block` al `motion.section` para que desaparezca por completo en vertical-mobile y reaparezca en tablet portrait y resoluciones mayores.
- Eliminar también el spacer (línea ~294 `<div className="h-2" />`) o condicionarlo, para no dejar hueco.

Ahorro estimado: ~110-130 px de alto (icono 80px + título + carrusel comercios).

### 4) Garantizar que no haya scroll
- Cambiar el contenedor scroll (línea 172) `overflow-y-auto` → `overflow-y-auto vertical-mobile:overflow-hidden` para forzar que en 375×667 no aparezca barra de scroll. Si por algún cálculo sobra 1-2 px, se recortarán en vez de generar scroll.
- Reducir `pb-2` del scroll body a `pb-0` en vertical-mobile.
- Verificar tras los cambios que la suma cabe en 667px - tab bar (~60px) - frame border. Margen objetivo: ≥10px.

### 5) Sin scroll horizontal
La estructura actual ya usa `overflow-hidden` en el frame exterior (línea 107), así que no debería aparecer scroll-x. Verificar tras el cambio que ningún hijo desborda (especialmente HomeModules con 4 ítems).

## Verificación visual

Tras implementar, abrir el preview en 375×667 portrait y comprobar:
- No hay scroll vertical ni horizontal.
- Hero, módulos, 2 CTAs, carrusel de promos y tab bar son todos visibles.
- "Esto es para ti" NO aparece.
- En 768×1024 (vertical-tablet) "Esto es para ti" SÍ aparece.
- En landscape no se rompe nada (el bloque landscape usa el mismo `HomeContent`, las clases `vertical-mobile:` no se activan ahí).

## Notas técnicas

Las variantes `vertical-mobile:` y `vertical-tablet:` ya están definidas en `tailwind.config.ts` y son las oficiales del proyecto (memoria Core). No introducir hex crudos; mantener tokens KM0.
