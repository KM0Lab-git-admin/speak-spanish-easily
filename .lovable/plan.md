## Problema

En `HomeContent.tsx`, los componentes están envueltos así:

```
middle (flex-col justify-evenly)
├── Login CTA
├── HomeModules
└── div wrapper (flex-col gap-0)
    ├── PromoSection
    └── ComerciosSection
```

`justify-evenly` reparte el espacio entre **3 hijos** (login, módulos, wrapper-promos+comercios). Dentro del wrapper, Promo y Comercios usan `gap-0`, por eso están pegados — visualmente no respetan la jerarquía.

## Solución (solo portrait)

Aplanar el árbol en portrait para que `PromoSection` y `ComerciosSection` sean hermanos directos del contenedor `justify-evenly`, al mismo nivel que `HomeModules`. Así los 4 elementos (login, módulos, promos, comercios) reciben el mismo espacio vertical entre sí.

En landscape se conserva el grid de 2 columnas actual (Promo + Comercios lado a lado).

## Cambios

**`src/components/HomeContent.tsx`** (líneas ~80-85):

- Eliminar el `<div className="flex flex-col gap-0 ... landscape:grid landscape:grid-cols-2 ...">` que agrupa Promo + Comercios.
- En portrait: renderizar `PromoSection` y `ComerciosSection` como hijos directos del contenedor middle, cada uno con su `border border-black` para mantener la guía visual.
- En landscape: mantener el grid 2-cols envolviendo solo Promo+Comercios mediante un wrapper con `hidden landscape:grid` (o usar `landscape:contents` sobre el wrapper actual para que en landscape el grid funcione y en portrait los hijos suban un nivel).

**Enfoque recomendado** (más limpio, sin duplicar JSX): usar `landscape:contents` no funciona porque el grid se aplica al wrapper. Mejor duplicar:

```tsx
{/* Portrait: hermanos directos del justify-evenly */}
<div className="landscape:hidden border border-black">
  <PromoSection promos={promos} />
</div>
<div className="landscape:hidden border border-black">
  <ComerciosSection comercios={comercios} onSeeAll={onSeeAllComercios} />
</div>

{/* Landscape: grid 2 columnas */}
<div className="hidden landscape:grid landscape:flex-1 landscape:min-h-0 landscape:grid-cols-2 landscape:gap-3 horizontal-desktop:gap-4 m-0 p-0">
  <div className="border border-black">
    <PromoSection promos={promos} />
  </div>
  <div className="border border-black">
    <ComerciosSection comercios={comercios} onSeeAll={onSeeAllComercios} />
  </div>
</div>
```

Resultado: en portrait, `justify-evenly` reparte espacio igual entre login, módulos, promos y comercios. En landscape, el comportamiento actual se mantiene.
