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
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [coverImage, setCoverImage] = useState(user?.coverImage || "");

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { bio: string; profileImage: string; coverImage: string }) => {
      return await apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Perfil atualizado!",
        description: "Suas alterações foram salvas com sucesso.",
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      bio,
      profileImage,
      coverImage,
    });
  };

  const handleClose = () => {
    setBio(user?.bio || "");
    setProfileImage(user?.profileImage || "");
    setCoverImage(user?.coverImage || "");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Perfil</DialogTitle>
          <DialogDescription>
            Atualize sua foto de perfil, banner e descrição
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profileImage">Foto de Perfil (URL)</Label>
            <Input
              id="profileImage"
              data-testid="input-profile-image"
              type="url"
              placeholder="https://exemplo.com/sua-foto.jpg"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Banner/Capa (URL)</Label>
            <Input
              id="coverImage"
              data-testid="input-cover-image"
              type="url"
              placeholder="https://exemplo.com/seu-banner.jpg"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Descrição</Label>
            <Textarea
              id="bio"
              data-testid="textarea-bio"
              placeholder="Conte um pouco sobre você..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.length}/300 caracteres
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              data-testid="button-cancel"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              data-testid="button-save-profile"
            >
              {updateProfileMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
