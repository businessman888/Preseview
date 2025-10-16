import { useState, useEffect } from "react";
import { Calendar, Clock, Archive, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateScheduledPost, useUpdateScheduledPost } from "@/hooks/use-queue";
import { useVaultContent as useVaultContentHook } from "@/hooks/use-vault";
import type { ScheduledPost } from "@shared/schema";

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  scheduledPost?: ScheduledPost | null;
  onEdit?: (post: ScheduledPost) => void;
}

export function SchedulePostModal({
  isOpen,
  onClose,
  selectedDate,
  scheduledPost,
  onEdit,
}: SchedulePostModalProps) {
  const [activeTab, setActiveTab] = useState<"vault" | "new">("vault");
  const [selectedVaultItem, setSelectedVaultItem] = useState<any>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isExclusive, setIsExclusive] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const createScheduledPostMutation = useCreateScheduledPost();
  const updateScheduledPostMutation = useUpdateScheduledPost();
  
  // Fetch vault content for "Do Cofre" tab
  const { data: vaultContent } = useVaultContentHook({
    type: "all",
    folderId: null,
    search: "",
    page: 1,
    limit: 20,
  });

  const isEditing = !!scheduledPost;
  const isLoading = createScheduledPostMutation.isPending || updateScheduledPostMutation.isPending;

  // Initialize form with selected date or scheduled post data
  useEffect(() => {
    if (isOpen) {
      if (scheduledPost) {
        // Editing existing scheduled post
        setTitle(scheduledPost.title);
        setContent(scheduledPost.content);
        setMediaUrls(scheduledPost.mediaUrls || []);
        setTags(scheduledPost.tags || []);
        setIsExclusive(scheduledPost.isExclusive);
        setNotificationEnabled(scheduledPost.notificationEnabled);
        
        const date = new Date(scheduledPost.scheduledDate);
        setScheduledDate(date.toISOString().split('T')[0]);
        setScheduledTime(date.toTimeString().slice(0, 5));
      } else if (selectedDate) {
        // Creating new scheduled post
        setTitle("");
        setContent("");
        setMediaUrls([]);
        setTags([]);
        setIsExclusive(false);
        setNotificationEnabled(true);
        
        setScheduledDate(selectedDate.toISOString().split('T')[0]);
        setScheduledTime("09:00");
        setActiveTab("vault");
      }
    }
  }, [isOpen, scheduledPost, selectedDate]);

  const handleVaultItemSelect = (item: any) => {
    setSelectedVaultItem(item);
    setTitle(item.title);
    setContent(item.content);
    setMediaUrls(item.mediaUrls || []);
    setTags(item.tags || []);
    setIsExclusive(item.isExclusive || false);
    setActiveTab("new"); // Switch to new post tab to show the selected content
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    
    try {
      if (isEditing && scheduledPost) {
        const updatedPost = await updateScheduledPostMutation.mutateAsync({
          id: scheduledPost.id,
          data: {
            scheduledDate: dateTime,
            title: title.trim(),
            content: content.trim(),
            mediaUrls,
            tags,
            isExclusive,
            notificationEnabled,
          },
        });
        
        if (onEdit) {
          onEdit(updatedPost);
        }
      } else {
        await createScheduledPostMutation.mutateAsync({
          scheduledDate: dateTime,
          title: title.trim(),
          content: content.trim(),
          mediaUrls,
          tags,
          isExclusive,
          notificationEnabled,
        });
      }
      
      handleClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setMediaUrls([]);
    setTags([]);
    setIsExclusive(false);
    setScheduledDate("");
    setScheduledTime("");
    setNotificationEnabled(true);
    setSelectedVaultItem(null);
    setActiveTab("vault");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isEditing ? "Editar Post Agendado" : "Agendar Post"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "vault" | "new")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vault" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Do Cofre
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Post
            </TabsTrigger>
          </TabsList>

          {/* Do Cofre Tab */}
          <TabsContent value="vault" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Selecionar do Cofre</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Escolha um conteúdo existente do seu cofre para agendar.
              </p>
              
              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                {vaultContent?.content?.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-colors ${
                      selectedVaultItem?.id === item.id
                        ? "ring-2 ring-pink-500 bg-pink-50 dark:bg-pink-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handleVaultItemSelect(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {item.mediaUrls && item.mediaUrls.length > 0 && (
                          <img
                            src={item.mediaUrls[0]}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{item.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {item.mediaUrls && item.mediaUrls.length > 0 ? 'Mídia' : 'Texto'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.content}
                          </p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {item.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!vaultContent?.content || vaultContent.content.length === 0) && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Archive className="h-8 w-8 mx-auto mb-2" />
                    <p>Nenhum conteúdo no cofre</p>
                    <p className="text-sm">Crie conteúdo primeiro para poder agendar</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Novo Post Tab */}
          <TabsContent value="new" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Treino de pernas hoje!"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva o conteúdo do seu post..."
                  rows={4}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Media URLs */}
              <div className="space-y-2">
                <Label>URLs de Mídia (opcional)</Label>
                <div className="space-y-2">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...mediaUrls];
                          newUrls[index] = e.target.value;
                          setMediaUrls(newUrls);
                        }}
                        placeholder="https://exemplo.com/imagem.jpg"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newUrls = mediaUrls.filter((_, i) => i !== index);
                          setMediaUrls(newUrls);
                        }}
                        disabled={isLoading}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMediaUrls([...mediaUrls, ""])}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Mídia
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (opcional)</Label>
                <Input
                  id="tags"
                  value={tags.join(", ")}
                  onChange={(e) => setTags(e.target.value.split(",").map(tag => tag.trim()).filter(Boolean))}
                  placeholder="fitness, treino, motivação"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">Separe as tags com vírgulas</p>
              </div>

              {/* Exclusive Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Conteúdo Exclusivo</Label>
                  <p className="text-xs text-gray-500">Apenas para assinantes</p>
                </div>
                <Switch
                  checked={isExclusive}
                  onCheckedChange={setIsExclusive}
                  disabled={isLoading}
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Hora *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Notification Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-pink-500" />
                  <span className="text-sm font-medium">Notificar-me antes</span>
                </div>
                <Switch
                  checked={notificationEnabled}
                  onCheckedChange={setNotificationEnabled}
                  disabled={isLoading}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !title.trim() || !content.trim()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {isEditing ? "Atualizando..." : "Agendando..."}
                    </>
                  ) : (
                    isEditing ? "Atualizar" : "Agendar Post"
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
