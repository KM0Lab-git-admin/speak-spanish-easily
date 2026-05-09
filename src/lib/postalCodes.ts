/**
 * Mapa CP → población. Fuente única usada por la pantalla de onboarding
 * (PostalCode) y por el perfil (Profile) para derivar la población a
 * partir del CP introducido. Cuando se conecte una API real, sustituir
 * este objeto por una llamada async manteniendo la misma firma.
 */
export const postalCodes: Record<string, string> = {
  "08001": "Barcelona",
  "08380": "Malgrat de Mar",
  "08301": "Mataró",
  "08400": "Granollers",
  "08201": "Sabadell",
  "08221": "Terrassa",
  "08800": "Vilanova i la Geltrú",
  "08850": "Gavà",
  "08901": "L'Hospitalet de Llobregat",
  "08940": "Cornellà de Llobregat",
};

export const lookupTown = (postalCode: string): string | null =>
  postalCodes[postalCode.trim()] ?? null;
