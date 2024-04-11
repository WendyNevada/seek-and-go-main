"use client"

import * as React from "react"
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

const provinces = [
  {
    value: "province_1",
    label: "province 1",
  },
  {
    value: "province_2",
    label: "province 2",
  },
  {
    value: "province_3",
    label: "province 3",
  },
  {
    value: "province_4",
    label: "province 4",
  },
  {
    value: "province_5",
    label: "province 5",
  },
]

interface ProvinceComboboxProps {
    onSelectProvince: (province: string) => void;
  }

export function ProvinceCombobox({onSelectProvince}: ProvinceComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

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
            ? provinces.find((provinces) => provinces.value === value)?.label
            : "Select Province..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Province..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {provinces.map((provinces) => (
                <CommandList>
                    <CommandItem
                        key={provinces.value}
                        value={provinces.value}
                        onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                            onSelectProvince(currentValue);
                        }}
                    >
                        <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                value === provinces.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                        {provinces.label}
                    </CommandItem>
                </CommandList>

            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
