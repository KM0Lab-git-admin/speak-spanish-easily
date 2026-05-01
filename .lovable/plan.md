## Objetivo

Generar **2 mockups PNG estáticos** de la pantalla Home sin registro, a 375×667 (vertical-mobile), fullbleed (sin BrandedFrame), copy en español, aplicando el design system KM0 LAB. Sin tocar el código de la app — solo imágenes para iterar visualmente.

## Estructura propuesta (común a las 2 variantes)

Basada en tu captura de referencia, reordenada y reinterpretada con el lenguaje KM0:

```text
┌──────────────────────────────────┐
│ Status bar mock (9:41)           │
├──────────────────────────────────┤
│ HEADER                           │
│  "Canet de Mar"  (font-brand)   │
│  KM0 LAB® logo    🔔 notif      │
├──────────────────────────────────┤
│ ACCESOS RÁPIDOS (3 chips)        │
│  [💬]      [🏆]      [🎁]       │
│  KM0 CHAT  Puntos    Cupones    │
├──────────────────────────────────┤
│ CTA AUTH (2 botones primarios)   │
│  [ Iniciar sesión ][ Registro ] │
├──────────────────────────────────┤
│ SECCIÓN: "Promos y eventos       │
│           destacados"            │
│  ┌──────────────────────────┐   │
│  │  Hero card carrusel       │   │
│  │  (placeholder ilustrado)  │   │
│  └──────────────────────────┘   │
│  • • ● • • • • •  (dots)        │
├──────────────────────────────────┤
│ SECCIÓN: "Comercios populares"   │
│           [ Ver todos → ]        │
│  (○) (○) (○) (○) (○)  scroll H  │
│  Sanaït Vidal Manitas Champ ...  │
├──────────────────────────────────┤
│ TAB BAR inferior                 │
│  🏠 Home   ℹ️ Info   👤 Perfil  │
└──────────────────────────────────┘
```

## Las 2 variantes

Ambas tienen la **misma jerarquía y bloques**. Solo cambia la "temperatura" cromática para decidir el tono visual:

- **Variante A — Cálida**: dominante `km0-yellow` en banda de accesos rápidos (como tu referencia), `km0-blue-700` en CTAs, fondo `km0-beige-50`. Más vibrante, festiva.
- **Variante B — Fresca**: dominante `km0-teal` en banda de accesos rápidos, mismos `km0-blue-700` en CTAs, fondo `km0-beige-50`. Más sereno, "marca KM0 pura".

## Tokens del design system aplicados

- **Colores**: solo paleta `km0-blue / beige / yellow / teal` y semánticos. Sin hex crudos.
- **Tipografías**:
  - `font-brand` (Antique Olive Black) → "Canet de Mar", títulos de sección.
  - `font-ui` (Inter / Antique Olive Bold) → labels de chips, botones, "Ver todos".
  - `font-body` → nombres de comercios, copy secundario.
- **Radius**: `rounded-2xl` para cards y botones, `rounded-full` para chips circulares y avatares de comercio.
- **Sombras**: suaves estilo `shadow-[0_8px_24px_-12px_hsl(var(--km0-blue-700)/0.2)]`.
- **Espaciado**: ritmo vertical generoso (gap 5–7), márgenes laterales 4.

## Cómo lo voy a generar

1. **Skill `canvas-design`** — escribir un script Python que renderiza cada variante a 375×667 usando PIL, dibujando los bloques con los HSL exactos del design system (los leo de `src/design-system/tokens.ts`).
2. Para los iconos uso glifos simples (lucide-style) dibujados en código o SVG inline.
3. Para el hero "Promos y eventos" uso un bloque ilustrado generado con IA (`google/gemini-2.5-flash-image`) en estilo coherente con KM0 (colores beige/azul/amarillo, tipografía gestual tipo "Festa Sant Roma 2024").
4. Salida: `/mnt/documents/home-v1-calida.png` y `/mnt/documents/home-v1-fresca.png`.
5. **QA visual obligatoria**: abro cada PNG, reviso clipping, contrastes, alineación, tipografías. Itero hasta dejarlo limpio antes de entregártelo.

## Lo que NO hago en este paso

- No toco `src/pages/`, `src/components/` ni rutas.
- No creo la pantalla en código.
- No toco el design system ni los tokens.
- No genero las otras 3 resoluciones (las dejamos para cuando aprobemos estructura).

## Siguiente iteración

Una vez veas las 2 variantes me dices:
1. Cuál es la base (A, B, mezcla, o pivote).
2. Qué bloques cambiar (orden, tamaño, contenido).
3. Cuándo te convenza, entramos **módulo por módulo** como propones (header → chips → CTA auth → carrusel → comercios → tab bar) y ahí ya sí maquetamos en código real.
