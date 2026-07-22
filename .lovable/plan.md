## Cambios en Agenda

**`src/components/WhenTabs.tsx`**
- Dejar solo 2 tabs en `WHEN_TABS`:
  - `{ key: "semana", label: "Esta semana" }`
  - `{ key: "mes", label: "Próximos 30 días" }`
- Cambiar el grid de `grid-cols-3` → `grid-cols-2`.

**`src/pages/Agenda.tsx`**
- En `rangeFor`, cambiar el caso `"mes"` para que devuelva `[hoy, hoy + 30 días]` en vez de "hasta fin de mes natural".
- Eliminar el caso `"trimestre"` (ya no se usa).

La query a la API sigue igual (`fecha_desde` = hoy, `fecha_hasta` = hoy+30), solo cambia el rango calculado.