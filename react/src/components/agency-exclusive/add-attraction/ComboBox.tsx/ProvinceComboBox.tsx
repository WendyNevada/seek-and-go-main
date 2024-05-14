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
import axiosClient from "@/axios.client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "react-i18next"

interface Province {
    value: string;
    label: string;
  }

  interface Area {
    area_1: string;
  }

interface ProvinceComboboxProps {
    onSelectProvince: (province: string) => void;
  }

export function ProvinceCombobox({onSelectProvince}: ProvinceComboboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [provinces, setProvinces] = React.useState<Province[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axiosClient.post("/v1/GetAllArea1");
          if (response.status !== 200) {
            throw new Error("Failed to fetch data");
          }
          const data: Area[] = response.data;
          const provinces: Province[] = data.map((item) => ({ value: item.area_1, label: item.area_1 }));
          setProvinces(provinces); // Update component state with fetched data
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
  },[]);

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
            : t('Select Province...')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t('Search Province...')} />
          <CommandEmpty>No framework found.</CommandEmpty>
          <ScrollArea className="h-48 overflow-auto">
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
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
