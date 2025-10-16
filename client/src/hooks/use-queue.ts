import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import type { 
  ScheduledPost, 
  InsertScheduledPost, 
  Reminder, 
  InsertReminder,
  Post
} from "@shared/schema";

// Calendar data query
export function useCalendarData(year: number, month: number) {
  return useQuery({
    queryKey: ["calendar", year, month],
    queryFn: async () => {
      const response = await fetch(`/api/creator/calendar?year=${year}&month=${month}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar dados do calendário");
      }
      return response.json() as Promise<{
        scheduledPosts: ScheduledPost[];
        reminders: Reminder[];
        publishedPosts: Post[];
      }>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Day details query
export function useDayDetails(date: Date) {
  const dateStr = date.toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ["day-details", dateStr],
    queryFn: async () => {
      const [scheduledResponse, remindersResponse] = await Promise.all([
        fetch(`/api/creator/scheduled-posts/date?date=${dateStr}`),
        fetch(`/api/creator/reminders/date?date=${dateStr}`)
      ]);

      if (!scheduledResponse.ok || !remindersResponse.ok) {
        throw new Error("Erro ao buscar detalhes do dia");
      }

      const [scheduledPosts, reminders] = await Promise.all([
        scheduledResponse.json() as Promise<ScheduledPost[]>,
        remindersResponse.json() as Promise<Reminder[]>
      ]);

      return { scheduledPosts, reminders };
    },
    enabled: !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Scheduled posts mutations
export function useCreateScheduledPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<InsertScheduledPost, "creatorId">) => {
      const response = await fetch("/api/creator/scheduled-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao agendar post");
      }

      return response.json() as Promise<ScheduledPost>;
    },
    onSuccess: (data) => {
      // Invalidate calendar queries to refresh the UI
      const scheduledDate = new Date(data.scheduledDate);
      const year = scheduledDate.getFullYear();
      const month = scheduledDate.getMonth() + 1;
      
      queryClient.invalidateQueries({ queryKey: ["calendar", year, month] });
      queryClient.invalidateQueries({ queryKey: ["day-details"] });
      
      toast({
        title: "Post agendado!",
        description: `"${data.title}" foi agendado para ${scheduledDate.toLocaleDateString('pt-BR')}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao agendar post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateScheduledPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertScheduledPost> }) => {
      const response = await fetch(`/api/creator/scheduled-posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar post agendado");
      }

      return response.json() as Promise<ScheduledPost>;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      const scheduledDate = new Date(data.scheduledDate);
      const year = scheduledDate.getFullYear();
      const month = scheduledDate.getMonth() + 1;
      
      queryClient.invalidateQueries({ queryKey: ["calendar", year, month] });
      queryClient.invalidateQueries({ queryKey: ["day-details"] });
      
      toast({
        title: "Post atualizado!",
        description: "O post agendado foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteScheduledPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/creator/scheduled-posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao excluir post agendado");
      }
    },
    onSuccess: () => {
      // Invalidate all calendar queries
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["day-details"] });
      
      toast({
        title: "Post excluído!",
        description: "O post agendado foi excluído com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function usePublishScheduledPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/creator/scheduled-posts/${id}/publish`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao publicar post agendado");
      }

      return response.json() as Promise<Post>;
    },
    onSuccess: () => {
      // Invalidate all calendar queries and posts feed
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["day-details"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
      toast({
        title: "Post publicado!",
        description: "O post foi publicado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao publicar post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Reminders mutations
export function useCreateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<InsertReminder, "creatorId">) => {
      const response = await fetch("/api/creator/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar lembrete");
      }

      return response.json() as Promise<Reminder>;
    },
    onSuccess: (data) => {
      // Invalidate calendar queries
      const reminderDate = new Date(data.reminderDate);
      const year = reminderDate.getFullYear();
      const month = reminderDate.getMonth() + 1;
      
      queryClient.invalidateQueries({ queryKey: ["calendar", year, month] });
      queryClient.invalidateQueries({ queryKey: ["day-details"] });
      
      toast({
        title: "Lembrete criado!",
        description: `"${data.title}" foi agendado para ${reminderDate.toLocaleDateString('pt-BR')}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar lembrete",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertReminder> }) => {
      const response = await fetch(`/api/creator/reminders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar lembrete");
      }

      return response.json() as Promise<Reminder>;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      const reminderDate = new Date(data.reminderDate);
      const year = reminderDate.getFullYear();
      const month = reminderDate.getMonth() + 1;
      
      queryClient.invalidateQueries({ queryKey: ["calendar", year, month] });
      queryClient.invalidateQueries({ queryKey: ["day-details"] });
      
      toast({
        title: "Lembrete atualizado!",
        description: "O lembrete foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar lembrete",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/creator/reminders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao excluir lembrete");
      }
    },
    onSuccess: () => {
      // Invalidate all calendar queries
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["day-details"] });
      
      toast({
        title: "Lembrete excluído!",
        description: "O lembrete foi excluído com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir lembrete",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
