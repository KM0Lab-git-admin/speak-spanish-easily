import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Tag as TagIcon,
  Loader2,
} from "lucide-react";

import BrandedFrame from "@/components/BrandedFrame";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { queryEvents, type Evento } from "@/services/eventQueryApi";

/* ──────────────────────────────────────────────────────────────
 * Agenda — Pantalla de búsqueda de eventos.
 *
 * UX: 3 clics máximo.
 *   Nivel 1 (visible): ¿Cuándo? + ¿Qué tipo de plan? + texto.
 *   Nivel 2 (oculto): precio, tags, tipo, organizador, población.
 *
 * Filtrado: el endpoint `event-query` solo acepta texto libre +
 * código postal. Hacemos una query amplia y filtramos en cliente
 * por fecha / categoría / precio / tags. El texto del buscador SÍ
 * se manda como `pregunta` (con debounce) para aprovechar el
 * ranking semántico del backend.
 * ────────────────────────────────────────────────────────────── */

type WhenKey = "hoy" | "manana" | "finde" | "semana" | "proxima" | "mes" | "fechas";
type Category = "todos" | "infantil" | "cultura" | "musica" | "deporte" | "talleres" | "fiestas" | "gastronomia";
type Price = "todos" | "gratis" | "pago";

const WHEN_OPTIONS: { key: WhenKey; label: string }[] = [
  { key: "hoy", label: "Hoy" },
  { key: "manana", label: "Mañana" },
  { key: "finde", label: "Este finde" },
  { key: "semana", label: "Esta semana" },
  { key: "proxima", label: "Próxima semana" },
  { key: "mes", label: "Este mes" },
  { key: "fechas", label: "Fechas" },
];

const CATEGORIES: { key: Category; label: string; matches: string[] }[] = [
  { key: "todos", label: "Todos", matches: [] },
  { key: "infantil", label: "Infantil", matches: ["infantil", "niños", "familia"] },
  { key: "cultura", label: "Cultura", matches: ["cultura", "exposición", "teatro", "cine"] },
  { key: "musica", label: "Música", matches: ["música", "musica", "concierto"] },
  { key: "deporte", label: "Deporte", matches: ["deporte", "deport"] },
  { key: "talleres", label: "Talleres", matches: ["taller", "workshop", "curso"] },
  { key: "fiestas", label: "Fiestas", matches: ["fiesta", "festa", "festival"] },
  { key: "gastronomia", label: "Gastronomía", matches: ["gastro", "comida", "cocina", "vino"] },
];

const SUGGESTED_TAGS: Record<Category, string[]> = {
  todos: [],
  infantil: ["manualidades", "cuentos", "niños", "familias", "creatividad"],
  cultura: ["exposición", "teatro", "cine", "literatura"],
  musica: ["concierto", "directo", "jazz", "rock"],
  deporte: ["running", "yoga", "ciclismo", "fútbol"],
  talleres: ["manualidades", "cocina", "yoga", "astronomía"],
  fiestas: ["popular", "tradicional", "verbena"],
  gastronomia: ["degustación", "vino", "tapas", "showcooking"],
};

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

/** Devuelve [from, to] según el chip seleccionado. */
const rangeFor = (
  key: WhenKey,
  custom: { from?: string; to?: string },
): [Date, Date] | null => {
  const today = startOfDay(new Date());
  switch (key) {
    case "hoy":
      return [today, endOfDay(today)];
    case "manana": {
      const t = addDays(today, 1);
      return [t, endOfDay(t)];
    }
    case "finde": {
      // Sábado y domingo de esta semana (si hoy es sábado/domingo, incluye hoy)
      const day = today.getDay(); // 0=dom, 6=sáb
      const toSat = day === 0 ? -1 : 6 - day;
      const sat = addDays(today, day === 6 ? 0 : day === 0 ? -1 : toSat);
      const sun = addDays(sat, 1);
      return [startOfDay(sat), endOfDay(sun)];
    }
    case "semana": {
      const day = today.getDay();
      const toSun = day === 0 ? 0 : 7 - day;
      return [today, endOfDay(addDays(today, toSun))];
    }
    case "proxima": {
      const day = today.getDay();
      const toNextMon = day === 0 ? 1 : 8 - day;
      const mon = addDays(today, toNextMon);
      return [startOfDay(mon), endOfDay(addDays(mon, 6))];
    }
    case "mes": {
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return [today, endOfDay(last)];
    }
    case "fechas": {
      if (!custom.from && !custom.to) return null;
      const from = custom.from ? startOfDay(new Date(custom.from)) : today;
      const to = custom.to ? endOfDay(new Date(custom.to)) : endOfDay(addDays(from, 30));
      return [from, to];
    }
  }
};

const formatDayHeader = (d: Date) => {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const target = startOfDay(d);
  const isToday = target.getTime() === today.getTime();
  const isTomorrow = target.getTime() === tomorrow.getTime();
  const base = d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  if (isToday) return `Hoy, ${base}`;
  if (isTomorrow) return `Mañana, ${base}`;
  return base.charAt(0).toUpperCase() + base.slice(1);
};

const formatTime = (t?: string) => (t ? t.slice(0, 5) : "");

/* ─── Componentes auxiliares ────────────────────────────────── */

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  removable?: boolean;
  className?: string;
}
const Chip = ({ active, onClick, children, removable, className }: ChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "shrink-0 inline-flex items-center gap-1 px-3 h-8 rounded-full border-2 font-ui text-xs transition-all active:scale-95",
      active
        ? "bg-km0-blue-700 text-white border-km0-blue-700 shadow-sm"
        : "bg-white text-km0-blue-900 border-km0-blue-200 hover:border-km0-blue-400",
      className,
    )}
  >
    {children}
    {removable && <X size={12} className="opacity-80" />}
  </button>
);

const SkeletonCard = () => (
  <div className="bg-white border border-km0-blue-100 rounded-2xl p-3 animate-pulse">
    <div className="h-4 w-2/3 bg-km0-blue-100/70 rounded mb-2" />
    <div className="h-3 w-1/2 bg-km0-blue-100/50 rounded mb-1.5" />
    <div className="h-3 w-1/3 bg-km0-blue-100/50 rounded" />
  </div>
);

interface EventListCardProps {
  evento: Evento;
}
const EventListCard = ({ evento }: EventListCardProps) => {
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
        {evento.tags?.slice(0, 2).map((t) => (
          <span
            key={t}
            className="px-1.5 py-0.5 rounded-full text-[10px] font-ui bg-km0-beige-100 text-km0-blue-900/70"
          >
            #{t.replace(/^#/, "")}
          </span>
        ))}
      </div>
    </motion.article>
  );
};

/* ─── Página ─────────────────────────────────────────────────── */

const Agenda = () => {
  const navigate = useNavigate();

  // Nivel 1
  const [when, setWhen] = useState<WhenKey>("semana");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [category, setCategory] = useState<Category>("todos");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  // Nivel 2 (avanzados)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [price, setPrice] = useState<Price>("todos");
  const [tagInput, setTagInput] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [tipo, setTipo] = useState("");
  const [organizador, setOrganizador] = useState("");
  const [poblacion, setPoblacion] = useState("Malgrat de Mar");

  // Datos
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce búsqueda
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  // Fetch — la pregunta usa la búsqueda libre + categoría como hint.
  useEffect(() => {
    const cat = CATEGORIES.find((c) => c.key === category);
    const hint = cat && cat.key !== "todos" ? cat.label : "";
    const pregunta = [debounced, hint, "eventos próximos"].filter(Boolean).join(" ");
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
  }, [debounced, category]);

  // Filtrado cliente
  const filtered = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.key === category);
    const range = rangeFor(when, { from: customFrom, to: customTo });

    return eventos.filter((e) => {
      // fecha
      if (range && e.fecha_inicio) {
        const d = new Date(e.fecha_inicio);
        if (d < range[0] || d > range[1]) return false;
      }
      // categoría
      if (cat && cat.matches.length > 0) {
        const hay = [
          ...(e.categorias ?? []),
          ...(e.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        if (!cat.matches.some((m) => hay.includes(m))) return false;
      }
      // precio
      if (price === "gratis" && !e.es_gratuito) return false;
      if (price === "pago" && e.es_gratuito) return false;
      // tags activos
      if (activeTags.length > 0) {
        const evTags = (e.tags ?? []).map((t) => t.replace(/^#/, "").toLowerCase());
        if (!activeTags.every((t) => evTags.includes(t.toLowerCase()))) return false;
      }
      // tipo (busca en categorias/tags)
      if (tipo.trim()) {
        const hay = [...(e.categorias ?? []), ...(e.tags ?? [])].join(" ").toLowerCase();
        if (!hay.includes(tipo.trim().toLowerCase())) return false;
      }
      // organizador (no hay campo dedicado: buscamos en lugar y descripción)
      if (organizador.trim()) {
        const hay = `${e.lugar_nombre ?? ""} ${e.descripcion_corta ?? ""}`.toLowerCase();
        if (!hay.includes(organizador.trim().toLowerCase())) return false;
      }
      // población
      if (poblacion.trim()) {
        if (!(e.poblacion_nombre ?? "").toLowerCase().includes(poblacion.trim().toLowerCase()))
          return false;
      }
      return true;
    });
  }, [eventos, when, customFrom, customTo, category, price, activeTags, tipo, organizador, poblacion]);

  // Agrupado por día
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

  /* ─── Handlers ──────────────────────────────────── */
  const toggleTag = (t: string) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };
  const addTagFromInput = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (!activeTags.includes(v)) setActiveTags([...activeTags, v]);
    setTagInput("");
  };
  const clearAdvanced = () => {
    setPrice("todos");
    setActiveTags([]);
    setTipo("");
    setOrganizador("");
    setPoblacion("Malgrat de Mar");
  };

  const whenLabel = WHEN_OPTIONS.find((w) => w.key === when)?.label;
  const catLabel = CATEGORIES.find((c) => c.key === category)?.label;

  /* ─── Render ─────────────────────────────────────── */
  const content = (
    <div className="flex flex-col gap-3 w-full">
      {/* ¿Cuándo? */}
      <section>
        <h3 className="font-brand text-xs text-km0-blue-900 mb-1.5 px-0.5">¿Cuándo?</h3>
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {WHEN_OPTIONS.map((opt) => (
            <Chip key={opt.key} active={when === opt.key} onClick={() => setWhen(opt.key)}>
              {opt.label}
            </Chip>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {when === "fechas" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 mt-2">
                <Input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="h-9 text-xs"
                />
                <Input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ¿Qué tipo de plan? */}
      <section>
        <h3 className="font-brand text-xs text-km0-blue-900 mb-1.5 px-0.5">
          ¿Qué tipo de plan buscas?
        </h3>
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {CATEGORIES.map((c) => (
            <Chip key={c.key} active={category === c.key} onClick={() => setCategory(c.key)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </section>

      {/* Buscador */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-km0-blue-700/60"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar eventos, lugares o tags…"
          className="h-9 pl-8 pr-3 text-xs bg-white border-km0-blue-200"
        />
      </div>

      {/* Resumen + filtros avanzados toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-ui text-km0-blue-700/80 truncate">
          {loading ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 size={11} className="animate-spin" />
              Buscando…
            </span>
          ) : (
            <>
              <span className="font-bold text-km0-blue-900">{filtered.length}</span> eventos
              {(whenLabel || (catLabel && category !== "todos")) && (
                <span className="ml-1 text-km0-blue-700/60">
                  · {whenLabel}
                  {category !== "todos" && ` · ${catLabel}`}
                </span>
              )}
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          className="shrink-0 inline-flex items-center gap-1 text-[11px] font-ui font-bold text-km0-blue-700 hover:text-km0-blue-900"
        >
          <SlidersHorizontal size={12} />
          {showAdvanced ? "Ocultar" : "Más filtros"}
        </button>
      </div>

      {/* Filtros activos (chips eliminables) */}
      {(price !== "todos" || activeTags.length > 0 || tipo || organizador) && (
        <div className="flex flex-wrap gap-1.5">
          {price !== "todos" && (
            <Chip removable onClick={() => setPrice("todos")} active>
              {price === "gratis" ? "Gratis" : "Pago"}
            </Chip>
          )}
          {activeTags.map((t) => (
            <Chip key={t} removable onClick={() => toggleTag(t)} active>
              #{t}
            </Chip>
          ))}
          {tipo && (
            <Chip removable onClick={() => setTipo("")} active>
              {tipo}
            </Chip>
          )}
          {organizador && (
            <Chip removable onClick={() => setOrganizador("")} active>
              {organizador}
            </Chip>
          )}
        </div>
      )}

      {/* ── Filtros avanzados ────────────────────────── */}
      <AnimatePresence initial={false}>
        {showAdvanced && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-km0-beige-50 border border-km0-blue-100 rounded-2xl p-3 space-y-3">
              {/* Precio */}
              <div>
                <h4 className="font-brand text-[11px] text-km0-blue-900 mb-1">Precio</h4>
                <div className="flex gap-1.5">
                  {(["todos", "gratis", "pago"] as Price[]).map((p) => (
                    <Chip key={p} active={price === p} onClick={() => setPrice(p)}>
                      {p === "todos" ? "Todos" : p === "gratis" ? "Gratis" : "Pago"}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-brand text-[11px] text-km0-blue-900 mb-1">Tags</h4>
                <div className="flex gap-1.5">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTagFromInput();
                      }
                    }}
                    placeholder="Buscar tag: manualidades, yoga…"
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    onClick={addTagFromInput}
                    className="h-8 px-3 text-xs bg-km0-blue-700 hover:bg-km0-blue-800"
                  >
                    Añadir
                  </Button>
                </div>
                {SUGGESTED_TAGS[category]?.length > 0 && (
                  <div className="mt-1.5">
                    <p className="text-[10px] font-ui text-km0-blue-700/60 mb-1">
                      Sugeridos para {catLabel}:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_TAGS[category].map((t) => (
                        <Chip
                          key={t}
                          active={activeTags.includes(t)}
                          onClick={() => toggleTag(t)}
                        >
                          #{t}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tipo */}
              <div>
                <h4 className="font-brand text-[11px] text-km0-blue-900 mb-1">Tipo</h4>
                <Input
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  placeholder="Ej: presencial, online…"
                  className="h-8 text-xs"
                />
              </div>

              {/* Organizador */}
              <div>
                <h4 className="font-brand text-[11px] text-km0-blue-900 mb-1">Organizador</h4>
                <Input
                  value={organizador}
                  onChange={(e) => setOrganizador(e.target.value)}
                  placeholder="Nombre del organizador o lugar…"
                  className="h-8 text-xs"
                />
              </div>

              {/* Población */}
              <div>
                <h4 className="font-brand text-[11px] text-km0-blue-900 mb-1">Población</h4>
                <Input
                  value={poblacion}
                  onChange={(e) => setPoblacion(e.target.value)}
                  placeholder="Población…"
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  onClick={() => setShowAdvanced(false)}
                  className="flex-1 h-9 text-xs bg-km0-blue-700 hover:bg-km0-blue-800"
                >
                  Aplicar filtros
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearAdvanced}
                  className="h-9 text-xs border-km0-blue-200"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Resultados ──────────────────────────────── */}
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
            <p className="text-[11px] font-ui text-km0-blue-700/70 mb-3">
              Prueba cambiando las fechas, la categoría o limpiando los filtros.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              <Chip onClick={() => setWhen("mes")}>Ver este mes</Chip>
              <Chip onClick={() => setCategory("todos")}>Todas las categorías</Chip>
              <Chip onClick={clearAdvanced}>Limpiar filtros</Chip>
            </div>
          </div>
        )}

        {grouped.map((g) => (
          <div key={g.date.toISOString()} className="space-y-2">
            <h3 className="font-brand text-xs text-km0-blue-900/80 sticky top-0 bg-km0-beige-50/95 backdrop-blur-sm py-1 -mx-1 px-1 z-10">
              {formatDayHeader(g.date)}
            </h3>
            {g.items.map((e) => (
              <EventListCard key={e.id_unico_evento} evento={e} />
            ))}
          </div>
        ))}
      </section>
    </div>
  );

  return (
    <BrandedFrame onBack={() => navigate(-1)} backAriaLabel="Volver">
      {content}
    </BrandedFrame>
  );
};

export default Agenda;

