import { useState } from "react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable/index";

/**
 * SocialAuthButtons — Botones Google + Apple compartidos por signup y login.
 * Usa `lovable.auth.signInWithOAuth` (gestionado por Lovable Cloud).
 */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C41.4 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 12.04c-.03-3.16 2.58-4.68 2.7-4.75-1.47-2.15-3.76-2.45-4.57-2.48-1.95-.2-3.8 1.15-4.79 1.15-.99 0-2.51-1.12-4.13-1.09-2.13.03-4.09 1.24-5.18 3.14-2.21 3.83-.57 9.5 1.59 12.6 1.05 1.52 2.31 3.23 3.97 3.17 1.59-.06 2.19-1.03 4.11-1.03s2.46 1.03 4.15 1c1.71-.03 2.79-1.55 3.84-3.07 1.21-1.76 1.71-3.47 1.74-3.56-.04-.02-3.34-1.28-3.37-5.08zM14.13 3.66c.88-1.07 1.47-2.55 1.31-4.03-1.27.05-2.79.84-3.7 1.91-.81.94-1.52 2.45-1.33 3.9 1.41.11 2.85-.72 3.72-1.78z" />
  </svg>
);

interface Props {
  redirectTo?: string;
}

const SocialAuthButtons = ({ redirectTo }: Props) => {
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);

  const handle = async (provider: "google" | "apple") => {
    setLoading(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: `${window.location.origin}${redirectTo ?? "/home"}`,
    });
    if (result.error) {
      toast.error("No se pudo iniciar sesión. Inténtalo de nuevo.");
      setLoading(null);
    }
    // Si redirige al provider, el navegador navega; no toca limpiar loading.
  };

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <button
        type="button"
        onClick={() => handle("google")}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-km0-blue-700/20 bg-background hover:bg-km0-beige-50 transition-colors disabled:opacity-50 font-ui text-sm text-foreground"
      >
        <GoogleIcon />
        <span>Google</span>
      </button>
      <button
        type="button"
        onClick={() => handle("apple")}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-km0-blue-700/20 bg-foreground hover:bg-foreground/90 transition-colors disabled:opacity-50 font-ui text-sm text-background"
      >
        <AppleIcon />
        <span>Apple</span>
      </button>
    </div>
  );
};

export default SocialAuthButtons;
