import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Hook para earnings
export function useEarnings({ period, type }: { period: string; type: string }) {
  return useQuery({
    queryKey: ['creator-earnings', period, type],
    queryFn: () => apiRequest(`/api/creator/earnings?period=${period}&type=${type}`),
    refetchInterval: 30000, // 30 segundos
    staleTime: 10000, // 10 segundos
  });
}

// Hook para top spenders
export function useTopSpenders() {
  return useQuery({
    queryKey: ['creator-top-spenders'],
    queryFn: () => apiRequest('/api/creator/top-spenders?limit=10'),
    staleTime: 60000, // 1 minuto
  });
}

// Hook para transações recentes
export function useRecentTransactions() {
  return useQuery({
    queryKey: ['creator-transactions'],
    queryFn: () => apiRequest('/api/creator/transactions?limit=20&type=recent'),
    refetchInterval: 10000, // 10 segundos para "Ao vivo"
    staleTime: 5000, // 5 segundos
  });
}

// Hook para ganhos mensais
export function useMonthlyEarnings(year: number = new Date().getFullYear()) {
  return useQuery({
    queryKey: ['creator-monthly-earnings', year],
    queryFn: () => apiRequest(`/api/creator/monthly-earnings?year=${year}`),
    staleTime: 300000, // 5 minutos
  });
}

// Hook para estatísticas de assinantes
export function useSubscribersStats(period: string = 'all') {
  return useQuery({
    queryKey: ['creator-subscribers-stats', period],
    queryFn: () => apiRequest(`/api/creator/subscribers-stats?period=${period}`),
    refetchInterval: 60000, // 1 minuto
    staleTime: 30000, // 30 segundos
  });
}

// Hook para estatísticas de conteúdo
export function useContentStats(period: string = 'all') {
  return useQuery({
    queryKey: ['creator-content-stats', period],
    queryFn: () => apiRequest(`/api/creator/content-stats?period=${period}`),
    refetchInterval: 60000, // 1 minuto
    staleTime: 30000, // 30 segundos
  });
}

// Hook para lista de assinantes
export function useSubscribersList(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['creator-subscribers-list', page, limit],
    queryFn: () => apiRequest(`/api/creator/subscribers-list?page=${page}&limit=${limit}`),
    staleTime: 60000, // 1 minuto
  });
}
