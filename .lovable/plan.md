## Problema

En orientación landscape (`horizontal-mobile` 667×375 y `horizontal-desktop` 1280×550), la pantalla `/home` reutiliza el mismo layout vertical apilado del portrait dentro de un frame 16:9 muy ancho y bajo. Resultado: hero gigante, contenido cortado, scroll vertical y todo desmaquetado.

El objetivo es **diseñar un layout landscape específico** que:

- No produzca scrolls (ni horizontal ni vertical) en `horizontal-mobile` ni `horizontal-desktop`.
- Muestre **todo** el contenido (header, módulos, CTAs, promos, comercios, tab bar) sin recortes.
- Sea fluido entre 667×375 y 1280×550 (y resoluciones intermedias).

## Diseño propuesto

Reorganizar el contenido en **dos columnas** dentro del frame landscape:

```text
┌────────────────────────────────────────────────────────────────────┐
│ ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│ │  HEADER COMPACTO     │  │  Promos y eventos destacados         │ │
│ │  Escudo + Nombre +   │  │  ┌────────────────────────────────┐  │ │
│ │  KM0 LAB    🔔        │  │  │  Banner promo (aspect 2/1)     │  │ │
│ │                      │  │  │  con drag y dots                │  │ │
│ │  [Skyline mini]      │  │  └────────────────────────────────┘  │ │
│ │                      │  │                                      │ │
│ │  ┌────────────────┐  │  │  🎟  Esto es para ti       Ver todos │ │
│ │  │ HomeModules    │  │  │  ◯  ◯  ◯  ◯   (carrusel comercios)   │ │
│ │  │ (4 iconos en   │  │  │                                      │ │
│ │  │  banda azul)   │  │  │                                      │ │
│ │  └────────────────┘  │  │                                      │ │
│ │                      │  │                                      │ │
│ │  [Iniciar] [Registro]│  │                                      │ │
│ └──────────────────────┘  └──────────────────────────────────────┘ │
│ ──────────────────────────────────────────────────────────────────  │
│   🏠 Inicio   ℹ Información   🏷 Ofertas   👤 Perfil  (tab bar)     │
└────────────────────────────────────────────────────────────────────┘
```

### Decisiones clave

1. **Dos columnas 45/55** (izquierda más estrecha, derecha más ancha). La izquierda agrupa identidad + acceso (Header + Módulos + CTAs). La derecha agrupa contenido dinámico (Promos + Comercios). Aprovecha el ancho 16:9 sin estirar nada.

2. **Tab bar full-width abajo**, fuera de las columnas. Se mantiene la estructura de 4 pestañas igual que en portrait.

3. **Hero recortado**: en landscape el skyline ya no es protagonista. El header se reduce a una franja compacta arriba de la columna izquierda con escudo, nombre, logo KM0 y campana. Sin imagen del skyline a tamaño completo (queda como decoración sutil de fondo opcional, opacidad muy baja).

4. **HomeModules en horizontal**: los 4 botones (KM0 CHAT, Agenda, Ayuntamiento, Comercios) se mantienen en fila pero con tamaños más pequeños y proporcionales al ancho de la columna izquierda.

5. **CTAs Iniciar/Registro**: 2 botones lado a lado en la columna izquierda, igual que portrait pero más compactos.

6. **PromoCarousel**: ocupa la mayor parte de la columna derecha. Mantiene `aspect-[16/9]` (que ya tenía para tablet) y se centra verticalmente. Los dots quedan justo debajo.

7. **ComercioCarousel**: 4 logos en grid horizontal debajo del banner, con dots de paginación. Tipografía y diámetros reducidos respecto a portrait.

8. **Espaciados con `clamp()` en función de la altura del frame** (`vh` o valores fluidos), de forma que de 375px a 550px de altura todo escale suavemente.

9. **Alturas calculadas para no scrollear**:
   - Tab bar: ~52–60px (fijo, mismo del portrait).
   - Resto del contenido: `flex-1` con `overflow-hidden` para garantizar que no haya scroll.
   - Cada sección usa tamaños proporcionales (`clamp` con `vmin`/altura del frame) para que en `horizontal-mobile` (375 alto) todo encoja y en `horizontal-desktop` (550 alto) todo respire.

### Fluidez entre breakpoints

- **horizontal-mobile (667×375)**: tipografía mínima, módulos compactos (~48px), banner promo ~210×118px, comercios pequeños.
- **horizontal-desktop (1280×550)**: tipografía cómoda, módulos ~64px, banner promo ~480×270px, comercios más grandes.
- Todo se interpola con `clamp()` basado en el ancho/alto del viewport landscape — sin saltos bruscos en resoluciones intermedias (p.ej. 900×450).

## Implementación técnica

Crear un nuevo subcomponente `HomeLandscape` (o ramificar dentro de `HomeContent` cuando `landscape === true`) que renderice este layout 2-columnas + tab bar. El portrait (`HomeContent` actual) **no se toca**.

### Archivos a tocar

- `src/pages/Home.tsx`:
  - Añadir el nuevo render landscape dentro del bloque `landscape` actual (líneas 124-140), o crear `<HomeContentLandscape>` aparte y delegar.
  - Reusar `HomeModules`, `PromoCarousel`, `ComercioCarousel`, `AuthButton`, `NotificationBell`, `TabItem`, `Km0Logo` tal cual.
  - No modificar la rama portrait ni los componentes hijos (a menos que necesiten props para tamaño compacto — en ese caso usar variantes responsive con `horizontal-mobile:` / `horizontal-desktop:`).

### Verificación

Capturas en las 4 resoluciones canónicas:

1. **375×667 (vertical-mobile)** — sin regresión.
2. **768×1024 (vertical-tablet)** — sin regresión.
3. **667×375 (horizontal-mobile)** — todo el contenido visible, sin scroll.
4. **1280×550 (horizontal-desktop)** — todo el contenido visible, sin scroll, layout cómodo.

Y captura intermedia (~900×450) para confirmar fluidez.

## Pregunta antes de implementar

¿Te parece bien la división **2 columnas (izquierda: identidad + módulos + CTAs · derecha: promos + comercios) + tab bar full-width abajo**? ¿O prefieres otra distribución (p.ej. tab bar lateral izquierda tipo desktop app, o todo en una fila horizontal scrolleable)?
