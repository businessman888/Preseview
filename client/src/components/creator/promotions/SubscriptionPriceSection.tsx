import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscriptionPrice, useUpdateSubscriptionPrice, formatCurrency } from "@/hooks/use-promotions";
import { toast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";

export function SubscriptionPriceSection() {
  const { data: currentPrice = 0, isLoading } = useSubscriptionPrice();
  const updatePriceMutation = useUpdateSubscriptionPrice();
  const [priceInput, setPriceInput] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = parseFloat(priceInput);
    
    if (isNaN(price) || price < 3.99 || price > 100.00) {
      toast({
        title: "Preço inválido",
        description: "O preço deve estar entre R$ 3,99 e R$ 100,00",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePriceMutation.mutateAsync(price);
      toast({
        title: "Preço atualizado!",
        description: "O preço da sua assinatura foi atualizado com sucesso.",
      });
      setPriceInput("");
    } catch (error) {
      toast({
        title: "Erro ao atualizar preço",
        description: "Não foi possível atualizar o preço da assinatura.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Preço por mês
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentPrice > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Preço atual:</span>
            <span className="font-semibold text-lg text-green-600 dark:text-green-400">
              {formatCurrency(currentPrice)}
            </span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Definir novo preço mensal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                R$
              </span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="3.99"
                max="100.00"
                placeholder="19.90"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="pl-8"
                disabled={updatePriceMutation.isPending}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mínimo R$ 3,99. Máximo R$ 100,00.
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={updatePriceMutation.isPending || !priceInput}
          >
            {updatePriceMutation.isPending ? "Atualizando..." : "Definir preço"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
