import { useState, useRef, useEffect } from "react";
import { X, RotateCcw, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MessageVariablePicker } from "./MessageVariablePicker";
import { MessagePreview } from "./MessagePreview";
import { MessageFormatToolbar } from "./MessageFormatToolbar";
import { 
  useUpsertAutomaticMessage, 
  useResetAutomaticMessage,
  getEventIcon,
  getEventLabel,
  validateMessageText
} from "@/hooks/use-automatic-messages";
import type { AutomaticMessage } from "@shared/schema";

interface EditMessageModalProps {
  message: AutomaticMessage;
  isOpen: boolean;
  onClose: () => void;
}

export function EditMessageModal({ message, isOpen, onClose }: EditMessageModalProps) {
  const [messageText, setMessageText] = useState(message.messageText);
  const [isEnabled, setIsEnabled] = useState(message.isEnabled);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const upsertMutation = useUpsertAutomaticMessage();
  const resetMutation = useResetAutomaticMessage();

  const eventIcon = getEventIcon(message.eventType);
  const eventLabel = getEventLabel(message.eventType);

  // Resetar estado quando o modal abrir com nova mensagem
  useEffect(() => {
    if (isOpen) {
      setMessageText(message.messageText);
      setIsEnabled(message.isEnabled);
    }
  }, [isOpen, message.messageText, message.isEnabled]);

  const handleSave = async () => {
    const validation = validateMessageText(messageText);
    if (!validation.isValid) {
      // Toast de erro será mostrado pelo hook
      return;
    }

    await upsertMutation.mutateAsync({
      eventType: message.eventType,
      data: {
        isEnabled,
        messageText
      }
    });

    onClose();
  };

  const handleReset = async () => {
    if (window.confirm("Tem certeza que deseja resetar para a mensagem padrão? Esta ação não pode ser desfeita.")) {
      const resetMessage = await resetMutation.mutateAsync(message.eventType);
      setMessageText(resetMessage.messageText);
      setIsEnabled(resetMessage.isEnabled);
    }
  };

  const handleInsertVariable = (variable: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newText = messageText.substring(0, start) + variable + messageText.substring(end);
      
      setMessageText(newText);
      
      // Restaurar posição do cursor após a variável inserida
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + variable.length;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleInsertText = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newText = messageText.substring(0, start) + text + messageText.substring(end);
      
      setMessageText(newText);
      
      // Restaurar posição do cursor
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + text.length;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    handleInsertText(emoji);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  const isDirty = messageText !== message.messageText || isEnabled !== message.isEnabled;
  const validation = validateMessageText(messageText);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <span className="text-2xl">{eventIcon}</span>
            <span>Editar: {eventLabel}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          {/* Coluna Esquerda - Editor */}
          <div className="space-y-6 overflow-y-auto">
            {/* Toggle ON/OFF */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <Label htmlFor="enable-toggle" className="text-sm font-medium">
                  Mensagem Ativa
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Quando ativada, a mensagem será enviada automaticamente
                </p>
              </div>
              <Switch
                id="enable-toggle"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
            </div>

            {/* Editor de Mensagem */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="message-text" className="text-sm font-medium">
                  Texto da Mensagem
                </Label>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${validation.isValid ? 'text-gray-500' : 'text-red-500'}`}>
                    {messageText.length}/500
                  </span>
                </div>
              </div>

              {/* Toolbar de formatação */}
              <MessageFormatToolbar
                onInsertText={handleInsertText}
                onInsertEmoji={handleInsertEmoji}
              />

              {/* Textarea */}
              <Textarea
                ref={textareaRef}
                id="message-text"
                value={messageText}
                onChange={handleTextareaChange}
                onSelect={handleTextareaSelect}
                placeholder="Digite sua mensagem automática aqui..."
                className="min-h-[120px] resize-none"
                maxLength={500}
              />

              {/* Erro de validação */}
              {!validation.isValid && (
                <p className="text-sm text-red-500">{validation.error}</p>
              )}
            </div>

            {/* Variáveis Disponíveis */}
            <MessageVariablePicker
              eventType={message.eventType}
              onInsertVariable={handleInsertVariable}
            />
          </div>

          {/* Coluna Direita - Preview */}
          <div className="space-y-6 overflow-y-auto">
            <MessagePreview
              messageText={messageText}
              eventType={message.eventType}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={resetMutation.isPending}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar para Padrão
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isDirty || !validation.isValid || upsertMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {upsertMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
