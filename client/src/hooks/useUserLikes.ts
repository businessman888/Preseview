import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export interface LikedContent {
  id: string;
  title: string;
  description?: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  likeDate: string;
  type: 'post' | 'video' | 'image' | 'album';
  isExclusive: boolean;
  likesCount: number;
  commentsCount: number;
}

export function useUserLikes() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    data: likes = [],
    isLoading,
    error,
    refetch,
  } = useQuery<LikedContent[]>({
    queryKey: ["/api/user/likes"],
    enabled: !!user && !isAuthLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    likes,
    isLoading,
    error,
    refetch,
    isEmpty: likes.length === 0,
  };
}
