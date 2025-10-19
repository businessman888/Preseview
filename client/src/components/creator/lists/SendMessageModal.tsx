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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSendMessageToList } from '@/hooks/use-lists';
import { MessageSquare, Loader2, Users, AlertCircle } from 'lucide-react';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: number;
  listName: string;
  memberCount: number;
  onSuccess?: (result: { sentCount: number; failedCount: number }) => void;
}

export function SendMessageModal({
  isOpen,
  onClose,
  listId,
  listName,
  memberCount,
  onSuccess,
}: SendMessageModalProps) {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sendMessageMutation = useSendMessageToList();

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    // Clear error when user starts typing
    if (errors.message) {
      setErrors(prev => ({ ...prev, message: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (message.trim().length > 500) {
      newErrors.message = 'Mensagem deve ter no máximo 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await sendMessageMutation.mutateAsync({
        listId,
        message: message.trim(),
      });

      // Reset form
      setMessage('');
      setErrors({});

      onSuccess?.(result);
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleClose = () => {
    if (!sendMessageMutation.isPending) {
      setMessage('');
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Enviar Mensagem em Massa
          </DialogTitle>
          <DialogDescription>
            Envie uma mensagem para todos os membros da lista "{listName}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* List Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Lista: {listName}
              </span>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              A mensagem será enviada para {memberCount} {memberCount === 1 ? 'membro' : 'membros'}
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              placeholder="Digite sua mensagem aqui..."
              value={message}
              onChange={(e) => handleInputChange(e.target.value)}
              className={errors.message ? 'border-red-500' : ''}
              rows={6}
              disabled={sendMessageMutation.isPending}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{errors.message && <span className="text-red-600">{errors.message}</span>}</span>
              <span>{message.length}/500</span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Atenção:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Esta mensagem será enviada para todos os {memberCount} membros da lista</li>
                  <li>• O processo pode levar alguns minutos dependendo do número de membros</li>
                  <li>• Mensagens são enviadas individualmente para cada membro</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={sendMessageMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={sendMessageMutation.isPending || !message.trim()}
            >
              {sendMessageMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}




