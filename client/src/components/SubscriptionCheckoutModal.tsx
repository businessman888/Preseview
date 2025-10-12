import { useState } from "react";
import { X, CreditCard, Lock, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  creator: User & { subscriptionPrice?: number };
}

type SubscriptionPlan = "trial" | "3months" | "6months";

export function SubscriptionCheckoutModal({
  open,
  onClose,
  creator,
}: SubscriptionCheckoutModalProps) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("6months");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [country, setCountry] = useState("Brazil");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const clearForm = () => {
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setCardholderName("");
    setAddress("");
    setDistrict("");
    setCity("");
    setPostalCode("");
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const subscriptionPrice = creator.subscriptionPrice || 38.46;
  
  const plans = {
    trial: {
      label: "Teste gratuito",
      subtitle: "por uma semana",
      price: 0,
      originalPrice: subscriptionPrice,
      discount: null,
      badge: "Grátis",
    },
    "3months": {
      label: "3 meses",
      subtitle: "Acesso completo",
      price: subscriptionPrice * 0.9,
      originalPrice: subscriptionPrice,
      discount: "-10%",
      badge: "Mais popular",
    },
    "6months": {
      label: "6 meses",
      subtitle: "Melhor oferta",
      price: subscriptionPrice * 0.75,
      originalPrice: subscriptionPrice,
      discount: "-25%",
      badge: null,
    },
  };

  const selectedPlanData = plans[selectedPlan];

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/subscriptions", {
        creatorId: creator.id,
        plan: selectedPlan,
        amount: selectedPlanData.price,
        paymentMethod: {
          cardNumber: cardNumber.slice(-4),
          cardholderName,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Assinatura confirmada! 🎉",
        description: `Agora você é assinante de ${creator.displayName}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/creators"] });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Erro ao processar assinatura",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      toast({
        title: "Preencha todos os campos do cartão",
        variant: "destructive",
      });
      return;
    }
    subscribeMutation.mutate();
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)} / ${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-800 p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold">Subscrição</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
              data-testid="button-close-subscription"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 space-y-6 pb-6">
          {/* Creator Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
            <Avatar className="w-16 h-16">
              <AvatarImage src={creator.profileImage || undefined} />
              <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{creator.displayName}</h3>
              <p className="text-sm text-gray-400">{creator.username}</p>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Tenha acesso completo a:</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-pink-500 mt-0.5" />
                <p className="text-sm">Conteúdo exclusivo para assinantes</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-pink-500 mt-0.5" />
                <p className="text-sm">Mensagens ilimitadas comigo</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-pink-500 mt-0.5" />
                <p className="text-sm">Acesso ao canal de assinantes</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-pink-500 mt-0.5" />
                <p className="text-sm">Cancelamento quando quiser, sem riscos</p>
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <RadioGroup value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as SubscriptionPlan)}>
            <div className="space-y-3">
              {Object.entries(plans).map(([key, plan]) => (
                <div key={key} className="relative">
                  <label
                    htmlFor={key}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlan === key
                        ? "border-pink-500 bg-pink-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <RadioGroupItem value={key} id={key} />
                      <div>
                        <p className="font-semibold">{plan.label}</p>
                        <p className="text-xs text-gray-400">{plan.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-pink-500">
                        {plan.price === 0 ? plan.badge : `R$ ${plan.price.toFixed(2)}`}
                      </p>
                      {plan.discount && (
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400 line-through">
                            R$ {plan.originalPrice.toFixed(2)}
                          </p>
                          <span className="text-xs font-semibold text-green-500 bg-green-500/20 px-2 py-0.5 rounded">
                            {plan.discount}
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                  {plan.badge && key !== "trial" && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <span className="bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>

          {/* Payment Info */}
          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-400">Este pagamento é processado em USD</p>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span>R$ {selectedPlanData.price.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-4">
              <span>Total a pagar</span>
              <span className="text-pink-500">
                {selectedPlanData.price === 0 ? "Teste gratuito" : `R$ ${selectedPlanData.price.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
              <CreditCard className="w-5 h-5 text-pink-500" />
              <span className="font-semibold">Cartão</span>
            </div>

            <div>
              <Label htmlFor="card-info" className="text-gray-400 text-xs">
                Informações do cartão
              </Label>
              <div className="mt-2 relative">
                <Input
                  id="card-info"
                  placeholder="1234 1234 1234 1234"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white pr-16"
                  maxLength={19}
                  data-testid="input-card-number"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="MM / AA"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                  maxLength={7}
                  data-testid="input-expiry"
                />
              </div>
              <div>
                <Input
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  className="bg-gray-800 border-gray-700 text-white"
                  maxLength={3}
                  data-testid="input-cvv"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cardholder-name" className="text-gray-400 text-xs">
                Nome do titular
              </Label>
              <Input
                id="cardholder-name"
                placeholder="Nome completo no cartão"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-2"
                data-testid="input-cardholder-name"
              />
            </div>

            <div>
              <Label htmlFor="country" className="text-gray-400 text-xs">
                Morada de faturação
              </Label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full mt-2 bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                data-testid="select-country"
              >
                <option value="Brazil">Brazil</option>
                <option value="Portugal">Portugal</option>
                <option value="USA">USA</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Morada"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-address"
              />
              <Input
                placeholder="Cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-city"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Distrito"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-district"
              />
              <Input
                placeholder="Código Postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-postal-code"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubscribe}
            disabled={subscribeMutation.isPending}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-6 rounded-lg text-lg"
            data-testid="button-confirm-subscription"
          >
            {subscribeMutation.isPending ? "Processando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
