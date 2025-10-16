import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAvailableVariables } from "@/hooks/use-automatic-messages";

interface MessageVariablePickerProps {
  eventType: string;
  onInsertVariable: (variable: string) => void;
}

export function MessageVariablePicker({ eventType, onInsertVariable }: MessageVariablePickerProps) {
  const [hoveredVariable, setHoveredVariable] = useState<string | null>(null);
  const availableVariables = getAvailableVariables(eventType);

  const handleVariableClick = (variableKey: string) => {
    onInsertVariable(`{${variableKey}}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Variáveis Disponíveis
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Clique em uma variável para inserir no texto da mensagem
        </p>
      </div>

      <TooltipProvider>
        <div className="flex flex-wrap gap-2">
          {availableVariables.map((variable) => (
            <Tooltip key={variable.key}>
              <TooltipTrigger asChild>
                <Badge
                  variant="secondary"
                  className={`
                    cursor-pointer transition-all duration-200 hover:scale-105
                    ${hoveredVariable === variable.key 
                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                  onClick={() => handleVariableClick(variable.key)}
                  onMouseEnter={() => setHoveredVariable(variable.key)}
                  onMouseLeave={() => setHoveredVariable(null)}
                >
                  <span className="font-mono text-sm">{variable.label}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-medium">{variable.label}</p>
                  <p className="text-xs text-gray-500">{variable.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Exemplo de uso */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="text-blue-500 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Dica de Uso
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
              As variáveis serão substituídas automaticamente pelos dados reais do usuário quando a mensagem for enviada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
