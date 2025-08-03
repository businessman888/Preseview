import { useState } from "react";
import { useToast } from "./use-toast";

export const useInteractions = () => {
  const { toast } = useToast();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [followedCreators, setFollowedCreators] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
      toast({
        description: "Curtida removida",
        duration: 2000,
      });
    } else {
      newLikedPosts.add(postId);
      toast({
        description: "Post curtido! ❤️",
        duration: 2000,
      });
    }
    setLikedPosts(newLikedPosts);
  };

  const toggleBookmark = (postId: string) => {
    const newBookmarkedPosts = new Set(bookmarkedPosts);
    if (newBookmarkedPosts.has(postId)) {
      newBookmarkedPosts.delete(postId);
      toast({
        description: "Removido dos salvos",
        duration: 2000,
      });
    } else {
      newBookmarkedPosts.add(postId);
      toast({
        description: "Post salvo! 📌",
        duration: 2000,
      });
    }
    setBookmarkedPosts(newBookmarkedPosts);
  };

  const toggleFollow = (creatorId: string, creatorName: string) => {
    const newFollowedCreators = new Set(followedCreators);
    if (newFollowedCreators.has(creatorId)) {
      newFollowedCreators.delete(creatorId);
      toast({
        description: `Você parou de seguir ${creatorName}`,
        duration: 2000,
      });
    } else {
      newFollowedCreators.add(creatorId);
      toast({
        description: `Agora você segue ${creatorName}! 🎉`,
        duration: 2000,
      });
    }
    setFollowedCreators(newFollowedCreators);
  };

  const handleComment = (postId: string) => {
    toast({
      description: "Comentários em breve! 💬",
      duration: 2000,
    });
  };

  const handleTip = (postId: string) => {
    toast({
      description: "Sistema de gorjetas em desenvolvimento! 💰",
      duration: 2000,
    });
  };

  return {
    likedPosts,
    bookmarkedPosts,
    followedCreators,
    toggleLike,
    toggleBookmark,
    toggleFollow,
    handleComment,
    handleTip,
  };
};