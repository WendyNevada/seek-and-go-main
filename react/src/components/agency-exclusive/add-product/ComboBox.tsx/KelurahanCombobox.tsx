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
    value: "kelurahan_1",
    label: "kelurahan 1",
  },
  {
    value: "kelurahan_2",
    label: "kelurahan 2",
  },
  {
    value: "kelurahan_3",
    label: "kelurahan 3",
  },
  {
    value: "kelurahan_4",
    label: "kelurahan 4",
  },
  {
    value: "kelurahan_5",
    label: "kelurahan 5",
  },
]

export function KelurahanCombobox() {
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
            : "Select kelurahan..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search kelurahan..." />
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
