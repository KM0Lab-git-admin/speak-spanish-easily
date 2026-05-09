# Análisis de Home en vertical-mobile (375×667)

## Conclusiones de la auditoría visual

Tras inspeccionar la captura real y el código (`src/pages/Home.tsx`), detecto **5 problemas de maquetación** específicos del breakpoint `vertical-mobile`:

### 1. Botón "Iniciar sesión" flota desconectado
El botón vive en su propia `section` (líneas 277-293) entre el hero y los módulos, con `mt-1` y los módulos tienen `-mt-6` (overlap). Resultado: el botón queda visualmente *atrapado* entre dos zonas (skyline beige arriba, card de módulos abajo) sin pertenecer a ninguna. Parece un elemento huérfano.

### 2. Tres spacers `flex-1` repartiendo aire vacío
Hay 3 divs vacíos con `vertical-mobile:flex-1` (líneas 306, 326, 368) que reparten el espacio sobrante por toda la columna. Esto genera **huecos grandes y desiguales** entre secciones. El usuario percibe vacío, no respiración.

### 3. Hero ocupa ~33% de la altura
El hero usa `aspect-[1920/716]` → en 375px de ancho ocupa ~140px de alto. En una pantalla de 667px (menos 60px de tab bar = 607px útiles), eso es ~23% solo de skyline decorativo. Aceptable, pero combinado con el botón flotante y los spacers, presiona el contenido útil.

### 4. "Esto es para ti" muy apretado contra la tab bar
Por culpa del spacer final (línea 368, `flex-1`), las cards de comercios quedan empujadas pegadas a la tab bar sin margen visual.

### 5. Indicador de paginación del PromoCarousel choca con "Esto es para ti"
Los puntitos del carrusel quedan a 0px del header "🎫 Esto es para ti" porque el spacer entre ambos (línea 326) absorbe todo el aire arriba en vez de dejar separación local.

---

## Plan de corrección (solo `vertical-mobile`, resto intacto)

### A. Anclar el CTA "Iniciar sesión" al header
Mover el botón al overlay del hero (líneas 257-273), junto a la campana, en lugar de tenerlo como sección separada. Tamaño compacto (`text-xs px-3 py-1`). En vertical-mobile cabe junto al escudo+nombre+logo+campana porque el ancho disponible (375px) es suficiente con el botón pequeño.

→ **Eliminar** la `motion.section` independiente (líneas 278-293).
→ **Mostrar** el botón también en portrait dentro del overlay del header (quitar `hidden landscape:inline-flex`).

### B. Reducir spacers `flex-1` de 3 a 1
Sustituir los 3 `flex-1` por márgenes verticales fijos y dejar **un único** `flex-1` al final (antes de la tab bar) para absorber el sobrante en pantallas más altas.

- Línea 306 (entre módulos y promos): cambiar `flex-1` por `mt-3`.
- Línea 326 (entre promos y "Esto es para ti"): cambiar `flex-1` por `mt-4`.
- Línea 368 (final): mantener `flex-1` (es el único que reparte aire residual).

### C. Restaurar `-mt-8` en los módulos
Al quitar el botón intermedio, el overlap natural de los módulos sobre el hero vuelve a funcionar. Cambiar `-mt-6` → `-mt-8`.

### D. Verificar
- Captura a 375×667 → comprobar: header con login compacto + campana, módulos pegados al hero, promos con respiración mínima, "Esto es para ti" con un poco de aire sobre la tab bar, sin scroll.
- Captura a 768×1024 (vertical-tablet) → verificar que sigue ok.
- Captura a 667×375 y 1280×550 (landscape) → no se tocan, deben quedar idénticas.

## Detalles técnicos

```text
Header overlay (vertical-mobile):
┌─────────────────────────────────────────┐
│ [escudo] Malgrat de Mar  [Iniciar][🔔] │
│          [KM0LAB]                       │
└─────────────────────────────────────────┘
        ↓ skyline ↓
        ↓ módulos (-mt-8 overlap) ↓
        ↓ mt-3 ↓
        ↓ Promos + carrusel ↓
        ↓ mt-4 ↓
        ↓ Esto es para ti + carrusel ↓
        ↓ flex-1 (absorbe sobrante) ↓
        ↓ Tab bar ↓
```

**Archivos a tocar:** solo `src/pages/Home.tsx`. Sin cambios en componentes hijos, sin nuevas dependencias.

**Fuera de alcance:** estética del hero, datos, navegación, otros breakpoints.