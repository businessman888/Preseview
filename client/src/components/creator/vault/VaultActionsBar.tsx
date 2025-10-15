import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Move, Edit3, X } from "lucide-react";
import { useMoveContent, useDeleteContent } from "@/hooks/use-vault";
import { toast } from "@/hooks/use-toast";

interface VaultActionsBarProps {
  selectedIds: Set<number>;
  selectedCount: number;
  onClearSelection: () => void;
  folders: Array<{
    id: number;
    name: string;
    contentCount: number;
  }>;
}

export function VaultActionsBar({
  selectedIds,
  selectedCount,
  onClearSelection,
  folders
}: VaultActionsBarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  
  const moveContentMutation = useMoveContent();
  const deleteContentMutation = useDeleteContent();

  const handleMoveToFolder = async () => {
    if (!selectedFolderId) {
      toast({
        title: "Erro",
        description: "Selecione uma pasta",
        variant: "destructive",
      });
      return;
    }

    try {
      const folderId = selectedFolderId === "none" ? null : parseInt(selectedFolderId);
      
      // Move each selected item
      const promises = Array.from(selectedIds).map(id =>
        moveContentMutation.mutateAsync({ contentId: id, folderId })
      );
      
      await Promise.all(promises);
      
      onClearSelection();
      setShowMoveDialog(false);
      setSelectedFolderId("");
      
      toast({
        title: "Sucesso",
        description: `${selectedCount} item(ns) movido(s) com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao mover itens. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Delete each selected item
      const promises = Array.from(selectedIds).map(id =>
        deleteContentMutation.mutateAsync(id)
      );
      
      await Promise.all(promises);
      
      onClearSelection();
      setShowDeleteDialog(false);
      
      toast({
        title: "Sucesso",
        description: `${selectedCount} item(ns) excluído(s) com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir itens. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg px-4 py-3 z-50">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
          </Badge>
          
          <div className="flex items-center gap-2">
            {selectedCount === 1 && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Editar
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMoveDialog(true)}
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              Mover
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {/* Move Dialog */}
      <AlertDialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mover para Pasta</AlertDialogTitle>
            <AlertDialogDescription>
              Selecione a pasta para onde deseja mover {selectedCount} item{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma pasta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem pasta (raiz)</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id.toString()}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowMoveDialog(false);
              setSelectedFolderId("");
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleMoveToFolder}
              disabled={moveContentMutation.isPending}
            >
              {moveContentMutation.isPending ? "Movendo..." : "Mover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedCount} item{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSelected}
              disabled={deleteContentMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteContentMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
