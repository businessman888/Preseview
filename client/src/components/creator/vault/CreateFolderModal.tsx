import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateFolder } from "@/hooks/use-vault";
import { toast } from "@/hooks/use-toast";

interface CreateFolderModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateFolderModal({ open, onClose }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const createFolderMutation = useCreateFolder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da pasta é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      await createFolderMutation.mutateAsync(folderName.trim());
      setFolderName("");
      onClose();
      toast({
        title: "Sucesso",
        description: "Pasta criada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar pasta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setFolderName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Nova Pasta</DialogTitle>
            <DialogDescription>
              Organize seu conteúdo criando uma nova pasta no cofre.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Nome da pasta</Label>
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Ex: Fotos da Praia, Receitas..."
                maxLength={50}
                autoFocus
              />
              <p className="text-xs text-gray-500">
                {folderName.length}/50 caracteres
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createFolderMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={createFolderMutation.isPending || !folderName.trim()}
            >
              {createFolderMutation.isPending ? "Criando..." : "Criar Pasta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
