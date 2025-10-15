import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatorLayout } from "@/components/creator/CreatorLayout";
import { PeriodFilter } from "@/components/creator/statistics/PeriodFilter";
import { EarningsTab } from "@/components/creator/statistics/EarningsTab";
import { MonthlyEarningsTab } from "@/components/creator/statistics/MonthlyEarningsTab";
import { SubscribersTab } from "@/components/creator/statistics/SubscribersTab";
import { ContentTab } from "@/components/creator/statistics/ContentTab";

export function StatisticsPage() {
  const [activeTab, setActiveTab] = useState<'earnings' | 'monthly' | 'subscribers' | 'content'>('earnings');
  const [periodFilter, setPeriodFilter] = useState<'all' | 'week' | 'month' | 'day'>('all');

  const handleRefresh = () => {
    // Implementar refresh dos dados
    window.location.reload();
  };

  return (
    <CreatorLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Estatísticas
            </h1>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                GMT -3
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Earnings</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            {/* Filtros de Período */}
            <div className="flex gap-4 mb-6">
              <PeriodFilter 
                period={periodFilter} 
                onPeriodChange={setPeriodFilter}
                className="w-48"
              />
              <PeriodFilter 
                period={periodFilter} 
                onPeriodChange={setPeriodFilter}
                className="w-48"
              />
            </div>

            {/* Conteúdo das Tabs */}
            <TabsContent value="earnings" className="mt-0">
              <EarningsTab 
                period={periodFilter}
                onPeriodChange={setPeriodFilter}
              />
            </TabsContent>

            <TabsContent value="monthly" className="mt-0">
              <MonthlyEarningsTab 
                period={periodFilter}
                onPeriodChange={setPeriodFilter}
              />
            </TabsContent>

            <TabsContent value="subscribers" className="mt-0">
              <SubscribersTab 
                period={periodFilter}
                onPeriodChange={setPeriodFilter}
              />
            </TabsContent>

            <TabsContent value="content" className="mt-0">
              <ContentTab 
                period={periodFilter}
                onPeriodChange={setPeriodFilter}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </CreatorLayout>
  );
}

