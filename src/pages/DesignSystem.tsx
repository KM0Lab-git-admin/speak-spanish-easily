import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Download, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import {
  colorScales,
  semanticTokens,
  typography,
  typeScale,
  spacingScale,
  radiusScale,
  breakpoints,
  animations,
  iconography,
} from "@/design-system/tokens";
import { generateAIContext } from "@/design-system/aiContext";
import { MapPin, MapPinOff, AlertTriangle, Mic, MicOff, Check as CheckIcon } from "lucide-react";

const sections = [
  { id: "intro",       label: "Introducción" },
  { id: "colors",      label: "Color · Paleta" },
  { id: "semantic",    label: "Color · Semántico" },
  { id: "typography",  label: "Tipografía" },
  { id: "spacing",     label: "Spacing" },
  { id: "radius",      label: "Radius" },
  { id: "breakpoints", label: "Breakpoints" },
  { id: "animations",  label: "Animaciones" },
  { id: "icons",       label: "Iconografía" },
  { id: "components",  label: "Componentes →" },
  { id: "screens",     label: "Pantallas" },
  { id: "ai-export",   label: "Export para IA" },
];

const DesignSystem = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ctx = generateAIContext();
    await navigator.clipboard.writeText(ctx);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ctx = generateAIContext();
    const blob = new Blob([ctx], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "km0-design-system.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-km0-beige-50">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-km0-beige-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-km0-blue-700 hover:text-km0-blue-800 font-ui text-sm font-medium">
              <ArrowLeft size={18} /> Volver
            </Link>
            <div className="h-6 w-px bg-km0-beige-200" />
            <h1 className="font-brand text-xl text-km0-blue-700">KM0 LAB · Design System</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-km0-beige-300 text-km0-blue-700 font-ui text-sm hover:bg-km0-beige-100 transition-colors"
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
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-2 rounded-lg text-sm font-ui text-km0-blue-800 hover:bg-km0-beige-100 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 space-y-16 pb-24">
          {/* Intro */}
          <section id="intro">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-3">Introducción</h2>
            <p className="font-body text-km0-blue-800/80 max-w-2xl leading-relaxed">
              Este es el sistema de diseño de KM0 LAB. Contiene tokens, tipografía, componentes y reglas
              que rigen toda la experiencia. Si trabajas con otra IA para generar prototipos, usa el botón
              <span className="mx-1 px-2 py-0.5 bg-km0-beige-100 rounded font-ui text-xs">Copiar contexto IA</span>
              para llevarte un Markdown listo para pegar como system prompt.
            </p>
          </section>

          {/* Color palette */}
          <section id="colors">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-2">Paleta KM0</h2>
            <p className="font-body text-km0-blue-800/70 mb-6 max-w-2xl">
              5 escalas, 9 shades cada una. El número marcado como <strong>principal</strong> es el más usado.
            </p>
            <div className="space-y-8">
              {colorScales.map(scale => (
                <div key={scale.name}>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-ui font-semibold text-lg text-km0-blue-800">{scale.name}</h3>
                    <span className="text-xs font-ui text-km0-blue-800/60">principal: {scale.principal}</span>
                  </div>
                  <p className="text-sm font-body text-km0-blue-800/70 mb-3">{scale.description}</p>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {scale.shades.map(s => {
                      const isPrincipal = s.shade === scale.principal;
                      return (
                        <div key={s.shade} className="flex flex-col">
                          <div
                            className={`aspect-square rounded-lg border ${isPrincipal ? "ring-2 ring-km0-blue-700 ring-offset-2 ring-offset-km0-beige-50" : "border-black/5"}`}
                            style={{ backgroundColor: `hsl(${s.hsl})` }}
                            title={s.usage}
                          />
                          <div className="text-[10px] font-mono text-km0-blue-800/70 mt-1 text-center">
                            {s.shade}
                          </div>
                          <div className="text-[9px] font-mono text-km0-blue-800/50 text-center">
                            {s.hex}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Semantic tokens */}
          <section id="semantic">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-2">Tokens semánticos</h2>
            <p className="font-body text-km0-blue-800/70 mb-6 max-w-2xl">
              Preferir SIEMPRE estos sobre los crudos `km0-*`. Permiten cambiar el tema (light/dark) sin tocar componentes.
            </p>
            <div className="bg-white rounded-2xl border border-km0-beige-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-km0-beige-50 text-km0-blue-800 font-ui">
                  <tr>
                    <th className="text-left px-4 py-3">Token</th>
                    <th className="text-left px-4 py-3">Mapea a</th>
                    <th className="text-left px-4 py-3">Uso</th>
                  </tr>
                </thead>
                <tbody>
                  {semanticTokens.map(t => (
                    <tr key={t.name} className="border-t border-km0-beige-200">
                      <td className="px-4 py-3 font-mono text-xs text-km0-blue-700">{t.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-km0-blue-800/80">{t.mapsTo}</td>
                      <td className="px-4 py-3 font-body text-km0-blue-800/80">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Typography */}
          <section id="typography">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-2">Tipografía</h2>
            <p className="font-body text-km0-blue-800/70 mb-6 max-w-2xl">
              Tres familias semánticas. El peso ya va implícito en cada una — no añadir `font-bold` encima.
            </p>
            <div className="space-y-4 mb-10">
              {typography.map(t => (
                <div key={t.className} className="bg-white rounded-2xl border border-km0-beige-200 p-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <code className="text-xs font-mono px-2 py-1 bg-km0-beige-100 rounded text-km0-blue-700">{t.className}</code>
                    <span className="text-xs font-ui text-km0-blue-800/60">{t.family} · {t.weight}</span>
                  </div>
                  <p className={`${t.className} text-2xl text-km0-blue-800 mb-2`}>{t.sample}</p>
                  <p className="text-sm font-body text-km0-blue-800/70">{t.usage}</p>
                </div>
              ))}
            </div>

            <h3 className="font-ui font-semibold text-lg text-km0-blue-800 mb-3">Escala de tamaños</h3>
            <div className="bg-white rounded-2xl border border-km0-beige-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-km0-beige-50 font-ui text-km0-blue-800">
                  <tr>
                    <th className="text-left px-4 py-3">Clase</th>
                    <th className="text-left px-4 py-3">px</th>
                    <th className="text-left px-4 py-3">Muestra</th>
                    <th className="text-left px-4 py-3">Uso</th>
                  </tr>
                </thead>
                <tbody>
                  {typeScale.map(s => (
                    <tr key={s.className} className="border-t border-km0-beige-200">
                      <td className="px-4 py-3 font-mono text-xs text-km0-blue-700">{s.className}</td>
                      <td className="px-4 py-3 font-mono text-xs">{s.px}</td>
                      <td className={`px-4 py-3 ${s.className} text-km0-blue-800`}>Aa Áé Ñ</td>
                      <td className="px-4 py-3 font-body text-km0-blue-800/70">{s.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Spacing */}
          <section id="spacing">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-6">Spacing</h2>
            <div className="space-y-2">
              {spacingScale.map(s => (
                <div key={s.token} className="flex items-center gap-4 bg-white rounded-xl border border-km0-beige-200 p-3">
                  <code className="font-mono text-xs text-km0-blue-700 w-16 shrink-0">gap-{s.token}</code>
                  <span className="font-mono text-xs text-km0-blue-800/60 w-12 shrink-0">{s.px}px</span>
                  <div className="bg-km0-teal-500 h-3 rounded" style={{ width: `${s.px}px` }} />
                  <span className="text-sm font-body text-km0-blue-800/70 ml-auto">{s.usage ?? ""}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Radius */}
          <section id="radius">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-6">Border Radius</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {radiusScale.map(r => (
                <div key={r.className} className="text-center">
                  <div className={`bg-km0-blue-700 aspect-square ${r.className} mb-2`} />
                  <code className="text-xs font-mono text-km0-blue-700">{r.className}</code>
                  <div className="text-[10px] font-mono text-km0-blue-800/60">{r.px}px</div>
                  <div className="text-[10px] font-body text-km0-blue-800/70 mt-1">{r.usage ?? ""}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Breakpoints */}
          <section id="breakpoints">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-2">Breakpoints</h2>
            <p className="font-body text-km0-blue-800/70 mb-6 max-w-2xl">
              4 oficiales — sincronizados con Playwright. <strong>NO usar otros</strong>.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {breakpoints.map(b => (
                <div key={b.variant} className="bg-white rounded-2xl border border-km0-beige-200 p-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-ui font-semibold text-km0-blue-800">{b.name}</h3>
                    <code className="text-xs font-mono text-km0-teal-600">{b.testSize}</code>
                  </div>
                  <code className="block text-xs font-mono text-km0-blue-700 bg-km0-beige-100 px-2 py-1 rounded mb-2">{b.variant}</code>
                  <code className="block text-[10px] font-mono text-km0-blue-800/60 mb-2">@media {b.media}</code>
                  <p className="text-sm font-body text-km0-blue-800/70">{b.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Animations */}
          <section id="animations">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-6">Animaciones</h2>
            <div className="space-y-3">
              {animations.map(a => (
                <div key={a.name} className="bg-white rounded-2xl border border-km0-beige-200 p-5 flex items-center gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-km0-teal-500 animate-float" />
                  <div className="flex-1">
                    <h3 className="font-ui font-semibold text-km0-blue-800">{a.name}</h3>
                    <code className="text-xs font-mono text-km0-blue-700">{a.className}</code>
                    <p className="text-sm font-body text-km0-blue-800/70">{a.usage}</p>
                  </div>
                  <span className="text-xs font-mono text-km0-blue-800/60">{a.duration}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Icons */}
          <section id="icons">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-2">Iconografía</h2>
            <p className="font-body text-km0-blue-800/70 mb-6">
              Librería: <code className="font-mono text-sm">{iconography.library}</code> · Tamaño defecto: {iconography.defaultSize}px
            </p>
            <h3 className="font-ui font-semibold text-km0-blue-800 mb-3">Pares semánticos (positivo / negativo)</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { pos: <MapPin size={28} />,    neg: <MapPinOff size={28} />,      ctx: "Ubicación válida / no reconocida" },
                { pos: <CheckIcon size={28} />, neg: <AlertTriangle size={28} />,  ctx: "Validación correcta / error" },
                { pos: <Mic size={28} />,       neg: <MicOff size={28} />,         ctx: "Grabación activa / muteada" },
              ].map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-km0-beige-200 p-5">
                  <div className="flex items-center gap-6 mb-3">
                    <div className="text-km0-teal-500">{p.pos}</div>
                    <span className="text-km0-blue-800/40">↔</span>
                    <div className="text-destructive">{p.neg}</div>
                  </div>
                  <p className="text-sm font-body text-km0-blue-800/70">{p.ctx}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Components — moved to its own page */}
          <section id="components">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-3">Componentes</h2>
            <p className="font-body text-km0-blue-800/80 max-w-2xl leading-relaxed mb-6">
              El catálogo de componentes del proyecto (props, previews y comportamiento responsive)
              vive en una página dedicada para no saturar el Design System.
            </p>
            <Link
              to="/components"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-ui font-semibold hover:bg-km0-blue-600 transition-colors"
            >
              Ir al catálogo de componentes →
            </Link>
          </section>

          {/* Screens */}
          <section id="screens">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-2">Pantallas existentes</h2>
            <p className="font-body text-km0-blue-800/70 mb-6">Catálogo de pantallas en producción. Click para abrir.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { path: "/", name: "Index / Language", desc: "Selección de idioma. Usa BrandedFrame." },
                { path: "/onboarding", name: "Onboarding", desc: "Carrusel 3D con slides. Usa BrandedFrame." },
                { path: "/postal-code", name: "PostalCode", desc: "Validación de CP con estados idle/encontrado/error." },
                { path: "/chat", name: "Chat", desc: "Layout fullbleed (NO usa BrandedFrame). fixed inset-0." },
              ].map(s => (
                <Link
                  key={s.path}
                  to={s.path}
                  className="bg-white rounded-2xl border border-km0-beige-200 p-5 hover:border-km0-blue-700 hover:shadow-lg transition-all"
                >
                  <h3 className="font-ui font-semibold text-km0-blue-800 mb-1">{s.name}</h3>
                  <code className="text-xs font-mono text-km0-teal-600">{s.path}</code>
                  <p className="text-sm font-body text-km0-blue-800/70 mt-2">{s.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* AI export */}
          <section id="ai-export">
            <h2 className="font-brand text-3xl text-km0-blue-700 mb-2">Export para IA externa</h2>
            <p className="font-body text-km0-blue-800/70 mb-6 max-w-2xl">
              El botón <strong>Copiar contexto IA</strong> arriba a la derecha genera un único Markdown con
              TODO lo necesario para que un LLM externo (ChatGPT, Claude, Gemini…) genere prototipos
              respetando el sistema KM0: tokens, breakpoints, anti-patrones y JSX de ejemplo. Pégalo como
              system prompt al inicio de la conversación.
            </p>
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-ui font-semibold hover:bg-km0-blue-600 transition-colors"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? "Copiado al portapapeles" : "Copiar contexto IA completo"}
            </motion.button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DesignSystem;
