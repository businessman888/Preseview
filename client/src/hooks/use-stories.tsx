import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Story, InsertStory, User } from "@shared/schema";

type StoryWithCreator = Story & { creator: User; isViewed: boolean };

export function useStories() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get active stories from followed creators
  const {
    data: activeStories = [],
    isLoading: isLoadingStories,
    error: storiesError
  } = useQuery<StoryWithCreator[]>({
    queryKey: ["/api/stories"],
    refetchInterval: 60000, // Refresh every minute to get new stories
  });

  // Create a new story
  const createStoryMutation = useMutation({
    mutationFn: async (storyData: Omit<InsertStory, "creatorId" | "expiresAt">) => {
      const res = await apiRequest("POST", "/api/stories", storyData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      toast({
        title: "Story publicado!",
        description: "Seu story foi publicado com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao publicar story",
        description: error.message || "Falha ao publicar o story",
        variant: "destructive",
      });
    },
  });

  // View a story (mark as viewed)
  const viewStoryMutation = useMutation({
    mutationFn: async (storyId: number) => {
      const res = await apiRequest("POST", `/api/stories/${storyId}/view`);
      return res;
    },
    onSuccess: (_, storyId) => {
      // Update the cache to mark story as viewed
      queryClient.setQueryData<StoryWithCreator[]>(["/api/stories"], (old) => {
        if (!old) return [];
        return old.map(story => 
          story.id === storyId 
            ? { ...story, isViewed: true }
            : story
        );
      });
    },
    onError: (error: Error) => {
      console.error("Error viewing story:", error);
    },
  });

  // Get stories from a specific creator
  const useCreatorStories = (creatorId: number) => {
    return useQuery<Story[]>({
      queryKey: ["/api/stories/creator", creatorId],
      enabled: !!creatorId,
    });
  };

  return {
    activeStories,
    isLoadingStories,
    storiesError,
    createStoryMutation,
    viewStoryMutation,
    useCreatorStories,
  };
}