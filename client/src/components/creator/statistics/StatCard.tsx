import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'flat';
  trendData?: number[];
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendData, 
  icon, 
  className 
}: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return `$${val.toFixed(2)}`;
    }
    return val;
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        {icon}
      </div>
      
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {formatValue(value)}
      </div>
      
      {subtitle && (
        <div className="text-sm text-gray-500 dark:text-gray-500 mb-3">
          {subtitle}
        </div>
      )}
      
      {trendData && (
        <div className="h-12">
          <MiniChart data={trendData} trend={trend} />
        </div>
      )}
    </Card>
  );
}

// Componente para mini gráfico
function MiniChart({ data, trend }: { data: number[]; trend?: 'up' | 'down' | 'flat' }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const getColor = () => {
    switch (trend) {
      case 'up': return '#10b981'; // green-500
      case 'down': return '#ef4444'; // red-500
      default: return '#6b7280'; // gray-500
    }
  };

  return (
    <svg width="100%" height="48" viewBox="0 0 100 48" className="overflow-visible">
      <polyline
        fill="none"
        stroke={getColor()}
        strokeWidth="2"
        points={data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 48 - ((value - min) / range) * 48;
          return `${x},${y}`;
        }).join(' ')}
      />
    </svg>
  );
}
