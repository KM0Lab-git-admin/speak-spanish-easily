# Refactor de `HomeModules.tsx`

Alcance limitado a `src/components/HomeModules.tsx` (presentacional puro).
No se tocan otras pantallas ni la API pública del componente (`modules`,
`className`, tipos `HomeModule` / `HomeModuleId`). Todo change scoped a
mobile-first + `vertical-tablet:` (aislamiento por resolución).

---

## 1. Inconsistencias / deuda técnica

- Eliminar imports muertos: `Trophy`, `Ticket`, `type LucideIcon` y el
  mapa `ICONS` (`punts`/`cupons` ya no se usan como iconos Lucide, todos
  los módulos actuales son imágenes PNG).
- Eliminar la rama `Icon` en `ModuleItem` y su lógica derivada
  (`isImage`, `iconSize`, `iconColor` para no-imagen). Todos los módulos
  renderizan `<img>`.
- Simplificar `ICON_COLOR` → eliminarlo (no aporta con solo imágenes) o
  reducir a un mapa `IMAGE_SRC` limpio: `Record<HomeModuleId, string>`.
- Eliminar prop `emphasized` (siempre `false` desde el padre) y el
  comentario "Solo soporta exactamente 3 módulos" (ya son 4).
- Actualizar el bloque de comentario superior: quitar referencias a
  "banda azul", "borde azul", "círculo central más grande" — hoy la
  banda es `bg-km0-beige-100` y no hay módulo central destacado.
- Quitar los dos `<div aria-hidden />` decorativos con `bg-white/5`: son
  invisibles sobre beige (solo tenían sentido sobre azul saturado).

## 2. Accesibilidad

- Cambiar `<button aria-pressed={active}>` → `<button aria-disabled=
  {!active} disabled={!active}>`. Estos accesos son navegación, no
  toggles; `aria-pressed` es semánticamente incorrecto.
- Quitar `aria-label={label}` (duplica el texto visible del pill). El
  `<span>` con el label ya da nombre accesible al botón.
- Añadir `focus-visible:outline-2 focus-visible:outline-km0-blue-500
  focus-visible:outline-offset-2 rounded-2xl` en el `<button>` para
  indicador de foco visible (hoy no hay).
- Asegurar tap target ≥ 44×44: el `<button>` ya envuelve círculo+pill;
  añadir `min-h-11` para garantizarlo en cualquier resolución.

## 3. Diseño / consistencia

- Añadir variante `vertical-tablet:` a tamaños del círculo (hoy solo
  hay `base` y `horizontal-mobile:`). Propuesta:
  `w-[68px] h-[68px] vertical-tablet:w-[84px] vertical-tablet:h-[84px]`
  para aprovechar el ancho del tablet portrait.
- Escalar el pill del label en `vertical-tablet:` a `text-[11px]` y
  `px-2 py-0.5` (hoy queda diminuto en 768×1024).
- Homogeneizar padding interno de las imágenes: hoy `ajuntament` y
  `comerc` llevan `p-2.5` y las otras no. Mover a un único mapa
  `IMAGE_PADDING` por id para que sea explícito y previsible.
- Revisar la "curva orgánica" (`rounded-bl-[40%_24px]
  rounded-br-[40%_24px]`) — con `bg-km0-beige-100` sobre fondo también
  beige la curva no se ve. Opciones (a elegir en implementación):
  (a) quitar el redondeo y dejar `rounded-3xl` liso, o
  (b) cambiar el fondo de la banda a `bg-white` para que la curva
      recupere su papel visual. Sugerencia: (a) por simplicidad.

## Detalles técnicos

- Cero cambios en `HomeContent.tsx` ni en el manifest/preview: la firma
  pública de `HomeModules` y `HomeModule` se mantiene.
- Sin nuevas dependencias, sin tokens nuevos.
- Verificación: `tsgo` para tipos; revisión visual la haces tú (sin
  screenshots automáticas, por tu preferencia).

```text
HomeModules
├── banda beige (curva | plana)
└── grid 4 cols
    └── ModuleItem × N
        ├── sombra elíptica
        ├── círculo blanco  ← imagen PNG
        └── pill label      ← da nombre accesible
```
