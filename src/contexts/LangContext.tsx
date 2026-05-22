import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LANGS, type Lang } from "@/lib/i18n";

/**
 * LangContext — idioma global persistido en localStorage.
 *
 * Fuente única de verdad para toda la app. Reemplaza el paso por
 * router state (que se perdía al recargar).
 */

const STORAGE_KEY = "km0_lang";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

const readInitial = (): Lang => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && (LANGS as string[]).includes(raw)) return raw as Lang;
  } catch {/* localStorage puede fallar (privado / SSR) */}
  return "es";
};

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(readInitial);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {/* ignore */}
  }, []);

  // Sync entre pestañas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && (LANGS as string[]).includes(e.newValue)) {
        setLangState(e.newValue as Lang);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = (): LangContextValue => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
};
