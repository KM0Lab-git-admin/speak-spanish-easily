import type { HomeModule } from "@/components/HomeModules";

/** Módulos iniciales del Home (todos activos por defecto). */
export const INITIAL_MODULES: HomeModule[] = [
  { id: "chat", label: "KM0 CHAT", active: true },
  { id: "agenda", label: "Agenda", active: true },
  { id: "ajuntament", label: "Ayuntamiento", active: true },
  { id: "comerc", label: "Comercios", active: true },
];
