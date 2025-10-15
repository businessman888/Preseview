import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

interface TopSpendersProps {
  data: Array<{
    userId: number;
    username: string;
    displayName: string;
    avatar: string;
    totalSpent: number;
    lastTransaction: string;
  }>;
}

export function TopSpenders({ data }: TopSpendersProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Maiores Gastadores
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Nenhum gastador ainda.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Maiores Gastadores
        </h3>
      </div>
      
      <div className="space-y-3">
        {data.slice(0, 5).map((spender) => (
          <div key={spender.userId} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={spender.avatar} />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {spender.displayName[0]?.toUpperCase() || spender.username[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {spender.displayName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  @{spender.username}
                </div>
              </div>
            </div>
            <div className="font-semibold text-sm text-gray-900 dark:text-white">
              ${spender.totalSpent.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      {data.length > 5 && (
        <Button variant="ghost" className="w-full mt-4" size="sm">
          <ChevronDown className="w-4 h-4 mr-2" />
          Ver mais
        </Button>
      )}
    </Card>
  );
}
