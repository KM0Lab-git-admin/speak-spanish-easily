# Plan: navegación completa + auth + i18n

## 1. Idioma global persistente

**Nuevo:** `src/contexts/LangContext.tsx` con `LangProvider` + `useLang()`.
- Estado: `lang: "ca" | "es" | "en"`, `setLang(l)`.
- Persistencia en `localStorage` (`km0_lang`), fallback `"es"`.
- Envolver `<App />` en `<LangProvider>` (en `main.tsx` o `App.tsx`).

**Nuevo:** `src/lib/i18n.ts` — diccionario plano por claves anidadas, tipado, helper `t(key, lang)`.
Estructura:
```
{ language:{title,...}, postal:{...}, login:{...}, otp:{...},
  home:{greetingHello, greetingSubtitle, sections:{quickAccess,events,shops,coupons,seeAll,seeAllF}, modules:{...}, tabs:{home,chat,profile,login}},
  profile:{...} }
```
Cubre **ca / es / en** completo.

- `Language.tsx`: al elegir idioma → `setLang(id)` antes de navegar.
- Resto de pantallas: leen `lang` desde `useLang()` (no router state).

## 2. Códigos postales

- Migración insert: `INSERT INTO postal_codes(postal_code, town, province) VALUES ('03669','Planes','Alacant') ON CONFLICT DO NOTHING;` (Malgrat ya está).
- `PostalCode.tsx`: textos vía `t(...)`. Quitar dependencia del `state.lang`.

## 3. Flujo Onboarding → PostalCode → Home

- Onboarding ya navega a `/postal-code` ✓.
- `PostalCode` tras submit: navega a `/home` (sin state).
- Persistimos `km0_postal_code` y `km0_town` en `localStorage` (no sessionStorage) para sobrevivir recargas y poder leerse desde Home como `cityName` antes de tener perfil.

## 4. Auth — flujo OTP existente

El flujo ya existe (`Login.tsx` + `CheckEmail.tsx` + trigger `handle_new_user`). Cambios:

- Traducir Login y CheckEmail con `t(...)`.
- En `Login`: pasar `postal_code` + `town` desde `localStorage` (ya lo hace con sessionStorage; cambiamos a localStorage).
- Verificar que `signInWithOtp` con `shouldCreateUser: true` + `data: { postal_code, town }` puebla `profiles` vía trigger ✓ (ya implementado).
- Tras `verifyOtp` correcto → `navigate("/home")`.

## 5. Home — UI condicional según sesión

Cambios en `src/pages/Home.tsx` (props compartidos) y `HomeContent.tsx` / `HomeContentLandscape.tsx`:

| Elemento            | Invitado (sin sesión)  | Registrado            |
|---------------------|------------------------|-----------------------|
| LoginButton         | **Visible**            | Oculto                |
| PointsCard          | **Oculto**             | **Visible**           |
| GreetingBlock name  | `null` → "¡Hola!"      | `profile.first_name` si existe, si no `null` → "¡Hola!" |
| BottomTabs profile  | Oculto                 | Visible               |

- `GreetingBlock`: ya soporta `name?: null` → muestra "¡Hola!". Sin cambios estructurales, solo i18n del subtitle.
- `HomeContent`: envolver `<PointsCard>` en `{showProfile && <PointsCard .../>}` (showProfile=registrado).
- `cityName`: leer de `profile.town` si registrado, si no de `localStorage.km0_town`, fallback `"Malgrat de Mar"`.

## 6. Hook `useProfile`

**Nuevo:** `src/hooks/useProfile.ts` — carga `profiles` del user actual (first_name, last_name, town, postal_code). Devuelve `{ profile, loading }`. Se invalida en `onAuthStateChange`.

`Home.tsx` lo usa para alimentar `userName` y `cityName`.

## 7. Traducción de Home completa

- Section headers, "Ver todos/todas", subtítulo greeting, etiquetas de `BottomTabs` y nombres de módulos en `HomeModules` → todos a través de `t(...)`. Para módulos: añadir `labelKey` a `INITIAL_MODULES` (`src/data/homeModules.ts`) y resolver `t(labelKey)` en el render.

## 8. Profile

- Traducir labels, placeholders y botones con `t(...)`.
- Selector de idioma opcional dentro de Profile (deseable pero no bloqueante; lo incluyo como subapartado pequeño al final del form).

## Archivos a crear

- `src/contexts/LangContext.tsx`
- `src/lib/i18n.ts`
- `src/hooks/useProfile.ts`
- Migración SQL: insertar CP `03669` Planes.

## Archivos a modificar

- `src/main.tsx` o `src/App.tsx` — envolver con `LangProvider`.
- `src/pages/Language.tsx` — `setLang`, textos del título via t.
- `src/pages/Onboarding.tsx` — usar `useLang`, textos via t (mínimo: botón).
- `src/pages/PostalCode.tsx` — `useLang`, persistencia en localStorage.
- `src/pages/Login.tsx` — i18n, leer CP+town de localStorage.
- `src/pages/CheckEmail.tsx` — i18n.
- `src/pages/Home.tsx` — usar `useAuth` + `useProfile` + `useLang` para construir props (userName, cityName, showLogin, showProfile, showPoints).
- `src/components/HomeContent.tsx` y `HomeContentLandscape.tsx` — render condicional de `PointsCard` (nueva prop `showPoints`), strings via t.
- `src/components/GreetingBlock.tsx` — props `helloLabel` + `subtitle` desde t.
- `src/components/BottomTabs.tsx` — labels via t.
- `src/components/HomeModules.tsx` + `src/data/homeModules.ts` — `labelKey` traducible.
- `src/pages/Profile.tsx` — i18n.

## Detalles técnicos

- `useLang()` no causa re-render innecesario: `value = useMemo({lang,setLang})`.
- `useProfile()` usa `react-query` (`queryClient` ya disponible) para cachear y refrescar tras login.
- En invitado (`!user`), `useProfile` devuelve `{profile: null, loading: false}` sin tocar Supabase.
- RLS de `profiles` ya restringe a `auth.uid() = user_id` ✓.

## Fuera de alcance

- Selector de idioma post-onboarding (lo dejamos como mini-control en Profile, opcional).
- OAuth Google/Apple (siguen como "próximamente" en Login).
- Sistema real de puntos (PointsCard sigue con datos fake hasta tener backend).
