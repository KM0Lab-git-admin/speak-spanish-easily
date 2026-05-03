import { useEffect, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import BrandedFrame from "@/components/BrandedFrame";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const RESEND_COOLDOWN_SECONDS = 30;

interface LocationState {
  email?: string;
  mode?: "signup" | "login";
}

/**
 * Pantalla de verificación OTP (segundo factor del passwordless).
 *
 * El email viene en location.state desde Signup/Login. Si entran a
 * /verify directamente sin estado, redirigimos a /login.
 *
 * Cuando los 6 dígitos se completan, llamamos a verifyOtp con type
 * "email" — válido tanto para signup como para magic link.
 */
const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const email = state.email;
  const mode = state.mode ?? "login";

  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Auto-submit al completar 6 dígitos.
  useEffect(() => {
    if (code.length === 6 && !verifying && email) {
      void handleVerify(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleVerify = async (token: string) => {
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      toast.error("Código incorrecto. Inténtalo de nuevo.");
      setCode("");
      setVerifying(false);
      return;
    }

    toast.success(mode === "signup" ? "¡Cuenta creada!" : "¡Bienvenido!");
    navigate("/home", { replace: true });
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: mode === "signup" },
    });
    if (error) {
      toast.error("No se pudo reenviar. Inténtalo más tarde.");
      return;
    }
    toast.success("Código reenviado");
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
        <div className="text-center space-y-1">
          <h1 className="font-brand text-2xl horizontal-mobile:text-xl text-km0-blue-700">
            Verifica tu email
          </h1>
          <p className="font-body text-sm text-muted-foreground px-4">
            Hemos enviado un código a<br />
            <span className="font-ui text-foreground">{email}</span>
          </p>
        </div>

        <div className="mt-2">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            disabled={verifying}
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-11 h-12 horizontal-mobile:w-9 horizontal-mobile:h-10 text-lg font-ui rounded-xl border-2 border-km0-blue-700/20 first:rounded-l-xl last:rounded-r-xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {verifying && (
          <p className="font-body text-sm text-muted-foreground">Verificando...</p>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="font-body text-sm text-km0-blue-700 underline underline-offset-2 disabled:text-muted-foreground disabled:no-underline"
        >
          {cooldown > 0 ? `Reenviar código en ${cooldown}s` : "Reenviar código"}
        </button>
      </motion.div>
    </BrandedFrame>
  );
};

export default Verify;
