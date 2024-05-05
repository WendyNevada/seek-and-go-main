"use client"

import React, {useState} from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCityQuery } from "./CityCombobox-hook"
import { ScrollArea } from "@/components/ui/scroll-area"

    interface CityComboboxProps {
        onSelectCity: (city: string) => void;
        selectedProvince: string;
    }
    interface City {
        value: string;
        label: string;
    }
export function CityCombobox({onSelectCity, selectedProvince} : CityComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const {cities, loading}= useCityQuery({ selectedProvince });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? cities.find((cities:City) => cities.value === value)?.label
            : "Select City..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search City..." />
          {/* {loading ? <CommandEmpty>Loading...</CommandEmpty> : null} */}
          {!loading && cities.length === 0 && <CommandEmpty>No city found.</CommandEmpty>}
          {/* <CommandEmpty>No City found.</CommandEmpty> */}
          {!loading && cities.length > 0 && (
            <ScrollArea className="h-48 overflow-auto">
            <CommandGroup>
            {cities.map((cities:City) => (
                <CommandList>
                    <CommandItem
                        key={cities.value}
                        value={cities.value}
                        onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                            onSelectCity(currentValue)
                        }}
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            value === cities.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                        {cities.label}
                    </CommandItem>
                </CommandList>

            ))}
          </CommandGroup>
          </ScrollArea>
          )
        }
        </Command>
      </PopoverContent>
    </Popover>
  )
}
