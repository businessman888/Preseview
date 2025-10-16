import { CreatorLayout } from "@/components/creator/CreatorLayout";
import { MessageConfigList } from "@/components/creator/automatic-messages/MessageConfigList";

export function AutomaticMessagesPage() {
  return (
    <CreatorLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                💬
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Mensagens automáticas
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure mensagens automáticas para eventos específicos
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Informações */}
          <div className="mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-blue-500 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100">
                    Como funcionam as mensagens automáticas
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                    Configure mensagens personalizadas que serão enviadas automaticamente quando eventos específicos ocorrerem. 
                    Use variáveis dinâmicas como {'{user_name}'} e {'{creator_name}'} para personalizar cada mensagem.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Configurações */}
          <MessageConfigList />
        </main>
      </div>
    </CreatorLayout>
  );
}
