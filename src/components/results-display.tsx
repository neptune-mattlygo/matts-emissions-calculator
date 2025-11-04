"use client";

import { CalculationResult, ComparisonMetrics } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatNumber, formatCurrency } from "@/lib/calculations";
import { 
  Leaf, 
  Users, 
  Car, 
  TreePine, 
  Plane, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  result: CalculationResult;
  comparison: ComparisonMetrics;
}

export function ResultsDisplay({ result, comparison }: ResultsDisplayProps) {
  const getEfficiencyColor = (rating: ComparisonMetrics['efficiencyRating']) => {
    switch (rating) {
      case 'efficient': return 'text-green-600 bg-green-50 border-green-200';
      case 'average': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high-emissions': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getEfficiencyIcon = (rating: ComparisonMetrics['efficiencyRating']) => {
    switch (rating) {
      case 'efficient': return <CheckCircle className="h-4 w-4" />;
      case 'average': return <TrendingUp className="h-4 w-4" />;
      case 'high-emissions': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getEfficiencyText = (rating: ComparisonMetrics['efficiencyRating']) => {
    switch (rating) {
      case 'efficient': return 'Efficient';
      case 'average': return 'Average';
      case 'high-emissions': return 'High Emissions';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Emissions Result */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Carbon Emissions
          </CardTitle>
          <CardDescription>
            {result.aircraft.manufacturer} {result.aircraft.model} • {formatNumber(result.distance)} {result.distanceUnit.replace('-', ' ')}
            {result.roundTrip && " (round trip)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">
              {formatNumber(result.totalCO2Tonnes, 2)}
            </div>
            <div className="text-sm text-muted-foreground">tonnes CO₂ total</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {formatNumber(result.perPassengerCO2Tonnes, 2)}
            </div>
            <div className="text-sm text-muted-foreground">tonnes CO₂ per passenger</div>
          </div>

          <div className="text-center">
            <Badge
              variant="outline"
              className={cn("text-sm px-3 py-1", getEfficiencyColor(comparison.efficiencyRating))}
            >
              {getEfficiencyIcon(comparison.efficiencyRating)}
              <span className="ml-1">{getEfficiencyText(comparison.efficiencyRating)}</span>
            </Badge>
            <div className="text-xs text-muted-foreground mt-1">efficiency rating</div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Comparison</CardTitle>
          <CardDescription>
            Put these emissions into perspective
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Car Comparison */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[140px]">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Car trips</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Equivalent to {formatNumber(comparison.carTripsEquivalent, 1)}x the same distance by car
                </span>
                <span className="text-sm font-medium">
                  {formatNumber(comparison.carTripsEquivalent * 100, 0)}%
                </span>
              </div>
              <Progress value={Math.min(comparison.carTripsEquivalent * 20, 100)} className="h-2" />
            </div>
          </div>

          {/* Commercial Flight Comparison */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[140px]">
              <Plane className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Commercial flight</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {formatNumber(comparison.commercialFlightComparison, 1)}x more than commercial flight
                </span>
                <span className="text-sm font-medium">
                  {formatNumber(comparison.commercialFlightComparison * 100, 0)}%
                </span>
              </div>
              <Progress value={Math.min(comparison.commercialFlightComparison * 10, 100)} className="h-2" />
            </div>
          </div>

          {/* Trees to Offset */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[140px]">
              <TreePine className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Trees needed</span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">
                {Math.ceil(comparison.treesNeededToOffset)} trees for 1 year to offset these emissions
              </div>
            </div>
          </div>

          {/* Carbon Offset Cost */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[140px]">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Offset cost</span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">
                {formatCurrency(comparison.carbonOffsetCost.min)} - {formatCurrency(comparison.carbonOffsetCost.max)} to offset via carbon credits
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per Passenger Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Per Passenger Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold">{result.passengerCount}</div>
              <div className="text-xs text-muted-foreground">passengers</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{formatNumber(result.perPassengerCO2Tonnes, 2)}</div>
              <div className="text-xs text-muted-foreground">tonnes CO₂/passenger</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{Math.ceil(comparison.treesNeededToOffset / result.passengerCount)}</div>
              <div className="text-xs text-muted-foreground">trees/passenger</div>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {formatCurrency(comparison.carbonOffsetCost.min / result.passengerCount)} - {formatCurrency(comparison.carbonOffsetCost.max / result.passengerCount)}
              </div>
              <div className="text-xs text-muted-foreground">offset cost/passenger</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
