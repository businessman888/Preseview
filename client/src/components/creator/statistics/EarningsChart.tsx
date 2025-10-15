import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EarningsChartProps {
  data: Array<{ date: string; amount: number }>;
  type: 'net' | 'gross';
  onTypeChange: (type: 'net' | 'gross') => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { date: string; amount: number };
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {format(new Date(label || ''), 'dd/MM/yyyy', { locale: ptBR })}
        </p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
}

export function EarningsChart({ data, type, onTypeChange }: EarningsChartProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Ganhos ao longo do tempo
        </h3>
        <ToggleGroup type="single" value={type} onValueChange={onTypeChange}>
          <ToggleGroupItem 
            value="net" 
            className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700 dark:data-[state=on]:bg-green-900 dark:data-[state=on]:text-green-300"
          >
            Net
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="gross"
            className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700 dark:data-[state=on]:bg-green-900 dark:data-[state=on]:text-green-300"
          >
            Gross
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              className="dark:stroke-gray-700" 
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: ptBR })}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              className="dark:text-gray-400"
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              className="dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#9333ea" 
              strokeWidth={3}
              dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#9333ea', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
