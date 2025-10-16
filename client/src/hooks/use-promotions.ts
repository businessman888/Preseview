import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import type { SubscriptionPackage, PromotionalOffer, InsertSubscriptionPackage, InsertPromotionalOffer } from "@shared/schema";

// ===== SUBSCRIPTION PRICE =====

export function useSubscriptionPrice() {
  return useQuery({
    queryKey: ["/api/creator/subscription-price"],
    queryFn: async () => {
      const response = await fetch("/api/creator/subscription-price");
      if (!response.ok) {
        throw new Error('Erro ao buscar preço da assinatura');
      }
      const data = await response.json();
      return data.price as number;
    },
  });
}

export function useUpdateSubscriptionPrice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (price: number) => {
      const response = await fetch("/api/creator/subscription-price", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar preço da assinatura');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/subscription-price"] });
      toast({
        title: "Sucesso!",
        description: "Preço da assinatura atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar preço da assinatura.",
        variant: "destructive",
      });
    },
  });
}

// ===== FREE TRIAL SETTING =====

export function useFreeTrialSetting() {
  return useQuery({
    queryKey: ["/api/creator/free-trial-setting"],
    queryFn: async () => {
      const response = await fetch("/api/creator/free-trial-setting");
      if (!response.ok) {
        throw new Error('Erro ao buscar configuração de teste gratuito');
      }
      const data = await response.json();
      return data.allowed as boolean;
    },
  });
}

export function useUpdateFreeTrialSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (allowed: boolean) => {
      const response = await fetch("/api/creator/free-trial-setting", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allowed }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar configuração de teste gratuito');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/free-trial-setting"] });
      toast({
        title: "Sucesso!",
        description: "Configuração de teste gratuito atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar configuração de teste gratuito.",
        variant: "destructive",
      });
    },
  });
}

// ===== SUBSCRIPTION PACKAGES =====

export function useSubscriptionPackages() {
  return useQuery({
    queryKey: ["/api/creator/subscription-packages"],
    queryFn: async () => {
      const response = await fetch("/api/creator/subscription-packages");
      if (!response.ok) {
        throw new Error('Erro ao buscar pacotes de assinatura');
      }
      return response.json() as Promise<SubscriptionPackage[]>;
    },
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<InsertSubscriptionPackage, "creatorId">) => {
      const response = await fetch("/api/creator/subscription-packages", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar pacote');
      }
      
      return response.json() as Promise<SubscriptionPackage>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/subscription-packages"] });
      toast({
        title: "Sucesso!",
        description: "Pacote criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar pacote.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<InsertSubscriptionPackage, "creatorId">> }) => {
      const response = await fetch(`/api/creator/subscription-packages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar pacote');
      }
      
      return response.json() as Promise<SubscriptionPackage>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/subscription-packages"] });
      toast({
        title: "Sucesso!",
        description: "Pacote atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar pacote.",
        variant: "destructive",
      });
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/creator/subscription-packages/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao excluir pacote');
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/subscription-packages"] });
      toast({
        title: "Sucesso!",
        description: "Pacote excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir pacote.",
        variant: "destructive",
      });
    },
  });
}

export function useTogglePackage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/creator/subscription-packages/${id}/toggle`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao alterar status do pacote');
      }
      
      return response.json() as Promise<SubscriptionPackage>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/subscription-packages"] });
      toast({
        title: "Sucesso!",
        description: `Pacote ${data.isActive ? 'ativado' : 'desativado'} com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status do pacote.",
        variant: "destructive",
      });
    },
  });
}

// ===== PROMOTIONAL OFFERS =====

export function usePromotionalOffers(filters?: { isActive?: boolean }) {
  return useQuery({
    queryKey: ["/api/creator/promotional-offers", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.isActive !== undefined) {
        params.append("isActive", filters.isActive.toString());
      }
      
      const url = `/api/creator/promotional-offers${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar ofertas promocionais');
      }
      return response.json() as Promise<PromotionalOffer[]>;
    },
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<InsertPromotionalOffer, "creatorId">) => {
      const response = await fetch("/api/creator/promotional-offers", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar oferta');
      }
      
      return response.json() as Promise<PromotionalOffer>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/promotional-offers"] });
      toast({
        title: "Sucesso!",
        description: "Oferta promocional criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar oferta promocional.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<InsertPromotionalOffer, "creatorId">> }) => {
      const response = await fetch(`/api/creator/promotional-offers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar oferta');
      }
      
      return response.json() as Promise<PromotionalOffer>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/promotional-offers"] });
      toast({
        title: "Sucesso!",
        description: "Oferta promocional atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar oferta promocional.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/creator/promotional-offers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao excluir oferta');
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/promotional-offers"] });
      toast({
        title: "Sucesso!",
        description: "Oferta promocional excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir oferta promocional.",
        variant: "destructive",
      });
    },
  });
}

export function useToggleOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/creator/promotional-offers/${id}/toggle`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao alterar status da oferta');
      }
      
      return response.json() as Promise<PromotionalOffer>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/creator/promotional-offers"] });
      toast({
        title: "Sucesso!",
        description: `Oferta promocional ${data.isActive ? 'ativada' : 'desativada'} com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status da oferta promocional.",
        variant: "destructive",
      });
    },
  });
}

// ===== UTILITY FUNCTIONS =====

export function calculatePackagePrice(basePrice: number, discountPercent: number): number {
  return basePrice - (basePrice * discountPercent / 100);
}

export function calculatePackageSavings(basePrice: number, discountPercent: number, months: number): number {
  const monthlySavings = basePrice * discountPercent / 100;
  return monthlySavings * months;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function getOfferTypeLabel(offerType: string): string {
  switch (offerType) {
    case 'trial':
      return 'Teste Grátis';
    case 'discount':
      return 'Desconto';
    default:
      return offerType;
  }
}

export function getTargetAudienceLabel(audience: string): string {
  switch (audience) {
    case 'new':
      return 'Novos assinantes';
    case 'existing':
      return 'Assinantes existentes';
    case 'all':
      return 'Todos';
    default:
      return audience;
  }
}

export function isOfferExpired(endDate: Date | null): boolean {
  if (!endDate) return false;
  return new Date() > new Date(endDate);
}

export function getOfferStatus(offer: PromotionalOffer): 'active' | 'expired' | 'inactive' {
  if (!offer.isActive) return 'inactive';
  if (isOfferExpired(offer.endDate)) return 'expired';
  return 'active';
}
