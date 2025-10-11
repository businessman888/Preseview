import { useState } from "react";
import { Link } from "wouter";
import { Post, User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Bookmark, DollarSign, MoreVertical, Send } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TipModal } from "./TipModal";

interface PostWithCreator extends Post {
  creator: User;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  user: User;
}

interface PostCardProps {
  post: PostWithCreator;
}

export function PostCard({ post }: PostCardProps) {
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/posts", post.id, "comments"],
    enabled: showComments,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/posts/${post.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/posts/${post.id}/bookmark`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", `/api/posts/${post.id}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", post.id, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      setCommentText("");
      toast({ title: "Comentário adicionado!" });
    },
  });

  const tipMutation = useMutation({
    mutationFn: async (data: { amount: number; message?: string }) => {
      return await apiRequest("POST", "/api/tips", {
        receiverId: post.creatorId,
        postId: post.id,
        amount: data.amount,
        message: data.message,
      });
    },
    onSuccess: () => {
      toast({ title: "Presente enviado com sucesso!" });
      setShowTipDialog(false);
      setTipAmount("");
      setTipMessage("");
    },
  });

  const handleTipSuccess = () => {
    toast({ title: "Presente enviado com sucesso! 🎁" });
    queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      commentMutation.mutate(commentText);
    }
  };

  const handleSendTip = () => {
    const amount = parseFloat(tipAmount);
    if (amount > 0) {
      tipMutation.mutate({
        amount,
        message: tipMessage || undefined,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 overflow-hidden max-w-lg mx-auto" data-testid={`post-${post.id}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link href={`/creator/${post.creatorId}`}>
          <div className="flex items-center gap-3 cursor-pointer" data-testid={`link-creator-${post.creatorId}`}>
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.creator.profileImage || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                {post.creator.displayName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white hover:text-pink-500 transition-colors">
                {post.creator.displayName}
              </p>
              <p className="text-sm text-pink-500">
                @{post.creator.username}
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
          </p>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Image */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="w-full">
          <img
            src={post.mediaUrls[0]}
            alt={post.title}
            className="w-full h-auto object-cover"
            data-testid={`post-media-${post.id}-0`}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => likeMutation.mutate()}
              className={`h-12 w-12 hover:bg-transparent ${post.isLiked ? "text-pink-500" : "text-gray-600"}`}
              data-testid={`button-like-${post.id}`}
            >
              <Heart className={`w-7 h-7 ${post.isLiked ? "fill-current" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowComments(!showComments)}
              className="h-12 w-12 hover:bg-transparent text-gray-600"
              data-testid={`button-comments-${post.id}`}
            >
              <MessageCircle className="w-7 h-7" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTipDialog(true)}
              className="h-12 w-12 hover:bg-transparent text-gray-600"
              data-testid={`button-tip-${post.id}`}
            >
              <DollarSign className="w-7 h-7" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => bookmarkMutation.mutate()}
            className={`h-12 w-12 hover:bg-transparent ${post.isBookmarked ? "text-pink-500" : "text-gray-600"}`}
            data-testid={`button-bookmark-${post.id}`}
          >
            <Bookmark className={`w-7 h-7 ${post.isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <button 
            onClick={() => likeMutation.mutate()}
            className="font-semibold hover:underline"
            data-testid={`text-likes-${post.id}`}
          >
            {post.likesCount} curtidas
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="font-semibold hover:underline"
            data-testid={`text-comments-${post.id}`}
          >
            {post.commentsCount} comentários
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 space-y-3 border-t dark:border-gray-800 pt-3" data-testid={`comments-section-${post.id}`}>
          <div className="flex gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Input
              placeholder="Adicione um comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendComment()}
              className="flex-1"
              data-testid={`input-comment-${post.id}`}
            />
            <Button 
              onClick={handleSendComment} 
              disabled={commentMutation.isPending}
              size="icon"
              data-testid={`button-send-comment-${post.id}`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2" data-testid={`comment-${comment.id}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.profileImage || undefined} />
                  <AvatarFallback>{comment.user.displayName[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{comment.user.displayName}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-3">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tip Modal */}
      <TipModal
        isOpen={showTipDialog}
        onClose={() => setShowTipDialog(false)}
        creator={post.creator}
        onSuccess={handleTipSuccess}
      />
    </div>
  );
}
