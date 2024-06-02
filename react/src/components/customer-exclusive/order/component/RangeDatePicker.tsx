import * as React from "react";
import { addDays, differenceInDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RangeDatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange: (date: DateRange | undefined) => void;
  onQtyChange: (newQty: number) => void;
  startDt?: string;
  endDt?: string;
}

export function RangeDatePicker({
  className,
  onDateChange,
  onQtyChange,
  startDt,
  endDt
}: RangeDatePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (startDt && endDt) {
      return {
        from: new Date(startDt),
        to: new Date(endDt),
      };
    }
    return undefined;
  });

  React.useEffect(() => {
    onDateChange(date);
    // Calculate quantity of days
    const startDate = date?.from ? new Date(date.from) : null;
    const endDate = date?.to ? new Date(date.to) : null;
    const days = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
    onQtyChange(days);
  }, [date, onDateChange, onQtyChange]);

  React.useEffect(() => {
    onDateChange(date);
  }, [date, onDateChange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
