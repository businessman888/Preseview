import { ArrowLeftIcon, PlusIcon, CreditCardIcon, TrashIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PaymentMethod } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export const WalletPaymentMethodsSection = (): JSX.Element => {
  const { toast } = useToast();

  const { data: paymentMethods, isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });

  const deleteMethodMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/payment-methods/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({
        title: "Método removido",
        description: "O método de pagamento foi removido",
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/payment-methods/${id}/default`, {
        method: "PUT",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({
        title: "Método padrão alterado",
        description: "O método de pagamento padrão foi atualizado",
      });
    },
  });

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
          Métodos de pagamento
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Saldo da carteira</CardTitle>
            <CardDescription>Seu saldo disponível</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#5d5b5b]">R$ 0,00</p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#5d5b5b]">Métodos de pagamento</h2>
          <Button size="sm" className="bg-gradient-to-r from-[#b24592] to-[#f15f79]" data-testid="button-add-method">
            <PlusIcon className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : paymentMethods && paymentMethods.length > 0 ? (
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <Card key={method.id} data-testid={`payment-method-${method.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCardIcon className="w-5 h-5 text-[#5d5b5b]" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{method.brand} •••• {method.last4}</p>
                          {method.isDefault && (
                            <Badge variant="secondary" className="text-xs">Padrão</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Expira em {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDefaultMutation.mutate(method.id)}
                          disabled={setDefaultMutation.isPending}
                          data-testid={`button-set-default-${method.id}`}
                        >
                          Tornar padrão
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMethodMutation.mutate(method.id)}
                        disabled={deleteMethodMutation.isPending}
                        data-testid={`button-delete-${method.id}`}
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum método de pagamento cadastrado</p>
              <p className="text-sm text-gray-400 mt-2">Adicione um cartão para fazer pagamentos</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
