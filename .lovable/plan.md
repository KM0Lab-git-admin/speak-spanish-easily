# Landscape Home — un solo componente, Portrait intocable

## Objetivo

Entregar una versión landscape definitiva del Home usando el mismo `HomeContent.tsx`, con distribución en 2 columnas, y sin modificar el Portrait actual en 375×667 ni 768×1024.

La prioridad absoluta es que la captura Portrait actual quede igual. El landscape se resuelve únicamente con clases de orientación landscape.

## Por qué falló el intento anterior

El intento anterior no respetó una frontera operativa suficientemente estricta: se hicieron cambios en estructura/clases compartidas que también afectan al flujo Portrait. Aunque la intención era arreglar landscape, al tocar valores comunes el Portrait cambió. Eso invalida el trabajo.

Esta vez la regla no es “tener cuidado”; la regla es verificable: en un cambio solo-landscape no se tocan clases base, no se tocan clases `vertical-*`, no se cambia `Home.tsx`, no se crean componentes alternativos y no se modifica ningún hijo compartido.

## Regla de oro obligatoria

Cuando el cambio sea solo-landscape:

1. Solo se pueden añadir o editar clases con prefijo `horizontal-mobile:` o `horizontal-desktop:`.
2. Prohibido usar `landscape:` dentro de componentes reutilizados en `/preview-all`, porque depende del viewport real del navegador y contamina también el frame Portrait simulado.
3. Prohibido modificar clases base de Tailwind ya existentes.
4. Prohibido modificar clases `vertical-mobile:` o `vertical-tablet:`.
5. Prohibido cambiar el orden DOM que usa Portrait.
6. Prohibido editar componentes hijos: `HomeModules`, `EventHeroCarousel`, `ComercioCarousel`, `CouponCard`, `PointsCard`, `GreetingBlock`, `BottomTabs`, `LoginButton`.
7. Prohibido editar `Home.tsx`, `tailwind.config.ts` y `src/data/`.
8. Si Portrait cambia aunque sea visualmente mínimo, el cambio se considera erróneo.

## Alcance técnico

Único archivo de aplicación a tocar:

- `src/components/HomeContent.tsx`

No se crearán archivos nuevos.

No se modificará `Home.tsx`.

No se tocarán datos, breakpoints ni componentes compartidos.

## Layout objetivo en landscape

```text
┌──────────────────────────────────────────────────────────────┐
│ Header existente compacto                                    │
├──────────────────────────────────────────────────────────────┤
│ Saludo + PointsCard en formato landscape                     │
│ Login centrado si no hay sesión                              │
├──────────────────────────────┬───────────────────────────────┤
│ Columna izquierda            │ Columna derecha               │
│ Accesos rápidos              │ Descubre lo nuestro           │
│ Eventos destacados           │ Promos para ti                │
├──────────────────────────────┴───────────────────────────────┤
│ BottomTabs fijo                                               │
└──────────────────────────────────────────────────────────────┘
```

El Portrait mantiene su flujo actual: hero con saludo/puntos, CTA de login, Accesos rápidos, Eventos, Descubre, Promos, todo apilado.

## Cambios previstos en `HomeContent.tsx`

### 1. Mantener Portrait como flujo base

La estructura actual seguirá siendo la fuente de verdad para Portrait. No se reordenará el JSX base.

Las clases actuales sin prefijo y las clases `vertical-*` quedan congeladas.

### 2. Añadir una capa landscape al contenedor de secciones

Sobre el contenedor que hoy apila las secciones se añadirán únicamente clases `horizontal-mobile:` / `horizontal-desktop:` para convertirlo en grid de 2 columnas en landscape.

Ejemplo de intención, sin tocar los valores base existentes:

```text
horizontal-mobile:grid
horizontal-mobile:grid-cols-2
horizontal-desktop:grid
horizontal-desktop:grid-cols-2
```

### 3. Reordenar solo en landscape

Cada sección recibirá orden únicamente con prefijo `horizontal-mobile:` / `horizontal-desktop:`:

- Accesos rápidos: primera posición de la columna izquierda.
- Eventos destacados: segunda posición de la columna izquierda.
- Descubre lo nuestro: primera posición de la columna derecha.
- Promos para ti: segunda posición de la columna derecha.

Portrait seguirá usando el orden DOM actual.

### 4. Compactar solo en landscape

Los ajustes de altura, separación y tipografía se harán solo con:

- `horizontal-mobile:` para 667×375.
- `horizontal-desktop:` para 1280×550.

No se tocarán textos, datos ni estados.

### 5. Scroll y overflow

Se mantiene `overflow-x-hidden`.

El landscape no debe crear scroll horizontal. Si el contenido vertical no cabe, se permite scroll-y interno del body existente, pero el objetivo es que el primer encuadre sea estable y legible en 667×375 y 1280×550.

## QA obligatorio antes de darlo por bueno

Validar las 4 resoluciones oficiales:

- 375×667 portrait: debe verse igual que la captura actual.
- 768×1024 portrait: debe verse igual que el estado actual.
- 667×375 landscape: layout 2 columnas, sin scroll-x, textos visibles.
- 1280×550 landscape: layout 2 columnas con más aire, sin romper proporciones.

Condición de aceptación: si cualquiera de las dos resoluciones Portrait cambia, se revierte la clase concreta que lo causó antes de entregar.

## Resultado esperado

Una única implementación en `HomeContent.tsx`, sin duplicar componentes, donde Portrait queda protegido por regla y landscape se resuelve por orientación con los breakpoints oficiales del proyecto.