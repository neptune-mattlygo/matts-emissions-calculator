"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Route } from "lucide-react";
import { DistanceUnit } from "@/lib/types";
import { POPULAR_ROUTES } from "@/lib/constants";

interface DistanceInputProps {
  distance: number;
  unit: DistanceUnit;
  onDistanceChange: (distance: number) => void;
  onUnitChange: (unit: DistanceUnit) => void;
}

export function DistanceInput({ distance, unit, onDistanceChange, onUnitChange }: DistanceInputProps) {
  const [inputValue, setInputValue] = React.useState(distance.toString());

  React.useEffect(() => {
    setInputValue(distance.toString());
  }, [distance]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onDistanceChange(numValue);
    }
  };

  const handlePopularRouteSelect = (routeDistance: number) => {
    onDistanceChange(routeDistance);
    setInputValue(routeDistance.toString());
  };

  const getUnitDisplay = (unit: DistanceUnit) => {
    switch (unit) {
      case 'miles': return 'mi';
      case 'kilometers': return 'km';
      case 'nautical-miles': return 'nm';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="distance" className="flex items-center gap-2 mb-2">
            <Route className="h-4 w-4" />
            Flight Distance
          </Label>
          <Input
            id="distance"
            type="number"
            placeholder="Enter distance"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="text-lg"
            min="0"
            step="any"
          />
        </div>
        
        <div>
          <Label className="block mb-2">Unit</Label>
          <Select value={unit} onValueChange={onUnitChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="miles">Miles (mi)</SelectItem>
              <SelectItem value="kilometers">Kilometers (km)</SelectItem>
              <SelectItem value="nautical-miles">Nautical Miles (nm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Popular Routes */}
      <div>
        <Label className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4" />
          Popular Routes
        </Label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROUTES.map((route) => (
            <Button
              key={route.name}
              variant="outline"
              size="sm"
              onClick={() => handlePopularRouteSelect(route.distance)}
              className="h-auto flex-col items-start p-2 text-left"
            >
              <div className="font-medium text-xs">{route.name}</div>
              <Badge variant="secondary" className="text-xs mt-1">
                {route.distance.toLocaleString()} {getUnitDisplay(route.unit)}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
