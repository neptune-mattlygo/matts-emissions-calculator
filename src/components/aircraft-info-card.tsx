"use client";

import { Aircraft } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categoryDisplayNames } from "@/lib/aircraft-data";
import { Plane, Users, MapPin, Gauge, Fuel, Leaf } from "lucide-react";

interface AircraftInfoCardProps {
  aircraft: Aircraft;
}

export function AircraftInfoCard({ aircraft }: AircraftInfoCardProps) {
  return (
    <Card className="w-full bg-slate-700 border-slate-600">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-slate-300" />
            <CardTitle className="text-lg text-white">
              {aircraft.manufacturer} {aircraft.model}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-sm bg-slate-600 text-slate-200">
            {categoryDisplayNames[aircraft.category]}
          </Badge>
        </div>
        <CardDescription className="text-slate-300">Aircraft Specifications</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-300" />
          <div>
            <div className="font-medium text-slate-200">Passenger Capacity</div>
            <div className="text-slate-400">
              {aircraft.passengerCapacity.typical} typical, {aircraft.passengerCapacity.maximum} max
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-300" />
          <div>
            <div className="font-medium text-slate-200">Range</div>
            <div className="text-slate-400">
              {aircraft.range.nauticalMiles.toLocaleString()} nm ({aircraft.range.kilometers.toLocaleString()} km)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-slate-300" />
          <div>
            <div className="font-medium text-slate-200">Cruise Speed</div>
            <div className="text-slate-400">
              {aircraft.cruiseSpeed.knots} kts ({aircraft.cruiseSpeed.kmh} km/h)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Fuel className="h-4 w-4 text-slate-300" />
          <div>
            <div className="font-medium text-slate-200">Fuel Consumption</div>
            <div className="text-slate-400">
              {aircraft.fuelConsumption.gallonsPerHour} gal/hr ({aircraft.fuelConsumption.litersPerHour} L/hr)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-span-2 lg:col-span-1">
          <Leaf className="h-4 w-4 text-slate-300" />
          <div>
            <div className="font-medium text-slate-200">Emissions Factor</div>
            <div className="font-semibold text-green-400">
              {aircraft.emissionsFactor.kgCO2PerKm.toFixed(1)} kg CO₂/km
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
