import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Ticket,
  ExternalLink,
  Building2,
} from "lucide-react";

import BrandedFrame from "@/components/BrandedFrame";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
 * Evento — Ficha de un evento de la agenda.
 *
 * Estado actual: POC con 3 variantes visuales para validar
 * dirección de diseño antes de quedarnos con una.
 *   v1 → Hero con imagen grande arriba
 *   v2 → Card compacta sin hero
 *   v3 → Estilo ticket / pósters de concierto
 *
 * Datos de muestra reales (Malgrat de Mar, mayo 2026).
 * ───────────────────────────────────────────────────────────── */

interface EventoMuestra {
  titulo: string;
  descripcion: string;
  fecha: string; // ISO
  hora_inicio: string;
  hora_fin: string;
  lugar: string;
  direccion: string;
  poblacion: string;
  es_gratuito: boolean;
  precio?: number;
  categoria: string;
  organizador?: string;
  imagen: string;
  link_inscripcion?: string;
}

const EVENTO: EventoMuestra = {
  titulo: "Animeclub: «Millennium Actress»",
  descripcion:
    "El cicle d'animació japonesa Animeclub projecta la pel·lícula «Millennium Actress» de Satoshi Kon a dos quarts de set de la tarda al Centre Cultural. Una oda al cinema i a la memòria, narrada amb el llenguatge visual de l'anime més contemplatiu.",
  fecha: "2026-05-17",
  hora_inicio: "18:30",
  hora_fin: "20:30",
  lugar: "Centre Cultural",
  direccion: "Carrer del Carme, 26",
  poblacion: "Malgrat de Mar",
  es_gratuito: true,
  categoria: "Cultura · Cinema",
  organizador: "Ajuntament de Malgrat",
  imagen:
    "https://www.ajmalgrat.cat/media/repository/noticies/2026/Agenda/MillenniumActress2001_02_copy.jpg",
  link_inscripcion: "https://www.ajmalgrat.cat",
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
    mes: d
      .toLocaleDateString("es-ES", { month: "short" })
      .replace(".", "")
      .toUpperCase(),
    diaSemana: d
      .toLocaleDateString("es-ES", { weekday: "short" })
      .replace(".", "")
      .toUpperCase(),
  };
};

type Variant = "v1" | "v2" | "v3";

/* ── V1: Hero con imagen grande ─────────────────────────────── */
const VariantHero = ({ ev, onBack }: { ev: EventoMuestra; onBack: () => void }) => (
  <div className="-mx-4 -mt-2 flex flex-col h-full min-h-0">
    {/* Hero */}
    <div className="relative shrink-0">
      <img
        src={ev.imagen}
        alt={ev.titulo}
        className="w-full h-48 vertical-tablet:h-64 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-km0-blue-900/80 via-km0-blue-900/20 to-transparent" />
      <button
        onClick={onBack}
        className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md active:scale-95"
        aria-label="Volver"
      >
        <ArrowLeft size={18} className="text-km0-blue-900" />
      </button>
      <button
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md active:scale-95"
        aria-label="Compartir"
      >
        <Share2 size={16} className="text-km0-blue-900" />
      </button>
      <div className="absolute bottom-3 left-3 right-3">
        <span className="inline-block px-2 py-0.5 rounded-full bg-km0-yellow-400 text-km0-blue-900 text-[10px] font-ui font-bold mb-1.5">
          {ev.categoria}
        </span>
        <h1 className="font-brand text-xl text-white leading-tight drop-shadow">
          {ev.titulo}
        </h1>
      </div>
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

    {/* Descripción + CTA */}
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
      <button className="flex-1 h-11 rounded-full bg-km0-blue-900 text-white font-ui font-bold text-sm inline-flex items-center justify-center gap-1.5 active:scale-95">
        Inscribirse <ExternalLink size={14} />
      </button>
      <button
        className="w-11 h-11 rounded-full bg-white border border-km0-blue-200 text-km0-blue-900 inline-flex items-center justify-center active:scale-95"
        aria-label="Compartir"
      >
        <Share2 size={16} />
      </button>
    </div>
  </div>
);

/* ── V2: Card compacta sin hero ─────────────────────────────── */
const VariantCompact = ({ ev, onBack }: { ev: EventoMuestra; onBack: () => void }) => {
  const f = formatFechaCorta(ev.fecha);
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header simple */}
      <div className="flex items-center justify-between shrink-0 mb-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-km0-blue-200 flex items-center justify-center active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft size={18} className="text-km0-blue-900" />
        </button>
        <button
          className="w-9 h-9 rounded-full bg-white border border-km0-blue-200 flex items-center justify-center active:scale-95"
          aria-label="Compartir"
        >
          <Share2 size={16} className="text-km0-blue-900" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-3">
        {/* Cabecera con fecha mostaza al lado del título */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-14 rounded-xl bg-km0-yellow-400 text-km0-blue-900 text-center py-1.5 shadow-sm">
            <div className="font-ui text-[9px] font-bold leading-none">
              {f.diaSemana}
            </div>
            <div className="font-brand text-2xl leading-none mt-0.5">{f.dia}</div>
            <div className="font-ui text-[9px] font-bold leading-none mt-0.5">
              {f.mes}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1 mb-1">
              <span className="px-1.5 py-0.5 rounded-full bg-km0-blue-50 text-km0-blue-700 text-[10px] font-ui">
                {ev.categoria}
              </span>
              {ev.es_gratuito && (
                <span className="px-1.5 py-0.5 rounded-full bg-km0-teal-100 text-km0-teal-700 text-[10px] font-ui font-bold">
                  Gratis
                </span>
              )}
            </div>
            <h1 className="font-brand text-base text-km0-blue-900 leading-tight">
              {ev.titulo}
            </h1>
          </div>
        </div>

        {/* Datos en grid 2 columnas */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white border border-km0-blue-100 rounded-xl p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-ui text-km0-blue-700/70 uppercase mb-1">
              <Clock size={10} /> Horario
            </div>
            <div className="font-brand text-sm text-km0-blue-900">
              {ev.hora_inicio}
            </div>
            <div className="font-ui text-[10px] text-km0-blue-700/80">
              hasta {ev.hora_fin}
            </div>
          </div>
          <div className="bg-white border border-km0-blue-100 rounded-xl p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-ui text-km0-blue-700/70 uppercase mb-1">
              <MapPin size={10} /> Lugar
            </div>
            <div className="font-brand text-sm text-km0-blue-900 leading-tight truncate">
              {ev.lugar}
            </div>
            <div className="font-ui text-[10px] text-km0-blue-700/80 truncate">
              {ev.poblacion}
            </div>
          </div>
        </div>

        {/* Mini mapa placeholder */}
        <div className="bg-km0-blue-50 border border-km0-blue-100 rounded-xl h-20 flex items-center justify-center text-km0-blue-700/60 text-[11px] font-ui gap-1">
          <MapPin size={14} /> {ev.direccion}
        </div>

        {/* Descripción */}
        <div>
          <h2 className="font-brand text-xs text-km0-blue-900/80 uppercase mb-1">
            Sobre el evento
          </h2>
          <p className="font-body text-sm text-km0-blue-900/90 leading-relaxed">
            {ev.descripcion}
          </p>
        </div>

        {ev.organizador && (
          <div className="flex items-center gap-2 text-[11px] font-ui text-km0-blue-700/80 pt-1">
            <Building2 size={12} />
            Organiza: <span className="font-bold">{ev.organizador}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="pt-2 shrink-0">
        <button className="w-full h-11 rounded-full bg-km0-blue-900 text-white font-ui font-bold text-sm inline-flex items-center justify-center gap-1.5 active:scale-95">
          Inscribirse <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

/* ── V3: Ticket / pósters de concierto ──────────────────────── */
const VariantTicket = ({ ev, onBack }: { ev: EventoMuestra; onBack: () => void }) => {
  const f = formatFechaCorta(ev.fecha);
  return (
    <div className="flex flex-col h-full min-h-0">
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

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-2">
        {/* Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-km0-blue-100"
        >
          {/* Pósters arriba (ratio 3:4 aprox) */}
          <div className="relative aspect-[3/4] bg-km0-blue-900">
            <img
              src={ev.imagen}
              alt={ev.titulo}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-km0-blue-900/90 via-transparent to-km0-blue-900/30" />
            <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
              <span className="px-2 py-0.5 rounded-full bg-km0-yellow-400 text-km0-blue-900 text-[10px] font-ui font-bold">
                {ev.categoria}
              </span>
              {ev.es_gratuito && (
                <span className="px-2 py-0.5 rounded-full bg-km0-teal-500 text-white text-[10px] font-ui font-bold">
                  GRATIS
                </span>
              )}
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h1 className="font-brand text-lg text-white leading-tight drop-shadow">
                {ev.titulo}
              </h1>
            </div>
          </div>

          {/* Perforaciones decorativas */}
          <div className="relative h-4 bg-white">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-km0-beige-50" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-km0-beige-50" />
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 border-t border-dashed border-km0-blue-200" />
          </div>

          {/* Stub con datos */}
          <div className="px-4 pt-2 pb-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="font-ui text-[9px] text-km0-blue-700/60 uppercase">
                Fecha
              </div>
              <div className="font-brand text-base text-km0-blue-900 leading-none mt-1">
                {f.dia}
              </div>
              <div className="font-ui text-[10px] font-bold text-km0-blue-900">
                {f.mes}
              </div>
            </div>
            <div className="border-x border-dashed border-km0-blue-200">
              <div className="font-ui text-[9px] text-km0-blue-700/60 uppercase">
                Hora
              </div>
              <div className="font-brand text-base text-km0-blue-900 leading-none mt-1">
                {ev.hora_inicio}
              </div>
              <div className="font-ui text-[10px] text-km0-blue-700/80">
                – {ev.hora_fin}
              </div>
            </div>
            <div>
              <div className="font-ui text-[9px] text-km0-blue-700/60 uppercase">
                Lugar
              </div>
              <div className="font-brand text-[11px] text-km0-blue-900 leading-tight mt-1 line-clamp-2">
                {ev.lugar}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Descripción debajo del ticket */}
        <div className="mt-3 px-1">
          <p className="font-body text-sm text-km0-blue-900/90 leading-relaxed">
            {ev.descripcion}
          </p>
          <div className="mt-2 text-[11px] font-ui text-km0-blue-700/80 flex items-center gap-1">
            <MapPin size={12} /> {ev.direccion} · {ev.poblacion}
          </div>
          {ev.organizador && (
            <div className="text-[11px] font-ui text-km0-blue-700/80 flex items-center gap-1 mt-1">
              <Building2 size={12} /> {ev.organizador}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="pt-2 shrink-0">
        <button className="w-full h-11 rounded-full bg-km0-yellow-400 text-km0-blue-900 font-ui font-bold text-sm inline-flex items-center justify-center gap-1.5 active:scale-95 shadow-md">
          <Ticket size={16} /> Inscribirse
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
    { key: "v2", label: "Compacta" },
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
        {/* Selector POC (temporal — desaparecerá al elegir) */}
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
          {variant === "v2" && <VariantCompact ev={EVENTO} onBack={onBack} />}
          {variant === "v3" && <VariantTicket ev={EVENTO} onBack={onBack} />}
        </div>
      </div>
    </BrandedFrame>
  );
};

export default Evento;
