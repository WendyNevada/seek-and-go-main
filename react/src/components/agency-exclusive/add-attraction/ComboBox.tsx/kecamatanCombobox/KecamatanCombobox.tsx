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
import { useKecamatanQuery } from "./KecamatanCombobox-hook"

interface KecamatanComboboxProps {
    onSelectKecamatan: (kecamatan: string) => void;
    selectedCity: string;
}

interface Kecamatan {
    value: string;
    label: string;
}

export function KecamatanCombobox({onSelectKecamatan, selectedCity} : KecamatanComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const { kecamatan, loading } = useKecamatanQuery({selectedCity});

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
            ? kecamatan.find((kecamatan:Kecamatan) => kecamatan.value === value)?.label
            : "Select Kecamatan..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Kecamatan..." />
          {!loading && kecamatan.length === 0 && <CommandEmpty>No district found.</CommandEmpty>}
          {/* <CommandEmpty>No framework found.</CommandEmpty> */}
          <CommandGroup>
            {kecamatan.map((kecamatan:Kecamatan) => (
                <CommandList>
                    <CommandItem
                        key={kecamatan.value}
                        value={kecamatan.value}
                        onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                            onSelectKecamatan(currentValue)
                        }}
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            value === kecamatan.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                        {kecamatan.label}
                    </CommandItem>
                </CommandList>

            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
