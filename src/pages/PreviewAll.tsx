import { useState } from "react";
import ScreenFrame from "@/components/ScreenFrame";
import SimulatedDevice from "@/components/SimulatedDevice";
import HomeSandbox, { type HomeSandboxState } from "@/components/HomeSandbox";
import { VIEWPORTS, formatViewportSize } from "@/design-system/viewports";

/**
 * /preview-all — Catálogo visual: cada pantalla de la app renderizada en
 * sus dos viewports mínimos compartidos (mobilePortraitBase y
 * mobileLandscape) lado a lado, para QA visual rápido sin tener que cambiar
 * el viewport del navegador.
 *
 * Junto a cada pantalla mostramos el árbol de componentes que la
 * compone, para servir de documentación visual + estructural.
 */
interface ScreenEntry {
  label: string;
  src: string;
  tree: string;
}

const screens: ScreenEntry[] = [
  {
    label: "Home",
    src: "/home",
    tree: `(NO usa BrandedFrame — DeviceShell propio, con el MISMO tamaño de frame que BrandedFrame en cada resolución)
│
├── Portrait  (landscape:hidden) → HomeContent
│   ├── HomeHero               ← header FIJO (inline=true; showLogin={false})
│   │   ├── skyline malgrat    (bg absoluto, object-top, opacity-25)
│   │   ├── fila header        (escudo + ciudad + KM0 + bell)
│   │   └── greetingSlot
│   │       ├── GreetingBlock  ← "👋 ¡Hola, {name}!" + subtítulo
│   │       └── PointsCard     (solo si showPoints — usuario auth)
│   ├── body scroll-y
│   │   ├── LoginButton        (solo si !user, centrado)
│   │   ├── section "Accesos rápidos"     → HomeModules
│   │   ├── section "Eventos destacados"  → EventHeroCarousel
│   │   ├── section "Descubre lo nuestro" → ComercioCarousel
│   │   └── section "Promos para ti"      → CouponCard × N
│   ├── BottomTabs             ← fijo abajo (showProfile si auth)
│   └── NotificationsOverlay
│
└── Landscape  (hidden landscape:flex) → HomeContentLandscape
    ├── HomeHero               ← inline=true; header fijo 92px / 78px desktop
    │   └── greetingSlot       → GreetingBlock + PointsCard (si auth)
    ├── main compacto          → grid 2 columnas, flex-1 dentro del frame común 16:9:
    │   ├── panel izq → Accesos rápidos (HomeModules, banda fija)
    │   │              + Eventos destacados (EventHeroCarousel compacto 40px / flexible desktop)
    │   └── panel der → Descubre lo nuestro (ComercioCarousel 4 cols)
    │                  + Promos para ti (CouponCard × N, juntas bajo título)
    ├── BottomTabs             (oculto en landscape vía landscape:hidden)
    └── NotificationsOverlay

Lógica:
  · useAuth → isAuthed → showLogin / showProfile / showPoints
  · useNotifications → bell + overlay
  · modules state (INITIAL_MODULES) con toggleModule
  · módulo "agenda" → navigate("/agenda"); resto togglea activo`,
  },
  {
    label: "Language",
    src: "/",
    tree: `BrandedFrame                    ← wrapper de marca (logo + card + back)
└── (decide portrait/landscape con clases tailwind)
    ├── Portrait
    │   ├── FloatingDots        ← partículas decorativas
    │   ├── <img> mascota robot
    │   ├── <h2> "Escoge tu idioma"
    │   └── LanguageCard × 3    ← ca / es / en (driven by \`languages[]\`)
    │
    └── Landscape
        ├── FloatingDots + mascota (columna izquierda)
        ├── divisor vertical
        └── LanguageCard × 3    ← columna derecha`,
  },
  {
    label: "Onboarding",
    src: "/onboarding",
    tree: `BrandedFrame                    ← wrapper de marca (logo + card + back)
└── StackCarousel               ← carrusel reutilizable (stack 3D + drag + flechas)
    │   props: items, index, onIndexChange, skipLabel, finishLabel,
    │          onFinish, renderSlideContent, renderThumbnail?
    │
    ├── Portrait  (landscape:hidden)
    │   ├── motion.div  carousel  (pointer handlers + scale wrapper)
    │   │   └── sliding track  (translateX = trackX + dragOffset)
    │   │       └── slide × N
    │   │           ├── stack layers (solo activa)
    │   │           └── card (renderSlideContent)
    │   │               └── OnboardingCard  ← contenido de dominio
    │   │                   (emoji + XP badge + título + desc)
    │   ├── ChevronLeft / ChevronRight  ← prev / next
    │   ├── thumbnails × N    (renderThumbnail || item.thumb)
    │   └── footer  (contador + dots + botón SKIP/START → onFinish)
    │
    └── Landscape  (hidden landscape:flex)
        ├── motion.div carousel  (slotLs adaptativo 360/560)
        │   └── sliding track → slide × N → OnboardingCard
        ├── ChevronLeft / ChevronRight
        └── footer (contador + thumbs × N + dots + SKIP/START)`,
  },
  {
    label: "PostalCode",
    src: "/postal-code",
    tree: `BrandedFrame                    ← wrapper de marca (logo + card + back)
└── (decide portrait/landscape con clases tailwind)
    │
    ├── Portrait  (landscape:hidden)
    │   ├── motion.div  city illustration   ← <img> cityMap (km0_city_map.png)
    │   ├── motion.div  title slot          ← alterna entre:
    │   │   ├── default:  <h1> título + <p> subtítulo
    │   │   └── found:    "📍 {cityName}"  (AnimatePresence)
    │   ├── motion.div  input field
    │   │   ├── MapPin / MapPinOff  (lucide)
    │   │   ├── <input> numérico  maxLength=5
    │   │   └── mensaje error / notFound  (AnimatePresence)
    │   └── motion.div  CTA  → <button> CONTINUAR
    │       (Loader2 spinner mientras valida)
    │
    └── Landscape  (hidden landscape:flex)
        ├── motion.div  city image (basis 42%)
        └── motion.div  columna derecha
            ├── title slot  (default / found)
            ├── input field  (MapPin + input + errores)
            └── <button> CONTINUAR

Lógica:
  · lookupTown(cp)  → src/lib/postalCodes.ts (Supabase \`postal_codes\`)
  · estados: idle / validating / found / not_found / error (no numérico)
  · al continuar: sessionStorage (km0_postal_code + km0_town) y navega /home`,
  },
  {
    label: "Login",
    src: "/login",
    tree: `BrandedFrame                    ← wrapper de marca (logo + card + back)
└── motion.div  contenedor (fade-in + y)
    ├── header
    │   ├── <h1> "Entra o regístrate"
    │   └── <p> subtítulo
    │
    ├── <form>  (passwordless OTP email)
    │   ├── <input type="email">
    │   └── <button> CONTINUAR / "Enviando enlace..."
    │
    ├── divider  "próximamente"
    │
    └── grid social  (deshabilitados)
        ├── <button> Google  (gris + disabled)
        └── <button> Apple   (gris + disabled)

Lógica:
  · supabase.auth.signInWithOtp({ shouldCreateUser: true })
  · recupera km0_postal_code + km0_town de sessionStorage → data
  · al éxito: navega a /check-email con state {email, mode:"login"}`,
  },
  {
    label: "CheckEmail",
    src: "/check-email?email=preview%40km0lab.com",
    tree: `BrandedFrame                    ← wrapper de marca (logo + card + back)
└── motion.div  contenedor (fade-in + y, items-center)
    ├── icon circle  (Mail dentro de círculo amarillo)
    ├── bloque texto
    │   ├── <h1> "Revisa tu correo"
    │   ├── <p> "Te hemos enviado un enlace a"
    │   ├── <p> {email}
    │   └── <p> "Pulsa el enlace del email para entrar"
    ├── <button> "Reenviar enlace" / cooldown 30s
    └── <p> footer  "¿No lo encuentras? Mira en spam..."

Lógica:
  · state.email obligatorio → si falta: <Navigate to="/login">
  · cooldown decreciente (setTimeout 1s) deshabilita el botón
  · resend → supabase.auth.signInWithOtp(email)`,
  },
  {
    label: "Chat",
    src: "/chat",
    tree: `(fullbleed — NO usa BrandedFrame; layout fixed inset-0)
│
├── Portrait  (landscape:hidden, ancho mobilePortraitModern compartido)
│   ├── motion.header        ← HeaderContent
│   │   ├── back button (chevron amarillo dashed)
│   │   ├── título: {cityName} + logo KM0 CHAT/XAT
│   │   └── NotificationBell
│   ├── date banner          (amarillo · "AGENDA · {fecha}")
│   ├── messages scroll
│   │   └── MessagesList     ← burbujas + EventCard × N + loader
│   ├── motion.div input
│   │   └── InputBar         ← AnimatePresence (VoiceRecorder | input+mic+send)
│   └── NotificationsOverlay
│
└── Landscape  (hidden landscape:flex, 16:9 frame)
    ├── motion.header (HeaderContent compact, edge-to-edge)
    ├── date banner   (edge-to-edge)
    ├── messages scroll (max-w-[720px] centrado)
    │   └── MessagesList
    ├── motion.div input (max-w-[720px] centrado)
    │   └── InputBar compact
    └── NotificationsOverlay

Componentes auxiliares (definidos en Chat.tsx, candidatos a extraer):
  · HeaderContent({compact})  · InputBar({compact})  · MessagesList({endRef})

Lógica:
  · state: lang ("ca"|"es"|"en"), cityName, postalCode
  · i18n local (greeting + placeholder + dateLabel)
  · handleSend → queryEvents(text, postalCode) (eventQueryApi)
  · voz: VoiceRecorder (Web Speech API) → setInput + setIsRecording(false)
  · auto-scroll a messagesEndRef en cada nuevo mensaje`,
  },
  {
    label: "Home · NotificationsOverlay",
    src: "/home?notifs=open",
    tree: `Home (?notifs=open → notifOpen=true al montar)
└── NotificationsOverlay         ← absolute inset-0 z-50 sobre la card
    ├── motion.div  (fade + slide-up, AnimatePresence)
    ├── header
    │   ├── <h2> "Notificaciones"
    │   └── <button X> cerrar
    └── lista scroll-y
        ├── empty state  "No tienes notificaciones"
        └── notificación × N  (button)
            ├── dot estado (coral=unread / beige=read)
            ├── título + hora
            ├── descripción
            └── linkLabel + ArrowRight  → navigate(n.link)

Lógica:
  · open desde HomeHero → NotificationBell onClick
  · markAllRead() al abrir; markRead(id) al pulsar una individual
  · al pulsar: cierra overlay + navega a n.link
  · datos: useNotifications() → src/data/notifications.ts`,
  },
  {
    label: "Agenda",
    src: "/agenda",
    tree: `BrandedFrame  (hideHeader, contentClassName overflow-hidden)
└── content (flex-col h-full)
    ├── HomeHero               ← reutilizado del Home
    │   └── greetingSlot: ScreenTitle "Agenda"
    ├── WhenTabs               ← segmented control (semana/próxima/mes/trimestre)
    ├── grid 4×2 categorías    ← chips con icono lucide + color por categoría
    │   (música, cultura, infantil, deporte, talleres, fiestas, gastro, todos)
    ├── contador               ← "{N} eventos" / Loader2 "Buscando…"
    └── <section> resultados (única zona scroll-y)
        ├── SkeletonCard × 3   (estado loading)
        ├── error card         (km0-coral, si fetch falla)
        ├── empty state        (CalendarIcon + mensaje)
        └── AnimatePresence
            └── grupos por día
                ├── <h3> sticky  "Hoy/Mañana/..." (formatDayHeader)
                └── EventListCard × N

Lógica:
  · queryEvents(hintCategoría, CP=08380, limit=50) en cada cambio de categoría
  · filtros locales: rango temporal (rangeFor), categoría (matches[]), precio
  · agrupación por startOfDay → Map<isoDate, items[]>`,
  },
  {
    label: "Evento",
    src: "/evento",
    tree: `BrandedFrame  (hideHeader, contentClassName overflow-hidden)
└── content (flex-col h-full)
    ├── selector POC  (toggle v1 "Hero" / v3 "Ticket")
    └── AnimatePresence  (slide horizontal entre variantes)
        │
        ├── VariantHero  (v1)
        │   ├── ImageCarousel (h-48, overlay categoría + título + back/share)
        │   ├── card flotante datos (fecha · hora · lugar · gratis)
        │   ├── descripción (scroll-y interno) + organizador
        │   └── CTAs sticky  (CtaPrincipal + share circular)
        │
        └── VariantTicket  (v3)
            ├── header  (back · "TU ENTRADA" · share)
            ├── motion.div ticket
            │   ├── ImageCarousel aspect-[3/4] (póster + categoría + GRATIS)
            │   ├── perforaciones (línea dashed + huecos laterales)
            │   ├── stub  (fecha · hora · lugar en 3 columnas)
            │   └── descripción + dirección
            └── CTA amarillo + share circular

Componentes auxiliares (en Evento.tsx, candidatos a extraer):
  · ImageCarousel  · CtaPrincipal  · VariantHero  · VariantTicket

Lógica:
  · EVENTO mock (POC)
  · CtaPrincipal: prefiere link_inscripcion ("Ticket") sobre link_noticia
    ("ExternalLink"); muestra hostname del link como label
  · ImageCarousel: chevrons + dots, AnimatePresence fade entre imágenes`,
  },
  {
    label: "Profile",
    src: "/profile",
    tree: `BrandedFrame                    ← wrapper de marca (logo + card + back)
└── motion.div  contenedor (fade-in + y, overflow-y-auto en landscape)
    ├── header
    │   ├── <h1> "Mi perfil"
    │   └── <p> "Actualiza tus datos"
    │
    ├── loading state  ← Loader2 spinner centrado
    │
    └── <form>  (handleSave)
        ├── Field "Nombre"        → <input>
        ├── Field "Apellidos"     → <input>
        ├── Field "Email"         → <input readOnly disabled>  (de user.email)
        ├── grid [110px_1fr]
        │   ├── Field "C. postal" → <input numeric maxLength=5>
        │   └── Field "Población" → <input readOnly>  (derivada de CP)
        ├── <button submit> "Guardar cambios" / Loader2
        └── <button> "Cerrar sesión"  (LogOut icon)

Lógica:
  · useAuth → user (si no hay, formulario vacío modo testing)
  · carga inicial: supabase.from("profiles").select(...).eq(user_id)
  · validación: zod schema (first_name, last_name, postal_code regex 5d)
  · town se resuelve async vía lookupTown(postal_code) (Supabase postal_codes)
  · signOut → toast + navigate("/home")`,
  },
];

const HOME_STATES: { id: HomeSandboxState; label: string }[] = [
  { id: "guest", label: "No registrado" },
  { id: "registered", label: "Registrado" },
  { id: "reward-welcome", label: "Bienvenida (+500 pts)" },
];

const PreviewAll = () => {
  const [homeState, setHomeState] = useState<HomeSandboxState>("guest");

  return (
    <div className="min-h-screen w-screen bg-km0-beige-50">
      <header className="sticky top-0 z-10 bg-km0-blue-700 text-white px-4 py-3 shadow-md">
        <h1 className="font-brand text-xl">Preview · todas las pantallas</h1>
        <p className="font-body text-sm opacity-80">
          Resoluciones mínimas: {VIEWPORTS.mobilePortraitBase.label} ({formatViewportSize(VIEWPORTS.mobilePortraitBase)}) y{" "}
          {VIEWPORTS.mobileLandscape.label} ({formatViewportSize(VIEWPORTS.mobileLandscape)})
        </p>
      </header>

      <main className="w-full px-6 sm:px-10 lg:px-16 py-6 flex flex-col gap-10">
        {screens.map((s) => {
          // La Home se renderiza SIN iframe para permitir Visual Edit.
          // El resto de pantallas sigue con iframe en esta iteración.
          const isHome = s.label === "Home";
          return (
            <section key={s.label} className="flex flex-col gap-4 w-full">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-ui text-lg text-km0-blue-700">{s.label}</h2>
                {isHome && (
                  <div
                    role="tablist"
                    aria-label="Estado de la Home"
                    className="inline-flex rounded-full border-2 border-km0-blue-700/20 bg-white p-1 shadow-sm"
                  >
                    {HOME_STATES.map((st) => {
                      const active = homeState === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setHomeState(st.id)}
                          className={`px-3 py-1 rounded-full font-ui text-xs transition-colors ${
                            active
                              ? "bg-km0-blue-700 text-white"
                              : "text-km0-blue-700 hover:bg-km0-blue-700/10"
                          }`}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-start gap-6 w-full">
                {isHome ? (
                  <SimulatedDevice orientation="portrait" label={s.label}>
                    <HomeSandbox state={homeState} />
                  </SimulatedDevice>
                ) : (
                  <ScreenFrame src={s.src} orientation="portrait" label={s.label} />
                )}
                <div className="flex flex-col gap-4 flex-1 min-w-[320px]">
                  {isHome ? (
                    <SimulatedDevice orientation="landscape" label={s.label}>
                      <HomeSandbox state={homeState} />
                    </SimulatedDevice>
                  ) : (
                    <ScreenFrame src={s.src} orientation="landscape" label={s.label} />
                  )}
                  <pre className="w-full overflow-auto rounded-xl border-2 border-km0-blue-700/20 bg-white p-4 font-mono text-xs leading-relaxed text-km0-blue-700 shadow-[0_8px_24px_-16px_hsl(var(--km0-blue-700)/0.35)] whitespace-pre">
{s.tree}
                  </pre>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default PreviewAll;
