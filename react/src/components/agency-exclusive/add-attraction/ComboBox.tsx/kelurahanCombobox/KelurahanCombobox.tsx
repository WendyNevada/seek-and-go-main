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
import { useKelurahanQuery } from "./KelurahanCombobox-hook"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "react-i18next"

interface KelurahanComboboxProps {
    onSelectKelurahan: (kelurahan: string) => void;
    selectedKecamatan: string;
    selectedCity: string;
    selectedProvince: string;
}

interface Kelurahan {
    value: string;
    label: string;
}

export function KelurahanCombobox({onSelectKelurahan, selectedKecamatan, selectedCity, selectedProvince} : KelurahanComboboxProps) {
  const {t} = useTranslation();
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const {kelurahan,  loading} = useKelurahanQuery({selectedKecamatan, selectedCity, selectedProvince});

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
            ? kelurahan.find((kelurahan:Kelurahan) => kelurahan.value === value)?.label
            : t('Select Kelurahan...')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t('Search Kelurahan...')} />
          {!loading && kelurahan.length === 0 && <CommandEmpty>No sub district found.</CommandEmpty>}
          {/* <CommandEmpty>No framework found.</CommandEmpty> */}
          <ScrollArea className="h-48 overflow-auto">
          <CommandGroup>
            {kelurahan.map((kelurahan:Kelurahan) => (
                <CommandList>
                    <CommandItem
                        key={kelurahan.value}
                        value={kelurahan.value}
                        onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                            onSelectKelurahan(currentValue)
                        }}
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            value === kelurahan.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                        {kelurahan.label}
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
