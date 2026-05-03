import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import BrandedFrame from "@/components/BrandedFrame";
import SocialAuthButtons from "@/components/SocialAuthButtons";

/**
 * Pantalla de login.
 *
 * Mismo flujo passwordless: usuario introduce email, recibe OTP de 6
 * dígitos, lo valida en /verify. `shouldCreateUser: false` para que
 * no cree cuentas accidentalmente desde aquí.
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
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/home`,
      },
    });

    if (error) {
      // Mensaje útil cuando el email no existe.
      const msg = /signups not allowed|user not found/i.test(error.message)
        ? "No encontramos esa cuenta. ¿Quieres registrarte?"
        : error.message;
      toast.error(msg);
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
            Bienvenido de nuevo
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
            {submitting ? "Enviando enlace..." : "Enviar enlace"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-km0-blue-700/15" />
          <span className="font-body text-xs text-muted-foreground">o continúa con</span>
          <div className="flex-1 h-px bg-km0-blue-700/15" />
        </div>

        <SocialAuthButtons />

        <p className="text-center font-body text-sm text-muted-foreground mt-auto pt-3">
          ¿No tienes cuenta?{" "}
          <Link to="/signup" className="font-ui text-km0-blue-700 underline underline-offset-2">
            Regístrate
          </Link>
        </p>
      </motion.div>
    </BrandedFrame>
  );
};

export default Login;
