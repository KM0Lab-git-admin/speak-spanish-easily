import ScreenFrame from "@/components/ScreenFrame";

/**
 * /preview-all — Catálogo visual: cada pantalla de la app renderizada en
 * sus dos resoluciones mínimas (vertical-mobile 375×667 y horizontal-mobile
 * 667×375) lado a lado, para QA visual rápido sin tener que cambiar el
 * viewport del navegador.
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
└── (decide portrait/landscape con clases tailwind)
    ├── Portrait
    │   ├── motion.div  carousel (drag/swipe + pointer handlers)
    │   │   └── scale wrapper (portraitScale, tablet boost)
    │   │       └── sliding track  (translateX = trackX + dragOffset)
    │   │           └── slide × 5  ← slides[] (id, xp, title*, desc*, color, emoji)
    │   │               ├── stack layers (solo activa)
    │   │               └── card  (image area + emoji + XP badge + título + desc)
    │   ├── ChevronLeft / ChevronRight  ← prev / next
    │   ├── thumbnails × 5     ← navegación rápida por emoji
    │   └── footer
    │       ├── contador  N/total
    │       ├── dots × 5
    │       └── botón SKIP / START  → /postal-code
    │
    └── Landscape
        ├── motion.div carousel  (slotLs adaptativo: 360 mobile / 560 desktop)
        │   └── sliding track  → slide × 5  (mismo contenido, tamaños landscape)
        ├── ChevronLeft / ChevronRight
        ├── thumbnails × 5
        └── footer (contador + dots + SKIP/START)`,
  },
  // { label: "PostalCode",  src: "/postal-code", tree: "" },
  // { label: "Login",       src: "/login",       tree: "" },
  // { label: "CheckEmail",  src: "/check-email", tree: "" },
  // { label: "Chat",        src: "/chat",        tree: "" },
  // { label: "Home",        src: "/home",        tree: "" },
  // { label: "Agenda",      src: "/agenda",      tree: "" },
  // { label: "Evento",      src: "/evento",      tree: "" },
  // { label: "Profile",     src: "/profile",     tree: "" },
];

const PreviewAll = () => {
  return (
    <div className="min-h-screen w-screen bg-km0-beige-50">
      <header className="sticky top-0 z-10 bg-km0-blue-700 text-white px-4 py-3 shadow-md">
        <h1 className="font-brand text-xl">Preview · todas las pantallas</h1>
        <p className="font-body text-sm opacity-80">
          Resoluciones mínimas: vertical-mobile (375×667) y horizontal-mobile (667×375)
        </p>
      </header>

      <main className="w-full px-4 py-6 flex flex-col gap-10">
        {screens.map((s) => (
          <section key={s.label} className="flex flex-col gap-4 w-full">
            <h2 className="font-ui text-lg text-km0-blue-700">{s.label}</h2>
            <div className="flex flex-wrap items-start gap-6 w-full">
              <ScreenFrame src={s.src} orientation="portrait"  label={s.label} />
              <div className="flex flex-col gap-4 flex-1 min-w-[320px]">
                <ScreenFrame src={s.src} orientation="landscape" label={s.label} />
                <pre className="w-full overflow-auto rounded-xl border-2 border-km0-blue-700/20 bg-white p-4 font-mono text-xs leading-relaxed text-km0-blue-700 shadow-[0_8px_24px_-16px_hsl(var(--km0-blue-700)/0.35)] whitespace-pre">
{s.tree}
                </pre>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default PreviewAll;
