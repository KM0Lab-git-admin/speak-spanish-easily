import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import BrandedFrame from "@/components/BrandedFrame";

/**
 * Pantalla única de entrada (login + registro unificados).
 *
 * Flujo passwordless: el usuario introduce su email y recibe un enlace
 * mágico. `shouldCreateUser: true` hace que la cuenta se cree si no
 * existe y se reutilice si ya existe → mismo flujo para ambos casos
 * (mínima fricción de entrada). Los datos extra (nombre, apellidos,
 * etc.) se piden más adelante en la pantalla de editar perfil.
 */
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Introduce tu email.");
      return;
    }

    setSubmitting(true);
    // Recuperamos CP+población del onboarding (si existen) para que se
    // guarden en el perfil al crear la cuenta vía handle_new_user trigger.
    const postalCode = sessionStorage.getItem("km0_postal_code") ?? undefined;
    const town = sessionStorage.getItem("km0_town") ?? undefined;
    // OTP de 6 dígitos por email — sin magic link. El usuario teclea
    // el código en /check-email sin salir de la app (clave para nativo).
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        data: { postal_code: postalCode, town },
      },
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    toast.success("Te hemos enviado un código por email");
    navigate("/check-email", { state: { email: email.trim(), mode: "login" } });
  };

  return (
    <BrandedFrame onBack={() => navigate(-1)} backAriaLabel="Volver">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col gap-4 horizontal-mobile:grid horizontal-mobile:grid-cols-2 horizontal-mobile:gap-x-5 horizontal-mobile:gap-y-2 horizontal-mobile:content-center"
      >
        {/* Columna izq (landscape) / arriba (portrait): título + form */}
        <div className="flex flex-col gap-3 horizontal-mobile:gap-2 min-w-0">
          <div className="text-center space-y-1 mt-2 horizontal-mobile:mt-0 horizontal-mobile:text-left">
            <h1 className="font-brand text-2xl horizontal-mobile:text-lg text-km0-blue-700">
              Entra o regístrate
            </h1>
            <p className="font-body text-sm horizontal-mobile:text-xs text-muted-foreground">
              Te enviaremos un enlace a tu email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 horizontal-mobile:gap-2 mt-2 horizontal-mobile:mt-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              inputMode="email"
              className="h-12 horizontal-mobile:h-10 px-4 rounded-xl border-2 border-km0-blue-700/20 bg-background font-body text-base horizontal-mobile:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-km0-blue-700 transition-colors"
            />

            <button
              type="submit"
              disabled={submitting}
              className="h-12 horizontal-mobile:h-10 mt-1 horizontal-mobile:mt-0 rounded-xl bg-km0-yellow-500 hover:bg-km0-yellow-600 active:scale-[0.98] transition-all font-ui text-base horizontal-mobile:text-sm text-km0-blue-700 disabled:opacity-50"
            >
              {submitting ? "Enviando enlace..." : "Continuar"}
            </button>
          </form>
        </div>

        {/* Columna der (landscape) / abajo (portrait): social próximamente */}
        <div className="flex flex-col gap-3 horizontal-mobile:gap-2 min-w-0 horizontal-mobile:justify-center">
          <div className="flex items-center gap-3 my-1 horizontal-mobile:my-0">
            <div className="flex-1 h-px bg-km0-blue-700/15" />
            <span className="font-body text-xs text-muted-foreground">próximamente</span>
            <div className="flex-1 h-px bg-km0-blue-700/15" />
          </div>

          <div className="grid grid-cols-2 gap-3 horizontal-mobile:gap-2 w-full" aria-disabled="true">
            <button
              type="button"
              disabled
              title="Próximamente"
              className="flex items-center justify-center gap-2 h-12 horizontal-mobile:h-10 rounded-xl border-2 border-km0-blue-700/10 bg-muted/40 grayscale opacity-50 cursor-not-allowed font-ui text-sm horizontal-mobile:text-xs text-muted-foreground"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" className="horizontal-mobile:w-4 horizontal-mobile:h-4">
                <path fill="currentColor" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              disabled
              title="Próximamente"
              className="flex items-center justify-center gap-2 h-12 horizontal-mobile:h-10 rounded-xl border-2 border-km0-blue-700/10 bg-muted/40 grayscale opacity-50 cursor-not-allowed font-ui text-sm horizontal-mobile:text-xs text-muted-foreground"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="horizontal-mobile:w-4 horizontal-mobile:h-4">
                <path d="M17.05 12.04c-.03-3.16 2.58-4.68 2.7-4.75-1.47-2.15-3.76-2.45-4.57-2.48-1.95-.2-3.8 1.15-4.79 1.15-.99 0-2.51-1.12-4.13-1.09-2.13.03-4.09 1.24-5.18 3.14-2.21 3.83-.57 9.5 1.59 12.6 1.05 1.52 2.31 3.23 3.97 3.17 1.59-.06 2.19-1.03 4.11-1.03s2.46 1.03 4.15 1c1.71-.03 2.79-1.55 3.84-3.07 1.21-1.76 1.71-3.47 1.74-3.56-.04-.02-3.34-1.28-3.37-5.08zM14.13 3.66c.88-1.07 1.47-2.55 1.31-4.03-1.27.05-2.79.84-3.7 1.91-.81.94-1.52 2.45-1.33 3.9 1.41.11 2.85-.72 3.72-1.78z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </div>
      </motion.div>
    </BrandedFrame>
  );
};

export default Login;
