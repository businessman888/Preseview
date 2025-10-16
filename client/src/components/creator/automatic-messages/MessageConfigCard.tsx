import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { getEventIcon, getEventColors, getEventLabel } from "@/hooks/use-automatic-messages";
import type { AutomaticMessage } from "@shared/schema";

interface MessageConfigCardProps {
  message: AutomaticMessage;
  onToggle: () => void;
  onClick: () => void;
}

export function MessageConfigCard({ message, onToggle, onClick }: MessageConfigCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const colors = getEventColors(message.eventType);
  const icon = getEventIcon(message.eventType);
  const title = getEventLabel(message.eventType);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      await onToggle();
    } finally {
      setIsToggling(false);
    }
  };

  const handleClick = () => {
    if (!isToggling) {
      onClick();
    }
  };

  return (
    <Card 
      className={`
        relative cursor-pointer transition-all duration-200 hover:shadow-md
        ${message.isEnabled 
          ? 'border-green-200 bg-green-50/50 hover:bg-green-50' 
          : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 opacity-75'
        }
        ${isToggling ? 'pointer-events-none opacity-50' : ''}
      `}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Ícone e Título */}
          <div className="flex items-center space-x-4">
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-full text-2xl
              ${colors.bgColor}
            `}>
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {message.isEnabled ? 'Ativo' : 'Inativo'}
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-3">
            {/* Toggle Switch */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${message.isEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                {message.isEnabled ? 'ON' : 'OFF'}
              </span>
              <Switch
                checked={message.isEnabled}
                onCheckedChange={handleToggle}
                disabled={isToggling}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            {/* Seta indicativa */}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Preview da mensagem (truncada) */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {message.messageText.length > 100 
              ? `${message.messageText.substring(0, 100)}...`
              : message.messageText
            }
          </p>
        </div>

        {/* Indicador de status */}
        <div className="absolute top-3 right-3">
          <div className={`
            w-3 h-3 rounded-full
            ${message.isEnabled ? 'bg-green-500' : 'bg-gray-300'}
          `} />
        </div>
      </CardContent>
    </Card>
  );
}
