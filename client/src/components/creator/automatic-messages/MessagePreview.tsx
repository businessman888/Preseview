import { generateMessagePreview, getEventIcon } from "@/hooks/use-automatic-messages";

interface MessagePreviewProps {
  messageText: string;
  eventType: string;
}

export function MessagePreview({ messageText, eventType }: MessagePreviewProps) {
  const previewText = generateMessagePreview(messageText, eventType);
  const icon = getEventIcon(eventType);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Preview da Mensagem
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Como a mensagem aparecerá para o usuário
        </p>
      </div>

      {/* Simulação de chat */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          {/* Avatar do criador */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              C
            </div>
          </div>

          {/* Mensagem */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-600">
              {/* Header da mensagem */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Mensagem Automática
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {icon}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  agora
                </span>
              </div>

              {/* Conteúdo da mensagem */}
              <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {previewText}
              </div>
            </div>

            {/* Indicador de status */}
            <div className="flex items-center space-x-1 mt-2">
              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Entregue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="text-blue-500 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Informações
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
              Esta mensagem será enviada automaticamente quando o evento "{eventType}" for disparado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
