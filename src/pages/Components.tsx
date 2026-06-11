import { useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Download, ArrowLeft, ExternalLink } from "lucide-react";
import {
  componentsCatalog,
  componentsByCategory,
  CATEGORY_LABELS,
  type ComponentSpec,
  type ComponentCategory,
} from "@/design-system/componentsCatalog";
import { generateComponentsContext } from "@/design-system/aiContext";
import { COMPONENT_PREVIEW_VIEWPORT } from "@/design-system/viewports";

/* ── Previews reales ───────────────────────────────── */
import BrandedFrame from "@/components/BrandedFrame";
import Km0Logo from "@/components/Km0Logo";
import FloatingDots from "@/components/FloatingDots";
import BottomTabs, { type HomeTab } from "@/components/BottomTabs";
import { NavLink } from "@/components/NavLink";
import LoginButton from "@/components/LoginButton";
import WhenTabs, { type WhenKey } from "@/components/WhenTabs";
import EventCard from "@/components/EventCard";
import HomeHero from "@/components/HomeHero";
import UserGreeting from "@/components/UserGreeting";
import ScreenTitle from "@/components/ScreenTitle";
import NotificationBell from "@/components/NotificationBell";
import HomeModules from "@/components/HomeModules";
import PromoSection from "@/components/PromoSection";
import PromoCarousel from "@/components/PromoCarousel";
import ComerciosSection from "@/components/ComerciosSection";
import ComercioCarousel from "@/components/ComercioCarousel";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import NotificationsOverlay from "@/components/NotificationsOverlay";
import LanguageCard from "@/components/LanguageCard";
import { Mic } from "lucide-react";
import type { Evento } from "@/services/eventQueryApi";
import { PROMOS } from "@/data/promos";
import { COMERCIOS } from "@/data/comercios";
import { INITIAL_MODULES } from "@/data/homeModules";
import { INITIAL_NOTIFICATIONS } from "@/data/notifications";

/* ── Mock data para EventCard ──────────────────────── */
const MOCK_EVENTO: Evento = {
  id_unico_evento: "demo-1",
  titulo: "Animeclub: Millenium Actress",
  descripcion_corta: "Proyección de la película de Satoshi Kon en el Centre Cultural.",
  descripcion_larga: "",
  cp_evento: "08380",
  poblacion_nombre: "Malgrat de Mar",
  lugar_nombre: "Centre Cultural",
  direccion_completa: "C/ del Carme, 30",
  fecha_inicio: "2026-05-22",
  fecha_fin: "2026-05-22",
  hora_inicio: "18:30:00",
  hora_fin: "20:30:00",
  es_gratuito: true,
  precio_euros: null,
  categorias: ["Cine"],
  tags: ["#anime", "#cinema", "#cultura"],
  url_evento: null,
  url_imagen: null,
  distancia_km: 0.4,
  similitud_score: 0.9,
  nivel_coincidencia: "alto",
};

/** Wrapper mini-móvil para previsualizar componentes con el viewport mobilePortraitModern compartido. */
const PhoneFrame = ({
  children,
  height = 480,
}: {
  children: ReactNode;
  height?: number;
}) => (
  <div
    className="mx-auto rounded-3xl border-2 border-km0-blue-700/40 bg-km0-beige-50 overflow-hidden relative"
    style={{ width: "100%", maxWidth: COMPONENT_PREVIEW_VIEWPORT.width, height }}
  >
    {children}
  </div>
);

/* ── Mapa id → preview ─────────────────────────────── */
const previews: Record<string, ReactNode> = {
  "branded-frame": (
    <div className="w-full h-[280px] overflow-hidden rounded-2xl border border-km0-beige-200">
      <div className="origin-top-left scale-[0.42] w-[238%] h-[238%]">
        <BrandedFrame onBack={() => {}} backAriaLabel="Back">
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
            <p className="font-brand text-2xl text-km0-blue-700">PANTALLA CON MARCA</p>
            <p className="font-body text-km0-blue-800/70 text-sm max-w-[28ch]">
              Contenido renderizado dentro del frame.
            </p>
          </div>
        </BrandedFrame>
      </div>
    </div>
  ),
  "km0-logo": (
    <div className="flex flex-col gap-4 items-start">
      <Km0Logo className="h-8 w-auto" />
      <Km0Logo className="h-11 w-auto" />
      <Km0Logo className="h-16 w-auto" />
    </div>
  ),
  "floating-dots": (
    <div className="relative w-full h-40 rounded-2xl bg-gradient-to-br from-km0-beige-50 to-km0-beige-100 border border-km0-beige-200 overflow-hidden">
      <FloatingDots />
      <div className="absolute inset-0 flex items-center justify-center font-ui text-xs text-km0-blue-800/60">
        Contenedor relative + overflow-hidden
      </div>
    </div>
  ),
  "bottom-tabs": (
    <div
      className="mx-auto rounded-2xl overflow-hidden border border-km0-beige-200"
      style={{ maxWidth: COMPONENT_PREVIEW_VIEWPORT.width }}
    >
      <BottomTabsPreview />
    </div>
  ),
  "nav-link": (
    <div className="flex gap-2 flex-wrap">
      <NavLink
        to="/design-system"
        className="px-3 py-2 rounded-xl font-ui text-sm text-km0-blue-700 hover:bg-km0-beige-100"
        activeClassName="bg-km0-blue-700 text-white"
      >
        /design-system
      </NavLink>
      <NavLink
        to="/components"
        className="px-3 py-2 rounded-xl font-ui text-sm text-km0-blue-700 hover:bg-km0-beige-100"
        activeClassName="bg-km0-blue-700 text-white"
      >
        /components (activo)
      </NavLink>
    </div>
  ),
  "login-button": (
    <div className="flex flex-col items-start gap-3">
      <LoginButton onClick={() => {}} size="sm" />
      <LoginButton onClick={() => {}} size="md" />
      <LoginButton onClick={() => {}} size="sm" label="Crear cuenta" />
    </div>
  ),
  "when-tabs": <WhenTabsPreview />,
  "event-card": (
    <div className="max-w-md">
      <EventCard evento={MOCK_EVENTO} index={0} />
    </div>
  ),

  /* ── Cabeceras ── */
  "home-hero": (
    <PhoneFrame height={180}>
      <HomeHero
        cityName="Malgrat de Mar"
        hasAlerts
        onToggleAlerts={() => {}}
        showLogin
        onLogin={() => {}}
      />
    </PhoneFrame>
  ),
  "user-greeting": (
    <div
      className="mx-auto bg-white/55 px-2 py-2 rounded-xl"
      style={{ maxWidth: COMPONENT_PREVIEW_VIEWPORT.width }}
    >
      <UserGreeting name="Albert" points={1259} nextLevel={3000} />
    </div>
  ),
  "screen-title": (
    <div className="space-y-3">
      <div
        className="mx-auto bg-white/55 px-2 py-2 rounded-xl"
        style={{ maxWidth: COMPONENT_PREVIEW_VIEWPORT.width }}
      >
        <ScreenTitle title="Agenda" />
      </div>
      <p className="font-body text-xs text-km0-blue-800/60 text-center">
        Mismo slot, fecha personalizada:
      </p>
      <div
        className="mx-auto bg-white/55 px-2 py-2 rounded-xl"
        style={{ maxWidth: COMPONENT_PREVIEW_VIEWPORT.width }}
      >
        <ScreenTitle title="Chat" date={new Date("2026-12-25")} />
      </div>
    </div>
  ),
  "notification-bell": (
    <div className="flex items-center gap-6 bg-km0-beige-100 p-4 rounded-2xl">
      <div className="flex flex-col items-center gap-2">
        <NotificationBell hasAlerts onClick={() => {}} />
        <span className="font-body text-xs text-km0-blue-800/70">hasAlerts</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <NotificationBell onClick={() => {}} />
        <span className="font-body text-xs text-km0-blue-800/70">sin alertas</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <NotificationBell hasAlerts />
        <span className="font-body text-xs text-km0-blue-800/70">decorativa (sin onClick)</span>
      </div>
    </div>
  ),

  /* ── Home ── */
  "home-content": (
    <p className="font-body text-sm text-km0-blue-800/70">
      Orquestador interno. Previsualiza el Home completo navegando a{" "}
      <Link to="/" className="underline text-km0-blue-700 font-semibold">
        /
      </Link>{" "}
      (página Home). No tiene sentido renderizar uno aislado aquí porque depende del
      frame portrait/landscape de la página.
    </p>
  ),
  "home-modules": (
    <PhoneFrame height={150}>
      <div className="p-3">
        <HomeModules modules={INITIAL_MODULES.map((m) => ({ id: m.id, active: m.active, label: m.labelKey.replace("module.", "") }))} />
      </div>
    </PhoneFrame>
  ),
  "promo-section": (
    <PhoneFrame height={220}>
      <div className="p-3">
        <PromoSection promos={PROMOS} />
      </div>
    </PhoneFrame>
  ),
  "promo-carousel": (
    <PhoneFrame height={200}>
      <div className="p-3">
        <PromoCarousel promos={PROMOS} />
      </div>
    </PhoneFrame>
  ),
  "comercios-section": (
    <PhoneFrame height={180}>
      <div className="p-3">
        <ComerciosSection comercios={COMERCIOS} onSeeAll={() => {}} />
      </div>
    </PhoneFrame>
  ),
  "comercio-carousel": (
    <PhoneFrame height={140}>
      <div className="p-3">
        <ComercioCarousel comercios={COMERCIOS} />
      </div>
    </PhoneFrame>
  ),

  /* ── Chat ── */
  "voice-recorder": <VoiceRecorderStub />,

  /* ── Auth ── */
  "social-auth-buttons": (
    <div className="max-w-md mx-auto">
      <SocialAuthButtons />
    </div>
  ),

  /* ── Overlays ── */
  "notifications-overlay": <NotificationsOverlayPreview />,

  /* ── Idioma ── */
  "language-card": <LanguageCardPreview />,
};

function BottomTabsPreview() {
  const [active, setActive] = useState<HomeTab>("home");
  return (
    <BottomTabs
      activeTab={active}
      onTabChange={setActive}
      showProfile={false}
      onLogin={() => {}}
      onProfile={() => {}}
    />
  );
}

function WhenTabsPreview() {
  const [value, setValue] = useState<WhenKey>("semana");
  return <WhenTabs value={value} onChange={setValue} />;
}

/** Stub estático del VoiceRecorder: no pide micro, solo enseña la pill visual. */
function VoiceRecorderStub() {
  return (
    <div className="flex items-center gap-3 bg-card rounded-full border border-border px-3 py-2 shadow-sm max-w-md">
      <span className="font-body text-sm text-primary font-semibold ml-1 whitespace-nowrap">
        Escuchando…
      </span>
      <div className="flex items-center gap-[3px] flex-1 justify-center">
        {[8, 22, 12, 20, 8].map((h, i) => (
          <span
            key={i}
            className="w-[4px] rounded-full bg-accent"
            style={{ height: h }}
          />
        ))}
      </div>
      <span className="font-body text-xs text-muted-foreground truncate max-w-[100px]">
        hola que tal…
      </span>
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0"
        aria-label="Stop demo"
      >
        <Mic size={16} />
      </button>
    </div>
  );
}

function NotificationsOverlayPreview() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-ui text-sm font-semibold"
      >
        {open ? "Cerrar overlay" : "Abrir overlay"}
      </button>
      <PhoneFrame height={520}>
        <NotificationsOverlay
          open={open}
          notifications={items}
          onClose={() => setOpen(false)}
          onMarkRead={(id) =>
            setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
          }
        />
        {!open && (
          <div className="absolute inset-0 flex items-center justify-center font-body text-sm text-km0-blue-800/60">
            Frame contenedor — pulsa "Abrir overlay"
          </div>
        )}
      </PhoneFrame>
    </div>
  );
}

function LanguageCardPreview() {
  const [selected, setSelected] = useState("ca");
  const langs = [
    { id: "ca", flag: "🇪🇸", name: "Català", description: "Catalán" },
    { id: "es", flag: "🇪🇸", name: "Castellano", description: "Spanish" },
    { id: "en", flag: "🇬🇧", name: "English", description: "Inglés" },
  ];
  return (
    <div className="max-w-md mx-auto space-y-3">
      {langs.map((l) => (
        <LanguageCard
          key={l.id}
          flag={l.flag}
          name={l.name}
          description={l.description}
          selected={selected === l.id}
          onClick={() => setSelected(l.id)}
        />
      ))}
      <LanguageCard flag="🇫🇷" name="Français" description="Próximamente" disabled />
    </div>
  );
}

/* ── Página ────────────────────────────────────────── */
const Components = () => {
  const [copied, setCopied] = useState(false);
  const grouped = componentsByCategory();
  const cats = (Object.keys(CATEGORY_LABELS) as ComponentCategory[]).filter(
    (c) => grouped[c].length > 0,
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateComponentsContext());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generateComponentsContext()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "km0-componentes.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-km0-beige-50">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-km0-beige-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/design-system"
              className="flex items-center gap-2 text-km0-blue-700 hover:text-km0-blue-800 font-ui text-sm font-medium shrink-0"
            >
              <ArrowLeft size={18} /> Design System
            </Link>
            <div className="h-6 w-px bg-km0-beige-200 shrink-0" />
            <h1 className="font-brand text-xl text-km0-blue-700 truncate">
              KM0 LAB · Componentes
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-km0-beige-300 text-km0-blue-700 font-ui text-sm hover:bg-km0-beige-100 transition-colors"
            >
              <Download size={16} /> .md
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-ui text-sm font-semibold hover:bg-km0-blue-600 transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copiado" : "Copiar contexto IA"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex gap-8 px-6 py-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-24 self-start">
          <nav className="flex flex-col gap-1">
            {cats.map((c) => (
              <a
                key={c}
                href={`#cat-${c}`}
                className="px-3 py-2 rounded-lg text-sm font-ui text-km0-blue-800 hover:bg-km0-beige-100 transition-colors flex items-center justify-between"
              >
                <span>{CATEGORY_LABELS[c]}</span>
                <span className="text-xs text-km0-blue-800/50">{grouped[c].length}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 space-y-12 pb-24 overflow-x-hidden">
          {/* Intro */}
          <section>
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-3">Componentes del proyecto</h2>
            <p className="font-body text-km0-blue-800/80 max-w-2xl leading-relaxed">
              Catálogo vivo de componentes propios (no shadcn/ui). Cada tarjeta muestra preview real,
              API de props, comportamiento responsive en los 4 breakpoints oficiales y notas de uso.
              Para tokens, color, tipografía y spacing visita el{" "}
              <Link to="/design-system" className="text-km0-blue-700 underline font-semibold">
                Design System
              </Link>
              .
            </p>
            <p className="font-body text-km0-blue-800/60 text-sm mt-3">
              {componentsCatalog.length} componentes documentados · {cats.length} categorías.
            </p>
          </section>

          {/* Categorías */}
          {cats.map((cat) => (
            <section key={cat} id={`cat-${cat}`} className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-km0-beige-200 pb-2">
                <h3 className="font-brand text-2xl text-km0-blue-700">{CATEGORY_LABELS[cat]}</h3>
                <span className="text-xs font-ui text-km0-blue-800/60">
                  {grouped[cat].length} componentes
                </span>
              </div>
              <div className="space-y-6">
                {grouped[cat].map((spec) => (
                  <ComponentCard key={spec.id} spec={spec} preview={previews[spec.id]} />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

/* ── ComponentCard ─────────────────────────────────── */
interface ComponentCardProps {
  spec: ComponentSpec;
  preview?: ReactNode;
}

const ComponentCard = ({ spec, preview }: ComponentCardProps) => (
  <article
    id={`cmp-${spec.id}`}
    className="bg-white rounded-2xl border border-km0-beige-200 overflow-hidden"
  >
    {/* Head */}
    <header className="px-6 py-5 border-b border-km0-beige-200 bg-km0-beige-50/50">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h4 className="font-brand text-xl text-km0-blue-700">{spec.name}</h4>
        <span className="text-[10px] font-ui font-semibold uppercase tracking-wider text-km0-teal-600 bg-km0-teal-50 px-2 py-1 rounded-full">
          {CATEGORY_LABELS[spec.category]}
        </span>
      </div>
      <code className="block text-xs font-mono text-km0-blue-800/70 mt-2 truncate">
        import {spec.name} from "{spec.importPath}"
      </code>
      {spec.usedIn.length > 0 && (
        <p className="text-xs font-ui text-km0-blue-800/60 mt-1">
          <span className="font-semibold">Usado en:</span> {spec.usedIn.join(", ")}
        </p>
      )}
    </header>

    <div className="p-6 space-y-5">
      <p className="font-body text-sm text-km0-blue-800/80 leading-relaxed">{spec.description}</p>

      {/* Preview */}
      {preview && (
        <div>
          <h5 className="font-ui font-semibold text-xs uppercase tracking-wider text-km0-blue-800/60 mb-2">
            Preview
          </h5>
          <div className="bg-gradient-to-br from-km0-beige-50 to-white rounded-2xl border border-dashed border-km0-beige-300 p-5 overflow-x-hidden">
            {preview}
          </div>
        </div>
      )}

      {/* Props */}
      {spec.props.length > 0 && (
        <div>
          <h5 className="font-ui font-semibold text-xs uppercase tracking-wider text-km0-blue-800/60 mb-2">
            Props
          </h5>
          <div className="rounded-xl border border-km0-beige-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-km0-beige-50 text-km0-blue-800 font-ui">
                <tr>
                  <th className="text-left px-3 py-2 text-xs">Nombre</th>
                  <th className="text-left px-3 py-2 text-xs">Tipo</th>
                  <th className="text-left px-3 py-2 text-xs">Default</th>
                  <th className="text-left px-3 py-2 text-xs">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {spec.props.map((p) => (
                  <tr key={p.name} className="border-t border-km0-beige-200 align-top">
                    <td className="px-3 py-2 font-mono text-xs text-km0-blue-700 whitespace-nowrap">
                      {p.name}
                      {p.required && <span className="text-destructive ml-0.5">*</span>}
                    </td>
                    <td className="px-3 py-2 font-mono text-[11px] text-km0-blue-800/80">{p.type}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-km0-blue-800/60">
                      {p.defaultValue ?? "—"}
                    </td>
                    <td className="px-3 py-2 font-body text-xs text-km0-blue-800/80">
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Responsive */}
      {spec.responsive.length > 0 && (
        <div>
          <h5 className="font-ui font-semibold text-xs uppercase tracking-wider text-km0-blue-800/60 mb-2">
            Responsive
          </h5>
          <div className="grid sm:grid-cols-2 gap-2">
            {spec.responsive.map((r) => (
              <div
                key={r.breakpoint}
                className="rounded-xl bg-km0-beige-50 border border-km0-beige-200 px-3 py-2"
              >
                <code className="text-[10px] font-mono text-km0-teal-600 block mb-0.5">
                  {r.breakpoint}
                </code>
                <p className="font-body text-xs text-km0-blue-800/80">{r.behavior}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {spec.notes && spec.notes.length > 0 && (
        <div>
          <h5 className="font-ui font-semibold text-xs uppercase tracking-wider text-km0-blue-800/60 mb-2">
            Notas de uso
          </h5>
          <ul className="list-disc pl-5 space-y-1">
            {spec.notes.map((n, i) => (
              <li key={i} className="font-body text-xs text-km0-blue-800/80 leading-relaxed">
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </article>
);

export default Components;
