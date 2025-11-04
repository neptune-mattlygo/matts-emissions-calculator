// Conversion factors
export const CONVERSION_FACTORS = {
  // Distance conversions
  MI_TO_KM: 1.60934,
  NM_TO_KM: 1.852,
  KM_TO_MI: 0.621371,
  KM_TO_NM: 0.539957,
  
  // Emission calculations
  KG_TO_TONNES: 1000,
  
  // Comparison metrics
  CAR_CO2_PER_KM: 0.12, // kg CO2 per km for average car
  TREE_CO2_ABSORPTION_PER_YEAR: 21, // kg CO2 per tree per year
  COMMERCIAL_FLIGHT_CO2_PER_KM: 0.09, // kg CO2 per passenger per km (economy class)
  
  // Carbon offset costs (USD per tonne CO2)
  CARBON_OFFSET_COST_MIN: 15,
  CARBON_OFFSET_COST_MAX: 30,
} as const;

// Emission efficiency thresholds (kg CO2 per km)
export const EFFICIENCY_THRESHOLDS = {
  EFFICIENT_MAX: 2.5,
  AVERAGE_MAX: 3.5,
} as const;

// Popular routes for quick selection
export const POPULAR_ROUTES = [
  { name: 'New York - Los Angeles', distance: 2445, unit: 'miles' as const },
  { name: 'London - Dubai', distance: 3414, unit: 'miles' as const },
  { name: 'Paris - New York', distance: 3635, unit: 'miles' as const },
  { name: 'Miami - London', distance: 4414, unit: 'miles' as const },
  { name: 'Los Angeles - Tokyo', distance: 5434, unit: 'miles' as const },
  { name: 'Sydney - Los Angeles', distance: 7488, unit: 'miles' as const },
] as const;
