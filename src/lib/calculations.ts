import { Aircraft, CalculationResult, ComparisonMetrics, DistanceUnit } from './types';
import { CONVERSION_FACTORS, EFFICIENCY_THRESHOLDS } from './constants';

// Convert distance between units
export function convertDistance(distance: number, fromUnit: DistanceUnit, toUnit: DistanceUnit): number {
  if (fromUnit === toUnit) return distance;
  
  // Convert to kilometers first
  let km: number;
  switch (fromUnit) {
    case 'miles':
      km = distance * CONVERSION_FACTORS.MI_TO_KM;
      break;
    case 'nautical-miles':
      km = distance * CONVERSION_FACTORS.NM_TO_KM;
      break;
    case 'kilometers':
      km = distance;
      break;
  }
  
  // Convert from kilometers to target unit
  switch (toUnit) {
    case 'miles':
      return km * CONVERSION_FACTORS.KM_TO_MI;
    case 'nautical-miles':
      return km * CONVERSION_FACTORS.KM_TO_NM;
    case 'kilometers':
      return km;
  }
}

// Calculate emissions for a flight
export function calculateEmissions(
  aircraft: Aircraft,
  distance: number,
  distanceUnit: DistanceUnit,
  passengerCount: number,
  roundTrip: boolean = false
): CalculationResult {
  // Convert distance to kilometers for calculation
  const distanceKm = convertDistance(distance, distanceUnit, 'kilometers');
  
  // Calculate total CO2 emissions
  const totalCO2Kg = distanceKm * aircraft.emissionsFactor.kgCO2PerKm * (roundTrip ? 2 : 1);
  const totalCO2Tonnes = totalCO2Kg / CONVERSION_FACTORS.KG_TO_TONNES;
  
  // Calculate per-passenger emissions
  const perPassengerCO2Tonnes = totalCO2Tonnes / passengerCount;
  
  return {
    totalCO2Kg,
    totalCO2Tonnes,
    perPassengerCO2Tonnes,
    aircraft,
    distance,
    distanceUnit,
    passengerCount,
    roundTrip,
  };
}

// Calculate comparison metrics
export function calculateComparisonMetrics(result: CalculationResult): ComparisonMetrics {
  const distanceKm = convertDistance(result.distance, result.distanceUnit, 'kilometers');
  const actualDistanceKm = distanceKm * (result.roundTrip ? 2 : 1);
  
  // Car trips equivalent
  const carCO2 = actualDistanceKm * CONVERSION_FACTORS.CAR_CO2_PER_KM;
  const carTripsEquivalent = result.totalCO2Kg / carCO2;
  
  // Commercial flight comparison
  const commercialFlightCO2 = actualDistanceKm * CONVERSION_FACTORS.COMMERCIAL_FLIGHT_CO2_PER_KM * result.passengerCount;
  const commercialFlightComparison = result.totalCO2Kg / commercialFlightCO2;
  
  // Trees needed to offset
  const treesNeededToOffset = result.totalCO2Kg / CONVERSION_FACTORS.TREE_CO2_ABSORPTION_PER_YEAR;
  
  // Carbon offset cost
  const carbonOffsetCost = {
    min: result.totalCO2Tonnes * CONVERSION_FACTORS.CARBON_OFFSET_COST_MIN,
    max: result.totalCO2Tonnes * CONVERSION_FACTORS.CARBON_OFFSET_COST_MAX,
  };
  
  // Efficiency rating
  let efficiencyRating: ComparisonMetrics['efficiencyRating'];
  if (result.aircraft.emissionsFactor.kgCO2PerKm <= EFFICIENCY_THRESHOLDS.EFFICIENT_MAX) {
    efficiencyRating = 'efficient';
  } else if (result.aircraft.emissionsFactor.kgCO2PerKm <= EFFICIENCY_THRESHOLDS.AVERAGE_MAX) {
    efficiencyRating = 'average';
  } else {
    efficiencyRating = 'high-emissions';
  }
  
  return {
    carTripsEquivalent,
    treesNeededToOffset,
    commercialFlightComparison,
    carbonOffsetCost,
    efficiencyRating,
  };
}

// Validate calculation inputs
export function validateInputs(
  aircraft: Aircraft | null,
  distance: number,
  passengerCount: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!aircraft) {
    errors.push('Please select an aircraft');
  }
  
  if (distance <= 0) {
    errors.push('Distance must be greater than 0');
  }
  
  if (passengerCount <= 0) {
    errors.push('Passenger count must be at least 1');
  }
  
  if (aircraft && passengerCount > aircraft.passengerCapacity.maximum) {
    errors.push(`Passenger count exceeds aircraft maximum capacity of ${aircraft.passengerCapacity.maximum}`);
  }
  
  if (aircraft && distance > aircraft.range.kilometers) {
    errors.push(`Distance exceeds aircraft range of ${aircraft.range.kilometers.toLocaleString()} km`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Utility functions for formatting
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
