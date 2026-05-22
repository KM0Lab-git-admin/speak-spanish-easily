import type { HomeModule } from "@/components/HomeModules";

/** Módulos iniciales del Home (solo Agenda activa por defecto). */
export const INITIAL_MODULES: HomeModule[] = [
  { id: "agenda", label: "Agenda", active: true },
  { id: "chat", label: "KM0 CHAT", active: false },
  { id: "ajuntament", label: "Ayuntamiento", active: false },
  { id: "comerc", label: "Comercios", active: false },
];
