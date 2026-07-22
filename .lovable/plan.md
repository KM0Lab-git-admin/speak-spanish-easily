# Notificaciones basadas en noticias

## Comportamiento

- La campana de la Home lista las últimas noticias de la API (`GET /api/v1/news?city=…&limit=20`) como notificaciones.
- Se guarda en `useAppStore` un timestamp `notificationsLastSeenAt` por usuario (persistido en localStorage).
- Una noticia se considera **no leída** si su `fecha_publicacion` es posterior a `notificationsLastSeenAt` (o si nunca se ha abierto el panel).
- Al **abrir** el drawer, se actualiza `notificationsLastSeenAt = now()` → todas quedan marcadas como leídas.
- Al **cerrar** el drawer no pasa nada extra. Si al día siguiente entra una noticia nueva, la campana vuelve a ámbar.

## Estados de la campana (`NotificationBell`)

- **Ámbar** (`bg-km0-coral-400`) → hay al menos una noticia con fecha > `lastSeenAt`.
- **Amarillo** (`bg-km0-yellow-400`) → todas leídas.
- Se elimina el estado "beige" actual: siempre uno de los dos.

## Panel lateral (drawer)

- Reutilizo `NotificationsOverlay.tsx` reconvertido a **drawer lateral derecho** con animación slide-in (Framer Motion, `x: 100% → 0`).
- Ancho: `w-full vertical-tablet:max-w-[420px]`, ocupa altura completa del contenedor de la Home.
- Cabecera "Notificacions" (i18n ca/es/en) + botón cerrar.
- Cada item: imagen miniatura de la noticia, título, fecha relativa, dot ámbar si no leída. Tap → navega a `/noticias/:id` y cierra el drawer.
- Estados: loading (skeletons), error (mensaje + retry), vacío ("Encara no tens notificacions").

## Cambios técnicos

1. **`src/stores/useAppStore.ts`**: añadir `notificationsLastSeenAt: string | null` y acción `markNotificationsSeen()`. Persistido.
2. **`src/hooks/useNotifications.ts`**: reescribir para consumir `useNewsList()` (o llamada equivalente vía `newsApi`) y derivar `unreadCount` comparando `fecha_publicacion` con `notificationsLastSeenAt`. Devuelve `{ items, hasUnread, loading, error, markAllSeen }`.
3. **`src/data/notifications.ts`**: eliminar mocks `INITIAL_NOTIFICATIONS` (ya no se usan) o vaciar tipos si están referenciados en otro sitio.
4. **`src/components/NotificationBell.tsx`**: prop `state: "unread" | "read"` (o mantener `hasAlerts`) y aplicar amarillo/ámbar al dot.
5. **`src/components/NotificationsOverlay.tsx`** → renombrar mentalmente a drawer: cambiar animación (`x` en lugar de `y`), layout lateral, y renderizar items de noticia (imagen + título + fecha).
6. **`src/pages/Home.tsx` / `HomeHero.tsx`**: al abrir → `markAllSeen()` antes de mostrar; pasar el nuevo estado al bell.
7. **`src/lib/i18n.ts`**: claves `notifications.title`, `notifications.empty.*`, `notifications.error.*`, `notifications.loading`.
8. **`preview-manifest.ts`**: actualizar estado del bell y del drawer.

## Fuera de scope

- Notificaciones push del navegador.
- Marcar noticias individuales como leídas (el criterio es global por timestamp).
- Otros orígenes de notificación (eventos, cupones): solo noticias por ahora.
