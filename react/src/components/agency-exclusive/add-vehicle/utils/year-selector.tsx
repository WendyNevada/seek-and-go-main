import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

interface YearSelectorProps {
    onSelectYear: (year: number) => void;
}

export function YearSelector({ onSelectYear }: YearSelectorProps) {
    // Generate a list of years (e.g., from 1950 to current year)
    const currentYear = new Date().getFullYear();
    const years: number[] = Array.from({ length: currentYear - 1949 }, (_, index) => currentYear - index);

    //const buttonText = onSelectYear ? "Select Year" : (onSelectYear as number).toString();
    const buttonText = onSelectYear ? "Select Year" : `Selected Year: ${onSelectYear}`;

    return (
        <div>
            <Select>
                <SelectTrigger>
                    <button className="w-[180px]" onClick={() => onSelectYear(-1)}>{buttonText}</button>
                </SelectTrigger>
                <SelectContent>
                    {years.map((year) => (
                        <SelectItem key={year} value={year.toString()} onClick={() => onSelectYear(year)}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

//   export default YearSelector;
