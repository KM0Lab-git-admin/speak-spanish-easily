## Objetivo

En `vertical-mobile` (375×667), conseguir que los 4 espacios verticales marcados en rojo en la captura sean **visualmente iguales**, eliminando el hueco vacío grande que hay sobre la tab bar inferior.

Los 4 espacios a igualar son:

```
[Header + HomeModules]   ← pegado arriba (OK)
   ↕ espacio 1           (módulos ↔ Iniciar/Registro)
[Iniciar sesión / Registro]
   ↕ espacio 2           (CTAs ↔ Promos)
[Promos y eventos destacados + card]
   ↕ espacio 3           (Promos ↔ Esto es para ti)
[Esto es para ti + carrusel comercios]
   ↕ espacio 4           (carrusel ↔ tab bar)   ← actualmente enorme
[Tab bar]                ← pegada abajo (OK)
```

## Diagnóstico

El frame portrait tiene altura fija (calculada por aspect-ratio 9/19.5). En 375×667 el contenido cabe holgado, pero los `mt-[clamp(...)]` actuales son **dispares**:

- Espacio 1 (módulos→CTAs): `mt-[clamp(0.5rem, 5vw, 2rem)]` ≈ 19px
- Espacio 2 (CTAs→Promos): `mt-[clamp(0.5rem, 3vw, 2rem)]` ≈ 11px (apretado)
- Espacio 3 (Promos→Esto es para ti): `mt-[clamp(0.375rem, 2.5vw, 2rem)]` ≈ 9px (muy apretado)
- Espacio 4 (carrusel→tab bar): spacer `h-1` (4px) + el carrusel acaba arriba → todo el aire restante del frame queda como hueco vacío visible

Además, el `overflow-hidden` aplicado en `vertical-mobile` ya garantiza que no haya scroll, así que podemos repartir el aire libremente.

## Solución

Cambiar el reparto vertical de **márgenes fijos pequeños + spacer mínimo** a **espaciado proporcional flexible**, de modo que los 4 huecos se igualen automáticamente.

### Estrategia: usar `flex` con `justify-between` solo en `vertical-mobile`

1. Convertir el contenedor scroll body en `vertical-mobile:flex vertical-mobile:flex-col`.
2. Eliminar los `mt-*` específicos de `vertical-mobile` en cada `<motion.section>` (mantenerlos en `vertical-tablet` para no regresionar).
3. Insertar **3 spacers flex-grow** entre las 4 zonas de contenido (módulos, CTAs, promos, comercios) que se expandan proporcionalmente, más un cuarto spacer encima de la tab bar.
4. Los 4 spacers comparten `flex-1` (mismo `flex-grow`), así Tailwind reparte el sobrante por igual → los 4 espacios serán matemáticamente iguales.

### Cambios concretos en `src/pages/Home.tsx`

**Contenedor scroll body** (línea 172):
- Añadir `vertical-mobile:flex vertical-mobile:flex-col` al div con `flex-1 min-h-0 overflow-y-auto`.
- Mantener `vertical-mobile:overflow-hidden` (ya está).

**HERO + HomeModules** (líneas 173-229):
- El bloque Hero + módulos queda como un primer "grupo" pegado arriba. No se toca.

**Insertar spacer 1** entre módulos y CTAs:
```tsx
<div className="hidden vertical-mobile:block flex-1" aria-hidden />
```

**CTAs Auth** (línea 232):
- Quitar `mt-[clamp(0.5rem,5vw,2rem)]`, sustituir por `vertical-tablet:mt-8` solamente. Añadir variante base `mt-4` para otros breakpoints.

**Insertar spacer 2** entre CTAs y Promos.

**Promos** (línea 247):
- Quitar `mt-[clamp(0.5rem,3vw,2rem)]`, dejar solo `vertical-tablet:mt-8` y un `mt-4` base.

**Insertar spacer 3** entre Promos y "Esto es para ti".

**Comercios** (línea 260):
- Quitar `mt-[clamp(0.375rem,2.5vw,2rem)]`, dejar solo `vertical-tablet:mt-8` y `mt-4` base.

**Spacer final** (línea 294):
- Reemplazar `<div className="h-[clamp(0.25rem,2vw,1.5rem)] vertical-mobile:h-1" />` por:
```tsx
<div className="h-[clamp(0.25rem,2vw,1.5rem)] vertical-mobile:h-0 vertical-mobile:flex-1" aria-hidden />
```

Resultado: en `vertical-mobile`, los 4 spacers `flex-1` reparten todo el aire sobrante de forma idéntica. En el resto de breakpoints, los `mt-*` originales (tablet/landscape) siguen funcionando porque las clases responsive `vertical-mobile:` solo aplican en portrait ≤767px.

### Aislamiento por breakpoint

- **vertical-mobile**: nuevo reparto flex (4 espacios iguales).
- **vertical-tablet**: usa los `vertical-tablet:mt-8` existentes; los spacers flex-1 quedan inactivos porque no tienen `vertical-tablet:flex-1`.
- **horizontal-mobile / horizontal-desktop**: mantienen su layout actual; los nuevos `mt-4` base son neutros y los spacers ocultos no afectan.

## Verificación

Tras aplicar los cambios, capturar las 4 resoluciones oficiales y verificar:

1. **375×667 (vertical-mobile)**: los 4 espacios marcados en rojo son visualmente iguales; nada cortado, sin scroll.
2. **768×1024 (vertical-tablet)**: layout idéntico al actual.
3. **667×375 (horizontal-mobile)** y **1280×550 (horizontal-desktop)**: sin regresiones.

## Archivos a tocar

- `src/pages/Home.tsx` (único archivo)
