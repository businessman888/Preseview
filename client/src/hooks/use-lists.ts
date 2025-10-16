import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ===== TYPES =====

export interface SubscriberList {
  id: number;
  creatorId: number;
  name: string;
  description: string | null;
  listType: 'smart' | 'custom';
  filters: string | null;
  memberCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListMember {
  id: number;
  listId: number;
  userId: number;
  addedAt: string;
  addedBy: 'auto' | 'manual';
  user: {
    id: number;
    username: string;
    display_name: string;
    profile_image: string | null;
    user_type: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
    email: string;
    password: string;
    bio: string | null;
    cover_image: string | null;
  };
}

export interface ListMembersResponse {
  members: ListMember[];
  totalCount: number;
  totalPages: number;
}

export interface CreateListData {
  name: string;
  description?: string;
  listType: 'smart' | 'custom';
  filters?: any;
}

export interface UpdateListData {
  name?: string;
  description?: string;
  filters?: any;
}

export interface SmartListFilters {
  subscriptionStatus?: 'active' | 'expired' | 'cancelled';
  relationshipType?: 'subscriber' | 'follower' | 'both';
  autoRenewal?: 'auto_renewing' | 'non_renewing';
  spending?: {
    type: 'spent_more_than' | 'purchased_paid_media' | 'sent_tips';
    value?: number;
  };
  period?: 'new_subscribers' | 'long_term' | 'this_month';
}

export interface SmartListPreview {
  memberCount: number;
  preview: Array<{
    id: number;
    username: string;
    display_name: string;
    profile_image: string | null;
  }>;
}

export interface SendMessageResult {
  sentCount: number;
  failedCount: number;
  messageIds: number[];
}

// ===== QUERIES =====

// Buscar todas as listas do criador
export function useSubscriberLists(filters?: { listType?: 'smart' | 'custom', isActive?: boolean }) {
  return useQuery({
    queryKey: ['subscriber-lists', filters],
    queryFn: async (): Promise<SubscriberList[]> => {
      const params = new URLSearchParams();
      if (filters?.listType) params.append('listType', filters.listType);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/api/creator/lists?${queryString}` : '/api/creator/lists';
      
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Erro ao buscar listas');
      }
      return response.json();
    },
  });
}

// Buscar detalhes de uma lista específica
export function useListDetails(listId: number) {
  return useQuery({
    queryKey: ['subscriber-list', listId],
    queryFn: async (): Promise<SubscriberList> => {
      const response = await fetch(`/api/creator/lists/${listId}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Erro ao buscar lista');
      }
      return response.json();
    },
    enabled: !!listId,
  });
}

// Buscar membros de uma lista (paginado)
export function useListMembers(listId: number, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['list-members', listId, page, limit],
    queryFn: async (): Promise<ListMembersResponse> => {
      const response = await fetch(`/api/creator/lists/${listId}/members?page=${page}&limit=${limit}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Erro ao buscar membros da lista');
      }
      return response.json();
    },
    enabled: !!listId,
  });
}

// Preview de lista inteligente
export function useSmartListPreview(filters: SmartListFilters) {
  return useQuery({
    queryKey: ['smart-list-preview', filters],
    queryFn: async (): Promise<SmartListPreview> => {
      const response = await fetch('/api/creator/lists/preview-smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ filters }),
      });
      if (!response.ok) {
        throw new Error('Erro ao gerar preview da lista');
      }
      return response.json();
    },
    enabled: Object.keys(filters).length > 0,
  });
}

// ===== MUTATIONS =====

// Criar nova lista
export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateListData): Promise<SubscriberList> => {
      const response = await fetch('/api/creator/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Erro ao criar lista');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['subscriber-lists'] });
    },
  });
}

// Atualizar lista existente
export function useUpdateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, data }: { listId: number; data: UpdateListData }): Promise<SubscriberList> => {
      const response = await fetch(`/api/creator/lists/${listId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar lista');
      }
      return response.json();
    },
    onSuccess: (_, { listId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['subscriber-lists'] });
      queryClient.invalidateQueries({ queryKey: ['subscriber-list', listId] });
    },
  });
}

// Excluir lista
export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listId: number): Promise<void> => {
      const response = await fetch(`/api/creator/lists/${listId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir lista');
      }
      return;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['subscriber-lists'] });
    },
  });
}

// Ativar/desativar lista
export function useToggleList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listId: number): Promise<SubscriberList> => {
      const response = await fetch(`/api/creator/lists/${listId}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erro ao alterar status da lista');
      }
      return response.json();
    },
    onSuccess: (_, listId) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['subscriber-lists'] });
      queryClient.invalidateQueries({ queryKey: ['subscriber-list', listId] });
    },
  });
}

// Adicionar membro à lista
export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, userId }: { listId: number; userId: number }): Promise<ListMember> => {
      const response = await fetch(`/api/creator/lists/${listId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error('Erro ao adicionar membro à lista');
      }
      return response.json();
    },
    onSuccess: (_, { listId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['list-members', listId] });
      queryClient.invalidateQueries({ queryKey: ['subscriber-list', listId] });
      queryClient.invalidateQueries({ queryKey: ['subscriber-lists'] });
    },
  });
}

// Remover membro da lista
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, userId }: { listId: number; userId: number }): Promise<void> => {
      const response = await fetch(`/api/creator/lists/${listId}/members/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erro ao remover membro da lista');
      }
      return;
    },
    onSuccess: (_, { listId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['list-members', listId] });
      queryClient.invalidateQueries({ queryKey: ['subscriber-list', listId] });
      queryClient.invalidateQueries({ queryKey: ['subscriber-lists'] });
    },
  });
}

// Adicionar múltiplos membros à lista
export function useAddMultipleMembers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, userIds }: { listId: number; userIds: number[] }): Promise<ListMember[]> => {
      const response = await fetch(`/api/creator/lists/${listId}/members/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userIds }),
      });
      if (!response.ok) {
        throw new Error('Erro ao adicionar membros à lista');
      }
      return response.json();
    },
    onSuccess: (_, { listId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['list-members', listId] });
      queryClient.invalidateQueries({ queryKey: ['subscriber-list', listId] });
      queryClient.invalidateQueries({ queryKey: ['subscriber-lists'] });
    },
  });
}

// Enviar mensagem em massa para lista
export function useSendMessageToList() {
  return useMutation({
    mutationFn: async ({ listId, message }: { listId: number; message: string }): Promise<SendMessageResult> => {
      const response = await fetch(`/api/creator/lists/${listId}/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }
      return response.json();
    },
  });
}

// ===== UTILITY HOOKS =====

// Hook para listas inteligentes pré-definidas
export function useSmartLists() {
  const smartLists = [
    {
      id: 'smart-subscribers',
      name: 'Assinantes Ativos',
      description: 'Usuários com assinatura ativa',
      filters: { subscriptionStatus: 'active' as const },
      icon: '👥'
    },
    {
      id: 'smart-followers',
      name: 'Seguidores',
      description: 'Usuários que seguem mas não assinam',
      filters: { relationshipType: 'follower' as const },
      icon: '❤️'
    },
    {
      id: 'smart-non-renewing',
      name: 'Sem Renovação Automática',
      description: 'Assinantes sem renovação automática',
      filters: { autoRenewal: 'non_renewing' as const },
      icon: '⚠️'
    },
    {
      id: 'smart-auto-renewing',
      name: 'Com Renovação Automática',
      description: 'Assinantes com renovação automática',
      filters: { autoRenewal: 'auto_renewing' as const },
      icon: '✅'
    },
    {
      id: 'smart-expired',
      name: 'Assinaturas Expiradas',
      description: 'Usuários com assinatura expirada',
      filters: { subscriptionStatus: 'expired' as const },
      icon: '⏰'
    },
    {
      id: 'smart-spenders',
      name: 'Gastaram Mais de R$50',
      description: 'Usuários que gastaram mais de R$50',
      filters: { spending: { type: 'spent_more_than' as const, value: 50 } },
      icon: '💰'
    },
    {
      id: 'smart-new-this-month',
      name: 'Novos Este Mês',
      description: 'Assinantes que se inscreveram este mês',
      filters: { period: 'this_month' as const },
      icon: '🆕'
    },
    {
      id: 'smart-long-term',
      name: 'Assinantes Fiéis',
      description: 'Assinantes há mais de 6 meses',
      filters: { period: 'long_term' as const },
      icon: '⭐'
    }
  ];

  return smartLists;
}

// Hook para buscar usuários elegíveis para adicionar à lista
export function useEligibleUsers(creatorId: number, searchTerm?: string) {
  return useQuery({
    queryKey: ['eligible-users', creatorId, searchTerm],
    queryFn: async () => {
      // Esta funcionalidade pode ser implementada futuramente
      // Por enquanto, retorna uma lista vazia
      return [];
    },
    enabled: false, // Desabilitado até implementar a API
  });
}
