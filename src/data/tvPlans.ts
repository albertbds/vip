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

// Maranhão cities (T15) - these cities should NOT show TV/phone services
const maranhaoT15Cities = new Set([
  'AÇAILÂNDIA', 'ALTO ALEGRE DO PINDARÉ', 'ARARI', 'BACABAL', 'BALSAS',
  'BARRA DO CORDA', 'BOM JESUS DAS SELVAS', 'BURITICUPU', 'CAJARI', 'CODÓ',
  'ESTREITO', 'GRAJAÚ', 'IMPERATRIZ', 'MATINHA', 'MATÕES',
  'OLINDA NOVA DO MARANHÃO', 'PAÇO DO LUMIAR', 'PARNARAMA', 'PENALVA',
  'PINDARÉ-MIRIM', 'PRESIDENTE DUTRA', 'SANTA INÊS', 'SANTA LUZIA',
  'SÃO JOSÉ DE RIBAMAR', 'SÃO LUÍS', 'SÃO MATEUS DO MARANHÃO', 'TIMON',
  'VIANA', 'VITÓRIA DO MEARIM', 'ZÉ DOCA'
]);

const createTVPlans = (city: string) => {
  // Special pricing for specific cities
  const isSpecialPricing = ['ITAÚ DE MINAS', 'SÃO JOÃO BATISTA DO GLÓRIA'].includes(city);
  if (isSpecialPricing) {
    return [
      {
        name: "Internet Básica",
        channels: "Internet Only",
        description: "Conecte-se com mais velocidade",
        plans: [
          { speed: "300MB", price: "89,99", priceAfter: "99,99" },
          { speed: "150MB", price: "79,99", priceAfter: "89,99" },
          { speed: "100MB", price: "69,99", priceAfter: "79,99" }
        ]
      }
    ];
  }

  // Check if city is in the second group (with different pricing)
  const isSecondGroup = [
    'ACARAÚ', 'AQUIRAZ', 'APERIBÉ', 'BEBERIBE', 'CAMOCIM', 'CAMBUCI', 'CANTAGALO',
    'CASCAVEL', 'CAUCAIA', 'CORDEIRO', 'CRUZ', 'DUAS BARRAS', 'EUSÉBIO', 'FORTALEZA',
    'FORTIM', 'FRECHEIRINHA', 'GRAÇA', 'GRANJA', 'IBIAPINA', 'ITAOCARA', 'ITAITINGA',
    'ITAPIPOCA', 'ITAREMA', 'ITAPERUNA', 'JIJOCA DE JERICOACOARA', 'LIMOEIRO DO NORTE',
    'MACUCO', 'MARACANAÚ', 'MARANGUAPE', 'MIRACEMA', 'MORADA NOVA', 'MUCAMBO', 'PACAJUS',
    'PACATUBA', 'PACUJÁ', 'PARACURU', 'PARAIPABA', 'PENTECOSTE', 'PINDORETAMA',
    'QUIXADÁ', 'RUSSAS', 'SÃO BENEDITO', 'SÃO GONÇALO DO AMARANTE', 'SÃO LUÍS DO CURU',
    'SOBRAL', 'TABULEIRO DO NORTE', 'TIANGUÁ', 'TRAIRI', 'UBAJARA', 'TERESINA', 'ALTOS',
    'PARNAÍBA'
  ].includes(city);

  if (isSecondGroup) {
    return [
      {
        name: "TV Básico",
        channels: "35 Canais ao vivo",
        description: "A melhor experiência em filmes e séries.",
        plans: [
          { speed: "920MB", price: "189,99", priceAfter: "209,99" },
          { speed: "800MB", price: "159,99", priceAfter: "179,99" },
          { speed: "600MB", price: "139,99", priceAfter: "159,99" },
          { speed: "400MB", price: "119,99", priceAfter: "139,99" }
        ]
      },
      {
        name: "TV Família",
        channels: "48 Canais ao vivo + Paramount",
        description: "A melhor experiência em filmes e séries.",
        plans: [
          { speed: "920MB", price: "204,99", priceAfter: "224,99" },
          { speed: "800MB", price: "174,99", priceAfter: "194,99" },
          { speed: "600MB", price: "154,99", priceAfter: "174,99" },
          { speed: "400MB", price: "134,99", priceAfter: "154,99" }
        ]
      },
      {
        name: "TV Cinema",
        channels: "48 Canais ao vivo + Paramount + Max",
        description: "A melhor experiência em filmes e séries.",
        plans: [
          { speed: "920MB", price: "214,99", priceAfter: "234,99" },
          { speed: "800MB", price: "184,99", priceAfter: "204,99" },
          { speed: "600MB", price: "164,99", priceAfter: "184,99" },
          { speed: "400MB", price: "144,99", priceAfter: "164,99" }
        ]
      }
    ];
  }

  // Default TV plans for other cities
  return [
    {
      name: "TV Básico",
      channels: "35 Canais ao vivo",
      description: "A melhor experiência em filmes e séries.",
      plans: [
        { speed: "920MB", price: "189,99", priceAfter: "209,99" },
        { speed: "800MB", price: "169,99", priceAfter: "189,99" },
        { speed: "600MB", price: "149,99", priceAfter: "169,99" },
        { speed: "400MB", price: "129,99", priceAfter: "149,99" }
      ]
    },
    {
      name: "TV Família",
      channels: "48 Canais ao vivo + Paramount",
      description: "A melhor experiência em filmes e séries.",
      plans: [
        { speed: "920MB", price: "204,99", priceAfter: "224,99" },
        { speed: "800MB", price: "184,99", priceAfter: "204,99" },
        { speed: "600MB", price: "164,99", priceAfter: "184,99" },
        { speed: "400MB", price: "144,99", priceAfter: "164,99" }
      ]
    },
    {
      name: "TV Cinema",
      channels: "48 Canais ao vivo + Paramount + Max",
      description: "A melhor experiência em filmes e séries.",
      plans: [
        { speed: "920MB", price: "214,99", priceAfter: "234,99" },
        { speed: "800MB", price: "194,99", priceAfter: "214,99" },
        { speed: "600MB", price: "174,99", priceAfter: "194,99" },
        { speed: "400MB", price: "154,99", priceAfter: "174,99" }
      ]
    }
  ];
};

export const tvTerritories: TVTerritory[] = Array.from(tvCities).map(city => ({
  id: "T1",
  name: "Região 1",
  cities: [city],
  plans: createTVPlans(city)
}));

export function findTVTerritoryByCity(city: string): TVTerritory | undefined {
  return tvTerritories.find(t => t.cities.includes(city.toUpperCase()));
}

export function isTVAvailable(city: string): boolean {
  // Maranhão cities (T15) should NOT have TV service
  if (maranhaoT15Cities.has(city.toUpperCase())) {
    return false;
  }
  return tvCities.has(city.toUpperCase());
}

export function isPhoneAvailable(city: string): boolean {
  // Maranhão cities (T15) should NOT have phone service
  if (maranhaoT15Cities.has(city.toUpperCase())) {
    return false;
  }
  return phoneCities.has(city.toUpperCase());
}

export const allTVCities = Array.from(tvCities);