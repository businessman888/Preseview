import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@shared/schema";

export function useCreatorPosts(creatorId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts = [], isLoading, error, refetch } = useQuery<Post[]>({
    queryKey: ["creator-posts", creatorId],
    queryFn: async () => {
      if (!creatorId) return [];
      
      const response = await fetch(`/api/posts/creator/${creatorId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao buscar posts");
      }

      return response.json();
    },
    enabled: !!creatorId,
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId, data }: { postId: number; data: Partial<Post> }) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-posts", creatorId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post atualizado!",
        description: "Seu post foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao deletar post");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-posts", creatorId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post deletado!",
        description: "Seu post foi deletado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao deletar post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Separate posts by media type
  const imagePosts = posts.filter(post => 
    post.mediaUrls && post.mediaUrls.some(url => 
      url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    )
  );

  const videoPosts = posts.filter(post => 
    post.mediaUrls && post.mediaUrls.some(url => 
      url.match(/\.(mp4|webm|ogg|mov)$/i)
    )
  );

  const allPosts = posts;

  return {
    posts: allPosts,
    imagePosts,
    videoPosts,
    isLoading,
    error,
    refetch,
    updatePost: updatePostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    isUpdating: updatePostMutation.isPending,
    isDeleting: deletePostMutation.isPending,
  };
}
