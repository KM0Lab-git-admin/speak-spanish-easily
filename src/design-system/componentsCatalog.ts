/**
 * Catálogo de metadata de componentes propios del proyecto (no shadcn/ui).
 * Fuente de verdad para la página `/components`. Mantener sincronizado con
 * las props reales de cada componente en `src/components/*`.
 */

export type ComponentCategory =
  | "marca"
  | "navegacion"
  | "cabecera"
  | "home"
  | "agenda"
  | "chat"
  | "auth"
  | "overlay"
  | "idioma";

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  marca: "Marca y layout",
  navegacion: "Navegación",
  cabecera: "Cabeceras",
  home: "Home",
  agenda: "Agenda y evento",
  chat: "Chat",
  auth: "Auth",
  overlay: "Overlays",
  idioma: "Idioma",
};

export interface PropSpec {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: string;
}

export type Breakpoint =
  | "vertical-mobile"
  | "vertical-tablet"
  | "horizontal-mobile"
  | "horizontal-desktop";

export interface ResponsiveNote {
  breakpoint: Breakpoint;
  behavior: string;
}

export interface ComponentSpec {
  id: string;
  name: string;
  category: ComponentCategory;
  importPath: string;
  description: string;
  usedIn: string[];
  props: PropSpec[];
  responsive: ResponsiveNote[];
  notes?: string[];
}

export const componentsCatalog: ComponentSpec[] = [
  /* ─── Marca y layout ──────────────────────────────── */
  {
    id: "branded-frame",
    name: "BrandedFrame",
    category: "marca",
    importPath: "@/components/BrandedFrame",
    description:
      "Wrapper obligatorio para pantallas con marca. Garantiza logo + back en posición idéntica y card de tamaño fijo (ratio móvil en portrait, 16:9 en landscape) en los 4 breakpoints.",
    usedIn: ["Language (Index)", "Onboarding", "PostalCode"],
    props: [
      { name: "children", type: "ReactNode", required: true, description: "Contenido renderizado dentro de la card." },
      { name: "onBack", type: "() => void", description: "Si se pasa, muestra el botón back amarillo a la izquierda del logo." },
      { name: "backAriaLabel", type: "string", defaultValue: '"Back"', description: "Aria label del botón back (i18n responsabilidad del consumidor)." },
      { name: "hideHeader", type: "boolean", defaultValue: "false", description: "Oculta el header con logo (cuando la pantalla ya tiene su propio hero)." },
      { name: "portraitContentClassName", type: "string", description: "Clases extra para el body en portrait." },
      { name: "landscapeContentClassName", type: "string", description: "Clases extra para el body en landscape." },
    ],
    responsive: [
      { breakpoint: "vertical-mobile", behavior: "Card ratio 9:19.5, logo h-9, header pt-5/pb-4." },
      { breakpoint: "vertical-tablet", behavior: "Misma card pero clampada a 420px de ancho." },
      { breakpoint: "horizontal-mobile", behavior: "Card ratio 16:9 compacta, logo h-8, paddings reducidos." },
      { breakpoint: "horizontal-desktop", behavior: "Card ratio 16:9 hasta 1200px, logo h-11, padding cómodo." },
    ],
    notes: [
      "El tamaño de la card se calcula SOLO desde el viewport, nunca del contenido — el frame nunca se deforma.",
      "Si el contenido no cabe, hace scroll-y INTERNO en el body. Nunca scroll horizontal.",
      "Chat NO usa este wrapper: tiene layout fullbleed propio.",
    ],
  },
  {
    id: "km0-logo",
    name: "Km0Logo",
    category: "marca",
    importPath: "@/components/Km0Logo",
    description: "Logo institucional KM0 LAB en SVG. Color y proporciones fijas, solo se controla el tamaño desde className.",
    usedIn: ["BrandedFrame", "Chat header"],
    props: [
      { name: "className", type: "string", defaultValue: '""', description: 'Clases de Tailwind para tamaño. Habitualmente "h-8" a "h-11".' },
    ],
    responsive: [
      { breakpoint: "vertical-mobile", behavior: "h-9 dentro del frame." },
      { breakpoint: "vertical-tablet", behavior: "h-9 dentro del frame (clampado por viewBox)." },
      { breakpoint: "horizontal-mobile", behavior: "h-8 compacto." },
      { breakpoint: "horizontal-desktop", behavior: "h-11." },
    ],
    notes: ["No añadir font-bold ni alterar fill — colores ya forman parte del SVG."],
  },
  {
    id: "floating-dots",
    name: "FloatingDots",
    category: "marca",
    importPath: "@/components/FloatingDots",
    description: "Puntos teal animados (animate-float) posicionados absolutos sobre un contenedor `relative`. Decoración ambiental.",
    usedIn: ["PostalCode", "Onboarding fondos"],
    props: [
      { name: "className", type: "string", description: "Clases extra para el contenedor absoluto." },
    ],
    responsive: [
      { breakpoint: "vertical-mobile", behavior: "Posiciones idénticas (porcentaje del contenedor)." },
      { breakpoint: "vertical-tablet", behavior: "Igual — escala con el padre." },
      { breakpoint: "horizontal-mobile", behavior: "Igual — escala con el padre." },
      { breakpoint: "horizontal-desktop", behavior: "Igual — escala con el padre." },
    ],
    notes: ["El padre DEBE ser `relative` y normalmente `overflow-hidden`."],
  },

  /* ─── Navegación ──────────────────────────────────── */
  {
    id: "bottom-tabs",
    name: "BottomTabs",
    category: "navegacion",
    importPath: "@/components/BottomTabs",
    description: "Barra de navegación inferior fija con 4 tabs (Inicio · Información · Ofertas · Perfil). El tab Perfil cambia de acción según haya sesión.",
    usedIn: ["Home", "Agenda"],
    props: [
      { name: "activeTab", type: '"home" | "info" | "ofertes" | "perfil"', required: true, description: "Tab activo (controlado por la pantalla)." },
      { name: "onTabChange", type: "(t: HomeTab) => void", required: true, description: "Callback al cambiar de tab." },
      { name: "showProfile", type: "boolean", required: true, description: "Si hay sesión, el tab Perfil navega a /profile; si no, a /login." },
      { name: "onLogin", type: "() => void", required: true, description: "Acción cuando no hay sesión y se pulsa Perfil." },
      { name: "onProfile", type: "() => void", required: true, description: "Acción cuando hay sesión y se pulsa Perfil." },
    ],
    responsive: [
      { breakpoint: "vertical-mobile", behavior: "pt-2/pb-3, iconos 20px, labels 10px." },
      { breakpoint: "vertical-tablet", behavior: "Igual que vertical-mobile (no escala)." },
      { breakpoint: "horizontal-mobile", behavior: "Paddings reducidos: pt-1/pb-1.5 (override !important)." },
      { breakpoint: "horizontal-desktop", behavior: "Como vertical-mobile." },
    ],
  },
  {
    id: "nav-link",
    name: "NavLink",
    category: "navegacion",
    importPath: "@/components/NavLink",
    description: "Wrapper de `react-router-dom NavLink` que acepta className + activeClassName + pendingClassName como strings simples, sin function-as-children.",
    usedIn: ["(libre — disponible para cualquier nav)"],
    props: [
      { name: "to", type: "string", required: true, description: "Destino (igual que NavLink de react-router)." },
      { name: "className", type: "string", description: "Clases base aplicadas siempre." },
      { name: "activeClassName", type: "string", description: "Clases añadidas cuando la ruta está activa." },
      { name: "pendingClassName", type: "string", description: "Clases añadidas cuando la ruta está en pending." },
    ],
    responsive: [
      { breakpoint: "vertical-mobile", behavior: "Las clases que pases definen el comportamiento." },
      { breakpoint: "vertical-tablet", behavior: "Idem." },
      { breakpoint: "horizontal-mobile", behavior: "Idem." },
      { breakpoint: "horizontal-desktop", behavior: "Idem." },
    ],
  },
  {
    id: "login-button",
    name: "LoginButton",
    category: "navegacion",
    importPath: "@/components/LoginButton",
    description: "Botón “Iniciar sesión” reutilizable, amarillo sobre texto azul. Sin wrapper ni animaciones externas — el consumidor decide layout.",
    usedIn: ["HomeHero", "Agenda"],
    props: [
      { name: "onClick", type: "() => void", required: true, description: "Acción al pulsar." },
      { name: "size", type: '"sm" | "md"', defaultValue: '"sm"', description: "Tamaño visual. sm escala con vertical-tablet." },
      { name: "className", type: "string", description: "Overrides puntuales (por ejemplo por breakpoint)." },
      { name: "label", type: "string", defaultValue: '"Iniciar sesión"', description: "Texto del botón (i18n del consumidor)." },
    ],
    responsive: [
      { breakpoint: "vertical-mobile", behavior: "sm: text-xs · px-3.5 · py-1." },
      { breakpoint: "vertical-tablet", behavior: "sm: text-sm · px-5 · py-1.5 (escalado)." },
      { breakpoint: "horizontal-mobile", behavior: "sm: text-xs (no escala)." },
      { breakpoint: "horizontal-desktop", behavior: "sm: text-xs (no escala)." },
    ],
  },

  /* ─── Agenda y evento ─────────────────────────────── */
  {
    id: "when-tabs",
    name: "WhenTabs",
    category: "agenda",
    importPath: "@/components/WhenTabs",
    description: "Segmented control de rango temporal para la Agenda: Esta semana · Este mes · 3 meses. Layout grid 3 columnas con pills.",
    usedIn: ["Agenda"],
    props: [
      { name: "value", type: '"semana" | "proxima-semana" | "mes" | "trimestre"', required: true, description: "Tab activo." },
      { name: "onChange", type: "(key: WhenKey) => void", required: true, description: "Callback al cambiar de rango." },
      { name: "className", type: "string", description: "Clases extra para el contenedor exterior." },
    ],
    responsive: [
      { breakpoint: "vertical-mobile", behavior: "text-[11px], grid-cols-3, alto mínimo 36px." },
      { breakpoint: "vertical-tablet", behavior: "text-sm (escalado)." },
      { breakpoint: "horizontal-mobile", behavior: "Como vertical-mobile, texto compacto." },
      { breakpoint: "horizontal-desktop", behavior: "text-sm." },
    ],
    notes: ["Pill activa: bg km0-blue-600 · texto km0-yellow-400. Nunca usar otros colores."],
  },
  {
    id: "event-card",
    name: "EventCard",
    category: "agenda",
    importPath: "@/components/EventCard",
    description: "Tarjeta resumen de evento en la lista de Agenda. Muestra título, descripción corta, fecha/hora/lugar, tags y badge de precio/gratis.",
    usedIn: ["Agenda"],
    props: [
      { name: "evento", type: "Evento", required: true, description: "Objeto Evento del API event-query." },
      { name: "index", type: "number", required: true, description: "Índice en la lista (usado para staggered fade-in)." },
    ],
    responsive: [
      { breakpoint: "vertical-mobile", behavior: "p-3, título text-sm, iconos 12px." },
      { breakpoint: "vertical-tablet", behavior: "Mismo layout (no escala el card en lista)." },
      { breakpoint: "horizontal-mobile", behavior: "Igual." },
      { breakpoint: "horizontal-desktop", behavior: "Igual — la lista decide cuántas columnas." },
    ],
    notes: [
      "Tags se truncan a 3 (slice(0, 3)).",
      "Badge gratis (accent) vs precio en € (secondary).",
    ],
  },
];

export const componentsByCategory = (): Record<ComponentCategory, ComponentSpec[]> => {
  const acc = {} as Record<ComponentCategory, ComponentSpec[]>;
  (Object.keys(CATEGORY_LABELS) as ComponentCategory[]).forEach((c) => (acc[c] = []));
  componentsCatalog.forEach((c) => acc[c.category].push(c));
  return acc;
};
