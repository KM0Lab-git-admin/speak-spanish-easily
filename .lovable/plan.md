## Pantalla de Evento (portrait) con datos reales

### 1. Schema + servicio
`src/services/apiSchemas.ts`
- Añadir `eventoDetailSchema` matching el JSON subido: `id`, `familia`, `titulo_es/cat`, `descripcion_es/cat`, `descripcion_corta_es/cat`, `cp`, `poblacion`, `lugar`, `direccion`, `tipo_organizador`, `organizador`, `organizador_web`, `fuente_url_original`, `es_gratuito`, `precio`, `imagen_url`, `tags_es/cat`, `fecha_inicio/fin`, `hora_inicio/fin`, `es_recurrente`, `recurrencia`, `horarios[]` (`{fecha_inicio, fecha_fin, hora_inicio, hora_fin, es_recurrente, recurrencia}`), `categorias_slugs/es/cat`, `es_familia`, `actividades[]`, `imagenes[]` (reuso `eventImagenSchema`).
- Wrapper: `eventoDetailResponseSchema` con `{ eventos, total, limit, offset, has_more, filtros_aplicados }`.

`src/services/eventsApi.ts`
- Nueva `getEvento(id, lang)` → GET `/api/v1/eventos?id=<id>&limit=1&offset=0`.
- Devuelve un `EventoDetalle` adaptado (título/descr/tags/categoría según `lang`, imágenes con URL absoluta vía `toAbsoluteImage`).

### 2. Navegación desde Agenda
`src/pages/Agenda.tsx`
- Envolver `<EventListCard />` en `<button>`/`<Link>` que navega a `/evento?id=<id_unico_evento>`.

### 3. Rediseño de `/evento` — solo portrait, todos los datos
`src/pages/Evento.tsx` (reescritura)
- Carga vía `getEvento(id)` con id de `useSearchParams`. Estados loading / error / not-found.
- Elimino selector de variantes POC y datos mock: dejo una sola variante portrait.
- Estructura de la ficha (scroll vertical interno, sin scroll horizontal):
  1. **Hero carrusel** de `imagenes[]` (aspect ~4/3 en móvil, más alto en tablet), con back + share flotantes y overlay con gradiente.
  2. **Card flotante** superpuesta: chips de `categorias_nombres` + badges (`GRATIS`/`precio €`, `Familiar` si `es_familia`).
  3. **Título grande** (`titulo`).
  4. **Bloque "Cuándo"**: si `horarios.length > 1`, lista todas las franjas (fecha inicio–fin, hora si hay); si no, muestra `fecha_inicio` (+ `fecha_fin` si distinto) y `hora_inicio–hora_fin`. Icono calendar/clock.
  5. **Bloque "Dónde"**: `lugar`, `direccion`, `poblacion` (`cp`). Icono MapPin.
  6. **Descripción completa** (`descripcion_es` con `whitespace-pre-line` para respetar los saltos).
  7. **Organiza**: `organizador` (+ link a `organizador_web` si existe). Icono Building2.
  8. **Tags**: chips con `tags_es`.
  9. **Fuente**: link a `fuente_url_original` con `ExternalLink`.
- **CTA sticky abajo**: "Ver publicación original" (fuente_url_original) + botón share. Si no hay fuente, oculto.

### 4. Registro
`src/design-system/preview-manifest.ts` y `src/pages/PreviewAll.tsx`: actualizar el `tree` de Evento (una sola variante, ya no hero/ticket).

### Copy / i18n
Etiquetas nuevas ("Cuándo", "Dónde", "Organiza", "Etiquetas", "Ver publicación original") van a `src/lib/i18n.ts` (ca/es/en).

### Notas
- El endpoint devuelve array `eventos`, cojo `eventos[0]`.
- No toco `services/apiClient.ts` (ya enruta por el proxy).
- Solo portrait como pediste; en landscape reutilizo el mismo layout centrado con `max-w-[430px]` (mismo patrón que Home/Agenda).