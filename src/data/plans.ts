import { Plan } from '../types';

interface PlanGroup {
  regular: Plan[];
  globoplay?: Plan;
  paramount?: Plan;
  max?: Plan;
  fixo?: Plan[];
}

// R1 Plans (Paraná e Mato Grosso do Sul)
const r1Plans: PlanGroup = {
  regular: [
    { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wi-Fi 6 incluso" },
    { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wi-Fi 6 incluso" },
    { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wi-Fi 6 incluso" },
    { speed: "400MB", price: "79,99", priceAfter: "99,99", description: "Wi-Fi 5 incluso" }
  ],
  globoplay: {
    speed: "600MB",
    price: "122,89",
    priceAfter: "142,89",
    description: "Globoplay Padrão com Anúncios"
  },
  paramount: {
    speed: "600MB",
    price: "109,99",
    priceAfter: "129,99",
    description: "Paramount+"
  },
  max: {
    speed: "600MB",
    price: "129,99",
    priceAfter: "149,99",
    description: "HBO Max"
  }
};

// R2-R7 Plans (São Paulo, Litoral SP, Lagos, Serrana, ES & Campos, MG/DF/Interior SP)
const r2r7Plans: PlanGroup = {
  regular: [
    { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wi-Fi 6 incluso" },
    { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wi-Fi 6 incluso" },
    { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wi-Fi 6 incluso" },
    { speed: "400MB", price: "79,99", priceAfter: "99,99", description: "Wi-Fi 5 incluso" }
  ],
  globoplay: {
    speed: "600MB",
    price: "122,89",
    priceAfter: "142,89",
    description: "Globoplay Padrão com Anúncios"
  },
  paramount: {
    speed: "600MB",
    price: "109,99",
    priceAfter: "129,99",
    description: "Paramount+"
  },
  max: {
    speed: "600MB",
    price: "129,99",
    priceAfter: "149,99",
    description: "HBO Max"
  },
  fixo: [
    { speed: "920MB", price: "149,99", priceAfter: "169,99", description: "Wi-Fi 6 + Telefone Fixo" },
    { speed: "800MB", price: "129,99", priceAfter: "149,99", description: "Wi-Fi 6 + Telefone Fixo" },
    { speed: "600MB", price: "109,99", priceAfter: "129,99", description: "Wi-Fi 6 + Telefone Fixo" },
    { speed: "400MB", price: "89,99", priceAfter: "109,99", description: "Wi-Fi 5 + Telefone Fixo" }
  ]
};

// R8 Plans (Ceará)
const r8Plans: PlanGroup = {
  regular: [
    { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wi-Fi 6 incluso" },
    { speed: "800MB", price: "109,99", priceAfter: "129,99", description: "Wi-Fi 6 incluso" },
    { speed: "600MB", price: "89,99", priceAfter: "109,99", description: "Wi-Fi 6 incluso" },
    { speed: "400MB", price: "69,99", priceAfter: "89,99", description: "Wi-Fi 5 incluso" }
  ],
  globoplay: {
    speed: "600MB",
    price: "112,89",
    priceAfter: "132,89",
    description: "Globoplay Padrão com Anúncios"
  },
  paramount: {
    speed: "600MB",
    price: "99,99",
    priceAfter: "119,99",
    description: "Paramount+"
  },
  max: {
    speed: "600MB",
    price: "119,99",
    priceAfter: "139,99",
    description: "HBO Max"
  }
};

// R9 Plans (Noroeste e Nordeste)
const r9Plans: PlanGroup = {
  regular: [
    { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wi-Fi 6 incluso" },
    { speed: "800MB", price: "109,99", priceAfter: "129,99", description: "Wi-Fi 6 incluso" },
    { speed: "600MB", price: "89,99", priceAfter: "109,99", description: "Wi-Fi 6 incluso" },
    { speed: "400MB", price: "69,99", priceAfter: "89,99", description: "Wi-Fi 5 incluso" }
  ],
  globoplay: {
    speed: "400MB",
    price: "92,89",
    priceAfter: "112,89",
    description: "Globoplay Padrão com Anúncios"
  },
  paramount: {
    speed: "400MB",
    price: "79,99",
    priceAfter: "99,99",
    description: "Paramount+"
  },
  max: {
    speed: "400MB",
    price: "99,99",
    priceAfter: "119,99",
    description: "HBO Max"
  }
};

// Special cities plans (Itaú de Minas, São João Batista do Glória)
const specialCitiesPlans: PlanGroup = {
  regular: [
    { speed: "300MB", price: "89,99", priceAfter: "99,99", description: "150 Mega de upload" },
    { speed: "150MB", price: "79,99", priceAfter: "89,99", description: "100 Mega de upload" },
    { speed: "100MB", price: "69,99", priceAfter: "79,99", description: "50 Mega de upload" }
  ]
};

// TV Plans for Giga+ TV cities (Cabo Frio, Guarulhos, Macaé, São Paulo, Vila Velha e Vitória)
export const gigaTvPlans = {
  essencial: {
    name: "Pacote Essencial",
    channels: "Canais básicos + aplicativos inclusos",
    description: "Conecte-se com mais velocidade",
    plans: [
      { speed: "920MB", price: "174,99", priceAfter: "194,99" },
      { speed: "800MB", price: "154,99", priceAfter: "174,99" },
      { speed: "600MB", price: "134,99", priceAfter: "154,99" },
      { speed: "400MB", price: "114,99", priceAfter: "134,99" }
    ]
  },
  esportes: {
    name: "Pacote Esportes",
    channels: "Canais de esporte + Paramount+ + ESPN + Premiere",
    description: "Para os amantes do esporte",
    plans: [
      { speed: "920MB", price: "209,99", priceAfter: "229,99" },
      { speed: "800MB", price: "189,99", priceAfter: "209,99" },
      { speed: "600MB", price: "169,99", priceAfter: "189,99" },
      { speed: "400MB", price: "149,99", priceAfter: "169,99" }
    ]
  },
  cinema: {
    name: "Pacote Cinema",
    channels: "Canais de cinema + Paramount+ + HBO Max + Telecine",
    description: "A melhor experiência em filmes e séries",
    plans: [
      { speed: "920MB", price: "219,99", priceAfter: "239,99" },
      { speed: "800MB", price: "199,99", priceAfter: "219,99" },
      { speed: "600MB", price: "179,99", priceAfter: "199,99" },
      { speed: "400MB", price: "159,99", priceAfter: "179,99" }
    ]
  },
  completo: {
    name: "Pacote Completo",
    channels: "Todos os canais + Paramount+ + HBO Max + Telecine + ESPN + Premiere",
    description: "A experiência completa de entretenimento",
    plans: [
      { speed: "920MB", price: "249,99", priceAfter: "269,99" },
      { speed: "800MB", price: "229,99", priceAfter: "249,99" },
      { speed: "600MB", price: "209,99", priceAfter: "229,99" },
      { speed: "400MB", price: "189,99", priceAfter: "209,99" }
    ]
  }
};

// Giga+ TV plans for Fortaleza and Teresina (different pricing)
export const gigaTvPlansFortalezaTeresina = {
  essencial: {
    name: "Pacote Essencial",
    channels: "Canais básicos + aplicativos inclusos",
    description: "Conecte-se com mais velocidade",
    plans: [
      { speed: "920MB", price: "174,99", priceAfter: "194,99" },
      { speed: "800MB", price: "144,99", priceAfter: "164,99" },
      { speed: "600MB", price: "124,99", priceAfter: "144,99" },
      { speed: "400MB", price: "104,99", priceAfter: "124,99" }
    ]
  },
  esportes: {
    name: "Pacote Esportes",
    channels: "Canais de esporte + Paramount+ + ESPN + Premiere",
    description: "Para os amantes do esporte",
    plans: [
      { speed: "920MB", price: "209,99", priceAfter: "229,99" },
      { speed: "800MB", price: "179,99", priceAfter: "199,99" },
      { speed: "600MB", price: "159,99", priceAfter: "179,99" },
      { speed: "400MB", price: "139,99", priceAfter: "159,99" }
    ]
  },
  cinema: {
    name: "Pacote Cinema",
    channels: "Canais de cinema + Paramount+ + HBO Max + Telecine",
    description: "A melhor experiência em filmes e séries",
    plans: [
      { speed: "920MB", price: "219,99", priceAfter: "239,99" },
      { speed: "800MB", price: "189,99", priceAfter: "209,99" },
      { speed: "600MB", price: "169,99", priceAfter: "189,99" },
      { speed: "400MB", price: "149,99", priceAfter: "169,99" }
    ]
  },
  completo: {
    name: "Pacote Completo",
    channels: "Todos os canais + Paramount+ + HBO Max + Telecine + ESPN + Premiere",
    description: "A experiência completa de entretenimento",
    plans: [
      { speed: "920MB", price: "249,99", priceAfter: "269,99" },
      { speed: "800MB", price: "219,99", priceAfter: "239,99" },
      { speed: "600MB", price: "199,99", priceAfter: "219,99" },
      { speed: "400MB", price: "179,99", priceAfter: "199,99" }
    ]
  }
};

// Helper function to get plans based on territory
export function getPlansForTerritory(territoryId: string): PlanGroup {
  // R1: T1 e T2 (Paraná e Mato Grosso do Sul)
  if (['T1', 'T2'].includes(territoryId)) {
    return r1Plans;
  }
  
  // R2-R7: T3, T4, T5, T6, T7, T8, T9
  if (['T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9'].includes(territoryId)) {
    return r2r7Plans;
  }
  
  // R8: T12 e T14 (Ceará)
  if (['T12', 'T14_1', 'T14_2'].includes(territoryId)) {
    return r8Plans;
  }
  
  // R9: T10, T11, T13, T15 (Noroeste e Nordeste)
  if (['T10', 'T11', 'T13', 'T15'].includes(territoryId)) {
    return r9Plans;
  }
  
  // Fallback para territórios não mapeados
  return r9Plans;
}

// Helper function to get special city plans
export function getSpecialCityPlans(): PlanGroup {
  return specialCitiesPlans;
}

// Helper function to get TV plans
export function getTVPlans() {
  return [
    gigaTvPlans.essencial,
    gigaTvPlans.esportes,
    gigaTvPlans.cinema,
    gigaTvPlans.completo
  ];
}

// Helper function to get TV plans for Fortaleza and Teresina
export function getTVPlansFortalezaTeresina() {
  return [
    gigaTvPlansFortalezaTeresina.essencial,
    gigaTvPlansFortalezaTeresina.esportes,
    gigaTvPlansFortalezaTeresina.cinema,
    gigaTvPlansFortalezaTeresina.completo
  ];
}