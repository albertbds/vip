import { PlansData } from '../types';
import { getPlansForTerritory } from './plans';

// Cities that should show the FIXO menu
const citiesWithFixo = new Set([
  "Armação dos Búzios", "Arraial do Cabo", "Barra de São João", "Cabo Frio",
  "Casimiro de Abreu", "Iguaba Grande", "Macaé", "Rio das Ostras",
  "São Pedro da Aldeia", "Unamar", "Além Paraíba", "Cachoeiras de Macacu",
  "Carmo", "Chiador", "Comendador Levy Gasparian", "Guapimirim", "Influência",
  "Itaipava", "Jamapará", "Magé", "Miguel Pereira", "Nova Friburgo",
  "Paraíba do Sul", "Paty do Alferes", "Petrópolis", "Piabetá", "Resende",
  "Santo Aleixo", "Sapucaia", "Silva Jardim", "Sumidouro", "Teresópolis",
  "Três Rios", "Vassouras", "Campos dos Goytacazes", "Cantagalo", "Cariacica",
  "Cataguases", "Cordeiro", "Duas Barras", "Guarapari", "Itaocara", "Macuco",
  "Muriaé", "Vila Velha", "Vitória"
]);

// Add ZIP codes for cities (example data - replace with actual ZIP codes)
const cityZipCodes: { [key: string]: string } = {
  "Apucarana": "86800-000",
  "Arapongas": "86700-000",
  "Campo Grande": "79000-000",
  "São Paulo": "01000-000",
  // Add more cities and their ZIP codes as needed
};

export function getCityZipCode(city: string): string {
  return cityZipCodes[city] || "N/A";
}

export function shouldShowFixo(city: string): boolean {
  return citiesWithFixo.has(city);
}

// Territory definitions
const territories = {
  T1: {
    id: "T1",
    name: "Paraná",
    cities: ["Apucarana", "Arapongas", "Araruna", "Campo Mourão", "Cianorte", "Doutor Camargo", "Engenheiro Beltrão", "Jandaia Do Sul", "Jussara", "Mandaguari", "Marialva", "Maringá", "Paiçandu", "Peabiru", "Rolândia", "Telêmaco Borba", "Ubiratã"],
  },
  T2: {
    id: "T2",
    name: "Mato Grosso do Sul",
    cities: ["Campo Grande", "Dourados"],
  },
  // ... Add other territories similarly
} as const;

// Create the plans data by combining territories with their respective plans
export const plansData: PlansData = Object.entries(territories).reduce((acc, [key, territory]) => {
  acc[key] = {
    ...territory,
    plans: getPlansForTerritory(territory.id)
  };
  return acc;
}, {} as PlansData);

export const allCities = Object.values(territories).flatMap(t => t.cities);

export function findTerritoryByCity(city: string): Territory | undefined {
  const territory = Object.values(territories).find(t => t.cities.includes(city));
  if (territory) {
    return {
      ...territory,
      plans: getPlansForTerritory(territory.id)
    };
  }
  return undefined;
}