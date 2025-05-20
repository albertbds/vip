import { PlansData } from './types';

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
  // Add more cities and their ZIP codes
};

export function getCityZipCode(city: string): string {
  return cityZipCodes[city] || "N/A";
}

export function shouldShowFixo(city: string): boolean {
  return citiesWithFixo.has(city);
}

export const plansData: PlansData = {
  T1: {
    id: "T1",
    name: "Paraná",
    cities: ["Apucarana", "Arapongas", "Araruna", "Campo Mourão", "Cianorte", "Doutor Camargo", "Engenheiro Beltrão", "Jandaia Do Sul", "Jussara", "Mandaguari", "Marialva", "Maringá", "Paiçandu", "Peabiru", "Rolândia", "Telêmaco Borba", "Ubiratã"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "79,99", priceAfter: "99,99" }
      ],
      globoplay: {
        speed: "600MB",
        price: "122,89",
        priceAfter: "142,89",
        description: "Wifi 6 incluso"
      },
      paramount: {
        speed: "400MB",
        price: "89,99",
        priceAfter: "109,99"
      }
    }
  },
  T2: {
    id: "T2",
    name: "Mato Grosso do Sul",
    cities: ["Campo Grande", "Dourados"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "79,99", priceAfter: "99,99" }
      ],
      globoplay: {
        speed: "600MB",
        price: "122,89",
        priceAfter: "142,89",
        description: "Wifi 6 incluso"
      },
      paramount: {
        speed: "400MB",
        price: "89,99",
        priceAfter: "109,99"
      }
    }
  },
  T3: {
    id: "T3",
    name: "São Paulo",
    cities: ["Diadema", "Ferraz De Vasconcelos", "Guarulhos", "Itaquaquecetuba", "Mauá", "Mogi Das Cruzes", "Poá", "Ribeirão Pires", "Rio Grande Da Serra", "Santo André", "São Bernardo Do Campo", "São Paulo", "Suzano"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "79,99", priceAfter: "99,99" }
      ],
      globoplay: {
        speed: "600MB",
        price: "122,89",
        priceAfter: "142,89",
        description: "Wifi 6 incluso"
      },
      paramount: {
        speed: "400MB",
        price: "89,99",
        priceAfter: "109,99"
      }
    }
  },
  T4: {
    id: "T4",
    name: "Litoral SP",
    cities: ["Bertioga", "Caçapava", "Caraguatatuba", "Cubatão", "Guarujá", "Ilhabela", "Itanhaém", "Jacareí", "Mongaguá", "Peruíbe", "Praia Grande", "Santos", "São José dos Campos", "São Sebastião", "São Vicente", "Taubaté", "Tremembé", "Ubatuba"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "79,99", priceAfter: "99,99" }
      ],
      globoplay: {
        speed: "600MB",
        price: "122,89",
        priceAfter: "142,89",
        description: "Wifi 6 incluso"
      },
      paramount: {
        speed: "400MB",
        price: "89,99",
        priceAfter: "109,99"
      }
    }
  },
  T5: {
    id: "T5",
    name: "Lagos",
    cities: ["Araruama", "Armação Dos Búzios", "Arraial Do Cabo", "Cabo Frio", "Casimiro De Abreu", "Iguaba Grande", "Macaé", "Rio Das Ostras", "São Pedro Da Aldeia", "Saquarema"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "79,99", priceAfter: "99,99" }
      ],
      globoplay: {
        speed: "600MB",
        price: "122,89",
        priceAfter: "142,89",
        description: "Wifi 6 incluso"
      },
      paramount: {
        speed: "400MB",
        price: "89,99",
        priceAfter: "109,99"
      }
    }
  },
  T6: {
    id: "T6",
    name: "Serrana",
    cities: ["Além Paraíba", "Barra Do Piraí", "Barra Mansa", "Bom Jardim", "Cachoeiras De Macacu", "Carmo", "Comendador Levy Gasparian", "Guapimirim", "Itaipava", "Itatiaia", "Magé", "Miguel Pereira", "Nova Friburgo", "Paraíba Do Sul", "Paty Do Alferes", "Petrópolis", "Pinheiral", "Porto Real", "Resende", "Sapucaia", "Silva Jardim", "Sumidouro", "Teresópolis", "Três Rios", "Valença", "Vassouras", "Volta Redonda"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "79,99", priceAfter: "99,99" }
      ],
      globoplay: {
        speed: "600MB",
        price: "122,89",
        priceAfter: "142,89",
        description: "Wifi 6 incluso"
      },
      paramount: {
        speed: "400MB",
        price: "89,99",
        priceAfter: "109,99"
      }
    }
  },
  T7: {
    id: "T7",
    name: "ES & Campos",
    cities: ["Anchieta", "Aperibé", "Cachoeiro De Itapemirim", "Cambuci", "Campos Dos Goytacazes", "Cantagalo", "Cariacica", "Cataguases", "Cordeiro", "Duas Barras", "Guarapari", "Itaocara", "Itapemirim", "Itaperuna", "Laje Do Muriaé", "Macuco", "Marataízes", "Miracema", "Muriaé", "Piúma", "Santo Antônio De Pádua", "São Fidélis", "São José De Ubá", "Serra", "Vila Velha", "Vitória"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "79,99", priceAfter: "99,99" }
      ],
      globoplay: {
        speed: "600MB",
        price: "122,89",
        priceAfter: "142,89",
        description: "Wifi 6 incluso"
      },
      paramount: {
        speed: "400MB",
        price: "89,99",
        priceAfter: "109,99"
      }
    }
  },
  T8: {
    id: "T8",
    name: "Minas Gerais",
    cities: ["Aguanil", "Alpinópolis", "Araxá", "Boa Esperança", "Campo Do Meio", "Campos Altos", "Campos Gerais", "Carmo Do Rio Claro", "Conquista", "Coqueiral", "Coromandel", "Cristais", "Delta", "Fortaleza De Minas", "Guapé", "Guaranésia", "Guaxupé", "Ibiá", "Ilicínea", "Itaú De Minas", "Jacuí", "Monte Santo De Minas", "Nepomuceno", "Nova Ponte", "Passos", "Pedrinópolis", "Perdizes", "Pratápolis", "Pratinha", "Sacramento", "Santa Juliana", "Santana Da Vargem", "São Gotardo", "São João Batista Do Glória", "São José Da Barra", "São Sebastião Do Paraíso", "São Tomás De Aquino", "Serra Do Salitre", "Tapira", "Uberaba", "Uberlândia"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "79,99", priceAfter: "99,99" }
      ],
      globoplay: {
        speed: "600MB",
        price: "122,89",
        priceAfter: "142,89",
        description: "Wifi 6 incluso"
      },
      paramount: {
        speed: "400MB",
        price: "89,99",
        priceAfter: "109,99"
      }
    }
  },
  T9: {
    id: "T9",
    name: "DF & Interior SP",
    cities: ["Altinópolis", "Aramina", "Brasilia", "Franca", "Guará", "Igarapava", "Ipuã", "Itirapuã", "Ituverava", "Morro Agudo", "Orlândia", "Patrocínio Paulista", "Ribeirão Preto", "São Joaquim Da Barra", "São José Da Bela Vista"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "79,99", priceAfter: "99,99" }
      ],
      globoplay: {
        speed: "600MB",
        price: "122,89",
        priceAfter: "142,89",
        description: "Wifi 6 incluso"
      },
      paramount: {
        speed: "400MB",
        price: "89,99",
        priceAfter: "109,99"
      }
    }
  },
  T10: {
    id: "T10",
    name: "Pernambuco",
    cities: ["Carnaíba", "Carpina", "Caruaru", "Flores", "Goianá", "Ilha De Itamaracá", "Ipojuca", "Itapissuma", "Limoeiro", "Mirandiba", "Nazaré Da Mata", "Olinda", "Parnamirim", "Paudalho", "Paulista", "Salgueiro", "Santa Cruz Do Capibaribe", "Serra Talhada", "Surubim", "Terra Nova", "Timbaúba", "Toritama", "Verdejante"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "109,99", priceAfter: "129,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "89,99", priceAfter: "109,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "69,99", priceAfter: "89,99" }
      ],
      globoplay: {
        speed: "400MB",
        price: "92,89",
        priceAfter: "112,89"
      }
    }
  },
  T11: {
    id: "T11",
    name: "Sergipe",
    cities: ["Aracaju", "Barra Dos Coqueiros", "Cedro De São João", "Divina Pastora", "Itaporanga D´Ajuda", "Japoatã", "Lagarto", "Laranjeiras", "Nossa Senhora Do Socorro", "Pacatuba", "Propriá", "Rosário Do Catete", "São Cristóvão", "Siriri", "Telha"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "109,99", priceAfter: "129,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "89,99", priceAfter: "109,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "69,99", priceAfter: "89,99" }
      ],
      globoplay: {
        speed: "400MB",
        price: "92,89",
        priceAfter: "112,89"
      }
    }
  },
  T12: {
    id: "T12",
    name: "Juazeiro",
    cities: ["Acopiara", "Aiuaba", "Antonina Do Norte", "Araripe", "Arneiroz", "Assaré", "Barbalha", "Brejo Santo", "Campos Sales", "Cariús", "Catarina", "Cedro", "Crateús", "Crato", "Farias Brito", "Icó", "Iguatu", "Independência", "Jati", "Juazeiro Do Norte", "Jucás", "Lavras Da Mangabeira", "Mauriti", "Missão Velha", "Mombaça", "Orós", "Parambu", "Piquet Carneiro", "Porteiras", "Quixelô", "Salitre", "Tarrafas", "Tauá", "Várzea Alegre"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "109,99", priceAfter: "129,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "89,99", priceAfter: "109,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "69,99", priceAfter: "89,99" }
      ],
      globoplay: {
        speed: "400MB",
        price: "92,89",
        priceAfter: "112,89"
      }
    }
  },
  T13: {
    id: "T13",
    name: "Teresina",
    cities: ["Altos", "Caxias", "Parauapebas", "Teresina", "Timon"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "109,99", priceAfter: "129,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "89,99", priceAfter: "109,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "69,99", priceAfter: "89,99" }
      ],
      globoplay: {
        speed: "400MB",
        price: "92,89",
        priceAfter: "112,89"
      }
    }
  },
  T14_1: {
    id: "T14.1",
    name: "Fortaleza",
    cities: ["Caucaia", "Fortaleza", "Maracanaú"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "109,99", priceAfter: "129,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "89,99", priceAfter: "109,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "69,99", priceAfter: "89,99" }
      ],
      globoplay: {
        speed: "400MB",
        price: "92,89",
        priceAfter: "112,89"
      }
    }
  },
  T14_2: {
    id: "T14.2",
    name: "Fortaleza",
    cities: ["Acaraú", "Aquiraz", "Beberibe", "Camocim", "Cascavel", "Cruz", "Eusébio", "Fortim", "Frecheirinha", "Graça", "Granja", "Ibiapina", "Itaitinga", "Itapipoca", "Itarema", "Jijoca De Jericoacoara", "Limoeiro Do Norte", "Maranguape", "Morada Nova", "Mucambo", "Pacajus", "Pacatuba", "Pacujá", "Paracuru", "Paraipaba", "Parnaíba", "Pentecoste", "Pindoretama", "Quixadá", "Russas", "São Benedito", "São Gonçalo Do Amarante", "São Luís Do Curu", "Sobral", "Tabuleiro Do Norte", "Tianguá", "Trairi", "Ubajara"],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "109,99", priceAfter: "129,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "89,99", priceAfter: "109,99", description: "Wifi 6 incluso" },
        { speed: "400MB", price: "69,99", priceAfter: "89,99" }
      ],
      globoplay: {
        speed: "400MB",
        price: "92,89",
        priceAfter: "112,89"
      }
    }
  },
  T15: {
    id: "T15",
    name: "Maranhão",
    cities: [
      "Açailândia", "Alto Alegre do Pindaré", "Arari", "Bacabal", "Balsas",
      "Barra do Corda", "Bom Jesus das Selvas", "Buriticupu", "Cajari", "Codó",
      "Estreito", "Grajaú", "Imperatriz", "Matinha", "Matões",
      "Olinda Nova do Maranhão", "Paço do Lumiar", "Parnarama", "Penalva",
      "Pindaré-Mirim", "Presidente Dutra", "Santa Inês", "Santa Luzia",
      "São José de Ribamar", "São Luís", "São Mateus do Maranhão", "Timon",
      "Viana", "Vitória do Mearim", "Zé Doca"
    ],
    plans: {
      regular: [
        { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
        { speed: "800MB", price: "109,99", priceAfter: "129,99", description: "Wifi 6 incluso" },
        { speed: "600MB", price: "89,99", priceAfter: "109,99", description: "Wifi 6 incluso" }
      ],
      globoplay: {
        speed: "600MB",
        price: "112,89",
        priceAfter: "132,89",
        description: "Wifi 6 incluso"
      }
    }
  }
};

export const territories = Object.values(plansData);

export const allCities = territories.flatMap(t => t.cities);

export function findTerritoryByCity(city: string): Territory | undefined {
  return territories.find(t => t.cities.includes(city));
}