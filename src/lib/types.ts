export interface Aircraft {
  id: string;
  model: string;
  manufacturer: string;
  category: 'turboprop' | 'very-light' | 'light' | 'midsize' | 'super-midsize' | 'heavy' | 'ultra-long-range';
  passengerCapacity: {
    typical: number;
    maximum: number;
  };
  range: {
    nauticalMiles: number;
    kilometers: number;
  };
  cruiseSpeed: {
    knots: number;
    kmh: number;
  };
  fuelConsumption: {
    litersPerHour: number;
    gallonsPerHour: number;
  };
  emissionsFactor: {
    kgCO2PerKm: number;
    kgCO2PerNauticalMile: number;
  };
  yearIntroduced?: number;
}

export interface CalculationResult {
  totalCO2Kg: number;
  totalCO2Tonnes: number;
  perPassengerCO2Tonnes: number;
  aircraft: Aircraft;
  distance: number;
  distanceUnit: 'miles' | 'kilometers' | 'nautical-miles';
  passengerCount: number;
  roundTrip: boolean;
}

export interface ComparisonMetrics {
  carTripsEquivalent: number;
  treesNeededToOffset: number;
  commercialFlightComparison: number;
  carbonOffsetCost: {
    min: number;
    max: number;
  };
  efficiencyRating: 'efficient' | 'average' | 'high-emissions';
}

export type DistanceUnit = 'miles' | 'kilometers' | 'nautical-miles';
