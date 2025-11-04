export const tvCities = new Set([
  'CABO FRIO', 'FORTALEZA', 'GUARULHOS', 'MACAÉ', 'SÃO PAULO', 'TERESINA', 'VILA VELHA', 'VITÓRIA'
]);

export const allTVCities = Array.from(tvCities);

export function isTVAvailable(city: string): boolean {
  return tvCities.has(city.toUpperCase());
}

export function isPhoneAvailable(city: string): boolean {
  return true;
}

export function findTVTerritoryByCity(city: string): string | null {
  if (isTVAvailable(city)) {
    return city.toUpperCase();
  }
  return null;
}
