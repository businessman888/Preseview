import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, MessageCircle, Users, Shield, Lock } from "lucide-react";
import { User, CreatorProfile } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CreatorWithProfile extends User {
  creatorProfile?: CreatorProfile;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorWithProfile;
}

export function SubscriptionModal({ isOpen, onClose, creator }: SubscriptionModalProps) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'trial' | '3months' | '6months'>('3months');

  const subscribeMutation = useMutation({
    mutationFn: async (plan: { months: number; amount: number }) => {
      return await apiRequest("POST", `/api/subscriptions`, {
        creatorId: creator.id,
        months: plan.months,
        amount: plan.amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creators", creator.id] });
      toast({
        title: "Assinatura realizada!",
        description: `Agora você é assinante de ${creator.displayName}`,
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao assinar",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  const plans = [
    {
      id: 'trial',
      label: 'Teste gratuito',
      subtitle: 'por uma semana',
      price: 'Grátis',
      originalPrice: 'R$ 19,90',
      discount: null,
      months: 0,
      amount: 0,
    },
    {
      id: '3months',
      label: '3 meses',
      subtitle: 'Acesso completo',
      price: 'R$ 49,90',
      originalPrice: 'R$ 59,70',
      discount: '-16%',
      months: 3,
      amount: 49.90,
      popular: true,
    },
    {
      id: '6months',
      label: '6 meses',
      subtitle: 'Melhor oferta',
      price: 'R$ 89,90',
      originalPrice: 'R$ 119,40',
      discount: '-25%',
      months: 6,
      amount: 89.90,
    },
  ];

  const handleSubscribe = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      subscribeMutation.mutate({
        months: plan.months,
        amount: plan.amount,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white dark:bg-gray-900">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 dark:bg-gray-800 p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          data-testid="button-close-modal"
        >
          <X className="w-5 h-5" />
        </button>

        <DialogHeader className="p-6 pb-4 space-y-4">
          {/* Creator Info */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-20 h-20 border-2 border-pink-500">
              <AvatarImage src={creator.profileImage || undefined} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                {creator.displayName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {creator.displayName}
                </h3>
                {creator.isVerified && (
                  <div className="bg-pink-500 rounded-full p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {creator.creatorProfile?.subscriberCount || 0} fãs
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-sm text-gray-900 dark:text-white mb-3">
              Tenha acesso completo a:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Lock className="w-4 h-4 text-pink-500" />
                <span>Conteúdo exclusivo para assinantes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <MessageCircle className="w-4 h-4 text-pink-500" />
                <span>Mensagens ilimitadas comigo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Users className="w-4 h-4 text-pink-500" />
                <span>Acesso ao canal de assinantes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Shield className="w-4 h-4 text-pink-500" />
                <span>Cancelamento quando quiser, sem riscos</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Plans */}
        <div className="p-6 pt-2 space-y-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as any)}
              className={`w-full border-2 rounded-lg p-4 transition-all ${
                selectedPlan === plan.id
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } ${plan.popular ? 'relative' : ''}`}
              data-testid={`plan-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs px-3 py-1 rounded-full">
                  Mais popular
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {plan.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {plan.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-pink-500">
                      {plan.price}
                    </p>
                    {plan.discount && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                        {plan.discount}
                      </span>
                    )}
                  </div>
                  {plan.originalPrice !== plan.price && (
                    <p className="text-xs text-gray-400 line-through">
                      {plan.originalPrice}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Subscribe Button */}
        <div className="p-6 pt-2">
          <Button 
            onClick={handleSubscribe}
            disabled={subscribeMutation.isPending}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-6 rounded-full text-base"
            data-testid="button-subscribe"
          >
            {subscribeMutation.isPending ? "Processando..." : "Assinar agora"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
