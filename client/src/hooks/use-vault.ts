import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VaultFilters {
  type?: 'all' | 'images' | 'videos' | 'audios';
  folderId?: number | null;
  search?: string;
  page?: number;
  limit?: number;
}

// Hook para buscar conteúdo do cofre
export function useVaultContent(filters: VaultFilters) {
  return useQuery({
    queryKey: ['vault-content', filters],
    queryFn: () => apiRequest('/api/creator/vault/content', { 
      method: 'GET',
      params: filters 
    }),
    staleTime: 60000, // 1 minuto
  });
}

// Hook para buscar pastas do cofre
export function useVaultFolders() {
  return useQuery({
    queryKey: ['vault-folders'],
    queryFn: () => apiRequest('/api/creator/vault/folders'),
    staleTime: 300000, // 5 minutos
  });
}

// Hook para criar pasta
export function useCreateFolder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => apiRequest('/api/creator/vault/folders', {
      method: 'POST',
      body: { name }
    }),
    onSuccess: () => {
      // Invalidate folders query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['vault-folders'] });
    }
  });
}

// Hook para mover conteúdo
export function useMoveContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contentId, folderId }: { contentId: number; folderId: number | null }) => 
      apiRequest(`/api/creator/vault/content/${contentId}/move`, {
        method: 'PATCH',
        body: { folderId }
      }),
    onSuccess: () => {
      // Invalidate vault content queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['vault-content'] });
      queryClient.invalidateQueries({ queryKey: ['vault-folders'] });
    }
  });
}

// Hook para deletar conteúdo
export function useDeleteContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contentId: number) =>
      apiRequest(`/api/creator/vault/content/${contentId}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      // Invalidate vault content queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['vault-content'] });
      queryClient.invalidateQueries({ queryKey: ['vault-folders'] });
    }
  });
}
