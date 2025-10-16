import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import type { AutomaticMessage } from "@shared/schema";

// ===== QUERIES =====

// Buscar todas as mensagens automáticas do criador
export function useAutomaticMessages() {
  return useQuery({
    queryKey: ["/api/creator/automatic-messages"],
    queryFn: async () => {
      const response = await fetch("/api/creator/automatic-messages");
      if (!response.ok) {
        throw new Error('Erro ao buscar mensagens automáticas');
      }
      return response.json() as Promise<AutomaticMessage[]>;
    },
  });
}

// Buscar mensagem específica por evento
export function useAutomaticMessage(eventType: string) {
  return useQuery({
    queryKey: ["/api/creator/automatic-messages", eventType],
    queryFn: async () => {
      const response = await fetch(`/api/creator/automatic-messages/${eventType}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar mensagem automática');
      }
      return response.json() as Promise<AutomaticMessage>;
    },
    enabled: !!eventType,
  });
}

// ===== MUTATIONS =====

// Criar ou atualizar mensagem
export function useUpsertAutomaticMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventType, data }: { 
      eventType: string; 
      data: { isEnabled: boolean; messageText: string } 
    }) => {
      const response = await fetch(`/api/creator/automatic-messages/${eventType}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao salvar mensagem automática');
      }
      
      return response.json() as Promise<AutomaticMessage>;
    },
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["/api/creator/automatic-messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/creator/automatic-messages", variables.eventType] });
      
      toast({
        title: "Sucesso!",
        description: "Mensagem automática salva com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar mensagem automática.",
        variant: "destructive",
      });
    },
  });
}

// Ativar/desativar mensagem
export function useToggleAutomaticMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventType: string) => {
      const response = await fetch(`/api/creator/automatic-messages/${eventType}/toggle`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao alterar status da mensagem');
      }
      
      return response.json() as Promise<AutomaticMessage>;
    },
    onSuccess: (data, eventType) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["/api/creator/automatic-messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/creator/automatic-messages", eventType] });
      
      toast({
        title: "Sucesso!",
        description: `Mensagem ${data.isEnabled ? 'ativada' : 'desativada'} com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status da mensagem.",
        variant: "destructive",
      });
    },
  });
}

// Resetar mensagem para padrão
export function useResetAutomaticMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventType: string) => {
      const response = await fetch(`/api/creator/automatic-messages/${eventType}/reset`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao resetar mensagem');
      }
      
      return response.json() as Promise<AutomaticMessage>;
    },
    onSuccess: (data, eventType) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["/api/creator/automatic-messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/creator/automatic-messages", eventType] });
      
      toast({
        title: "Sucesso!",
        description: "Mensagem resetada para o padrão com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao resetar mensagem.",
        variant: "destructive",
      });
    },
  });
}

// ===== UTILITY FUNCTIONS =====

// Obter label do evento
export function getEventLabel(eventType: string): string {
  const labels: Record<string, string> = {
    new_subscriber: "Novo assinante",
    new_follower: "Novo seguidor", 
    subscriber_canceled: "Assinatura cancelada",
    re_subscribed: "Re-assinatura",
    subscription_renewed: "Assinatura renovada",
    new_purchase: "Nova compra",
    first_message_reply: "Primeira resposta"
  };
  
  return labels[eventType] || eventType;
}

// Obter ícone do evento
export function getEventIcon(eventType: string): string {
  const icons: Record<string, string> = {
    new_subscriber: "➕",
    new_follower: "⭐",
    subscriber_canceled: "❌",
    re_subscribed: "🔄",
    subscription_renewed: "🔁",
    new_purchase: "💰",
    first_message_reply: "💬"
  };
  
  return icons[eventType] || "📝";
}

// Obter cores do evento
export function getEventColors(eventType: string): { color: string; bgColor: string } {
  const colors: Record<string, { color: string; bgColor: string }> = {
    new_subscriber: { color: 'text-blue-600', bgColor: 'bg-blue-50' },
    new_follower: { color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    subscriber_canceled: { color: 'text-red-600', bgColor: 'bg-red-50' },
    re_subscribed: { color: 'text-green-600', bgColor: 'bg-green-50' },
    subscription_renewed: { color: 'text-purple-600', bgColor: 'bg-purple-50' },
    new_purchase: { color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    first_message_reply: { color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
  };
  
  return colors[eventType] || { color: 'text-gray-600', bgColor: 'bg-gray-50' };
}

// Substituir variáveis no texto
export function replaceVariables(text: string, variables: Record<string, string>): string {
  let result = text;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
}

// Obter variáveis disponíveis por tipo de evento
export function getAvailableVariables(eventType: string): Array<{ key: string; label: string; description: string }> {
  const allVariables = [
    { key: 'user_name', label: '{user_name}', description: 'Nome do usuário' },
    { key: 'creator_name', label: '{creator_name}', description: 'Nome do criador' },
    { key: 'subscription_price', label: '{subscription_price}', description: 'Preço da assinatura' },
    { key: 'purchase_amount', label: '{purchase_amount}', description: 'Valor da compra' },
    { key: 'renewal_date', label: '{renewal_date}', description: 'Data de renovação' },
    { key: 'date', label: '{date}', description: 'Data atual' }
  ];

  // Filtrar variáveis relevantes por evento
  const eventSpecificVariables: Record<string, string[]> = {
    new_subscriber: ['user_name', 'creator_name', 'subscription_price'],
    new_follower: ['user_name', 'creator_name'],
    subscriber_canceled: ['user_name', 'creator_name'],
    re_subscribed: ['user_name', 'creator_name', 'subscription_price'],
    subscription_renewed: ['user_name', 'creator_name', 'renewal_date'],
    new_purchase: ['user_name', 'creator_name', 'purchase_amount'],
    first_message_reply: ['user_name', 'creator_name']
  };

  const allowedKeys = eventSpecificVariables[eventType] || ['user_name', 'creator_name'];
  
  return allVariables.filter(variable => allowedKeys.includes(variable.key));
}

// Gerar preview da mensagem com dados de exemplo
export function generateMessagePreview(messageText: string, eventType: string): string {
  const exampleVariables: Record<string, string> = {
    user_name: 'João Silva',
    creator_name: 'Criador Exemplo',
    subscription_price: 'R$ 29,90',
    purchase_amount: 'R$ 15,00',
    renewal_date: '15/02/2025',
    date: new Date().toLocaleDateString('pt-BR')
  };

  const availableVariables = getAvailableVariables(eventType);
  const variablesToUse: Record<string, string> = {};
  
  availableVariables.forEach(variable => {
    if (exampleVariables[variable.key]) {
      variablesToUse[variable.key] = exampleVariables[variable.key];
    }
  });

  return replaceVariables(messageText, variablesToUse);
}

// Validar se o texto da mensagem é válido
export function validateMessageText(text: string): { isValid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: 'Mensagem não pode estar vazia' };
  }
  
  if (text.length > 500) {
    return { isValid: false, error: 'Mensagem deve ter no máximo 500 caracteres' };
  }
  
  return { isValid: true };
}
