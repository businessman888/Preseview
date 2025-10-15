import { useState } from "react";
import { Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./StatCard";
import { EarningsChart } from "./EarningsChart";
import { TopSpenders } from "./TopSpenders";
import { RecentTransactions } from "./RecentTransactions";
import { useEarnings, useTopSpenders, useRecentTransactions } from "@/hooks/use-statistics";

interface EarningsTabProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

export function EarningsTab({ period, onPeriodChange }: EarningsTabProps) {
  const [earningsType, setEarningsType] = useState<'net' | 'gross'>('net');
  
  const { data: earnings, isLoading: earningsLoading } = useEarnings({ 
    period, 
    type: earningsType 
  });
  const { data: topSpenders, isLoading: spendersLoading } = useTopSpenders();
  const { data: transactions, isLoading: transactionsLoading } = useRecentTransactions();

  if (earningsLoading) {
    return <EarningsTabSkeleton />;
  }

  const earningsData = earnings?.data || [];
  const trendData = earningsData.slice(-7).map(d => d.amount); // Últimos 7 dias para mini gráfico
  const monthlyTrendData = Array(31).fill(0);
  monthlyTrendData[30] = earnings?.thisMonth || 0; // Último dia do mês

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cards de Resumo */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Ganhos" 
            value={earnings?.total || 0} 
            subtitle="Todo o período"
            trend="up"
            trendData={trendData}
            icon={<Info className="w-4 h-4 text-gray-400" />}
          />
          
          <StatCard 
            title="Este mês" 
            value={earnings?.thisMonth || 0} 
            subtitle="October 2025"
            trend={earnings?.thisMonth ? "up" : "flat"}
            trendData={monthlyTrendData}
            icon={<Info className="w-4 h-4 text-gray-400" />}
          />
          
          <TopPercentageCard 
            percentage={earnings?.topPercentage || 0}
          />
        </div>
        
        <EarningsChart 
          data={earningsData}
          type={earningsType}
          onTypeChange={setEarningsType}
        />
      </div>
      
      {/* Sidebar */}
      <div className="space-y-6">
        {!spendersLoading && <TopSpenders data={topSpenders || []} />}
        {!transactionsLoading && <RecentTransactions data={transactions || []} />}
      </div>
    </div>
  );
}

function TopPercentageCard({ percentage }: { percentage: number }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-4 h-4 text-yellow-500" />
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Estás no top {percentage}%
        </h3>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
        Queres ganhar mais? Vê mais sugestões para aumentar a receita!
      </p>
      
      <Button 
        size="sm" 
        className="bg-green-500 hover:bg-green-600 text-white"
        onClick={() => {/* Implementar */}}
      >
        Obter dicas &gt;
      </Button>
    </div>
  );
}

function EarningsTabSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
