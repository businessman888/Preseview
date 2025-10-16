import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateList } from '@/hooks/use-lists';
import { Plus, Loader2 } from 'lucide-react';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateListModal({ isOpen, onClose, onSuccess }: CreateListModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    listType: 'custom' as 'smart' | 'custom',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createListMutation = useCreateList();

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
    
    if (!validateForm()) return;

    try {
      await createListMutation.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        listType: formData.listType,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        listType: 'custom',
      });
      setErrors({});

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleClose = () => {
    if (!createListMutation.isPending) {
      setFormData({
        name: '',
        description: '',
        listType: 'custom',
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Nova Lista
          </DialogTitle>
          <DialogDescription>
            Crie uma nova lista personalizada para organizar seus assinantes e seguidores.
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
              disabled={createListMutation.isPending}
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
              disabled={createListMutation.isPending}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{errors.description && <span className="text-red-600">{errors.description}</span>}</span>
              <span>{formData.description.length}/200</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="listType">Tipo de Lista</Label>
            <Select
              value={formData.listType}
              onValueChange={(value: 'smart' | 'custom') => handleInputChange('listType', value)}
              disabled={createListMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">
                  <div className="flex items-center gap-2">
                    <span>📝</span>
                    <div>
                      <div className="font-medium">Personalizada</div>
                      <div className="text-xs text-gray-500">Adicione membros manualmente</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="smart" disabled>
                  <div className="flex items-center gap-2">
                    <span>🤖</span>
                    <div>
                      <div className="font-medium">Inteligente</div>
                      <div className="text-xs text-gray-500">Em breve - Filtros automáticos</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Listas inteligentes serão implementadas em breve com filtros automáticos.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createListMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createListMutation.isPending}
            >
              {createListMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Lista
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
