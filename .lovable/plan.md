# Reubicación del botón "Iniciar sesión"

## Problema

En las dos resoluciones **verticales** (vertical-mobile 375×667 y vertical-tablet 768×1024) el botón "Iniciar sesión" comparte fila con el escudo + nombre de la ciudad + logo KM0 + campana de notificaciones. En `vertical-mobile` (375 px) no queda ancho suficiente y el botón se ve aplastado/recortado contra la campana.

En las dos resoluciones **horizontales** (horizontal-mobile 667×375 y horizontal-desktop 1280×550) el botón en el header funciona bien: hay ancho de sobra y la altura es la limitación, así que ocupar la franja del header es la mejor opción.

## Propuesta

Renderizar el botón **dos veces** en el JSX, controlando la visibilidad por breakpoint con las variantes oficiales — así cada orientación recibe la versión que mejor encaja, sin tocar ninguna otra resolución.

### 1. Versión "header" (solo landscape)

Mantener el botón actual al lado de la campana, pero ocultarlo en portrait:

- Wrapper `flex items-center gap-2` del header → el `<button>` "Iniciar sesión" pasa a tener `hidden landscape:inline-flex`.
- Se conservan las clases responsive ya afinadas para `horizontal-mobile` y `horizontal-desktop`.
- El header en portrait queda con: escudo + nombre + logo + campana (como antes de añadir el login).

### 2. Versión "sobre módulos" (solo portrait)

Añadir una nueva sección, **justo antes** del bloque `HomeModules` (línea ~266), envuelta en `motion.section` con la misma animación staggered que ya usa el resto del Home:

- Visibilidad: `landscape:hidden` → solo aparece en `vertical-mobile` y `vertical-tablet`.
- Contenedor: `flex justify-center` con padding horizontal coherente con el resto de la pantalla.
- Botón: mismo estilo amarillo + azul que la versión header, pero con tamaño cómodo para portrait (más alto, más ancho, mejor jerarquía):
  - `vertical-mobile`: `text-sm px-5 py-2`
  - `vertical-tablet`: `text-base px-6 py-2.5`
- Solo se monta cuando `showLogin === true` (igual que la versión header).

### 3. Layout / spacers en vertical-mobile

`vertical-mobile` ya usa flex-col con varios `flex-1` repartiendo aire entre módulos, promos y comercios. Al insertar la nueva sección de login antes de los módulos hay que verificar que sigue cabiendo sin scroll en 375×667:

- La nueva sección es ~36 px de alto (botón + margen).
- Si hace falta, reducir uno de los spacers `vertical-mobile:flex-1` existentes a `vertical-mobile:flex-[0.5]`, **sin tocar las demás resoluciones**.

### Resultado por breakpoint

| Breakpoint        | Botón en header | Botón sobre módulos |
|-------------------|-----------------|---------------------|
| vertical-mobile   | ❌              | ✅ (centrado)       |
| vertical-tablet   | ❌              | ✅ (centrado)       |
| horizontal-mobile | ✅ (compacto)   | ❌                  |
| horizontal-desktop| ✅ (normal)     | ❌                  |

## Archivos afectados

- `src/pages/Home.tsx` — añadir `landscape:hidden` al botón actual del header y nueva `motion.section` con el botón portrait justo antes de `<HomeModules>`. Posible ajuste menor de un spacer en vertical-mobile.

## Fuera de alcance

- Lógica de auth, rutas, `useAuth`.
- Estilos del header en landscape (siguen igual).
- Cualquier cambio en `HomeModules`, promos o comercios.
