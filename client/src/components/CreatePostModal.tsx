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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Image as ImageIcon, Video, Smile, Calendar, Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [visibility, setVisibility] = useState("subscribers");
  const [caption, setCaption] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [currentMediaUrl, setCurrentMediaUrl] = useState("");

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

  const handleAddMedia = () => {
    if (currentMediaUrl.trim() && mediaUrls.length < 10) {
      setMediaUrls([...mediaUrls, currentMediaUrl.trim()]);
      setCurrentMediaUrl("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caption.trim() && mediaUrls.length === 0) {
      toast({
        title: "Post vazio",
        description: "Adicione uma legenda ou mídia ao seu post.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      title: caption.substring(0, 100) || "Novo post",
      content: caption.trim(),
      mediaUrls,
      isExclusive: visibility === "subscribers",
      tags: [],
    });
  };

  const handleClose = () => {
    setVisibility("subscribers");
    setCaption("");
    setMediaUrls([]);
    setCurrentMediaUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Criar post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visibility" className="text-sm">
              Quem pode ver a minha publicação
            </Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger id="visibility" data-testid="select-visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subscribers">Apenas subscritores</SelectItem>
                <SelectItem value="public">Público</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => {
                const url = prompt("Digite a URL da imagem/vídeo:");
                if (url && mediaUrls.length < 10) {
                  setMediaUrls([...mediaUrls, url]);
                }
              }}
              data-testid="button-upload-device"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm">Carregar do dispositivo</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => {
                toast({
                  title: "Em breve",
                  description: "Funcionalidade de cofre em desenvolvimento.",
                });
              }}
              data-testid="button-vault"
            >
              <Folder className="w-6 h-6" />
              <span className="text-sm">Adicionar do cofre</span>
            </Button>
          </div>

          {mediaUrls.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Mídias adicionadas ({mediaUrls.length}/10)</Label>
              <div className="space-y-1">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                    <ImageIcon className="w-4 h-4" />
                    <span className="flex-1 truncate">{url}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== index))}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Textarea
              id="caption"
              data-testid="textarea-caption"
              placeholder="Escreva uma legenda..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              data-testid="button-emoji"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              data-testid="button-clock"
            >
              <Calendar className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              data-testid="button-tag"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                toast({
                  title: "Em breve",
                  description: "Funcionalidade de agendamento em desenvolvimento.",
                });
              }}
              data-testid="button-schedule"
            >
              Agendar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                toast({
                  title: "Em breve",
                  description: "Funcionalidade de coleções em desenvolvimento.",
                });
              }}
              data-testid="button-add-collection"
            >
              Adicionar a coleção
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#5d5b5b] hover:bg-[#4a4848] text-white"
            disabled={createPostMutation.isPending}
            data-testid="button-create-post"
          >
            {createPostMutation.isPending ? "Publicando..." : "Criar publicação"}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Adicionar nova publicação (Máx. 10)
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
