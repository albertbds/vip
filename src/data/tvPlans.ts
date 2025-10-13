export interface ChannelCategory {
  name: string;
  channels: string[];
}

export const basicPackage: ChannelCategory[] = [
  {
    name: "Abertos",
    channels: ["Globo", "SBT", "RedeTV", "Record", "Band", "Gazeta"]
  },
  {
    name: "Esportes",
    channels: ["Band Sports", "SporTV", "SporTV2", "SporTV3"]
  },
  {
    name: "Notícias",
    channels: ["Band News", "Globo News"]
  },
  {
    name: "Infantis",
    channels: ["Gloob", "Gloobinho"]
  },
  {
    name: "Filmes e Séries",
    channels: ["Universal TV", "Studio Universal", "Megapix", "USA"]
  },
  {
    name: "Variedades",
    channels: [
      "Sabor & Arte", "Agro Plus", "C. Empreendedor", "Arte 1", "Multishow",
      "Terra Viva", "GNT", "Canal Off", "Bis", "Modo Viagem", "Viva",
      "Canal Brasil", "Futura", "TV Brasil", "MTV"
    ]
  },
  {
    name: "Religiosos",
    channels: ["Canção Nova", "Rede Vida", "Aparecida"]
  },
  {
    name: "Catálogo",
    channels: ["Lionsgate", "Xpeed", "Sony Pictures", "Universal"]
  }
];

export const familyPackage: ChannelCategory[] = [
  {
    name: "Streaming",
    channels: ["Paramount+"]
  },
  {
    name: "Abertos",
    channels: ["Globo", "SBT", "RedeTV", "Record", "Band", "Gazeta", "TV Cultura"]
  },
  {
    name: "Esportes",
    channels: ["Band Sports", "SporTV", "SporTV2", "SporTV3"]
  },
  {
    name: "Notícias",
    channels: ["Band News", "Globo News", "Record News", "Bloomberg"]
  },
  {
    name: "Infantis",
    channels: ["Gloob", "Gloobinho", "Nickeloeon", "Nick Jr."]
  },
  {
    name: "Filmes e Séries",
    channels: ["Universal TV", "Studio Universal", "Megapix", "USA", "Films & Arts", "Comedy Central", "Paramount"]
  },
  {
    name: "Variedades",
    channels: [
      "Sabor & Arte", "Agro Plus", "C. Empreendedor", "Arte 1", "Multishow",
      "Terra Viva", "GNT", "Canal Off", "Bis", "Modo Viagem", "Viva",
      "Canal Brasil", "Futura", "TV Brasil", "MTV"
    ]
  },
  {
    name: "Religiosos",
    channels: ["Canção Nova", "Rede Vida", "Aparecida"]
  },
  {
    name: "Catálogo",
    channels: ["Lionsgate", "Xpeed", "Sony Pictures", "Universal"]
  }
];

export const cinemaPackage: ChannelCategory[] = [
  {
    name: "Streaming",
    channels: ["Paramount+ e HBO Max"]
  },
  {
    name: "Abertos",
    channels: ["Globo", "SBT", "RedeTV", "Record", "Band", "Gazeta", "TV Cultura"]
  },
  {
    name: "Esportes",
    channels: ["Band Sports", "SporTV", "SporTV2", "SporTV3"]
  },
  {
    name: "Notícias",
    channels: ["Band News", "Globo News", "Record News", "Bloomberg"]
  },
  {
    name: "Infantis",
    channels: ["Gloob", "Gloobinho", "Nickeloeon", "Nick Jr."]
  },
  {
    name: "Filmes e Séries",
    channels: ["Universal TV", "Studio Universal", "Megapix", "USA", "Films & Arts", "Comedy Central", "Paramount"]
  },
  {
    name: "Variedades",
    channels: [
      "Sabor & Arte", "Agro Plus", "C. Empreendedor", "Arte 1", "Multishow",
      "Terra Viva", "GNT", "Canal Off", "Bis", "Modo Viagem", "Viva",
      "Canal Brasil", "Futura", "TV Brasil", "MTV"
    ]
  },
  {
    name: "Religiosos",
    channels: ["Canção Nova", "Rede Vida", "Aparecida"]
  },
  {
    name: "Catálogo",
    channels: ["Lionsgate", "Xpeed", "Sony Pictures", "Universal"]
  }
];

// Cities with TV service
export const tvCities = new Set([
  // Giga+ TV disponível em: Cabo Frio, Fortaleza, Guarulhos, Macaé, São Paulo, Teresina, Vila Velha e Vitória
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