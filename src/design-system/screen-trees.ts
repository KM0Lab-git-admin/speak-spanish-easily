/**
 * Árboles de componentes por pantalla. Fuente de verdad para el panel
 * de inspección (`/inspect/*`) y para el catálogo `/preview-all`.
 *
 * Mantén cada entrada sincronizada con la composición real de la
 * pantalla; si cambias la estructura, actualiza también su árbol aquí.
 */
export const SCREEN_TREES: Record<string, string> = {
  home: `(NO usa BrandedFrame — DeviceShell propio, con el MISMO tamaño de frame que BrandedFrame en cada resolución)
│
├── Portrait  (landscape:hidden) → HomeContent
│   ├── HomeHero               ← header FIJO (inline=true; showLogin={!user})
│   │   ├── skyline malgrat    (bg absoluto, object-top, opacity-25)
│   │   ├── fila header        (escudo + ciudad + KM0 + bell + LoginButton si !user)
│   │   └── greetingSlot
│   │       ├── GreetingBlock  ← "👋 ¡Hola, {name}!" + subtítulo
│   │       ├── JoinCard       (solo si !user — CTA "Crea el teu compte")
│   │       └── PointsCard     (solo si showPoints — usuario auth)
│   ├── body scroll-y
│   │   ├── section "Accesos rápidos"     → HomeModules
│   │   ├── section "Eventos destacados"  → EventHeroCarousel
│   │   ├── section "Descubre lo nuestro" → ComercioCarousel
│   │   └── section "Bescanvia amb punts" → CouponCard × N (guest: aviso corto)
│   ├── BottomTabs             ← fijo abajo (showProfile si auth)
│   └── NotificationsOverlay
│
└── Landscape  (hidden landscape:flex) → HomeContentLandscape
    ├── HomeHero               ← inline=true; header fijo 92px / 78px desktop
    │   └── greetingSlot       → GreetingBlock + JoinCard/PointsCard según sesión
    ├── main compacto          → grid 2 columnas, flex-1 dentro del frame común 16:9
    │   ├── panel izq → Accesos rápidos + Eventos destacados
    │   └── panel der → Descubre lo nuestro + Bescanvia amb punts
    ├── BottomTabs             (oculto en landscape vía landscape:hidden)
    └── NotificationsOverlay

Lógica:
  · useAuth → isAuthed → showLogin / showProfile / showPoints
  · useNotifications → bell + overlay (markAllRead al abrir)
  · modules state (INITIAL_MODULES) con toggleModule
  · módulo "agenda" → navigate("/agenda"); resto togglea activo`,
};
