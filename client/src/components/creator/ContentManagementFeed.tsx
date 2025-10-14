import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { PostCard } from "@/components/PostCard";
import { Post, User } from "@shared/schema";

interface PostWithCreator extends Post {
  creator: User;
  isLiked: boolean;
  isBookmarked: boolean;
}

export function ContentManagementFeed() {
  const { user } = useAuth();
  
  const { data: posts = [], isLoading } = useQuery<PostWithCreator[]>({
    queryKey: [`/api/creators/${user?.id}/posts`],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-4 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Você ainda não publicou nenhum conteúdo
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Comece criando seu primeiro post!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

