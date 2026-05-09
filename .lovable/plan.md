## Objetivo

Eliminar la duplicación del botón "Iniciar sesión" (hoy inline en `HomeContent.tsx` para portrait y en `HomeHero.tsx` para landscape) extrayéndolo como componente puro reutilizable. Así cada pantalla/contenedor decide su propio margin/padding alrededor del botón, y el botón solo se preocupa de su look&feel.

## Criterio de diseño elegido

**LoginButton "tonto"** (sin wrapper, sin animación, sin posicionamiento). Esta opción da el máximo control sobre paddings/margins porque:

- El botón NO impone `mt-1`, `mt-3`, `px-4`, ni `motion.section`.
- Cada consumidor (HomeContent portrait, HomeHero landscape, futuras pantallas) lo envuelve en su propio contenedor con los márgenes que necesita.
- Es 100% reutilizable en Login, Profile, modales, etc.

## Arquitectura

### Nuevo componente — `src/components/LoginButton.tsx`

```text
Props:
  onClick: () => void
  size?: "sm" | "md"          // sm = portrait/horizontal-mobile, md = horizontal-desktop
  className?: string          // hook de escape para ajustes puntuales

Render:
  <button> con las clases base actuales:
    font-ui font-bold text-km0-blue-700 bg-km0-yellow-500
    hover:bg-km0-yellow-400 active:scale-95 transition-all
    rounded-full whitespace-nowrap
    shadow-[0_4px_12px_-4px_hsl(var(--km0-blue-700)/0.3)]

  Tamaño según `size`:
    sm → text-xs px-3.5 py-1   (con vertical-tablet:text-sm vertical-tablet:px-5 vertical-tablet:py-1.5)
    md → text-sm px-4 py-2

  Sin motion, sin section, sin margins externos.
```

### Consumidor 1 — `src/components/HomeContent.tsx`

Sustituir el bloque actual (líneas ~58-74) por:

```tsx
{showLogin && (
  <motion.section
    className="landscape:hidden flex justify-center px-4 mt-1 vertical-tablet:mt-3"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.08 }}
  >
    <LoginButton onClick={onLogin} size="sm" />
  </motion.section>
)}
```

El `motion.section` se queda porque define el margin/padding del CTA portrait. El botón en sí ya no contiene estilos.

### Consumidor 2 — `src/components/HomeHero.tsx`

Sustituir el `<button>` inline del header landscape por:

```tsx
{showLogin && (
  <LoginButton
    onClick={onLogin}
    size="md"
    className="hidden landscape:inline-flex horizontal-mobile:!text-[11px] horizontal-mobile:!px-2.5 horizontal-mobile:!py-1"
  />
)}
```

Las visibility classes (`hidden landscape:inline-flex`) y los overrides finos por breakpoint quedan en el consumidor — no en el componente.

## Beneficios concretos

| Antes | Después |
|---|---|
| Estilos del botón duplicados en 2 archivos | Una sola fuente de verdad en `LoginButton.tsx` |
| Cambiar el color del CTA = editar 2 sitios | Cambiar el color = editar 1 sitio |
| Margin/padding mezclado con look del botón | Margin/padding 100% controlado por el contenedor |
| No reutilizable en Login/Profile/modales | Importable en cualquier pantalla |
| Tests: hay que montar HomeContent o HomeHero | Test unitario directo: `<LoginButton onClick={fn} />` |

## Lo que NO se toca

- Animaciones (`motion.section` y sus delays se quedan en el consumidor portrait).
- Lógica de `showLogin` / `onLogin` (sigue en `Home.tsx` → props).
- Estilos visuales (mismas clases, cero cambios visuales en los 4 breakpoints).
- `HomeHero` mantiene su layout; solo cambia el `<button>` inline por `<LoginButton>`.

## Plan de ejecución

1. Crear `src/components/LoginButton.tsx` con props `{ onClick, size?, className? }` y las clases base.
2. Editar `src/components/HomeContent.tsx`: importar `LoginButton`, sustituir el `<button>` inline manteniendo el `motion.section` wrapper.
3. Editar `src/components/HomeHero.tsx`: importar `LoginButton`, sustituir el `<button>` inline conservando las clases de visibilidad y overrides horizontal-mobile.
4. Verificar visualmente las 4 resoluciones (375×667, 768×1024, 667×375, 1280×550) — cero regresiones.

## Resultado esperado

- 1 componente nuevo (`LoginButton.tsx`, ~40 líneas).
- 2 archivos editados (`HomeContent.tsx`, `HomeHero.tsx`) más cortos y sin estilos duplicados.
- Cero cambios visuales.
- Base lista para reutilizar el botón en cualquier otra pantalla y para añadir `LoginButton.test.tsx` aislado.
