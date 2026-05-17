import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Ticket,
  ExternalLink,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import BrandedFrame from "@/components/BrandedFrame";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
 * Evento — Ficha de un evento de la agenda.
 *
 * POC con 2 variantes:
 *   v1 → Hero con imagen grande arriba
 *   v3 → Estilo ticket / pósters de concierto con scroll vertical interno
 *
 * Soporta carrusel cuando hay múltiples imágenes.
 * ───────────────────────────────────────────────────────────── */

interface EventoMuestra {
  titulo: string;
  descripcion: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  lugar: string;
  direccion: string;
  poblacion: string;
  es_gratuito: boolean;
  precio?: number;
  categoria: string;
  organizador?: string;
  imagenes: string[];
  link_inscripcion?: string;
  link_noticia?: string;
}

const EVENTO: EventoMuestra = {
  titulo: "Animeclub: «Millennium Actress»",
  descripcion:
    'El cicle d\'animació japonesa "Animeclub" projecta la pel·lícula "Millenium actress" de Satoshi Kon a dos quarts de set de la tarda al Centre Cultural.',
  fecha: "2026-05-17",
  hora_inicio: "18:30",
  hora_fin: "20:30",
  lugar: "Centre Cultural",
  direccion: "Carrer del Carme, 26",
  poblacion: "Malgrat de Mar",
  es_gratuito: true,
  categoria: "Cultura · Cinema",
  organizador: "Ajuntament de Malgrat",
  imagenes: [
    "https://www.ajmalgrat.cat/media/repository/noticies/2026/Agenda/MillenniumActress2001_02_copy.jpg",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
  ],
  // link_inscripcion: undefined,  // descomenta para probar "Ampliar noticia"
  link_inscripcion: "https://www.ajmalgrat.cat",
  link_noticia: "https://www.ajmalgrat.cat",
};

const formatFechaLarga = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return d
    .toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(/^\w/, (c) => c.toUpperCase());
};

const formatFechaCorta = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return {
    dia: d.getDate(),
    mes: d.toLocaleDateString("es-ES", { month: "short" }).replace(".", "").toUpperCase(),
    diaSemana: d.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "").toUpperCase(),
  };
};

type Variant = "v1" | "v3";

/* ── CTA condicional ──────────────────────────────────────────
 * Si hay link_inscripcion → "Inscribirse"
 * Si no, pero hay link_noticia → "Ampliar información"
 * Si no hay ninguno → null
 * ─────────────────────────────────────────────────────────── */
const CtaPrincipal = ({
  ev,
  className,
  amarillo = false,
}: {
  ev: EventoMuestra;
  className?: string;
  amarillo?: boolean;
}) => {
  const href = ev.link_inscripcion || ev.link_noticia;
  if (!href) return null;
  const esInscripcion = !!ev.link_inscripcion;
  const label = esInscripcion ? "Inscribirse" : "Ampliar información";
  const Icon = esInscripcion ? Ticket : ExternalLink;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex-1 h-11 rounded-full font-ui font-bold text-sm inline-flex items-center justify-center gap-1.5 active:scale-95 transition-transform",
        amarillo
          ? "bg-km0-yellow-400 text-km0-blue-900 shadow-md"
          : "bg-km0-blue-900 text-white",
        className,
      )}
    >
      <Icon size={14} /> {label}
    </a>
  );
};

/* ── Carrusel de imágenes (compartido) ───────────────────────── */
const ImageCarousel = ({
  imagenes,
  alt,
  className,
  overlay,
}: {
  imagenes: string[];
  alt: string;
  className?: string;
  overlay?: React.ReactNode;
}) => {
  const [idx, setIdx] = useState(0);
  const total = imagenes.length;
  const go = (n: number) => setIdx((n + total) % total);

  return (
    <div className={cn("relative overflow-hidden bg-km0-blue-900", className)}>
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={idx}
          src={imagenes[idx]}
          alt={`${alt} (${idx + 1}/${total})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {overlay}

      {total > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(idx - 1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 backdrop-blur flex items-center justify-center shadow active:scale-95"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={14} className="text-km0-blue-900" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(idx + 1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 backdrop-blur flex items-center justify-center shadow active:scale-95"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={14} className="text-km0-blue-900" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {imagenes.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === idx ? "w-4 bg-white" : "w-1.5 bg-white/60",
                )}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ── V1: Hero con imagen grande ─────────────────────────────── */
const VariantHero = ({ ev, onBack }: { ev: EventoMuestra; onBack: () => void }) => (
  <div className="-mx-4 -mt-2 flex flex-col h-full min-h-0">
    {/* Hero */}
    <div className="relative shrink-0">
      <ImageCarousel
        imagenes={ev.imagenes}
        alt={ev.titulo}
        className="w-full h-48 vertical-tablet:h-64"
        overlay={
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-km0-blue-900/80 via-km0-blue-900/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
              <span className="inline-block px-2 py-0.5 rounded-full bg-km0-yellow-400 text-km0-blue-900 text-[10px] font-ui font-bold mb-1.5">
                {ev.categoria}
              </span>
              <h1 className="font-brand text-xl text-white leading-tight drop-shadow">
                {ev.titulo}
              </h1>
            </div>
          </>
        }
      />
      <button
        onClick={onBack}
        className="absolute top-3 left-3 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md active:scale-95"
        aria-label="Volver"
      >
        <ArrowLeft size={18} className="text-km0-blue-900" />
      </button>
      <button
        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md active:scale-95"
        aria-label="Compartir"
      >
        <Share2 size={16} className="text-km0-blue-900" />
      </button>
    </div>

    {/* Datos clave en card flotante */}
    <div className="px-4 -mt-4 relative z-10 shrink-0">
      <div className="bg-white border border-km0-blue-100 rounded-2xl shadow-md p-3 space-y-2">
        <div className="flex items-center gap-2 text-km0-blue-900">
          <Calendar size={14} className="text-km0-teal-600 shrink-0" />
          <span className="font-ui text-xs">{formatFechaLarga(ev.fecha)}</span>
        </div>
        <div className="flex items-center gap-2 text-km0-blue-900">
          <Clock size={14} className="text-km0-teal-600 shrink-0" />
          <span className="font-ui text-xs">
            {ev.hora_inicio} – {ev.hora_fin}
          </span>
        </div>
        <div className="flex items-start gap-2 text-km0-blue-900">
          <MapPin size={14} className="text-km0-teal-600 shrink-0 mt-0.5" />
          <div className="font-ui text-xs leading-snug">
            <div className="font-bold">{ev.lugar}</div>
            <div className="text-km0-blue-700/80">
              {ev.direccion} · {ev.poblacion}
            </div>
          </div>
        </div>
        {ev.es_gratuito && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-km0-teal-100 text-km0-teal-700 text-[10px] font-ui font-bold">
            <Ticket size={10} /> Entrada gratuita
          </div>
        )}
      </div>
    </div>

    {/* Descripción */}
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-3 pb-4 space-y-3">
      <p className="font-body text-sm text-km0-blue-900/90 leading-relaxed">
        {ev.descripcion}
      </p>
      {ev.organizador && (
        <div className="flex items-center gap-2 text-[11px] font-ui text-km0-blue-700/80">
          <Building2 size={12} />
          Organiza: <span className="font-bold">{ev.organizador}</span>
        </div>
      )}
    </div>

    {/* CTAs sticky abajo */}
    <div className="px-4 pb-3 pt-2 shrink-0 bg-km0-beige-50/95 backdrop-blur border-t border-km0-blue-100 flex gap-2">
      <CtaPrincipal ev={ev} />
      <button
        className="w-11 h-11 rounded-full bg-white border border-km0-blue-200 text-km0-blue-900 inline-flex items-center justify-center active:scale-95 shrink-0"
        aria-label="Compartir"
      >
        <Share2 size={16} />
      </button>
    </div>
  </div>
);

/* ── V3: Ticket / pósters de concierto ───────────────────────── */
const VariantTicket = ({ ev, onBack }: { ev: EventoMuestra; onBack: () => void }) => {
  const f = formatFechaCorta(ev.fecha);
  return (
    <div className="flex flex-col h-full min-h-0 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-2">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-km0-blue-200 flex items-center justify-center active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft size={18} className="text-km0-blue-900" />
        </button>
        <span className="font-brand text-xs text-km0-blue-900/70 uppercase tracking-widest">
          Tu entrada
        </span>
        <button
          className="w-9 h-9 rounded-full bg-white border border-km0-blue-200 flex items-center justify-center active:scale-95"
          aria-label="Compartir"
        >
          <Share2 size={16} className="text-km0-blue-900" />
        </button>
      </div>

      {/* Ticket — scroll vertical interno para no perder texto */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl shadow-lg border border-km0-blue-100 flex-1 min-h-0 flex flex-col overflow-x-hidden overflow-y-auto touch-pan-y overscroll-contain"
      >
        {/* Imagen / carrusel — vertical/poster (aspect 3/4) */}
        <ImageCarousel
          imagenes={ev.imagenes}
          alt={ev.titulo}
          className="relative w-full aspect-[3/4] shrink-0 rounded-t-3xl"
          overlay={
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-km0-blue-900/90 via-transparent to-km0-blue-900/30 pointer-events-none" />
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10 pointer-events-none">
                <span className="px-2 py-0.5 rounded-full bg-km0-yellow-400 text-km0-blue-900 text-[10px] font-ui font-bold">
                  {ev.categoria}
                </span>
                {ev.es_gratuito && (
                  <span className="px-2 py-0.5 rounded-full bg-km0-teal-500 text-white text-[10px] font-ui font-bold">
                    GRATIS
                  </span>
                )}
              </div>
              <div className="absolute bottom-7 left-3 right-3 z-[5] pointer-events-none">
                <h1 className="font-brand text-base text-white leading-tight drop-shadow">
                  {ev.titulo}
                </h1>
                {ev.organizador && (
                  <div className="text-[10px] font-ui text-white/80 flex items-center gap-1 mt-0.5">
                    <Building2 size={10} /> {ev.organizador}
                  </div>
                )}
              </div>
            </>
          }
        />

        {/* Perforaciones */}
        <div className="relative h-3 bg-white shrink-0">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-km0-beige-50" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-km0-beige-50" />
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 border-t border-dashed border-km0-blue-200" />
        </div>

        {/* Stub */}
        <div className="px-3 pt-2 pb-3 grid grid-cols-3 gap-2 text-center shrink-0">
          <div>
            <div className="font-ui text-[9px] text-km0-blue-700/60 uppercase">Fecha</div>
            <div className="font-brand text-base text-km0-blue-900 leading-none mt-0.5">
              {f.dia}
            </div>
            <div className="font-ui text-[10px] font-bold text-km0-blue-900">{f.mes}</div>
          </div>
          <div className="border-x border-dashed border-km0-blue-200">
            <div className="font-ui text-[9px] text-km0-blue-700/60 uppercase">Hora</div>
            <div className="font-brand text-base text-km0-blue-900 leading-none mt-0.5">
              {ev.hora_inicio}
            </div>
            <div className="font-ui text-[10px] text-km0-blue-700/80">– {ev.hora_fin}</div>
          </div>
          <div>
            <div className="font-ui text-[9px] text-km0-blue-700/60 uppercase">Lugar</div>
            <div className="font-brand text-[11px] text-km0-blue-900 leading-tight mt-0.5 line-clamp-2">
              {ev.lugar}
            </div>
            <div className="font-ui text-[9px] text-km0-blue-700/70 truncate">
              {ev.poblacion}
            </div>
          </div>
        </div>

        {/* Descripción — dentro del ticket, scrollable junto al resto */}
        <div className="px-4 pb-5 pt-2 space-y-2 border-t border-dashed border-km0-blue-200/60 shrink-0">
          <p className="font-body text-xs text-km0-blue-900/90 leading-relaxed">
            {ev.descripcion}
          </p>
          <div className="flex items-start gap-1.5 text-[10px] font-ui text-km0-blue-700/80">
            <MapPin size={11} className="shrink-0 mt-0.5" />
            <span>
              {ev.direccion} · {ev.poblacion}
            </span>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <div className="pt-2 shrink-0 flex gap-2">
        <CtaPrincipal ev={ev} amarillo />
        <button
          className="w-11 h-11 rounded-full bg-white border border-km0-blue-200 text-km0-blue-900 inline-flex items-center justify-center active:scale-95 shrink-0"
          aria-label="Compartir"
        >
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
};

/* ─── Página con selector de variantes ──────────────────────── */
const Evento = () => {
  const navigate = useNavigate();
  const [variant, setVariant] = useState<Variant>("v1");

  const variants: { key: Variant; label: string }[] = [
    { key: "v1", label: "Hero" },
    { key: "v3", label: "Ticket" },
  ];

  const onBack = () => navigate(-1);

  return (
    <BrandedFrame
      hideHeader
      portraitContentClassName="!overflow-hidden !pb-0"
      landscapeContentClassName="!pb-0"
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Selector POC */}
        <div className="shrink-0 mb-2 flex items-center gap-1 bg-white border border-km0-blue-100 rounded-full p-1">
          {variants.map((v) => (
            <button
              key={v.key}
              onClick={() => setVariant(v.key)}
              className={cn(
                "flex-1 h-7 rounded-full font-ui text-[11px] font-bold transition-all",
                variant === v.key
                  ? "bg-km0-blue-900 text-white shadow-sm"
                  : "text-km0-blue-700/70",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0">
          {variant === "v1" && <VariantHero ev={EVENTO} onBack={onBack} />}
          {variant === "v3" && <VariantTicket ev={EVENTO} onBack={onBack} />}
        </div>
      </div>
    </BrandedFrame>
  );
};

export default Evento;
