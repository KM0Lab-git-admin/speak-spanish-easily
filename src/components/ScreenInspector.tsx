import { ReactNode, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SimulatedDevice from "@/components/SimulatedDevice";
import {
  RESPONSIVE_VIEWPORTS,
  getViewportById,
  type ViewportId,
} from "@/design-system/viewports";
import { SCREEN_TREES } from "@/design-system/screen-trees";

export interface InspectorState {
  id: string;
  label: string;
}

interface ScreenInspectorProps {
  screenId: string;
  title: string;
  states: InspectorState[];
  defaultStateId?: string;
  renderScreen: (stateId: string) => ReactNode;
}

/** Cuánto reducir cada viewport para que quepa cómodo en pantalla. */
const VIEWPORT_SCALES: Record<ViewportId, number> = {
  "mobile-portrait-base": 1,
  "mobile-landscape-base": 1,
  "tablet-portrait": 0.6,
  "desktop-landscape": 0.6,
};

const ScreenInspector = ({
  screenId,
  title,
  states,
  defaultStateId,
  renderScreen,
}: ScreenInspectorProps) => {
  const [params, setParams] = useSearchParams();

  const initialState = params.get("state") ?? defaultStateId ?? states[0].id;
  const initialVp = (params.get("vp") as ViewportId) ?? "mobile-portrait-base";

  const [stateId, setStateId] = useState<string>(
    states.find((s) => s.id === initialState) ? initialState : states[0].id,
  );
  const [viewportId, setViewportId] = useState<ViewportId>(
    RESPONSIVE_VIEWPORTS.find((v) => v.id === initialVp) ? initialVp : "mobile-portrait-base",
  );

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    setParams(next, { replace: true });
  };

  const onStateChange = (id: string) => {
    setStateId(id);
    updateParam("state", id);
  };
  const onViewportChange = (id: ViewportId) => {
    setViewportId(id);
    updateParam("vp", id);
  };

  const tree = SCREEN_TREES[screenId];
  const scale = VIEWPORT_SCALES[viewportId] ?? 1;

  const screenNode = useMemo(() => renderScreen(stateId), [renderScreen, stateId]);

  const copyTree = async () => {
    if (!tree) return;
    try {
      await navigator.clipboard.writeText(tree);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="min-h-screen w-screen bg-km0-beige-50">
      <header className="sticky top-0 z-20 bg-km0-blue-700 text-white px-4 py-3 shadow-md flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-brand text-xl">Inspector · {title}</h1>
          <p className="font-body text-xs opacity-80">
            Estado + resolución + árbol de componentes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-ui text-[11px] uppercase tracking-wide opacity-70">
              Estado
            </span>
            <div role="tablist" className="inline-flex rounded-full bg-white/10 p-1">
              {states.map((s) => {
                const active = s.id === stateId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onStateChange(s.id)}
                    className={`px-3 py-1 rounded-full font-ui text-xs transition-colors ${
                      active ? "bg-white text-km0-blue-700" : "text-white hover:bg-white/15"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-ui text-[11px] uppercase tracking-wide opacity-70">
              Resolución
            </span>
            <div role="tablist" className="inline-flex flex-wrap rounded-full bg-white/10 p-1">
              {RESPONSIVE_VIEWPORTS.map((v) => {
                const active = v.id === viewportId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    title={v.purpose}
                    onClick={() => onViewportChange(v.id)}
                    className={`px-3 py-1 rounded-full font-ui text-xs transition-colors ${
                      active ? "bg-white text-km0-blue-700" : "text-white hover:bg-white/15"
                    }`}
                  >
                    {v.label} · {v.width}×{v.height}
                    {v.tier === "smoke" ? " · smoke" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-6 flex flex-col vertical-tablet:flex-row gap-6 items-start">
        <div className="shrink-0">
          <SimulatedDevice viewportId={viewportId} scale={scale} label={title}>
            {screenNode}
          </SimulatedDevice>
        </div>

        <aside className="flex-1 min-w-[280px] w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-ui text-sm text-km0-blue-700">Árbol de componentes</h2>
            {tree && (
              <button
                type="button"
                onClick={copyTree}
                className="font-ui text-xs px-2 py-1 rounded-md border border-km0-blue-700/30 text-km0-blue-700 hover:bg-km0-blue-700/10 transition-colors"
              >
                Copiar
              </button>
            )}
          </div>
          {tree ? (
            <pre className="w-full overflow-auto rounded-xl border-2 border-km0-blue-700/20 bg-white p-4 font-mono text-xs leading-relaxed text-km0-blue-700 shadow-[0_8px_24px_-16px_hsl(var(--km0-blue-700)/0.35)] whitespace-pre">
              {tree}
            </pre>
          ) : (
            <p className="font-body text-xs text-km0-blue-700/60">
              No hay árbol registrado para <code>{screenId}</code>. Añádelo en{" "}
              <code>src/design-system/screen-trees.ts</code>.
            </p>
          )}
        </aside>
      </main>
    </div>
  );
};

export default ScreenInspector;
