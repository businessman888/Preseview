import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PeriodFilterProps {
  period: string;
  onPeriodChange: (period: string) => void;
  className?: string;
}

const periodOptions = [
  { value: 'all', label: 'Todo o período' },
  { value: 'week', label: 'Semanal' },
  { value: 'month', label: 'Mensal' },
  { value: 'day', label: 'Último dia' },
];

export function PeriodFilter({ period, onPeriodChange, className }: PeriodFilterProps) {
  return (
    <Select value={period} onValueChange={onPeriodChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Selecionar período" />
      </SelectTrigger>
      <SelectContent>
        {periodOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
