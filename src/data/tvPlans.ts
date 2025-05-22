import { TVTerritory } from '../types';
import { getTVPlans } from './plans';

const tvPlans = getTVPlans();

// List of cities where TV service is available
export const tvCities = new Set([
  // Region 1
  "Apucarana", "Arapongas", "Araruna", "Caçapava", "Campo Mourão", "Cianorte",
  "Doutor Camargo", "Engenheiro Beltrão", "Jandaia do Sul", "Jacareí", "Jussara",
  "Mandaguari", "Marialva", "Maringá", "Paiçandu", "Peabiru", "Rolândia",
  "Telêmaco Borba", "Ubiratã", "Diadema", "Guarulhos", "Mauá", "Ribeirão Pires",
  "Rio Grande da Serra", "São Bernardo do Campo", "São José dos Campos", "São Paulo",
  
  // Region 2
  "Além Paraíba", "Araruama", "Armação dos Búzios", "Arraial do Cabo",
  "Barra do Piraí", "Barra Mansa", "Bom Jardim", "Cabo Frio",
  "Cachoeiras de Macacu", "Carmo", "Cataguases", "Casimiro de Abreu",
  "Comendador Levy Gasparian", "Guapimirim", "Iguaba Grande", "Itatiaia",
  "Macaé", "Magé", "Miguel Pereira", "Muriaé", "Nova Friburgo",
  "Paraíba do Sul", "Paty do Alferes", "Petrópolis", "Pinheiral",
  "Porto Real", "Resende", "Rio das Ostras", "Sapucaia", "Saquarema",
  "São Pedro da Aldeia", "Silva Jardim", "Sumidouro", "Teresópolis",
  "Três Rios", "Valença", "Vassouras", "Volta Redonda",
  
  // Region 3
  "Acaraú", "Aquiraz", "Aperibé", "Beberibe", "Camocim", "Cambuci",
  "Cantagalo", "Cascavel", "Caucaia", "Cordeiro", "Cruz", "Duas Barras",
  "Eusébio", "Fortaleza", "Fortim", "Frecheirinha", "Graça", "Granja",
  "Ibiapina", "Itaocara", "Itaitinga", "Itapipoca", "Itarema", "Itaperuna",
  "Jijoca de Jericoacoara", "Muriaé", "Limoeiro do Norte", "Macuco",
  "Maracanaú", "Maranguape", "Miracema", "Morada Nova", "Mucambo",
  "Pacajus", "Pacatuba", "Pacujá", "Paracuru", "Paraipaba", "Pentecoste",
  "Pindoretama", "Quixadá", "Russas", "São Benedito",
  "São Gonçalo do Amarante", "São Luís do Curu", "Sobral",
  "Tabuleiro do Norte", "Tianguá", "Trairi", "Ubajara", "Teresina",
  "Altos", "Parnaíba"
]);

export const tvTerritories: TVTerritory[] = [
  {
    id: "T1",
    name: "Região 1",
    cities: Array.from(tvCities),
    plans: tvPlans
  }
];

export function findTVTerritoryByCity(city: string): TVTerritory | undefined {
  return tvTerritories.find(t => t.cities.includes(city));
}

export function isTVAvailable(city: string): boolean {
  return tvCities.has(city);
}

export const allTVCities = Array.from(tvCities);