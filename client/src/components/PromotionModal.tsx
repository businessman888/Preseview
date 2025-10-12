import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Percent, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreatorProfile {
  subscriptionPrice: number;
  description?: string;
}

export function PromotionModal({ isOpen, onClose }: PromotionModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: creatorProfile, isLoading } = useQuery<CreatorProfile>({
    queryKey: ["/api/creator/profile"],
    enabled: isOpen && user?.userType === "creator",
  });

  const [subscriptionPrice, setSubscriptionPrice] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [discountDuration, setDiscountDuration] = useState<string>("30");

  const updatePriceMutation = useMutation({
    mutationFn: async (data: { subscriptionPrice: number }) => {
      return await apiRequest("/api/creator/subscription-price", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/profile"] });
      toast({
        title: "Preço atualizado!",
        description: "O preço da sua assinatura foi atualizado com sucesso.",
      });
      setSubscriptionPrice("");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar preço",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(subscriptionPrice);
    if (isNaN(price) || price < 0) {
      toast({
        title: "Preço inválido",
        description: "Por favor, insira um valor válido.",
        variant: "destructive",
      });
      return;
    }
    updatePriceMutation.mutate({ subscriptionPrice: price });
  };

  const calculateDiscountedPrice = () => {
    const price = creatorProfile?.subscriptionPrice || 0;
    const discount = parseFloat(discountPercent) || 0;
    return price - (price * discount / 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Promotion Settings</DialogTitle>
          <DialogDescription>
            Gerencie o preço da sua assinatura e configure promoções
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Price Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Preço Atual da Assinatura
                </CardTitle>
                <CardDescription>
                  Este é o valor mensal que seus assinantes pagam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  R$ {creatorProfile?.subscriptionPrice?.toFixed(2) || '0.00'}
                  <span className="text-sm font-normal text-muted-foreground">/mês</span>
                </div>
              </CardContent>
            </Card>

            {/* Update Price Form */}
            <Card>
              <CardHeader>
                <CardTitle>Atualizar Preço de Assinatura</CardTitle>
                <CardDescription>
                  Defina um novo valor para suas assinaturas mensais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePrice} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="newPrice">Novo Preço (R$)</Label>
                      <Input
                        id="newPrice"
                        data-testid="input-subscription-price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="29.90"
                        value={subscriptionPrice}
                        onChange={(e) => setSubscriptionPrice(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="submit"
                        disabled={updatePriceMutation.isPending || !subscriptionPrice}
                        data-testid="button-update-price"
                      >
                        {updatePriceMutation.isPending ? "Atualizando..." : "Atualizar Preço"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Promotional Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Calculadora de Promoção
                </CardTitle>
                <CardDescription>
                  Simule descontos para suas assinaturas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount">Desconto (%)</Label>
                    <Input
                      id="discount"
                      data-testid="input-discount-percent"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="20"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Duração (dias)
                    </Label>
                    <Input
                      id="duration"
                      data-testid="input-discount-duration"
                      type="number"
                      min="1"
                      placeholder="30"
                      value={discountDuration}
                      onChange={(e) => setDiscountDuration(e.target.value)}
                    />
                  </div>
                </div>

                {discountPercent && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Preço com desconto:</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {calculateDiscountedPrice().toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        ({discountPercent}% off)
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Válido por {discountDuration} dias
                    </p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  💡 Nota: Esta é uma ferramenta de simulação. Para ativar promoções reais, 
                  entre em contato com o suporte.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-testid="button-close-promotion"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
