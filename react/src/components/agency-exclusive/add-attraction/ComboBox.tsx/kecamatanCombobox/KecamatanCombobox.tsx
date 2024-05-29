"use client"

import {useState} from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "react-i18next"

interface KecamatanComboboxProps {
    onSelectKecamatan: (kecamatan: string) => void;
    selectedCity: string;
    selectedProvince: string;
}

interface Kecamatan {
    value: string;
    label: string;
}

export function KecamatanCombobox({onSelectKecamatan, selectedCity, selectedProvince} : KecamatanComboboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const { kecamatan, loading } = useKecamatanQuery({selectedCity, selectedProvince});

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
            <span className="truncate">
                {value
                ? kecamatan.find((kecamatan:Kecamatan) => kecamatan.value === value)?.label
                : t('Select Kecamatan...')}
            </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t('Search Kecamatan...')} />
          {!loading && kecamatan.length === 0 && <CommandEmpty>No district found.</CommandEmpty>}
          {/* <CommandEmpty>No framework found.</CommandEmpty> */}
          <ScrollArea className="h-48 overflow-auto">
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
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
