import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentTransactionsProps {
  data: Array<{
    id: number;
    userId: number;
    username: string;
    displayName: string;
    amount: number;
    type: string;
    createdAt: string;
    isLive: boolean;
  }>;
}

export function RecentTransactions({ data }: RecentTransactionsProps) {
  const hasLiveTransactions = data?.some(t => t.isLive);

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transações recentes
          </h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Nenhuma transação ainda.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Transações recentes
        </h3>
        {hasLiveTransactions && (
          <Badge variant="secondary" className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Ao vivo
          </Badge>
        )}
      </div>
      
      <div className="space-y-3">
        {data.slice(0, 8).map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {transaction.displayName[0]?.toUpperCase() || transaction.username[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {transaction.displayName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(transaction.createdAt), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </div>
              </div>
            </div>
            <div className="font-semibold text-sm text-green-600 dark:text-green-400">
              +${transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
