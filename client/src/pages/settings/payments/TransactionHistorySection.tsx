import { ArrowLeftIcon, ArrowUpRightIcon, ArrowDownLeftIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Transaction } from "@shared/schema";

export const TransactionHistorySection = (): JSX.Element => {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    };
    const labels: Record<string, string> = {
      completed: "Concluído",
      pending: "Pendente",
      failed: "Falhou",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    if (type === "withdrawal") {
      return <ArrowUpRightIcon className="w-5 h-5 text-red-600" />;
    }
    return <ArrowDownLeftIcon className="w-5 h-5 text-green-600" />;
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      subscription: "Assinatura",
      tip: "Gorjeta",
      withdrawal: "Saque",
    };
    return labels[type] || type;
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdfdfa]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link href="/settings/payments">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeftIcon className="w-6 h-6 text-[#5d5b5b]" />
          </Button>
        </Link>
        <h1 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-xl">
          Histórico de transações
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <Card key={transaction.id} data-testid={`transaction-${transaction.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{getTypeLabel(transaction.type)}</p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {transaction.createdAt && format(new Date(transaction.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === "withdrawal" ? "text-red-600" : "text-green-600"}`}>
                        {transaction.type === "withdrawal" ? "-" : "+"}R$ {transaction.amount.toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhuma transação encontrada</p>
              <p className="text-sm text-gray-400 mt-2">Suas transações aparecerão aqui</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
