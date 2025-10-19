import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export interface PurchasedContent {
  id: string;
  title: string;
  description?: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  purchaseDate: string;
  price: number;
  type: 'post' | 'video' | 'image' | 'album';
  isExclusive: boolean;
}

export function useUserPurchases() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    data: purchases = [],
    isLoading,
    error,
    refetch,
  } = useQuery<PurchasedContent[]>({
    queryKey: ["/api/user/purchases"],
    enabled: !!user && !isAuthLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    purchases,
    isLoading,
    error,
    refetch,
    isEmpty: purchases.length === 0,
  };
}
