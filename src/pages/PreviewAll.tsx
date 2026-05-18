import ScreenFrame from "@/components/ScreenFrame";

/**
 * /preview-all — Catálogo visual: cada pantalla de la app renderizada en
 * sus dos resoluciones mínimas (vertical-mobile 375×667 y horizontal-mobile
 * 667×375) lado a lado, para QA visual rápido sin tener que cambiar el
 * viewport del navegador.
 *
 * Empezamos con Language. Las demás pantallas se irán añadiendo en
 * iteraciones siguientes (misma estructura: una entrada por ruta).
 */
const screens: { label: string; src: string }[] = [
  { label: "Language", src: "/" },
  // { label: "Onboarding",  src: "/onboarding"  },
  // { label: "PostalCode",  src: "/postal-code" },
  // { label: "Login",       src: "/login"       },
  // { label: "CheckEmail",  src: "/check-email" },
  // { label: "Chat",        src: "/chat"        },
  // { label: "Home",        src: "/home"        },
  // { label: "Agenda",      src: "/agenda"      },
  // { label: "Evento",      src: "/evento"      },
  // { label: "Profile",     src: "/profile"     },
];

const PreviewAll = () => {
  return (
    <div className="min-h-screen w-screen bg-km0-beige-50">
      <header className="sticky top-0 z-10 bg-km0-blue-700 text-white px-4 py-3 shadow-md">
        <h1 className="font-brand text-xl">Preview · todas las pantallas</h1>
        <p className="font-body text-sm opacity-80">
          Resoluciones mínimas: vertical-mobile (375×667) y horizontal-mobile (667×375)
        </p>
      </header>

      <main className="w-full px-4 py-6 flex flex-col gap-10">
        {screens.map((s) => (
          <section key={s.label} className="flex flex-col gap-4 w-full">
            <h2 className="font-ui text-lg text-km0-blue-700">{s.label}</h2>
            <div className="flex flex-wrap items-start gap-6 w-full">
              <ScreenFrame src={s.src} orientation="portrait"  label={s.label} />
              <ScreenFrame src={s.src} orientation="landscape" label={s.label} />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default PreviewAll;
