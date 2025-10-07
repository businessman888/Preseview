import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Upload, Image as ImageIcon, Video, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("post");
  
  // Post fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [currentMediaUrl, setCurrentMediaUrl] = useState("");
  const [tags, setTags] = useState("");
  const [isExclusive, setIsExclusive] = useState(false);
  
  // Story fields
  const [storyMediaUrl, setStoryMediaUrl] = useState("");
  const [storyCaption, setStoryCaption] = useState("");

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar post");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post criado!",
        description: "Seu post foi publicado com sucesso.",
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createStoryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar story");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast({
        title: "Story criado!",
        description: "Seu story foi publicado com sucesso.",
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar story",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddMediaUrl = () => {
    if (currentMediaUrl.trim()) {
      setMediaUrls([...mediaUrls, currentMediaUrl.trim()]);
      setCurrentMediaUrl("");
    }
  };

  const handleRemoveMediaUrl = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;

    const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);

    createPostMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      mediaUrls,
      tags: tagsArray,
      isExclusive,
    });
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storyMediaUrl.trim()) return;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    createStoryMutation.mutate({
      mediaUrl: storyMediaUrl.trim(),
      caption: storyCaption.trim() || null,
      expiresAt,
    });
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setMediaUrls([]);
    setCurrentMediaUrl("");
    setTags("");
    setIsExclusive(false);
    setStoryMediaUrl("");
    setStoryCaption("");
    setActiveTab("post");
    onClose();
  };

  // Only creators can create posts/stories
  if (user?.userType !== 'creator') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera size={20} />
            Criar novo conteúdo
          </DialogTitle>
          <DialogDescription>
            Compartilhe posts, imagens, vídeos ou stories com seus seguidores.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post" className="flex items-center gap-2">
              <FileText size={16} />
              Post / Mídia
            </TabsTrigger>
            <TabsTrigger value="story" className="flex items-center gap-2">
              <Camera size={16} />
              Story
            </TabsTrigger>
          </TabsList>

          <TabsContent value="post" className="space-y-4 mt-4">
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-title">Título *</Label>
                <Input
                  id="post-title"
                  data-testid="input-post-title"
                  placeholder="Título do seu post..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-content">Conteúdo *</Label>
                <Textarea
                  id="post-content"
                  data-testid="textarea-post-content"
                  placeholder="Escreva o conteúdo do seu post..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Imagens/Vídeos</Label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="URL da imagem ou vídeo..."
                    value={currentMediaUrl}
                    onChange={(e) => setCurrentMediaUrl(e.target.value)}
                    data-testid="input-media-url"
                  />
                  <Button
                    type="button"
                    onClick={handleAddMediaUrl}
                    variant="outline"
                    data-testid="button-add-media"
                  >
                    <Upload size={16} className="mr-2" />
                    Adicionar
                  </Button>
                </div>
                {mediaUrls.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {mediaUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                        {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <ImageIcon size={16} />
                        ) : (
                          <Video size={16} />
                        )}
                        <span className="flex-1 text-sm truncate">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMediaUrl(index)}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="post-tags"
                  data-testid="input-post-tags"
                  placeholder="Ex: moda, lifestyle, beleza"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="space-y-0.5">
                  <Label htmlFor="exclusive">Conteúdo Exclusivo</Label>
                  <p className="text-sm text-muted-foreground">
                    Apenas assinantes podem ver este post
                  </p>
                </div>
                <Switch
                  id="exclusive"
                  checked={isExclusive}
                  onCheckedChange={setIsExclusive}
                  data-testid="switch-exclusive"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  data-testid="button-cancel-post"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!title.trim() || !content.trim() || createPostMutation.isPending}
                  data-testid="button-submit-post"
                >
                  {createPostMutation.isPending ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Publicar Post
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="story" className="space-y-4 mt-4">
            <form onSubmit={handleSubmitStory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="story-media">URL da Imagem/Vídeo *</Label>
                <Input
                  id="story-media"
                  data-testid="input-story-media"
                  type="url"
                  placeholder="https://exemplo.com/sua-imagem.jpg"
                  value={storyMediaUrl}
                  onChange={(e) => setStoryMediaUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Cole o link de uma imagem ou vídeo hospedado online
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="story-caption">Legenda (opcional)</Label>
                <Textarea
                  id="story-caption"
                  data-testid="textarea-story-caption"
                  placeholder="Adicione uma legenda ao seu story..."
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {storyCaption.length}/200 caracteres
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Atenção:</strong> Stories ficam disponíveis por 24 horas e depois desaparecem automaticamente.
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  data-testid="button-cancel-story"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!storyMediaUrl.trim() || createStoryMutation.isPending}
                  data-testid="button-submit-story"
                >
                  {createStoryMutation.isPending ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Publicar Story
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
