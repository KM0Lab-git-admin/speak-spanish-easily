import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import BrandedFrame from "@/components/BrandedFrame";
import SocialAuthButtons from "@/components/SocialAuthButtons";

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
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/home`,
        data: { postal_code: postalCode, town },
      },
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    toast.success("Te hemos enviado un enlace por email");
    navigate("/check-email", { state: { email: email.trim(), mode: "login" } });
  };

  return (
    <BrandedFrame onBack={() => navigate(-1)} backAriaLabel="Volver">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col gap-4"
      >
        <div className="text-center space-y-1 mt-2">
          <h1 className="font-brand text-2xl horizontal-mobile:text-xl text-km0-blue-700">
            Entra o regístrate
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Te enviaremos un enlace a tu email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            inputMode="email"
            className="h-12 px-4 rounded-xl border-2 border-km0-blue-700/20 bg-background font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-km0-blue-700 transition-colors"
          />

          <button
            type="submit"
            disabled={submitting}
            className="h-12 mt-1 rounded-xl bg-km0-yellow-500 hover:bg-km0-yellow-600 active:scale-[0.98] transition-all font-ui text-base text-km0-blue-700 disabled:opacity-50"
          >
            {submitting ? "Enviando enlace..." : "Continuar"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-km0-blue-700/15" />
          <span className="font-body text-xs text-muted-foreground">o continúa con</span>
          <div className="flex-1 h-px bg-km0-blue-700/15" />
        </div>

        <SocialAuthButtons />
      </motion.div>
    </BrandedFrame>
  );
};

export default Login;
