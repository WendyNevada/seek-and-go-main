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

const frameworks = [
  {
    value: "city_1",
    label: "city 1",
  },
  {
    value: "city_2",
    label: "city 2",
  },
  {
    value: "city_3",
    label: "city 3",
  },
  {
    value: "city_4",
    label: "city 4",
  },
  {
    value: "city_5",
    label: "city 5",
  },
]

export function CityCombobox() {
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
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select City..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search City..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
                <CommandList>
                    <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                        }}
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            value === framework.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                        {framework.label}
                    </CommandItem>
                </CommandList>

            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
