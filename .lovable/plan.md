## Objetivo

Reducir la fricción de entrada: login y signup pasan a ser exactamente el mismo flujo (passwordless por email + Google/Apple). En la Home solo aparece "Iniciar sesión", colocado junto a la campana de notificaciones, y solo si el usuario no tiene sesión activa. Los datos extra (nombre, apellidos, etc.) se pedirán más adelante en una pantalla de "Editar perfil" que NO entra en este plan.

## Cambios

### 1. Unificar Login y SignUp en una sola pantalla `/login`

Reescribir `src/pages/Login.tsx` para que sea el único punto de entrada:

- Un único campo: **email**.
- Botón único: **"Continuar"**.
- Llama a `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: ${origin}/home } })`.
  - Con `shouldCreateUser: true`, Supabase crea la cuenta si el email no existe y la reutiliza si ya existe → mismo flujo para ambos casos.
  - No se piden nombre ni apellidos aquí (irán al editar perfil).
- Mantiene `<SocialAuthButtons />` (Google + Apple) tal cual.
- Tras enviar, navega a `/check-email` con `state: { email, mode: "login" }` (el modo deja de ser relevante para la lógica, pero CheckEmail ya lo recibe).
- Copy: título "Entra o regístrate", subtítulo "Te enviaremos un enlace a tu email".
- Se elimina el enlace "¿No tienes cuenta? Regístrate" (ya no hay diferencia).

### 2. Eliminar `/signup`

- Borrar `src/pages/SignUp.tsx`.
- Quitar de `src/App.tsx` el import y la ruta `/signup`.
- Buscar enlaces a `/signup` en el resto del proyecto y reemplazarlos por `/login` (por si CheckEmail u otra pantalla lo enlaza).

### 3. Home: quitar el bloque de CTAs y mover "Iniciar sesión" junto a la campana

En `src/pages/Home.tsx`:

- **Eliminar** el `<motion.section>` de CTAs Auth completo (líneas ~255-268), incluyendo el spacer flex que solo lo separaba (revisar el spacer flex de la línea 271 — se mantiene si sigue aportando reparto vertical en `vertical-mobile`, si no se elimina también).
- **Eliminar** los imports `UserRound`, `UserRoundPlus` si ya no se usan, y el componente local `AuthButton` (líneas ~370+) si no queda ningún consumidor.
- En el overlay del hero (línea ~233, donde está `NotificationBell`), envolver la campana y el nuevo CTA en un contenedor `flex items-center gap-2` (preservando `shrink-0`):
  - Si `useAuth().user` es `null` y `loading` es `false` → renderizar un botón compacto **"Iniciar sesión"** que navegue a `/login` con `useNavigate()`.
  - Si hay sesión → no se renderiza nada (solo la campana).
- El botón usa estilo coherente con la marca: pill pequeña con `bg-km0-yellow-500 text-km0-blue-700 font-ui`, altura compacta para no romper el header en `horizontal-mobile`. Variantes responsive con los breakpoints oficiales (`vertical-mobile`, `vertical-tablet`, `horizontal-mobile`, `horizontal-desktop`) para tamaño de fuente y padding.
- En `horizontal-mobile` (header más comprimido) se reduce padding y tamaño para no chocar con el escudo + nombre del municipio.

### 4. Verificación responsive

Comprobar visualmente en las 4 resoluciones oficiales (375×667, 768×1024, 667×375, 1280×550) que:
- El header (escudo + nombre + Km0Logo + [CTA login] + campana) cabe sin overflow.
- Las promos y "Esto es para ti" se reflujen correctamente al haber eliminado los CTAs intermedios.
- En `vertical-mobile` los spacers `flex-1` siguen distribuyendo el contenido sin scroll.

## Detalles técnicos

- `useAuth` ya expone `user` y `loading` — se importa en `HomeContent` (o en `Home` y se pasa por prop) para decidir si mostrar el botón. Recomendado pasarlo como prop `showLogin: boolean` para mantener `HomeContent` desacoplado.
- `signInWithOtp` con `shouldCreateUser: true` ya envía link mágico a `/home` (donde `RequireAuth` o el listener completarán el login). Si la cuenta se crea por primera vez, el trigger `handle_new_user` dejará el `profiles` con `first_name`/`last_name` vacíos — la futura pantalla "Editar perfil" los rellenará.
- `CheckEmail` no necesita cambios funcionales.
- Memoria a actualizar: `mem://funcionalidades/autenticacion` debe reflejar que ya no existe `/signup` y que `/login` cubre ambos casos.

## Fuera de alcance

- Pantalla "Editar perfil" para capturar nombre/apellidos/datos extra.
- Cambios en RLS, tabla `profiles` o triggers.
- Cambios en el flujo OAuth de Google/Apple.
