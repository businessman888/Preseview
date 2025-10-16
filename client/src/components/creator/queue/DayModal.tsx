import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Eye,
  Heart,
  MessageCircle,
  Gift,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeleteScheduledPost, usePublishScheduledPost, useDeleteReminder, useUpdateReminder } from "@/hooks/use-queue";
import { cn } from "@/lib/utils";
import type { ScheduledPost, Reminder, Post } from "@shared/schema";

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  scheduledPosts: ScheduledPost[];
  reminders: Reminder[];
  publishedPosts: Post[];
  onSchedulePost: () => void;
  onCreateReminder: () => void;
  onEditScheduledPost: (post: ScheduledPost) => void;
  onEditReminder: (reminder: Reminder) => void;
}

export function DayModal({
  isOpen,
  onClose,
  date,
  scheduledPosts,
  reminders,
  publishedPosts,
  onSchedulePost,
  onCreateReminder,
  onEditScheduledPost,
  onEditReminder,
}: DayModalProps) {
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [deleteReminderId, setDeleteReminderId] = useState<number | null>(null);

  const deleteScheduledPostMutation = useDeleteScheduledPost();
  const publishScheduledPostMutation = usePublishScheduledPost();
  const deleteReminderMutation = useDeleteReminder();
  const updateReminderMutation = useUpdateReminder();

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleToggleReminderComplete = async (reminder: Reminder) => {
    await updateReminderMutation.mutateAsync({
      id: reminder.id,
      data: { isCompleted: !reminder.isCompleted }
    });
  };

  const handlePublishPost = async (postId: number) => {
    await publishScheduledPostMutation.mutateAsync(postId);
  };

  const handleDeletePost = async () => {
    if (deletePostId) {
      await deleteScheduledPostMutation.mutateAsync(deletePostId);
      setDeletePostId(null);
    }
  };

  const handleDeleteReminder = async () => {
    if (deleteReminderId) {
      await deleteReminderMutation.mutateAsync(deleteReminderId);
      setDeleteReminderId(null);
    }
  };

  const formatStats = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!date) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {formatDate(date)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Scheduled Posts */}
            {scheduledPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Posts Agendados ({scheduledPosts.length})
                </h3>
                <div className="space-y-3">
                  {scheduledPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-pink-500" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {formatTime(post.scheduledDate)}
                            </span>
                            <Badge variant="secondary" className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
                              Agendado
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {post.content}
                          </p>
                          {post.mediaUrls && post.mediaUrls.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {post.mediaUrls.slice(0, 3).map((url, index) => (
                                <img
                                  key={index}
                                  src={url}
                                  alt=""
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              ))}
                              {post.mediaUrls.length > 3 && (
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{post.mediaUrls.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePublishPost(post.id)}
                          disabled={publishScheduledPostMutation.isPending}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Publicar Agora
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditScheduledPost(post)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeletePostId(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reminders */}
            {reminders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Lembretes ({reminders.length})
                </h3>
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={cn(
                        "p-4 border rounded-lg",
                        reminder.isCompleted
                          ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleReminderComplete(reminder)}
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5",
                            reminder.isCompleted
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 dark:border-gray-600 hover:border-green-500"
                          )}
                        >
                          {reminder.isCompleted && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {formatTime(reminder.reminderDate)}
                            </span>
                          </div>
                          <h4 className={cn(
                            "font-medium mb-1",
                            reminder.isCompleted
                              ? "text-green-700 dark:text-green-300 line-through"
                              : "text-gray-900 dark:text-white"
                          )}>
                            {reminder.title}
                          </h4>
                          {reminder.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {reminder.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEditReminder(reminder)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteReminderId(reminder.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Published Posts */}
            {publishedPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Posts Publicados ({publishedPosts.length})
                </h3>
                <div className="space-y-3">
                  {publishedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                    >
                      <div className="flex gap-3">
                        {post.mediaUrls && post.mediaUrls.length > 0 && (
                          <img
                            src={post.mediaUrls[0]}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {formatTime(post.createdAt)}
                            </span>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              Publicado
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {post.content}
                          </p>
                          
                          {/* Stats */}
                          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {formatStats(post.viewsCount || 0)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {formatStats(post.likesCount || 0)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {formatStats(post.commentsCount || 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {scheduledPosts.length === 0 && reminders.length === 0 && publishedPosts.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum item neste dia
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Este dia ainda não tem posts agendados, lembretes ou posts publicados.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={onSchedulePost}
                className="flex-1"
                disabled={new Date() > date}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agendar Post
              </Button>
              <Button
                onClick={onCreateReminder}
                variant="outline"
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Lembrete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Post Confirmation */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Post Agendado</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post agendado? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteScheduledPostMutation.isPending}
            >
              {deleteScheduledPostMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Reminder Confirmation */}
      <AlertDialog open={!!deleteReminderId} onOpenChange={() => setDeleteReminderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Lembrete</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este lembrete? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReminder}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteReminderMutation.isPending}
            >
              {deleteReminderMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
