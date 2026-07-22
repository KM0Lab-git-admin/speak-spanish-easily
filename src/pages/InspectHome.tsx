import ScreenInspector from "@/components/ScreenInspector";
import HomeSandbox, { type HomeSandboxState } from "@/components/HomeSandbox";

/**
 * /inspect/home — inspector visual de la Home: selector de estado
 * (guest / registered / reward-welcome), selector de resolución y
 * árbol de componentes al lado del frame simulado.
 */
const InspectHome = () => (
  <ScreenInspector
    screenId="home"
    title="Home"
    defaultStateId="guest"
    states={[
      { id: "guest", label: "No registrado" },
      { id: "registered", label: "Registrado" },
      { id: "reward-welcome", label: "Reward welcome" },
    ]}
    renderScreen={(id) => <HomeSandbox state={id as HomeSandboxState} />}
  />
);

export default InspectHome;
