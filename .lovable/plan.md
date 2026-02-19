
## Maquetación: Pantalla "Select Your Language" — KM0 LAB

### 1. Configuración del Design System en Tailwind
Definir las variables CSS del sistema KM0 LAB en `src/index.css`:
- **Colores principales**: KM0 Blue (`#174094`), KM0 Beige (`#FFECD2`), KM0 Yellow (`#F7B528`), KM0 Teal (`#00B8A9`) y sus escalas completas (50–900)
- **Fuentes**: Importar desde Google Fonts — `Inter` (ya disponible), y añadir `Oakes Grotesk` (alternativa: `DM Sans` como sustituto si no está disponible en Google Fonts)
- Registrar las familias en `tailwind.config.ts` como `font-brand` (Antique Olive), `font-ui` (Inter) y `font-body` (Oakes Grotesk)

### 2. Estructura de la Página (pantalla móvil)
La pantalla está diseñada para móvil (max-width ~390px centrado en pantalla):

- **Fondo**: Gradiente suave en tono beige/crema (`km0-beige-50` a `km0-beige-100`)
- **Logo KM0 LAB**: Imagen/SVG del logo en la parte superior centrado
- **Mascota robot**: Imagen de la mascota flotando con puntos decorativos en teal alrededor
- **Título**: "Select your language" — Heading 1 en `Antique Olive Bold`, color `km0-blue-700`
- **Subtítulo**: "Which language would you like to start with?" — Paragraph 2 en `Inter Regular`, color gris suave

### 3. Componente `LanguageCard`
Cada opción de idioma es una card interactiva con:
- **Borde**: Punteado/dashed en color `km0-yellow-500` (`#F7B528`)
- **Fondo**: Blanco con radio de borde generoso (rounded-2xl)
- **Contenido**: Emoji bandera circular | Nombre del idioma en bold (`Inter Semibold`) | Descripción en gris (`Oakes Grotesk Regular 14px`) | Flecha `→` a la derecha
- **Hover state**: Ligera elevación (`shadow-md`) y transición suave
- **Idiomas**: Català 🏴󠁥󠁳󠁣󠁴󠁿, Español 🇪🇸, English 🇬🇧

### 4. Layout y Componentes React
- **Página principal** (`src/pages/Index.tsx`): Layout full-height centrado, con la estructura completa de la pantalla
- **Componente `LanguageCard`** (`src/components/LanguageCard.tsx`): Card reutilizable con props `flag`, `name`, `description`, `onClick`
- **Componente `FloatingDots`** (`src/components/FloatingDots.tsx`): Puntos decorativos en teal con posicionamiento absoluto alrededor de la mascota

### 5. Assets
- Copiar la imagen de referencia como placeholder de la mascota hasta que se tenga el asset definitivo
- El logo KM0 LAB se renderizará como texto estilizado con el diseño del badge azul marino si no hay SVG disponible

### 6. Interactividad básica
- Al hacer click en una card de idioma, se muestra un estado "seleccionado" visual (borde más grueso, fondo ligeramente coloreado)
- Animación de entrada suave para las cards (fade-in escalonado)
