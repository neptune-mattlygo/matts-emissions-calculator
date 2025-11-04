"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Aircraft } from "@/lib/types";
import { aircraftDatabase, categoryDisplayNames } from "@/lib/aircraft-data";

interface AircraftSelectorProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  placeholder?: string;
}

export function AircraftSelector({ value, onValueChange, placeholder = "Select aircraft..." }: AircraftSelectorProps) {
  const [open, setOpen] = React.useState(false);
  
  const selectedAircraft = aircraftDatabase.find(aircraft => aircraft.id === value);

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[3rem] p-3"
          >
            <div className="flex items-center gap-2 text-left">
              <Plane className="h-4 w-4 text-muted-foreground" />
              {selectedAircraft ? (
                <div className="flex flex-col gap-1">
                  <div className="font-medium">
                    {selectedAircraft.manufacturer} {selectedAircraft.model}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {categoryDisplayNames[selectedAircraft.category]}
                  </Badge>
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search aircraft..." />
            <CommandEmpty>No aircraft found.</CommandEmpty>
            <CommandList className="max-h-[300px]">
              {Object.entries(
                aircraftDatabase.reduce((groups, aircraft) => {
                  const category = aircraft.category;
                  if (!groups[category]) {
                    groups[category] = [];
                  }
                  groups[category].push(aircraft);
                  return groups;
                }, {} as Record<Aircraft['category'], Aircraft[]>)
              ).map(([category, aircraftList]) => (
                <CommandGroup key={category} heading={categoryDisplayNames[category as Aircraft['category']]}>
                  {aircraftList.map((aircraft) => (
                    <CommandItem
                      key={aircraft.id}
                      value={`${aircraft.manufacturer} ${aircraft.model}`}
                      onSelect={() => {
                        onValueChange(aircraft.id === value ? undefined : aircraft.id);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            value === aircraft.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {aircraft.manufacturer} {aircraft.model}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {aircraft.passengerCapacity.typical}-{aircraft.passengerCapacity.maximum} pax •{" "}
                            {Math.round(aircraft.range.nauticalMiles).toLocaleString()} nm
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {aircraft.emissionsFactor.kgCO2PerKm.toFixed(1)} kg/km
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
