/**
 * i18n — diccionario plano de strings de la app KM0 LAB.
 *
 * Decisión: helper propio mínimo (no i18next) — la app tiene pocos
 * strings y el diccionario cabe en un único archivo tipado.
 *
 * Uso:
 *   const { lang } = useLang();
 *   t("home.sections.events", lang);
 */

export type Lang = "ca" | "es" | "en";

export const LANGS: Lang[] = ["ca", "es", "en"];

type Dict = Record<Lang, string>;

const D = {
  // ── Common ───────────────────────────────────────────────
  "common.back": { ca: "Enrere", es: "Volver", en: "Back" } as Dict,
  "common.continue": { ca: "CONTINUAR", es: "CONTINUAR", en: "CONTINUE" } as Dict,
  "common.loading": { ca: "Carregant…", es: "Cargando…", en: "Loading…" } as Dict,

  // ── Language screen ──────────────────────────────────────
  "language.title": { ca: "Tria el teu idioma", es: "Escoge tu idioma", en: "Choose your language" } as Dict,

  // ── Onboarding ───────────────────────────────────────────
  "onboarding.skip": { ca: "SALTAR", es: "SALTAR", en: "SKIP" } as Dict,
  "onboarding.finish": { ca: "INICI", es: "INICIO", en: "START" } as Dict,

  // ── Postal code ──────────────────────────────────────────
  "postal.title": {
    ca: "INTRODUEIX EL TEU CODI POSTAL",
    es: "INTRODUCE TU CÓDIGO POSTAL",
    en: "ENTER YOUR POSTAL CODE",
  } as Dict,
  "postal.subtitle": {
    ca: "Descobreix comerços i serveis al teu barri",
    es: "Descubre comercios y servicios en tu barrio",
    en: "Discover shops and services in your neighborhood",
  } as Dict,
  "postal.placeholder": { ca: "08380", es: "08380", en: "08380" } as Dict,
  "postal.error_numeric": {
    ca: "Només es permeten números",
    es: "Solo se permiten números",
    en: "Only numbers are allowed",
  } as Dict,
  "postal.error_notfound": {
    ca: "No es reconeix aquest codi postal",
    es: "No se reconoce este código postal",
    en: "This postal code is not recognized",
  } as Dict,

  // ── Login ────────────────────────────────────────────────
  "login.title": {
    ca: "Entra o registra't",
    es: "Entra o regístrate",
    en: "Sign in or sign up",
  } as Dict,
  "login.subtitle": {
    ca: "T'enviarem un codi al teu correu",
    es: "Te enviaremos un código a tu correo",
    en: "We'll send a code to your email",
  } as Dict,
  "login.email_placeholder": { ca: "Correu electrònic", es: "Email", en: "Email" } as Dict,
  "login.submit": { ca: "Continuar", es: "Continuar", en: "Continue" } as Dict,
  "login.submitting": {
    ca: "Enviant codi…",
    es: "Enviando código…",
    en: "Sending code…",
  } as Dict,
  "login.divider": { ca: "pròximament", es: "próximamente", en: "coming soon" } as Dict,
  "login.error_email": {
    ca: "Introdueix el teu correu.",
    es: "Introduce tu email.",
    en: "Enter your email.",
  } as Dict,
  "login.toast_sent": {
    ca: "T'hem enviat un codi per correu",
    es: "Te hemos enviado un código por email",
    en: "We've sent you a code by email",
  } as Dict,

  // ── OTP / Check email ────────────────────────────────────
  "otp.title": {
    ca: "Revisa el teu correu",
    es: "Revisa tu correo",
    en: "Check your email",
  } as Dict,
  "otp.subtitle": {
    ca: "Hem enviat un codi de 4 dígits a",
    es: "Hemos enviado un código de 4 dígitos a",
    en: "We sent a 4-digit code to",
  } as Dict,
  "otp.resend": {
    ca: "Reenviar codi",
    es: "Reenviar código",
    en: "Resend code",
  } as Dict,
  "otp.resending": {
    ca: "Reenviant…",
    es: "Reenviando…",
    en: "Resending…",
  } as Dict,
  "otp.resend_in": {
    ca: "Reenviar codi en",
    es: "Reenviar código en",
    en: "Resend code in",
  } as Dict,
  "otp.toast_resent": {
    ca: "Codi reenviat",
    es: "Código reenviado",
    en: "Code resent",
  } as Dict,
  "otp.toast_wrong": {
    ca: "Codi incorrecte. Torna-ho a provar.",
    es: "Código incorrecto. Inténtalo de nuevo.",
    en: "Wrong code. Try again.",
  } as Dict,
  "otp.toast_resend_fail": {
    ca: "No s'ha pogut reenviar. Prova-ho més tard.",
    es: "No se pudo reenviar. Inténtalo más tarde.",
    en: "Couldn't resend. Try again later.",
  } as Dict,
  "otp.welcome": {
    ca: "Benvingut/da!",
    es: "¡Bienvenido!",
    en: "Welcome!",
  } as Dict,
  "otp.footer_hint": {
    ca: "No el trobes? Mira a la carpeta de spam o promocions.",
    es: "¿No lo encuentras? Mira en spam o promociones.",
    en: "Can't find it? Check spam or promotions.",
  } as Dict,

  // ── Home ─────────────────────────────────────────────────
  "home.hello": { ca: "Hola", es: "Hola", en: "Hi" } as Dict,
  "home.greeting_subtitle": {
    ca: "Gràcies per recolzar el comerç local",
    es: "Gracias por apoyar lo local",
    en: "Thanks for supporting local",
  } as Dict,
  "home.section.quick": {
    ca: "Accessos ràpids",
    es: "Accesos rápidos",
    en: "Quick access",
  } as Dict,
  "home.section.events": {
    ca: "Esdeveniments destacats",
    es: "Eventos destacados",
    en: "Featured events",
  } as Dict,
  "home.section.shops": {
    ca: "Descobreix el nostre",
    es: "Descubre lo nuestro",
    en: "Discover our locals",
  } as Dict,
  "home.section.coupons": {
    ca: "Promos per a tu",
    es: "Promos para ti",
    en: "Promos for you",
  } as Dict,
  "home.action.see_all_m": { ca: "Veure'ls tots", es: "Ver todos", en: "See all" } as Dict,
  "home.action.see_all_f": { ca: "Veure-les totes", es: "Ver todas", en: "See all" } as Dict,
  "home.login_cta": {
    ca: "Iniciar sessió",
    es: "Iniciar sesión",
    en: "Sign in",
  } as Dict,

  // ── BottomTabs ───────────────────────────────────────────
  "tabs.home": { ca: "Inici", es: "Inicio", en: "Home" } as Dict,
  "tabs.info": { ca: "Informació", es: "Información", en: "Info" } as Dict,
  "tabs.offers": { ca: "Ofertes", es: "Ofertas", en: "Offers" } as Dict,
  "tabs.profile": { ca: "Perfil", es: "Perfil", en: "Profile" } as Dict,

  // ── Module labels ────────────────────────────────────────
  "module.agenda": { ca: "Agenda", es: "Agenda", en: "Agenda" } as Dict,
  "module.chat": { ca: "KM0 CHAT", es: "KM0 CHAT", en: "KM0 CHAT" } as Dict,
  "module.ajuntament": {
    ca: "Ajuntament",
    es: "Ayuntamiento",
    en: "Town hall",
  } as Dict,
  "module.comerc": { ca: "Comerços", es: "Comercios", en: "Shops" } as Dict,
  "module.punts": { ca: "Punts", es: "Puntos", en: "Points" } as Dict,
  "module.cupons": { ca: "Cupons", es: "Cupones", en: "Coupons" } as Dict,

  // ── Profile ──────────────────────────────────────────────
  "profile.title": { ca: "El meu perfil", es: "Mi perfil", en: "My profile" } as Dict,
  "profile.subtitle": {
    ca: "Actualitza les teves dades",
    es: "Actualiza tus datos",
    en: "Update your details",
  } as Dict,
  "profile.first_name": { ca: "Nom", es: "Nombre", en: "First name" } as Dict,
  "profile.first_name_ph": { ca: "El teu nom", es: "Tu nombre", en: "Your first name" } as Dict,
  "profile.last_name": { ca: "Cognoms", es: "Apellidos", en: "Last name" } as Dict,
  "profile.last_name_ph": { ca: "Els teus cognoms", es: "Tus apellidos", en: "Your last name" } as Dict,
  "profile.email": { ca: "Correu", es: "Email", en: "Email" } as Dict,
  "profile.postal": { ca: "C. postal", es: "C. postal", en: "Postal code" } as Dict,
  "profile.town": { ca: "Població", es: "Población", en: "Town" } as Dict,
  "profile.town_empty": {
    ca: "Sense coincidència",
    es: "Sin coincidencia",
    en: "No match",
  } as Dict,
  "profile.town_hint": {
    ca: "S'omple amb el CP",
    es: "Se rellena con el CP",
    en: "Filled by postcode",
  } as Dict,
  "profile.save": { ca: "Desar canvis", es: "Guardar cambios", en: "Save changes" } as Dict,
  "profile.saving": { ca: "Desant…", es: "Guardando…", en: "Saving…" } as Dict,
  "profile.logout": { ca: "Tancar sessió", es: "Cerrar sesión", en: "Sign out" } as Dict,
  "profile.toast_saved": {
    ca: "Perfil actualitzat",
    es: "Perfil actualizado",
    en: "Profile updated",
  } as Dict,
  "profile.toast_save_fail": {
    ca: "No s'ha pogut desar",
    es: "No se pudo guardar",
    en: "Couldn't save",
  } as Dict,
  "profile.toast_load_fail": {
    ca: "No s'ha pogut carregar el perfil",
    es: "No se pudo cargar el perfil",
    en: "Couldn't load profile",
  } as Dict,
  "profile.toast_logout": {
    ca: "Sessió tancada",
    es: "Sesión cerrada",
    en: "Signed out",
  } as Dict,
  "profile.language": { ca: "Idioma", es: "Idioma", en: "Language" } as Dict,

  // ── Noticias ─────────────────────────────────────────────
  "news.title": { ca: "Notícies", es: "Noticias", en: "News" } as Dict,
  "news.empty.title": {
    ca: "Encara no hi ha notícies",
    es: "Todavía no hay noticias",
    en: "No news yet",
  } as Dict,
  "news.empty.subtitle": {
    ca: "Torna a mirar més tard.",
    es: "Vuelve a mirar más tarde.",
    en: "Check back later.",
  } as Dict,
  "news.error.title": {
    ca: "No s'han pogut carregar les notícies",
    es: "No se han podido cargar las noticias",
    en: "Couldn't load the news",
  } as Dict,
  "news.error.subtitle": {
    ca: "Comprova la connexió i torna-ho a provar.",
    es: "Comprueba la conexión e inténtalo de nuevo.",
    en: "Check your connection and try again.",
  } as Dict,
  "news.error.retry": {
    ca: "Tornar a provar",
    es: "Reintentar",
    en: "Retry",
  } as Dict,
  "news.detail.source": {
    ca: "Font original",
    es: "Fuente original",
    en: "Original source",
  } as Dict,
} as const;

export type TKey = keyof typeof D;

export const t = (key: TKey, lang: Lang): string => {
  const entry = D[key];
  return entry?.[lang] ?? entry?.es ?? String(key);
};
