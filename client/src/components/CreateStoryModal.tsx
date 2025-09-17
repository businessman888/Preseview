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
import { useStories } from "@/hooks/use-stories";
import { useAuth } from "@/hooks/use-auth";
import { Camera, Upload } from "lucide-react";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateStoryModal({ isOpen, onClose }: CreateStoryModalProps) {
  const { user } = useAuth();
  const { createStoryMutation } = useStories();
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mediaUrl.trim()) return;

    createStoryMutation.mutate({
      mediaUrl: mediaUrl.trim(),
      caption: caption.trim() || null,
    });

    // Reset form and close modal
    setMediaUrl("");
    setCaption("");
    onClose();
  };

  const handleClose = () => {
    setMediaUrl("");
    setCaption("");
    onClose();
  };

  // Only creators can create stories
  if (user?.userType !== 'creator') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera size={20} />
            Criar novo Story
          </DialogTitle>
          <DialogDescription>
            Compartilhe um momento especial com seus seguidores. Stories ficam disponíveis por 24 horas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="story-media">URL da Imagem/Vídeo *</Label>
            <Input
              id="story-media"
              data-testid="input-story-media"
              type="url"
              placeholder="https://exemplo.com/sua-imagem.jpg"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
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
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">
              {caption.length}/200 caracteres
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
              disabled={!mediaUrl.trim() || createStoryMutation.isPending}
              data-testid="button-create-story"
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
      </DialogContent>
    </Dialog>
  );
}