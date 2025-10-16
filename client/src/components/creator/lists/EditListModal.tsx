import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateList } from '@/hooks/use-lists';
import { SubscriberList } from '@/hooks/use-lists';
import { Edit, Loader2 } from 'lucide-react';

interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: SubscriberList | null;
  onSuccess?: () => void;
}

export function EditListModal({ isOpen, onClose, list, onSuccess }: EditListModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateListMutation = useUpdateList();

  // Update form data when list changes
  useEffect(() => {
    if (list) {
      setFormData({
        name: list.name,
        description: list.description || '',
      });
    }
  }, [list]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Nome deve ter no máximo 50 caracteres';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Descrição deve ter no máximo 200 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!list || !validateForm()) return;

    try {
      await updateListMutation.mutateAsync({
        listId: list.id,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        },
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  const handleClose = () => {
    if (!updateListMutation.isPending) {
      setErrors({});
      onClose();
    }
  };

  if (!list) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Lista
          </DialogTitle>
          <DialogDescription>
            Edite as informações da sua lista "{list.name}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Lista *</Label>
            <Input
              id="name"
              placeholder="Ex: VIP Members, Engajados, etc."
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
              disabled={updateListMutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva o propósito desta lista..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
              disabled={updateListMutation.isPending}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{errors.description && <span className="text-red-600">{errors.description}</span>}</span>
              <span>{formData.description.length}/200</span>
            </div>
          </div>

          {/* List Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
              <span className="font-medium">
                {list.listType === 'smart' ? '🤖 Inteligente' : '📝 Personalizada'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Membros:</span>
              <span className="font-medium">{list.memberCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`font-medium ${list.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {list.isActive ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Criada em:</span>
              <span className="font-medium">
                {new Date(list.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateListMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateListMutation.isPending}
            >
              {updateListMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
