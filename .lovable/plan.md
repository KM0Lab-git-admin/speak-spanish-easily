He leído `docs/KNOWLEDGE.md` §3: el layout canónico ya es "columna portrait, centrada y limitada" (~430px) con fondo rellenando laterales, sin bespoke por orientación. La Home viola esta regla con `HomeContentLandscape`.

**Plan (3-4 pasos):**

1. **`src/pages/Home.tsx`**: eliminar la rama `hidden landscape:flex` con `HomeContentLandscape` y `NotificationsOverlay` duplicado. Quitar el `landscape:hidden` de la rama única para que `HomeContent` se renderice en TODAS las orientaciones. Quitar el import.

2. **`src/components/HomeContent.tsx`**: envolver el contenido en un contenedor centrado y limitado (`mx-auto w-full max-w-[430px]`) sobre fondo `bg-km0-beige-50` que ocupa todo el ancho del shell. Verificar que carruseles (`EventHeroCarousel`, `ComercioCarousel`, `CouponCarousel`) hacen scroll-x dentro de su contenedor y no fuerzan overflow del body.

3. **Limpieza**: borrar `src/components/HomeContentLandscape.tsx` y su uso en `src/components/HomeSandbox.tsx` (siempre `HomeContent`). Actualizar `src/pages/PreviewAll.tsx` y `src/design-system/screen-trees.ts` quitando la rama Landscape del tree de Home.

**Intocable**: composición interna de `HomeContent` (aprobada), i18n, tokens, contrato de API, primitivos `ui/`, breakpoints.

**Validación (sin PNG automático salvo que lo pidas)**: revisar visualmente 375×667 (idéntico), 768×1024, 667×375 y 1280×550 mostrando la misma columna centrada sobre fondo beige, sin scroll horizontal ni 2 columnas.

¿OK para ejecutar?