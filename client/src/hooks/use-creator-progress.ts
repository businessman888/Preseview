import { useQuery } from "@tanstack/react-query";
import type { CreatorProgress } from "@shared/schema";

export function useCreatorProgress() {
  return useQuery<CreatorProgress>({
    queryKey: ["/api/creator/progress"],
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });
}

