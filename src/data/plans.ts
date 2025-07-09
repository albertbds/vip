import { Plan } from '../types';

interface PlanGroup {
  regular: Plan[];
  globoplay?: Plan;
  paramount?: Plan;
  max?: Plan;
}

// Base message for all territories
const BASE_MESSAGE = `Temos cobertura para seu endereço ✅
Internet_ *100% Fibra*.
Fidelidade de 12 meses
Sua instalação 100% gratuita
Roteador fornecido em comodato`;

// T1-T9 Plans
const t1t9Plans: PlanGroup = {
  regular: [
    { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
    { speed: "800MB", price: "119,99", priceAfter: "139,99", description: "Wifi 6 incluso" },
    { speed: "600MB", price: "99,99", priceAfter: "119,99", description: "Wifi 6 incluso" },
    { speed: "400MB", price: "79,99", priceAfter: "99,99" }
  ],
  paramount: {
    speed: "400MB",
    price: "89,99",
    priceAfter: "109,99",
    description: "Paramount+"
  },
  max: {
    speed: "400MB",
    price: "109,99",
    priceAfter: "129,99",
    description: "MAX"
  }
};

// T10-T15 Plans (incluindo Maranhão agora com os mesmos preços de Fortaleza)
const t10t15Plans: PlanGroup = {
  regular: [
    { speed: "920MB", price: "139,99", priceAfter: "159,99", description: "Wifi 6 incluso" },
    { speed: "800MB", price: "109,99", priceAfter: "129,99", description: "Wifi 6 incluso" },
    { speed: "600MB", price: "89,99", priceAfter: "109,99", description: "Wifi 6 incluso" },
    { speed: "400MB", price: "69,99", priceAfter: "89,99" }
    { speed: "400MB", price: "69,99", priceAfter: "89,99" }
  ],
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
    description: "MAX"
  }
};

// TV Plans
export const tvBasicPlan = {
  name: "TV Básico",
  channels: "35 Canais ao vivo",
  description: "Conecte-se com mais velocidade, com Internet 100% Fibra.",
  plans: [
    { speed: "920MB", price: "189,99", priceAfter: "209,99" },
    { speed: "800MB", price: "169,99", priceAfter: "189,99" },
    { speed: "600MB", price: "149,99", priceAfter: "169,99" },
    { speed: "400MB", price: "129,99", priceAfter: "149,99" }
  ]
};

export const tvParamountPlan = {
  name: "TV + Paramount",
  channels: "48 Canais ao vivo + Paramount",
  description: "Mais conectividade e diversão para você.",
  plans: [
    { speed: "920MB", price: "204,99", priceAfter: "224,99" },
    { speed: "800MB", price: "184,99", priceAfter: "204,99" },
    { speed: "600MB", price: "164,99", priceAfter: "184,99" },
    { speed: "400MB", price: "144,99", priceAfter: "164,99" }
  ]
};

export const tvParamountMaxPlan = {
  name: "TV + Paramount + MAX",
  channels: "48 Canais ao vivo + MAX + Paramount",
  description: "Mais conectividade e diversão para você.",
  plans: [
    { speed: "920MB", price: "214,99", priceAfter: "234,99" },
    { speed: "800MB", price: "194,99", priceAfter: "214,99" },
    { speed: "174,99", price: "174,99", priceAfter: "194,99" },
    { speed: "400MB", price: "154,99", priceAfter: "174,99" }
  ]
};

// Helper function to get plans based on territory
export function getPlansForTerritory(territoryId: string): PlanGroup {
  const t1t9Territories = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9'];
  const t10t15Territories = ['T10', 'T11', 'T12', 'T13', 'T14_1', 'T14_2', 'T15']; // Incluindo T15 (Maranhão)
  
  if (t1t9Territories.includes(territoryId)) {
    return t1t9Plans;
  } else if (t10t15Territories.includes(territoryId)) {
    return t10t15Plans;
  }
  
  // Fallback para territórios não mapeados
  return t10t15Plans;
}

// Helper function to get TV plans
export function getTVPlans() {
  return [tvBasicPlan, tvParamountPlan, tvParamountMaxPlan];
}

export function formatPlanMessage(plans: PlanGroup): string {
  let message = BASE_MESSAGE;
  
  message += '\n\n- = - = - = *✯ Internet ✯* - = - = - =\n\n';
  
  // Regular plans
  message += plans.regular.map(plan => 
    `➕ ${plan.speed} por R$ ${plan.price}/mês${plan.description ? ` • ${plan.description}` : ''}\n` +
    `Após 3 meses, R$ ${plan.priceAfter}`
  ).join('\n\n');

  // Streaming plans
  message += '\n\n- = - = - = *✯ Internet + Streamings ✯* - = - = - =\n';
  
  if (plans.paramount) {
    message += `\n*➕ ${plans.paramount.speed}* + Paramount por R$ ${plans.paramount.price}/mês\n` +
               `Após 3 meses, R$ ${plans.paramount.priceAfter}`;
  }

  if (plans.max) {
    message += `\n\n*➕ ${plans.max.speed}* + MAX por R$ ${plans.max.price}/mês\n` +
               `Após 3 meses, R$ ${plans.max.priceAfter}`;
  }

  return message;
}