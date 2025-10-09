import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Image, Video, Loader2 } from "lucide-react";

interface AddContentModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddContentModal({ open, onClose }: AddContentModalProps) {
  const [tab, setTab] = useState<"story" | "post">("post");
  const { toast } = useToast();

  const [storyData, setStoryData] = useState({
    mediaUrl: "",
    caption: "",
  });

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    mediaUrls: [] as string[],
    tags: [] as string[],
    isExclusive: false,
  });

  const [mediaInput, setMediaInput] = useState("");

  const createStoryMutation = useMutation({
    mutationFn: async (data: typeof storyData) => {
      return await apiRequest("POST", "/api/stories", data);
    },
    onSuccess: () => {
      toast({ title: "Story publicado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      resetForms();
      onClose();
    },
    onError: () => {
      toast({ title: "Erro ao publicar story", variant: "destructive" });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: typeof postData) => {
      return await apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      toast({ title: "Post publicado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      resetForms();
      onClose();
    },
    onError: () => {
      toast({ title: "Erro ao publicar post", variant: "destructive" });
    },
  });

  const resetForms = () => {
    setStoryData({ mediaUrl: "", caption: "" });
    setPostData({ title: "", content: "", mediaUrls: [], tags: [], isExclusive: false });
    setMediaInput("");
  };

  const handleAddMedia = () => {
    if (mediaInput.trim() && !postData.mediaUrls.includes(mediaInput.trim())) {
      setPostData(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, mediaInput.trim()],
      }));
      setMediaInput("");
    }
  };

  const handleRemoveMedia = (index: number) => {
    setPostData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="dialog-add-content">
        <DialogHeader>
          <DialogTitle>Adicionar Conteúdo</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "story" | "post")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post" data-testid="tab-post">Post</TabsTrigger>
            <TabsTrigger value="story" data-testid="tab-story">Story</TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="story-media">URL da Mídia (Foto ou Vídeo)</Label>
              <Input
                id="story-media"
                placeholder="https://exemplo.com/imagem.jpg"
                value={storyData.mediaUrl}
                onChange={(e) => setStoryData(prev => ({ ...prev, mediaUrl: e.target.value }))}
                data-testid="input-story-media"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="story-caption">Legenda (opcional)</Label>
              <Textarea
                id="story-caption"
                placeholder="Adicione uma legenda..."
                value={storyData.caption}
                onChange={(e) => setStoryData(prev => ({ ...prev, caption: e.target.value }))}
                rows={3}
                data-testid="input-story-caption"
              />
            </div>

            <Button
              onClick={() => createStoryMutation.mutate(storyData)}
              disabled={!storyData.mediaUrl || createStoryMutation.isPending}
              className="w-full"
              data-testid="button-publish-story"
            >
              {createStoryMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                "Publicar Story"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">Título</Label>
              <Input
                id="post-title"
                placeholder="Título do post"
                value={postData.title}
                onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                data-testid="input-post-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-content">Conteúdo</Label>
              <Textarea
                id="post-content"
                placeholder="O que você quer compartilhar?"
                value={postData.content}
                onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                rows={5}
                data-testid="input-post-content"
              />
            </div>

            <div className="space-y-2">
              <Label>Mídia (Fotos/Vídeos)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Cole a URL da mídia"
                  value={mediaInput}
                  onChange={(e) => setMediaInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddMedia()}
                  data-testid="input-post-media"
                />
                <Button onClick={handleAddMedia} variant="outline" data-testid="button-add-media">
                  Adicionar
                </Button>
              </div>
              {postData.mediaUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {postData.mediaUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Mídia ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-remove-media-${index}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="exclusive"
                checked={postData.isExclusive}
                onCheckedChange={(checked) => setPostData(prev => ({ ...prev, isExclusive: checked }))}
                data-testid="switch-exclusive"
              />
              <Label htmlFor="exclusive">Conteúdo exclusivo (somente assinantes)</Label>
            </div>

            <Button
              onClick={() => createPostMutation.mutate(postData)}
              disabled={!postData.title || !postData.content || createPostMutation.isPending}
              className="w-full"
              data-testid="button-publish-post"
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                "Publicar Post"
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
