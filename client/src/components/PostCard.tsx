import { useState } from "react";
import { Post, User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MessageCircle, Bookmark, DollarSign, UserPlus, Send } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/subscriptions", {
        creatorId: post.creatorId,
        amount: 9.99,
      });
    },
    onSuccess: () => {
      toast({ title: "Assinatura realizada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
    },
  });

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
    <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 p-4 space-y-4" data-testid={`post-${post.id}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.creator.profileImage || undefined} />
            <AvatarFallback>{post.creator.displayName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{post.creator.displayName}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => subscribeMutation.mutate()}
          disabled={subscribeMutation.isPending}
          data-testid={`button-subscribe-${post.id}`}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Assinar
        </Button>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
      </div>

      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Post media ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
              data-testid={`post-media-${post.id}-${index}`}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t dark:border-gray-800">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => likeMutation.mutate()}
            className={post.isLiked ? "text-pink-500" : ""}
            data-testid={`button-like-${post.id}`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
            <span className="ml-1">{post.likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            data-testid={`button-comments-${post.id}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="ml-1">{post.commentsCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => bookmarkMutation.mutate()}
            className={post.isBookmarked ? "text-blue-500" : ""}
            data-testid={`button-bookmark-${post.id}`}
          >
            <Bookmark className={`w-5 h-5 ${post.isBookmarked ? "fill-current" : ""}`} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTipDialog(true)}
            data-testid={`button-tip-${post.id}`}
          >
            <DollarSign className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {showComments && (
        <div className="space-y-3 pt-3 border-t dark:border-gray-800" data-testid={`comments-section-${post.id}`}>
          <div className="flex gap-2">
            <Input
              placeholder="Adicione um comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendComment()}
              data-testid={`input-comment-${post.id}`}
            />
            <Button onClick={handleSendComment} disabled={commentMutation.isPending} data-testid={`button-send-comment-${post.id}`}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2" data-testid={`comment-${comment.id}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.profileImage || undefined} />
                  <AvatarFallback>{comment.user.displayName[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                  <p className="font-semibold text-sm">{comment.user.displayName}</p>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
        <DialogContent data-testid={`dialog-tip-${post.id}`}>
          <DialogHeader>
            <DialogTitle>Enviar Presente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Valor (R$)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                data-testid={`input-tip-amount-${post.id}`}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mensagem (opcional)</label>
              <Input
                placeholder="Adicione uma mensagem..."
                value={tipMessage}
                onChange={(e) => setTipMessage(e.target.value)}
                data-testid={`input-tip-message-${post.id}`}
              />
            </div>
            <Button
              onClick={handleSendTip}
              disabled={!tipAmount || tipMutation.isPending}
              className="w-full"
              data-testid={`button-send-tip-${post.id}`}
            >
              Enviar R$ {tipAmount || "0.00"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
