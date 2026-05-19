import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BrandedFrame from "@/components/BrandedFrame";

const RESEND_COOLDOWN_SECONDS = 30;

interface LocationState {
  email?: string;
  mode?: "signup" | "login";
}

/**
 * CheckEmail — Pantalla "Revisa tu correo" tras enviar magic link.
 *
 * Sustituye a la antigua /verify (OTP de 6 dígitos), porque la plantilla
 * de email por defecto de Lovable solo entrega el enlace mágico, no el
 * código. El usuario completa el login pulsando el botón en su email,
 * que le redirige directamente a /home.
 *
 * Aquí solo mostramos confirmación visual + opción de reenviar.
 */
const CheckEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = (location.state ?? {}) as LocationState;
  // Fallback por query string para que /preview-all pueda renderizar esta
  // pantalla sin venir del flujo real de Login.
  const email = state.email ?? searchParams.get("email") ?? undefined;
  const mode = state.mode ?? "login";

  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/home`,
      },
    });
    setResending(false);
    if (error) {
      toast.error("No se pudo reenviar. Inténtalo más tarde.");
      return;
    }
    toast.success("Enlace reenviado");
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  return (
    <BrandedFrame onBack={() => navigate(-1)} backAriaLabel="Volver">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col items-center gap-5 pt-2"
      >
        <div className="w-16 h-16 rounded-full bg-km0-yellow-500/20 flex items-center justify-center mt-4">
          <Mail className="w-8 h-8 text-km0-blue-700" />
        </div>

        <div className="text-center space-y-2 px-2">
          <h1 className="font-brand text-2xl horizontal-mobile:text-xl text-km0-blue-700">
            Revisa tu correo
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Te hemos enviado un enlace a
          </p>
          <p className="font-ui text-base text-foreground break-all">
            {email}
          </p>
          <p className="font-body text-sm text-muted-foreground pt-2">
            Pulsa el enlace del email para entrar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="font-body text-sm text-km0-blue-700 underline underline-offset-2 disabled:text-muted-foreground disabled:no-underline mt-2"
        >
          {resending
            ? "Reenviando..."
            : cooldown > 0
            ? `Reenviar enlace en ${cooldown}s`
            : "Reenviar enlace"}
        </button>

        <p className="font-body text-xs text-muted-foreground text-center px-4 mt-auto pb-2">
          ¿No lo encuentras? Mira en spam o promociones.
        </p>
      </motion.div>
    </BrandedFrame>
  );
};

export default CheckEmail;
