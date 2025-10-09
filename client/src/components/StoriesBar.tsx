import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Story, User } from "@shared/schema";

interface StoryWithCreator extends Story {
  creator: User;
  isViewed: boolean;
}

interface StoriesBarProps {
  onAddStory: () => void;
  onViewStory: (stories: StoryWithCreator[], startIndex: number) => void;
}

export function StoriesBar({ onAddStory, onViewStory }: StoriesBarProps) {
  const { data: stories = [], isLoading } = useQuery<StoryWithCreator[]>({
    queryKey: ["/api/stories"],
  });

  const groupedStories = stories.reduce((acc, story) => {
    const creatorId = story.creatorId;
    if (!acc[creatorId]) {
      acc[creatorId] = {
        creator: story.creator,
        stories: [],
        hasUnviewed: false,
      };
    }
    acc[creatorId].stories.push(story);
    if (!story.isViewed) {
      acc[creatorId].hasUnviewed = true;
    }
    return acc;
  }, {} as Record<number, { creator: User; stories: StoryWithCreator[]; hasUnviewed: boolean }>);

  const storyGroups = Object.values(groupedStories);

  if (isLoading) {
    return (
      <div className="flex gap-3 p-4 overflow-x-auto scrollbar-hide" data-testid="stories-bar-loading">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 p-4 overflow-x-auto scrollbar-hide bg-white dark:bg-gray-900 border-b dark:border-gray-800" data-testid="stories-bar">
      <button
        onClick={onAddStory}
        className="flex flex-col items-center gap-2 flex-shrink-0"
        data-testid="button-add-story"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <span className="text-xs text-gray-700 dark:text-gray-300">Adicionar</span>
      </button>

      {storyGroups.map((group, index) => (
        <button
          key={group.creator.id}
          onClick={() => {
            const allStoriesFlat = storyGroups.flatMap(g => g.stories);
            const startIndex = storyGroups
              .slice(0, index)
              .reduce((acc, g) => acc + g.stories.length, 0);
            onViewStory(allStoriesFlat, startIndex);
          }}
          className="flex flex-col items-center gap-2 flex-shrink-0"
          data-testid={`story-${group.creator.id}`}
        >
          <div className={`p-0.5 rounded-full ${group.hasUnviewed ? 'bg-gradient-to-br from-pink-500 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className="p-0.5 bg-white dark:bg-gray-900 rounded-full">
              <Avatar className="w-14 h-14">
                <AvatarImage src={group.creator.profileImage || undefined} />
                <AvatarFallback>{group.creator.displayName[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[64px] truncate">
            {group.creator.displayName}
          </span>
        </button>
      ))}
    </div>
  );
}
