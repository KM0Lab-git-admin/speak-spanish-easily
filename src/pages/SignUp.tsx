import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import BrandedFrame from "@/components/BrandedFrame";
import SocialAuthButtons from "@/components/SocialAuthButtons";

/**
 * Pantalla de registro.
 *
 * Flujo passwordless:
 *   1. Usuario rellena nombre/apellidos/email.
 *   2. supabase.auth.signInWithOtp({ email, shouldCreateUser: true,
 *      data: { first_name, last_name } }) — crea cuenta si no existe
 *      y envía código OTP de 6 dígitos al email.
 *   3. Redirige a /verify con el email para introducir el código.
 *
 * Los nombres viajan en `data` → `raw_user_meta_data` → trigger
 * `handle_new_user` que rellena la tabla `profiles`.
 */
const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error("Completa todos los campos.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/home`,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    toast.success("Te hemos enviado un enlace por email");
    navigate("/check-email", { state: { email: email.trim(), mode: "signup" } });
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
            Crea tu cuenta
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Registro rápido. Te enviaremos un enlace para entrar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Nombre"
            autoComplete="given-name"
            className="h-12 px-4 rounded-xl border-2 border-km0-blue-700/20 bg-background font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-km0-blue-700 transition-colors"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Apellidos"
            autoComplete="family-name"
            className="h-12 px-4 rounded-xl border-2 border-km0-blue-700/20 bg-background font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-km0-blue-700 transition-colors"
          />
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
            {submitting ? "Enviando código..." : "Crear cuenta"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-km0-blue-700/15" />
          <span className="font-body text-xs text-muted-foreground">o continúa con</span>
          <div className="flex-1 h-px bg-km0-blue-700/15" />
        </div>

        <SocialAuthButtons />

        <p className="text-center font-body text-sm text-muted-foreground mt-auto pt-3">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-ui text-km0-blue-700 underline underline-offset-2">
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </BrandedFrame>
  );
};

export default SignUp;
