## Problema

En **resoluciones portrait intermedias/fluidas** (cualquier ancho grande de viewport en portrait — p.ej. 600×900, 710×775, 720×900, etc., todas dentro de `vertical-mobile` ≤767), el banner azul "Festa Major Romana" y la sección "Promos y eventos destacados" se ven **cortados por la derecha** del frame portrait.

No es un caso aislado: ocurre de forma fluida en todo el rango de anchos donde el viewport es bastante más ancho que el frame interior.

## Causa raíz

En `src/pages/Home.tsx` línea 432, la card del carrusel tiene:

```tsx
className="... aspect-[2/1] vertical-tablet:aspect-[16/9] min-h-[clamp(120px,28vw,200px)]"
```

El `min-h` se calcula con `vw` (viewport units), no con el ancho real del frame portrait. El frame portrait tiene un ancho fijado por:

```
width: min(100vw - 1.5rem, (100dvh - 1.5rem) * 9 / 19.5, 420px)
```

Es decir, el frame se queda estrecho (~340–420px) aunque el viewport sea muy ancho. Mientras tanto, `28vw` crece linealmente con el ancho del viewport:

| Viewport | Ancho frame | min-h (28vw) | Width implícito por aspect-[2/1] |
|----------|-------------|--------------|----------------------------------|
| 375×667  | ~308px      | 105px        | 210px → cabe                     |
| 600×900  | ~415px      | 168px        | 336px → cabe ajustado            |
| **710×775** | ~346px   | **199px**    | **398px → desborda 52px**        |
| 720×900  | ~415px      | 200px (cap)  | 400px → desborda 15px            |

Cuando `min-height × 2 > ancho del frame`, el navegador respeta el `aspect-ratio` ensanchando la card → **se sale por la derecha** del frame.

## Solución

Eliminar el `min-h-[clamp(...)]`. El `aspect-[2/1]` ya garantiza altura proporcional al ancho real del contenedor, sin riesgo de desbordar.

### Cambio único en `src/pages/Home.tsx` línea 432

```tsx
// Antes
<div className="relative rounded-2xl overflow-hidden shadow-[...] aspect-[2/1] vertical-tablet:aspect-[16/9] min-h-[clamp(120px,28vw,200px)]">

// Después
<div className="relative w-full rounded-2xl overflow-hidden shadow-[...] aspect-[2/1] vertical-tablet:aspect-[16/9]">
```

- Se quita `min-h-[clamp(120px,28vw,200px)]`.
- Se añade `w-full` explícito como salvaguarda para que la card respete el ancho del padre.

El contenido interno (`FESTA / MAJOR / ROMANA` + subtítulo) usa `text-2xl/text-3xl` que cabe holgado con cualquier altura derivada del aspect-ratio (la mínima realista será ~150px de altura → más que suficiente).

## Verificación

Tras el cambio, capturar y validar:

1. **375×667** (vertical-mobile canónico): layout idéntico al actual.
2. **710×775** (caso reportado): banner y título dentro del frame, sin recortes.
3. **600×900, 720×1000** (otras intermedias portrait): sin recortes.
4. **768×1024** (vertical-tablet): la card mantiene `aspect-[16/9]` sin regresión.
5. **horizontal-mobile / horizontal-desktop**: sin cambios (el frame landscape no usa esta sección igual).

## Archivos a tocar

- `src/pages/Home.tsx` (1 línea)
