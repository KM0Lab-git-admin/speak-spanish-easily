import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Loader2,
  Music2,
  Palette,
  Baby,
  Trophy,
  Hammer,
  PartyPopper,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";

import BrandedFrame from "@/components/BrandedFrame";
import HomeHero from "@/components/HomeHero";
import ScreenTitle from "@/components/ScreenTitle";
import WhenTabs, { type WhenKey } from "@/components/WhenTabs";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { queryEvents, type Evento } from "@/services/eventQueryApi";

/* ──────────────────────────────────────────────────────────────
 * Agenda — diseño "Bold" (mockup aprobado).
 *
 * Estructura visual:
 *   1. Título XL "Agenda" + número de día en mostaza.
 *   2. Segmented control de 4 opciones (Hoy / Mañana / Finde / Mes).
 *   3. Grid 4×2 de categorías, cada una con su color e icono.
 *   4. Toggle Gratis / Pago / Todos.
 *   5. Resultados agrupados por día.
 *
 * Sin búsqueda por texto. Sin filtros de "Lugares" ni "Tags".
 * ────────────────────────────────────────────────────────────── */

type WhenKey = "hoy" | "manana" | "finde" | "mes";
type Category =
  | "todos"
  | "musica"
  | "cultura"
  | "infantil"
  | "deporte"
  | "talleres"
  | "fiestas"
  | "gastronomia";
type Price = "todos" | "gratis" | "pago";

const WHEN_OPTIONS: { key: WhenKey; label: string }[] = [
  { key: "hoy", label: "Hoy" },
  { key: "manana", label: "Mañana" },
  { key: "finde", label: "Finde" },
  { key: "mes", label: "Mes" },
];

interface CatDef {
  key: Category;
  label: string;
  matches: string[];
  Icon: typeof Music2;
  /** color de fondo cuando está activa */
  activeBg: string;
  activeText: string;
  /** color de fondo cuando inactiva */
  idleBg: string;
  idleText: string;
}

const CATEGORIES: CatDef[] = [
  {
    key: "musica",
    label: "Música",
    matches: ["música", "musica", "concierto"],
    Icon: Music2,
    activeBg: "bg-km0-blue-900",
    activeText: "text-white",
    idleBg: "bg-km0-blue-900/90",
    idleText: "text-white",
  },
  {
    key: "cultura",
    label: "Cultura",
    matches: ["cultura", "exposición", "teatro", "cine"],
    Icon: Palette,
    activeBg: "bg-km0-yellow-500",
    activeText: "text-km0-blue-900",
    idleBg: "bg-km0-yellow-400",
    idleText: "text-km0-blue-900",
  },
  {
    key: "infantil",
    label: "Infantil",
    matches: ["infantil", "niños", "familia"],
    Icon: Baby,
    activeBg: "bg-white",
    activeText: "text-km0-blue-900",
    idleBg: "bg-white",
    idleText: "text-km0-blue-900",
  },
  {
    key: "deporte",
    label: "Deporte",
    matches: ["deporte", "deport"],
    Icon: Trophy,
    activeBg: "bg-km0-teal-500",
    activeText: "text-white",
    idleBg: "bg-km0-teal-400",
    idleText: "text-white",
  },
  {
    key: "talleres",
    label: "Talleres",
    matches: ["taller", "workshop", "curso"],
    Icon: Hammer,
    activeBg: "bg-km0-coral-500",
    activeText: "text-white",
    idleBg: "bg-km0-coral-400",
    idleText: "text-white",
  },
  {
    key: "fiestas",
    label: "Fiestas",
    matches: ["fiesta", "festa", "festival"],
    Icon: PartyPopper,
    activeBg: "bg-km0-blue-700",
    activeText: "text-white",
    idleBg: "bg-km0-blue-600",
    idleText: "text-white",
  },
  {
    key: "gastronomia",
    label: "Gastro",
    matches: ["gastro", "comida", "cocina", "vino"],
    Icon: UtensilsCrossed,
    activeBg: "bg-km0-coral-600",
    activeText: "text-white",
    idleBg: "bg-km0-coral-500",
    idleText: "text-white",
  },
  {
    key: "todos",
    label: "Todos",
    matches: [],
    Icon: Sparkles,
    activeBg: "bg-km0-teal-600",
    activeText: "text-white",
    idleBg: "bg-km0-teal-500",
    idleText: "text-white",
  },
];

const DEFAULT_CP = "08380"; // Malgrat de Mar

/* ─── Helpers de fecha ──────────────────────────────────────── */
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const rangeFor = (key: WhenKey): [Date, Date] => {
  const today = startOfDay(new Date());
  switch (key) {
    case "hoy":
      return [today, endOfDay(today)];
    case "manana": {
      const t = addDays(today, 1);
      return [t, endOfDay(t)];
    }
    case "finde": {
      const day = today.getDay();
      const sat = addDays(today, day === 6 ? 0 : day === 0 ? -1 : 6 - day);
      const sun = addDays(sat, 1);
      return [startOfDay(sat), endOfDay(sun)];
    }
    case "mes": {
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return [today, endOfDay(last)];
    }
  }
};

const MONTHS_SHORT = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

const formatDayHeader = (d: Date) => {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const target = startOfDay(d);
  const base = d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  if (target.getTime() === today.getTime()) return `Hoy, ${base}`;
  if (target.getTime() === tomorrow.getTime()) return `Mañana, ${base}`;
  return base.charAt(0).toUpperCase() + base.slice(1);
};

const formatTime = (t?: string) => (t ? t.slice(0, 5) : "");

/* ─── Tarjeta de evento ─────────────────────────────────────── */
const EventListCard = ({ evento }: { evento: Evento }) => {
  const time = formatTime(evento.hora_inicio);
  const timeEnd = formatTime(evento.hora_fin);
  const cat = evento.categorias?.[0];
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-km0-blue-100 rounded-2xl p-3 shadow-sm hover:border-km0-blue-300 transition-colors"
    >
      <h4 className="font-brand text-sm leading-tight text-km0-blue-900 mb-1">
        {evento.titulo}
      </h4>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] font-ui text-km0-blue-700/80 mb-1.5">
        {time && (
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {time}
            {timeEnd && `–${timeEnd}`}
          </span>
        )}
        <span className="inline-flex items-center gap-1 truncate">
          <MapPin size={11} />
          <span className="truncate">
            {evento.lugar_nombre}
            {evento.poblacion_nombre && ` · ${evento.poblacion_nombre}`}
          </span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {evento.es_gratuito ? (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-ui font-bold bg-km0-teal-100 text-km0-teal-700">
            Gratis
          </span>
        ) : evento.precio_euros != null ? (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-ui font-bold bg-km0-yellow-100 text-km0-yellow-800">
            {evento.precio_euros.toFixed(2)} €
          </span>
        ) : null}
        {cat && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-ui bg-km0-blue-50 text-km0-blue-700">
            {cat}
          </span>
        )}
      </div>
    </motion.article>
  );
};

const SkeletonCard = () => (
  <div className="bg-white border border-km0-blue-100 rounded-2xl p-3 animate-pulse">
    <div className="h-4 w-2/3 bg-km0-blue-100/70 rounded mb-2" />
    <div className="h-3 w-1/2 bg-km0-blue-100/50 rounded mb-1.5" />
    <div className="h-3 w-1/3 bg-km0-blue-100/50 rounded" />
  </div>
);

/* ─── Página ─────────────────────────────────────────────────── */
const Agenda = () => {
  const navigate = useNavigate();
  const { hasUnread, markAllRead } = useNotifications();
  const [when, setWhen] = useState<WhenKey>("hoy");
  const [category, setCategory] = useState<Category>("todos");
  const [price, setPrice] = useState<Price>("todos");

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch — categoría como hint semántico al backend.
  useEffect(() => {
    const cat = CATEGORIES.find((c) => c.key === category);
    const hint = cat && cat.key !== "todos" ? cat.label : "";
    const pregunta = [hint, "eventos próximos"].filter(Boolean).join(" ");
    let cancelled = false;
    setLoading(true);
    setError(null);
    queryEvents(pregunta, DEFAULT_CP, 50)
      .then((res) => {
        if (!cancelled) setEventos(res.eventos ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  const filtered = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.key === category);
    const range = rangeFor(when);
    return eventos.filter((e) => {
      if (range && e.fecha_inicio) {
        const d = new Date(e.fecha_inicio);
        if (d < range[0] || d > range[1]) return false;
      }
      if (cat && cat.matches.length > 0) {
        const hay = [...(e.categorias ?? []), ...(e.tags ?? [])]
          .join(" ")
          .toLowerCase();
        if (!cat.matches.some((m) => hay.includes(m))) return false;
      }
      if (price === "gratis" && !e.es_gratuito) return false;
      if (price === "pago" && e.es_gratuito) return false;
      return true;
    });
  }, [eventos, when, category, price]);

  const grouped = useMemo(() => {
    const map = new Map<string, { date: Date; items: Evento[] }>();
    filtered
      .slice()
      .sort((a, b) => +new Date(a.fecha_inicio) - +new Date(b.fecha_inicio))
      .forEach((e) => {
        const d = startOfDay(new Date(e.fecha_inicio));
        const k = d.toISOString();
        if (!map.has(k)) map.set(k, { date: d, items: [] });
        map.get(k)!.items.push(e);
      });
    return Array.from(map.values());
  }, [filtered]);

  const today = new Date();
  const dayNum = today.getDate();
  const monthLabel = MONTHS_SHORT[today.getMonth()];

  /* ─── Render ─────────────────────────────────────── */
  const content = (
    <div className="flex flex-col gap-3 w-full">
      {/* ── Hero superior reutilizado del Home ─── */}
      <div className="-mx-4 -mt-2">
        <HomeHero
          cityName="Malgrat de Mar"
          hasAlerts={hasUnread}
          onToggleAlerts={markAllRead}
          showLogin={false}
          onLogin={() => navigate("/login")}
          onBack={() => navigate(-1)}
          backAriaLabel="Volver"
          showGreeting={false}
          greetingSlot={<ScreenTitle title="Agenda" />}
        />
      </div>

      {/* ── Segmented "¿Cuándo?" (4 opciones, sin scroll) ─── */}
      <div className="grid grid-cols-4 gap-1 bg-white border-2 border-km0-blue-900 rounded-full p-1">
        {WHEN_OPTIONS.map((opt) => {
          const active = when === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setWhen(opt.key)}
              className={cn(
                "h-8 rounded-full font-ui text-xs font-bold transition-all active:scale-95",
                active
                  ? "bg-km0-blue-900 text-white shadow-sm"
                  : "text-km0-blue-900 hover:bg-km0-beige-100",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* ── Categorías (grid 4×2, sin scroll horizontal) ─── */}
      <div className="grid grid-cols-4 gap-1.5">
        {CATEGORIES.map((c) => {
          const active = category === c.key;
          const Icon = c.Icon;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={cn(
                "h-9 rounded-full inline-flex items-center justify-center gap-1 px-1 font-ui text-[10.5px] font-bold transition-all active:scale-95 border",
                active
                  ? `${c.activeBg} ${c.activeText} border-km0-blue-900 ring-2 ring-km0-blue-900/20 shadow-sm`
                  : `${c.idleBg} ${c.idleText} border-transparent opacity-90 hover:opacity-100`,
                c.key === "infantil" && "border-km0-blue-200",
              )}
            >
              <Icon size={11} strokeWidth={2.5} className="shrink-0" />
              <span className="truncate">{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Toggle precio ─── */}
      <div className="grid grid-cols-3 gap-1 bg-white/70 border border-km0-blue-200 rounded-full p-0.5">
        {(["todos", "gratis", "pago"] as Price[]).map((p) => {
          const active = price === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPrice(p)}
              className={cn(
                "h-7 rounded-full font-ui text-[11px] font-bold transition-all active:scale-95",
                active
                  ? "bg-km0-blue-900 text-white"
                  : "text-km0-blue-900/70 hover:text-km0-blue-900",
              )}
            >
              {p === "todos" ? "Todos" : p === "gratis" ? "Gratis" : "Pago"}
            </button>
          );
        })}
      </div>

      {/* ── Contador ─── */}
      <div className="text-[11px] font-ui text-km0-blue-700/80 px-0.5">
        {loading ? (
          <span className="inline-flex items-center gap-1">
            <Loader2 size={11} className="animate-spin" />
            Buscando…
          </span>
        ) : (
          <>
            <span className="font-bold text-km0-blue-900">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "evento" : "eventos"}
          </>
        )}
      </div>

      {/* ── Resultados ─── */}
      <section className="space-y-3">
        {loading && eventos.length === 0 && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && error && (
          <div className="bg-km0-coral-50 border border-km0-coral-200 rounded-2xl p-4 text-xs font-ui text-km0-coral-700">
            No se han podido cargar los eventos. {error}
          </div>
        )}

        {!loading && !error && grouped.length === 0 && (
          <div className="bg-white border border-km0-blue-100 rounded-2xl p-5 text-center">
            <CalendarIcon size={28} className="mx-auto text-km0-blue-700/50 mb-2" />
            <p className="font-brand text-sm text-km0-blue-900 mb-1">
              No hemos encontrado eventos
            </p>
            <p className="text-[11px] font-ui text-km0-blue-700/70">
              Prueba cambiando la fecha o la categoría.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {grouped.map((g) => (
            <motion.div
              key={g.date.toISOString()}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <h3 className="font-brand text-xs text-km0-blue-900/80 sticky top-0 bg-km0-beige-50/95 backdrop-blur-sm py-1 -mx-1 px-1 z-10">
                {formatDayHeader(g.date)}
              </h3>
              {g.items.map((e) => (
                <EventListCard key={e.id_unico_evento} evento={e} />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </section>
    </div>
  );

  return (
    <BrandedFrame hideHeader>
      {content}
    </BrandedFrame>
  );
};

export default Agenda;
