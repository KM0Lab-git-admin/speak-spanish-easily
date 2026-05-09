## Objetivo

Mover el mapa CP → población de `src/lib/postalCodes.ts` (hardcoded) a una tabla en base de datos, para que tanto la pantalla de código postal como el perfil consulten la misma fuente y se pueda ampliar sin tocar código.

## Cambios

### 1. Base de datos

Nueva tabla `public.postal_codes`:
- `postal_code` (text, PK) — el CP de 5 dígitos
- `town` (text, not null) — nombre de la población
- `province` (text, nullable) — por si más adelante queremos filtrar
- `created_at`, `updated_at`

RLS:
- SELECT público (cualquiera puede consultar, incluso sin login — la pantalla de CP es previa al registro)
- Sin INSERT/UPDATE/DELETE públicos (gestión interna)

Seed inicial con los 10 CPs actuales del fichero `postalCodes.ts` (Barcelona, Malgrat de Mar, Mataró, Granollers, Sabadell, Terrassa, Vilanova i la Geltrú, Gavà, L'Hospitalet, Cornellà).

### 2. Capa de acceso

Reescribir `src/lib/postalCodes.ts` para exponer una API async basada en Supabase, manteniendo la firma simple:

```ts
export async function lookupTown(postalCode: string): Promise<string | null>
```

Cache en memoria (Map) para evitar repetir queries del mismo CP en una misma sesión. Sin React Query para mantenerlo neutro (lo usan tanto Profile como PostalCode).

### 3. Pantallas

- **`src/pages/PostalCode.tsx`**: el `useEffect` que valida el CP ya tiene un timeout de 1.2s simulado — sustituirlo por la llamada real a `lookupTown(value)`. El estado `validationResult` y `cityName` siguen igual.
- **`src/pages/Profile.tsx`**: el `town` ahora es async. Añadir un `useEffect` que recalcule `town` cuando cambia `form.postal_code`, guardándolo en estado local. El input de población sigue read-only.

### 4. Limpieza

Eliminar el objeto `postalCodes` exportado del fichero (ya no se usa directamente en componentes). Si algún test lo referencia, actualizarlo.

## Notas técnicas

- La tabla NO referencia `auth.users`: es un catálogo público.
- Se mantiene la validación de formato (5 dígitos numéricos) en cliente antes de consultar.
- El trigger `handle_new_user` sigue guardando `postal_code` y `town` en `profiles` desde `user_metadata` — no se cambia.
- En el futuro se puede sustituir el seed manual por un import masivo (CSV oficial de Correos) sin tocar la app.

## Fuera de alcance

- No se añade UI de administración del catálogo.
- No se geocodifica ni se añaden coordenadas (solo nombre de población).
- No se cambia el flujo de onboarding ni el guardado en `sessionStorage`.
