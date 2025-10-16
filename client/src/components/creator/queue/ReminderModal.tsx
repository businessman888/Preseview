import { useState, useEffect } from "react";
import { Calendar, Clock, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateReminder, useUpdateReminder } from "@/hooks/use-queue";
import type { Reminder } from "@shared/schema";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  reminder?: Reminder | null;
}

export function ReminderModal({
  isOpen,
  onClose,
  selectedDate,
  reminder,
}: ReminderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const createReminderMutation = useCreateReminder();
  const updateReminderMutation = useUpdateReminder();

  const isEditing = !!reminder;
  const isLoading = createReminderMutation.isPending || updateReminderMutation.isPending;

  // Initialize form with selected date or reminder data
  useEffect(() => {
    if (isOpen) {
      if (reminder) {
        // Editing existing reminder
        setTitle(reminder.title);
        setDescription(reminder.description || "");
        setNotificationEnabled(reminder.notificationEnabled);
        
        const date = new Date(reminder.reminderDate);
        setReminderDate(date.toISOString().split('T')[0]);
        setReminderTime(date.toTimeString().slice(0, 5));
      } else if (selectedDate) {
        // Creating new reminder
        setTitle("");
        setDescription("");
        setNotificationEnabled(true);
        
        setReminderDate(selectedDate.toISOString().split('T')[0]);
        setReminderTime("09:00");
      }
    }
  }, [isOpen, reminder, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const dateTime = new Date(`${reminderDate}T${reminderTime}`);
    
    try {
      if (isEditing && reminder) {
        await updateReminderMutation.mutateAsync({
          id: reminder.id,
          data: {
            reminderDate: dateTime,
            title: title.trim(),
            description: description.trim() || null,
            notificationEnabled,
          },
        });
      } else {
        await createReminderMutation.mutateAsync({
          reminderDate: dateTime,
          title: title.trim(),
          description: description.trim() || null,
          notificationEnabled,
        });
      }
      
      handleClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setReminderDate("");
    setReminderTime("");
    setNotificationEnabled(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isEditing ? "Editar Lembrete" : "Novo Lembrete"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Gravar vídeo para YouTube"
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes sobre o lembrete..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Hora *</Label>
              <Input
                id="time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              {notificationEnabled ? (
                <Bell className="h-4 w-4 text-green-600" />
              ) : (
                <BellOff className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm font-medium">Notificar-me</span>
            </div>
            <Switch
              checked={notificationEnabled}
              onCheckedChange={setNotificationEnabled}
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? "Atualizando..." : "Criando..."}
                </>
              ) : (
                isEditing ? "Atualizar" : "Criar Lembrete"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
