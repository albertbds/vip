import { TVTerritory } from '../types';
import { getTVPlans } from './plans';

const tvPlans = getTVPlans();

export const tvTerritories: TVTerritory[] = [
  {
    id: "T1",
    name: "Região 1",
    cities: [
      "Apucarana", "Arapongas", "Araruna", "Caçapava", "Campo Mourão", "Cianorte",
      "Doutor Camargo", "Engenheiro Beltrão", "Jandaia do Sul", "Jacareí", "Jussara",
      "Mandaguari", "Marialva", "Maringá", "Paiçandu", "Peabiru", "Rolândia",
      "Telêmaco Borba", "Ubiratã", "Diadema", "Guarulhos", "Mauá", "Ribeirão Pires",
      "Rio Grande da Serra", "São Bernardo do Campo", "São José dos Campos", "São Paulo"
    ],
    plans: tvPlans
  },
  {
    id: "T2",
    name: "Região 2",
    cities: [
      "Além Paraíba", "Araruama", "Armação dos Búzios", "Arraial do Cabo",
      "Barra do Piraí", "Barra Mansa", "Bom Jardim", "Cabo Frio",
      "Cachoeiras de Macacu", "Carmo", "Cataguases", "Casimiro de Abreu",
      "Comendador Levy Gasparian", "Guapimirim", "Iguaba Grande", "Itatiaia",
      "Macaé", "Magé", "Miguel Pereira", "Muriaé", "Nova Friburgo",
      "Paraíba do Sul", "Paty do Alferes", "Petrópolis", "Pinheiral",
      "Porto Real", "Resende", "Rio das Ostras", "Sapucaia", "Saquarema",
      "São Pedro da Aldeia", "Silva Jardim", "Sumidouro", "Teresópolis",
      "Três Rios", "Valença", "Vassouras", "Volta Redonda"
    ],
    plans: tvPlans
  },
  {
    id: "T3",
    name: "Região 3",
    cities: [
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
    ],
    plans: tvPlans
  }
];

export function findTVTerritoryByCity(city: string): TVTerritory | undefined {
  return tvTerritories.find(t => t.cities.includes(city));
}

export const allTVCities = tvTerritories.flatMap(t => t.cities);