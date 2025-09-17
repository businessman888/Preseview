import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useStories } from "@/hooks/use-stories";
import { Story, User } from "@shared/schema";

type StoryWithCreator = Story & { creator: User; isViewed: boolean };

interface StoryViewerProps {
  stories: StoryWithCreator[];
  initialStoryIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function StoryViewer({ stories, initialStoryIndex, isOpen, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const { viewStoryMutation } = useStories();

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!isOpen || !currentStory) return;

    // Mark story as viewed when opened
    if (!currentStory.isViewed) {
      viewStoryMutation.mutate(currentStory.id);
    }

    // Progress timer for story viewing (5 seconds per story)
    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const increment = 100 / (duration / interval);

    setProgress(0);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Auto advance to next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isOpen, currentStory, viewStoryMutation]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  if (!isOpen || !currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded">
            <div 
              className="h-full bg-white rounded transition-all duration-100"
              style={{
                width: index < currentIndex ? '100%' : 
                       index === currentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentStory.creator.profileImage || undefined} />
            <AvatarFallback>
              {currentStory.creator.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{currentStory.creator.displayName}</p>
            <p className="text-xs text-gray-300">
              {new Date(currentStory.createdAt).toLocaleString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
              })}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10"
          data-testid="button-close-story"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Story content */}
      <div className="relative w-full h-full max-w-md mx-auto">
        <img 
          src={currentStory.mediaUrl} 
          alt="Story"
          className="w-full h-full object-cover"
          data-testid={`img-story-${currentStory.id}`}
        />
        
        {/* Caption overlay */}
        {currentStory.caption && (
          <div className="absolute bottom-20 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white text-sm">{currentStory.caption}</p>
          </div>
        )}

        {/* Navigation areas */}
        <button
          className="absolute top-0 left-0 w-1/3 h-full z-10"
          onClick={goToPrevious}
          data-testid="button-story-previous"
        />
        <button
          className="absolute top-0 right-0 w-1/3 h-full z-10"
          onClick={goToNext}
          data-testid="button-story-next"
        />
      </div>

      {/* Story info */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Eye size={16} />
          <span className="text-sm">{currentStory.viewsCount || 0}</span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            data-testid="button-story-like"
          >
            <Heart size={16} />
          </Button>
        </div>
      </div>

      {/* Navigation arrows for larger screens */}
      <div className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="text-white hover:bg-white/10"
          data-testid="button-story-nav-previous"
        >
          <ChevronLeft size={24} />
        </Button>
      </div>
      
      <div className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNext}
          disabled={currentIndex === stories.length - 1}
          className="text-white hover:bg-white/10"
          data-testid="button-story-nav-next"
        >
          <ChevronRight size={24} />
        </Button>
      </div>
    </div>
  );
}