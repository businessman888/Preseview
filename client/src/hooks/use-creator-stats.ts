import { useQuery } from "@tanstack/react-query";
import type { CreatorStats } from "@shared/schema";

export function useCreatorStats() {
  return useQuery<CreatorStats>({
    queryKey: ["/api/creator/stats"],
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });
}

