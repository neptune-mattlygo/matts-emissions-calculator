"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  RotateCcw, 
  AlertCircle, 
  Plane, 
  Route,
  Users as UsersIcon,
  ArrowLeftRight
} from "lucide-react";

import { AircraftSelector } from "./aircraft-selector";
import { AircraftInfoCard } from "./aircraft-info-card";
import { DistanceInput } from "./distance-input";
import { PassengerInput } from "./passenger-input";
import { ResultsDisplay } from "./results-display";

import { CalculationResult, ComparisonMetrics, DistanceUnit } from "@/lib/types";
import { aircraftDatabase } from "@/lib/aircraft-data";
import { calculateEmissions, calculateComparisonMetrics, validateInputs } from "@/lib/calculations";

export function CalculatorForm() {
  const [selectedAircraftId, setSelectedAircraftId] = React.useState<string | undefined>();
  const [distance, setDistance] = React.useState<number>(1000);
  const [distanceUnit, setDistanceUnit] = React.useState<DistanceUnit>('miles');
  const [passengerCount, setPassengerCount] = React.useState<number>(1);
  const [roundTrip, setRoundTrip] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<CalculationResult | null>(null);
  const [comparison, setComparison] = React.useState<ComparisonMetrics | null>(null);
  const [errors, setErrors] = React.useState<string[]>([]);

  // Reference to the results section for scrolling
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const selectedAircraft = selectedAircraftId 
    ? aircraftDatabase.find(aircraft => aircraft.id === selectedAircraftId)
    : undefined;

  const handleCalculate = () => {
    const validation = validateInputs(selectedAircraft || null, distance, passengerCount);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setResult(null);
      setComparison(null);
      return;
    }

    if (selectedAircraft) {
      const calculationResult = calculateEmissions(
        selectedAircraft,
        distance,
        distanceUnit,
        passengerCount,
        roundTrip
      );
      
      const comparisonMetrics = calculateComparisonMetrics(calculationResult);
      
      setResult(calculationResult);
      setComparison(comparisonMetrics);
      setErrors([]);

      // Scroll to results section after calculation
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  const handleReset = () => {
    setSelectedAircraftId(undefined);
    setDistance(1000);
    setDistanceUnit('miles');
    setPassengerCount(1);
    setRoundTrip(false);
    setResult(null);
    setComparison(null);
    setErrors([]);
  };

  const isFormValid = selectedAircraft && distance > 0 && passengerCount > 0 && 
    passengerCount <= selectedAircraft.passengerCapacity.maximum;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Matt&apos;s Emissions Calculator</h1>
        <p className="text-lg text-slate-300">
          Calculate and compare the carbon footprint of your private jet flights
        </p>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          {/* Input Form */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Plane className="h-5 w-5" />
                Flight Details
              </CardTitle>
              <CardDescription className="text-slate-300">
                Enter your flight information to calculate emissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Aircraft Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-200">Select Aircraft</Label>
                <AircraftSelector
                  value={selectedAircraftId}
                  onValueChange={setSelectedAircraftId}
                  placeholder="Choose from 48 aircraft models..."
                />
              </div>

              {/* Aircraft Info Card */}
              {selectedAircraft && (
                <AircraftInfoCard aircraft={selectedAircraft} />
              )}

              {/* Distance Input */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2 text-slate-200">
                  <Route className="h-4 w-4" />
                  Flight Distance
                </Label>
                <DistanceInput
                  distance={distance}
                  unit={distanceUnit}
                  onDistanceChange={setDistance}
                  onUnitChange={setDistanceUnit}
                />
              </div>

              {/* Passenger Count */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2 text-slate-200">
                  <UsersIcon className="h-4 w-4" />
                  Passengers
                </Label>
                <PassengerInput
                  passengerCount={passengerCount}
                  onPassengerCountChange={setPassengerCount}
                  aircraft={selectedAircraft}
                />
              </div>

              {/* Round Trip Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="round-trip"
                  checked={roundTrip}
                  onCheckedChange={setRoundTrip}
                />
                <Label htmlFor="round-trip" className="flex items-center gap-2 text-slate-200">
                  <ArrowLeftRight className="h-4 w-4" />
                  Round trip
                  {roundTrip && (
                    <Badge variant="secondary" className="ml-2">
                      2x emissions
                    </Badge>
                  )}
                </Label>
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCalculate}
                  disabled={!isFormValid}
                  className="flex-1"
                  size="lg"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Emissions
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && comparison && (
            <div ref={resultsRef} className="scroll-mt-6">
              <ResultsDisplay result={result} comparison={comparison} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
