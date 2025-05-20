export interface Plan {
  speed: string;
  price: string;
  priceAfter: string;
  description?: string;
}

export interface Territory {
  id: string;
  name: string;
  cities: string[];
  plans: {
    regular: Plan[];
    globoplay?: Plan;
    paramount?: Plan;
    max?: Plan;
  };
}

export interface PlansData {
  [key: string]: Territory;
}

export interface TVPlan {
  name: string;
  channels: number;
  plans: {
    speed: string;
    price: string;
    priceAfter: string;
  }[];
  description: string;
}

export interface TVTerritory {
  id: string;
  name: string;
  cities: string[];
  plans: TVPlan[];
}