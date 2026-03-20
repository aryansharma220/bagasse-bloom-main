// India-specific regional data for BioGraphX
// Data sources: CEIC, ISMA, Ministry of Power, State Rural Livelihood Missions (2024-25)

export interface RegionalData {
  state: string;
  electricityCost: number; // $/kWh
  laborCost: number; // $/day
  bagasseAvailability: number; // tons/year in region
  sugarmillDensity: string; // number of mills
  carbonCreditValue: number; // $/ton CO2 saved
  majorIncentives: string[];
}

export const indianRegionalData: Record<string, RegionalData> = {
  // Uttar Pradesh - Largest bagasse producer (40% of India's output)
  "uttar-pradesh": {
    state: "Uttar Pradesh",
    electricityCost: 0.082, // ₹6.80/kWh
    laborCost: 750, // Well-developed industrial labor market
    bagasseAvailability: 6_500_000, // tons/year
    sugarmillDensity: "140+ mills",
    carbonCreditValue: 2.4, // ₹200/ton CO2
    majorIncentives: [
      "UDYAM registration (small enterprise benefits)",
      "Industrial corridor incentives",
      "Proximity to Delhi/NCR market"
    ]
  },

  // Maharashtra - Strong industrial base, diverse economy
  "maharashtra": {
    state: "Maharashtra",
    electricityCost: 0.087, // ₹7.20/kWh
    laborCost: 850, // Higher cost of living (Pune/Mumbai proximity)
    bagasseAvailability: 5_100_000,
    sugarmillDensity: "80+ mills",
    carbonCreditValue: 2.4,
    majorIncentives: [
      "25% capital subsidy for green technology",
      "Tax holiday for 7 years",
      "Renewable energy integration priority",
      "Export promotion benefits"
    ]
  },

  // Tamil Nadu - Sugar belt, competitive electricity, strong policy
  "tamil-nadu": {
    state: "Tamil Nadu",
    electricityCost: 0.078, // ₹6.50/kWh - Lowest in country
    laborCost: 650, // Lower cost of labor outside metros
    bagasseAvailability: 2_300_000,
    sugarmillDensity: "35+ mills",
    carbonCreditValue: 2.5, // Higher priority state for carbon credits
    majorIncentives: [
      "Priority pollution certificate (fast-track)",
      "Power subsidy for exporters",
      "Research partnership with Anna University",
      "SEZ benefits if applicable"
    ]
  },

  // Gujarat - Excellent industrial infrastructure
  "gujarat": {
    state: "Gujarat",
    electricityCost: 0.083, // ₹6.90/kWh
    laborCost: 700,
    bagasseAvailability: 1_800_000,
    sugarmillDensity: "40+ mills",
    carbonCreditValue: 2.3,
    majorIncentives: [
      "Vibrant Gujarat summit support",
      "GST parking & warehousing benefits",
      "Export-oriented unit (EOU) benefits",
      "Port proximity (globally competitive)"
    ]
  },

  // Karnataka - Hydro-rich, competitive power
  "karnataka": {
    state: "Karnataka",
    electricityCost: 0.085, // ₹7.10/kWh
    laborCost: 720,
    bagasseAvailability: 1_400_000,
    sugarmillDensity: "25+ mills",
    carbonCreditValue: 2.3,
    majorIncentives: [
      "Renewable energy hub (hydro + solar synergy)",
      "Startup India recognition",
      "Bangalore tech cluster proximity (research partnership)"
    ]
  },

  // Telangana - Emerging growth hub
  "telangana": {
    state: "Telangana",
    electricityCost: 0.079, // ₹6.60/kWh
    laborCost: 680,
    bagasseAvailability: 1_200_000,
    sugarmillDensity: "15+ mills",
    carbonCreditValue: 2.4,
    majorIncentives: [
      "T-Fiber broadband free for industries",
      "Competitive land price",
      "Emerging pharma-chemical cluster",
      "Hyderabad metro proximity"
    ]
  },

  // Andhra Pradesh - Coastal, competitive
  "andhra-pradesh": {
    state: "Andhra Pradesh",
    electricityCost: 0.081, // ₹6.70/kWh
    laborCost: 700,
    bagasseAvailability: 1_100_000,
    sugarmillDensity: "18+ mills",
    carbonCreditValue: 2.3,
    majorIncentives: [
      "Port connectivity (Visakhapatnam, etc.)",
      "Export incentives",
      "Special Economic Zones (SEZ) benefits"
    ]
  },

  // Punjab - High agricultural base, higher costs
  "punjab": {
    state: "Punjab",
    electricityCost: 0.089, // ₹7.40/kWh - Highest due to subsidies
    laborCost: 850,
    bagasseAvailability: 900_000,
    sugarmillDensity: "12+ mills",
    carbonCreditValue: 2.2,
    majorIncentives: [
      "Agricultural surplus processing incentives",
      "Green hydrogen hub support (emerging)"
    ]
  }
};

export const getRegionalData = (stateKey: string): RegionalData | null => {
  return indianRegionalData[stateKey] || null;
};

export const getAllStates = (): string[] => {
  return Object.values(indianRegionalData).map(r => r.state);
};

export const getStateKey = (stateName: string): string => {
  const entry = Object.entries(indianRegionalData).find(
    ([, data]) => data.state === stateName
  );
  return entry ? entry[0] : "";
};

// Carbon savings calculator
export const calculateCarbonSavings = (bagasseTonsPerYear: number): number => {
  // 1 ton bagasse = 1.5 tons CO2 saved (lifecycle analysis)
  // When diverted from co-generation or burning
  return bagasseTonsPerYear * 1.5;
};

// Carbon credit revenue calculator
export const calculateCarbonCreditRevenue = (
  carbonSavedTons: number,
  carbonCreditValuePerTon: number
): number => {
  return carbonSavedTons * carbonCreditValuePerTon;
};

export const stateSelectOptions = Object.entries(indianRegionalData).map(
  ([key, data]) => ({
    value: key,
    label: data.state
  })
);
