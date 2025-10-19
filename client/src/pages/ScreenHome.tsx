import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { StoriesBar } from "@/components/StoriesBar";
import { StoryViewer } from "@/components/StoryViewer";
import { AddContentModal } from "@/components/AddContentModal";
import { PostCard } from "@/components/PostCard";
import { SuggestedCreators } from "@/components/SuggestedCreators";
import { UserLayout } from "@/components/user/UserLayout";
import { Post, User as UserType, Story } from "@shared/schema";

interface PostWithCreator extends Post {
  creator: UserType;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface StoryWithCreator extends Story {
  creator: UserType;
  isViewed: boolean;
}

export const ScreenHome = (): JSX.Element => {
  const [selectedStories, setSelectedStories] = useState<StoryWithCreator[]>([]);
  const [storyStartIndex, setStoryStartIndex] = useState(0);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data: posts = [], isLoading: isLoadingPosts } = useQuery<PostWithCreator[]>({
    queryKey: ["/api/posts/feed"],
    enabled: !!user && !isAuthLoading,
  });

  const handleViewStory = (stories: StoryWithCreator[], startIndex: number) => {
    setSelectedStories(stories);
    setStoryStartIndex(startIndex);
    setIsStoryViewerOpen(true);
  };

  return (
    <UserLayout>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black pb-20 md:pb-0">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              FanConnect
            </h1>
            <Link href="/search">
              <Button variant="ghost" size="icon" className="h-10 w-10" data-testid="button-search">
                <Search className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </Button>
            </Link>
          </div>
        </header>

        <StoriesBar
          onAddStory={() => setIsAddContentModalOpen(true)}
          onViewStory={handleViewStory}
          showAddButton={user?.userType === 'creator'}
        />

        <SuggestedCreators />

        <main className="max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
          {isLoadingPosts ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Nenhum post ainda. Siga criadores para ver o conteúdo deles!
              </p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </main>

        {isStoryViewerOpen && (
          <StoryViewer
            stories={selectedStories}
            initialStoryIndex={storyStartIndex}
            isOpen={isStoryViewerOpen}
            onClose={() => setIsStoryViewerOpen(false)}
          />
        )}

        {user?.userType === 'creator' && (
          <AddContentModal
            open={isAddContentModalOpen}
            onClose={() => setIsAddContentModalOpen(false)}
          />
        )}
      </div>
    </UserLayout>
  );
};
