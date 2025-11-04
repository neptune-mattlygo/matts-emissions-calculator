"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, AlertTriangle } from "lucide-react";
import { Aircraft } from "@/lib/types";

interface PassengerInputProps {
  passengerCount: number;
  onPassengerCountChange: (count: number) => void;
  aircraft?: Aircraft;
}

export function PassengerInput({ passengerCount, onPassengerCountChange, aircraft }: PassengerInputProps) {
  const [inputValue, setInputValue] = React.useState(passengerCount.toString());

  React.useEffect(() => {
    setInputValue(passengerCount.toString());
  }, [passengerCount]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onPassengerCountChange(numValue);
    }
  };

  const showCapacityWarning = aircraft && passengerCount > aircraft.passengerCapacity.typical;
  const showCapacityError = aircraft && passengerCount > aircraft.passengerCapacity.maximum;

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="passengers" className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4" />
          Number of Passengers
        </Label>
        <Input
          id="passengers"
          type="number"
          placeholder="Enter passenger count"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className="text-lg"
          min="1"
          max={aircraft?.passengerCapacity.maximum}
        />
      </div>

      {aircraft && (
        <div className="text-sm text-muted-foreground">
          Aircraft capacity: {aircraft.passengerCapacity.typical} typical, {aircraft.passengerCapacity.maximum} maximum
        </div>
      )}

      {showCapacityError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Passenger count exceeds aircraft maximum capacity of {aircraft!.passengerCapacity.maximum}.
          </AlertDescription>
        </Alert>
      )}

      {showCapacityWarning && !showCapacityError && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Passenger count exceeds typical capacity of {aircraft!.passengerCapacity.typical}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
