import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import type { 
  PaidMediaLink, 
  InsertPaidMediaLink, 
  PaidMediaPurchase, 
  InsertPaidMediaPurchase 
} from "@shared/schema";

// ===== QUERIES =====

// Buscar links de mídia paga do criador
export function usePaidMediaLinks(filters?: { isActive?: boolean }) {
  return useQuery({
    queryKey: ["paid-media-links", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }
      
      const response = await fetch(`/api/creator/paid-links?${params}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar links de mídia paga');
      }
      return response.json() as Promise<PaidMediaLink[]>;
    },
  });
}

// Buscar preview de link público
export function usePaidLinkPreview(slug: string) {
  return useQuery({
    queryKey: ["paid-link-preview", slug],
    queryFn: async () => {
      const response = await fetch(`/api/paid-link/${slug}`);
      if (!response.ok) {
        throw new Error('Link não encontrado');
      }
      return response.json() as Promise<PaidMediaLink & { creator: any }>;
    },
    enabled: !!slug,
  });
}

// Verificar acesso com token
export function useVerifyPurchase(slug: string, token: string) {
  return useQuery({
    queryKey: ["verify-purchase", slug, token],
    queryFn: async () => {
      const response = await fetch(`/api/paid-link/${slug}/verify/${token}`);
      if (!response.ok) {
        throw new Error('Token inválido ou expirado');
      }
      return response.json() as Promise<PaidMediaLink & { creator: any }>;
    },
    enabled: !!slug && !!token,
  });
}

// Buscar estatísticas de um link
export function useLinkStats(linkId: number) {
  return useQuery({
    queryKey: ["link-stats", linkId],
    queryFn: async () => {
      const response = await fetch(`/api/creator/paid-links/${linkId}/stats`);
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas');
      }
      return response.json() as Promise<{
        totalPurchases: number;
        totalRevenue: number;
        recentPurchases: PaidMediaPurchase[];
        averagePrice: number;
      }>;
    },
    enabled: !!linkId,
  });
}

// ===== MUTATIONS =====

// Criar novo link
export function useCreatePaidMediaLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (linkData: Partial<InsertPaidMediaLink>) => {
      const response = await fetch('/api/creator/paid-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar link');
      }
      
      return response.json() as Promise<PaidMediaLink>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid-media-links"] });
      toast({
        title: "Sucesso!",
        description: "Link de mídia paga criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar link de mídia paga.",
        variant: "destructive",
      });
    },
  });
}

// Atualizar link
export function useUpdatePaidMediaLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPaidMediaLink> }) => {
      const response = await fetch(`/api/creator/paid-links/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar link');
      }
      
      return response.json() as Promise<PaidMediaLink>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid-media-links"] });
      toast({
        title: "Sucesso!",
        description: "Link atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar link.",
        variant: "destructive",
      });
    },
  });
}

// Excluir link
export function useDeletePaidMediaLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/creator/paid-links/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao excluir link');
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid-media-links"] });
      toast({
        title: "Sucesso!",
        description: "Link excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir link.",
        variant: "destructive",
      });
    },
  });
}

// Ativar/desativar link
export function useTogglePaidMediaLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/creator/paid-links/${id}/toggle`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao alterar status do link');
      }
      
      return response.json() as Promise<PaidMediaLink>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paid-media-links"] });
      toast({
        title: "Sucesso!",
        description: `Link ${data.isActive ? 'ativado' : 'desativado'} com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status do link.",
        variant: "destructive",
      });
    },
  });
}

// Processar compra (placeholder)
export function usePurchasePaidLink() {
  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await fetch(`/api/paid-link/${slug}/purchase`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao processar compra');
      }
      
      return response.json() as Promise<{
        success: boolean;
        accessToken: string;
        message: string;
      }>;
    },
    onSuccess: (data) => {
      toast({
        title: "Compra realizada!",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na compra",
        description: error.message || "Erro ao processar compra.",
        variant: "destructive",
      });
    },
  });
}

// ===== UTILITÁRIOS =====

// Gerar slug único
export function generateSlug(): string {
  return Math.random().toString(36).substring(2, 11);
}

// URLs de compartilhamento social
export const getShareUrls = (link: string) => ({
  whatsapp: `https://wa.me/?text=${encodeURIComponent(link)}`,
  twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
  telegram: `https://t.me/share/url?url=${encodeURIComponent(link)}`,
});

// Copiar para clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para clipboard:', error);
    return false;
  }
}

// Formatar preço
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

// Formatar números
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Obter ícone do tipo de mídia
export function getMediaTypeIcon(mediaType: string): string {
  switch (mediaType) {
    case 'image':
      return '🖼️';
    case 'video':
      return '🎥';
    case 'audio':
      return '🎵';
    default:
      return '📄';
  }
}

// Obter cor do tipo de mídia
export function getMediaTypeColor(mediaType: string): string {
  switch (mediaType) {
    case 'image':
      return 'bg-blue-100 text-blue-800';
    case 'video':
      return 'bg-purple-100 text-purple-800';
    case 'audio':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
