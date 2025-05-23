import { TVTerritory } from '../types';

// Cities with TV service
export const tvCities = new Set([
  'APUCARANA', 'ARAPONGAS', 'ARARUNA', 'CAÇAPAVA', 'CAMPO MOURÃO', 'CIANORTE',
  'DIADEMA', 'DOUTOR CAMARGO', 'ENGENHEIRO BELTRÃO', 'GUARULHOS', 'JANDAIA DO SUL',
  'JACAREÍ', 'JUSSARA', 'MANDAGUARI', 'MARIALVA', 'MARINGÁ', 'MAUÁ', 'PAIÇANDU',
  'PEABIRU', 'RIBEIRÃO PIRES', 'RIO GRANDE DA SERRA', 'ROLÂNDIA',
  'SÃO BERNARDO DO CAMPO', 'SÃO JOSÉ DOS CAMPOS', 'SÃO PAULO', 'TELÊMACO BORBA',
  'UBIRATÃ', 'ALÉM PARAÍBA', 'ARARUAMA', 'ARMAÇÃO DOS BÚZIOS', 'ARRAIAL DO CABO',
  'BARRA DO PIRAÍ', 'BARRA MANSA', 'BOM JARDIM', 'CABO FRIO',
  'CACHOEIRAS DE MACACU', 'CARMO', 'CATAGUASES', 'CASIMIRO DE ABREU',
  'COMENDADOR LEVY GASPARIAN', 'GUAPIMIRIM', 'IGUABA GRANDE', 'ITATIAIA',
  'MACAÉ', 'MAGÉ', 'MIGUEL PEREIRA', 'MURIAÉ', 'NOVA FRIBURGO', 'PARAÍBA DO SUL',
  'PATY DO ALFERES', 'PETRÓPOLIS', 'PINHEIRAL', 'PORTO REAL', 'RESENDE',
  'RIO DAS OSTRAS', 'SAPUCAIA', 'SAQUAREMA', 'SÃO PEDRO DA ALDEIA',
  'SILVA JARDIM', 'SUMIDOURO', 'TERESÓPOLIS', 'TRÊS RIOS', 'VALENÇA',
  'VASSOURAS', 'VOLTA REDONDA', 'ACARAÚ', 'AQUIRAZ', 'APERIBÉ', 'BEBERIBE',
  'CAMOCIM', 'CAMBUCI', 'CANTAGALO', 'CASCAVEL', 'CAUCAIA', 'CORDEIRO', 'CRUZ',
  'DUAS BARRAS', 'EUSÉBIO', 'FORTALEZA', 'FORTIM', 'FRECHEIRINHA', 'GRAÇA',
  'GRANJA', 'IBIAPINA', 'ITAOCARA', 'ITAITINGA', 'ITAPIPOCA', 'ITAREMA',
  'ITAPERUNA', 'JIJOCA DE JERICOACOARA', 'LIMOEIRO DO NORTE', 'MACUCO',
  'MARACANAÚ', 'MARANGUAPE', 'MIRACEMA', 'MORADA NOVA', 'MUCAMBO', 'PACAJUS',
  'PACATUBA', 'PACUJÁ', 'PARACURU', 'PARAIPABA', 'PENTECOSTE', 'PINDORETAMA',
  'QUIXADÁ', 'RUSSAS', 'SÃO BENEDITO', 'SÃO GONÇALO DO AMARANTE',
  'SÃO LUÍS DO CURU', 'SOBRAL', 'TABULEIRO DO NORTE', 'TIANGUÁ', 'TRAIRI',
  'UBAJARA', 'TERESINA', 'ALTOS', 'PARNAÍBA'
]);

// Cities with phone service
export const phoneCities = new Set([
  'ARMAÇÃO DOS BÚZIOS', 'ARRAIAL DO CABO', 'CASIMIRO DE ABREU', 'CABO FRIO',
  'IGUABA GRANDE', 'MACAÉ', 'RIO DAS OSTRAS', 'SÃO PEDRO DA ALDEIA',
  'ALÉM PARAÍBA', 'CACHOEIRAS DE MACACU', 'CARMO', 'COMENDADOR LEVY GASPARIAN',
  'GUAPIMIRIM', 'MAGÉ', 'MIGUEL PEREIRA', 'NOVA FRIBURGO', 'PARAÍBA DO SUL',
  'PATY DO ALFERES', 'PETRÓPOLIS', 'RESENDE', 'SAPUCAIA', 'SILVA JARDIM',
  'SUMIDOURO', 'TERESÓPOLIS', 'TRÊS RIOS', 'VASSOURAS', 'CAMPOS DOS GOYTACAZES',
  'CANTAGALO', 'CARIACICA', 'CATAGUASES', 'CORDEIRO', 'DUAS BARRAS',
  'GUARAPARI', 'ITAOCARA', 'MACUCO', 'MURIAÉ', 'VILA VELHA', 'VITÓRIA'
]);

export const tvPlans = [
  {
    name: "TV Básico",
    channels: "35 Canais ao vivo",
    description: "Conecte-se com mais velocidade, com Internet 100% Fibra.",
    plans: [
      { speed: "920MB", price: "189,99", priceAfter: "209,99" },
      { speed: "800MB", price: "169,99", priceAfter: "189,99" },
      { speed: "600MB", price: "149,99", priceAfter: "169,99" },
      { speed: "400MB", price: "129,99", priceAfter: "149,99" }
    ]
  },
  {
    name: "TV Família",
    channels: "85 Canais ao vivo",
    description: "Mais canais e conteúdo para toda a família.",
    plans: [
      { speed: "920MB", price: "209,99", priceAfter: "229,99" },
      { speed: "800MB", price: "189,99", priceAfter: "209,99" },
      { speed: "600MB", price: "169,99", priceAfter: "189,99" },
      { speed: "400MB", price: "149,99", priceAfter: "169,99" }
    ]
  },
  {
    name: "TV Cinema",
    channels: "95 Canais ao vivo",
    description: "A melhor experiência em filmes e séries.",
    plans: [
      { speed: "920MB", price: "229,99", priceAfter: "249,99" },
      { speed: "800MB", price: "209,99", priceAfter: "229,99" },
      { speed: "600MB", price: "189,99", priceAfter: "209,99" },
      { speed: "400MB", price: "169,99", priceAfter: "189,99" }
    ]
  }
];

export const tvTerritories: TVTerritory[] = [
  {
    id: "T1",
    name: "Região 1",
    cities: Array.from(tvCities),
    plans: tvPlans
  }
];

export function findTVTerritoryByCity(city: string): TVTerritory | undefined {
  return tvTerritories.find(t => t.cities.includes(city.toUpperCase()));
}

export function isTVAvailable(city: string): boolean {
  return tvCities.has(city.toUpperCase());
}

export function isPhoneAvailable(city: string): boolean {
  return phoneCities.has(city.toUpperCase());
}

export const allTVCities = Array.from(tvCities);