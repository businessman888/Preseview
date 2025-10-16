import { useState } from "react";
import { MessageConfigCard } from "./MessageConfigCard";
import { EditMessageModal } from "./EditMessageModal";
import { useAutomaticMessages, useToggleAutomaticMessage } from "@/hooks/use-automatic-messages";
import type { AutomaticMessage } from "@shared/schema";

export function MessageConfigList() {
  const [editingMessage, setEditingMessage] = useState<AutomaticMessage | null>(null);
  
  const { data: messages, isLoading, error } = useAutomaticMessages();
  const toggleMutation = useToggleAutomaticMessage();

  const handleToggle = async (message: AutomaticMessage) => {
    await toggleMutation.mutateAsync(message.eventType);
  };

  const handleEdit = (message: AutomaticMessage) => {
    setEditingMessage(message);
  };

  const handleCloseModal = () => {
    setEditingMessage(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Erro ao carregar mensagens
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Não foi possível carregar as mensagens automáticas. Tente novamente.
        </p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma mensagem encontrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Não há mensagens automáticas configuradas ainda.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.map((message) => (
          <MessageConfigCard
            key={message.eventType}
            message={message}
            onToggle={() => handleToggle(message)}
            onClick={() => handleEdit(message)}
          />
        ))}
      </div>

      {/* Modal de Edição */}
      {editingMessage && (
        <EditMessageModal
          message={editingMessage}
          isOpen={!!editingMessage}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
