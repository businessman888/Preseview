import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSmartLists, useSmartListPreview } from '@/hooks/use-lists';
import { 
  Users, 
  MessageSquare, 
  Gift, 
  Eye, 
  RefreshCw,
  Loader2,
  Sparkles
} from 'lucide-react';

interface SmartListsTabProps {
  onViewMembers: (listId: string, filters: any) => void;
  onSendMessage: (listId: string, filters: any) => void;
  onCreateOffer: (listId: string, filters: any) => void;
}

export function SmartListsTab({ onViewMembers, onSendMessage, onCreateOffer }: SmartListsTabProps) {
  const [previewingList, setPreviewingList] = useState<string | null>(null);
  const smartLists = useSmartLists();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePreviewList = (listId: string, filters: any) => {
    setPreviewingList(listId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Listas Inteligentes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Listas automáticas baseadas em critérios inteligentes
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-full">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Como funcionam as Listas Inteligentes?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Estas listas são atualizadas automaticamente com base em critérios como status de assinatura, 
              comportamento de compra e período de relacionamento. Os membros são calculados em tempo real.
            </p>
          </div>
        </div>
      </Card>

      {/* Smart Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {smartLists.map((list) => (
          <SmartListCard
            key={list.id}
            list={list}
            onPreview={() => handlePreviewList(list.id, list.filters)}
            onViewMembers={() => onViewMembers(list.id, list.filters)}
            onSendMessage={() => onSendMessage(list.id, list.filters)}
            onCreateOffer={() => onCreateOffer(list.id, list.filters)}
            isPreviewing={previewingList === list.id}
          />
        ))}
      </div>

      {/* Coming Soon */}
      <Card className="p-6 border-dashed border-2 border-gray-300 dark:border-gray-600">
        <div className="text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Mais Listas Inteligentes em Breve
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Estamos trabalhando em filtros mais avançados como:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Interação com Posts',
              'Frequência de Acesso',
              'Localização',
              'Idade da Conta',
              'Tipo de Dispositivo'
            ].map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

interface SmartListCardProps {
  list: {
    id: string;
    name: string;
    description: string;
    filters: any;
    icon: string;
  };
  onPreview: () => void;
  onViewMembers: () => void;
  onSendMessage: () => void;
  onCreateOffer: () => void;
  isPreviewing: boolean;
}

function SmartListCard({ 
  list, 
  onPreview, 
  onViewMembers, 
  onSendMessage, 
  onCreateOffer,
  isPreviewing 
}: SmartListCardProps) {
  const { data: previewData, isLoading } = useSmartListPreview(list.filters);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{list.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {list.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {list.description}
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Inteligente
        </Badge>
      </div>

      {/* Member Count */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Calculando...</span>
                </div>
              ) : (
                `${previewData?.memberCount || 0} membros`
              )}
            </span>
          </div>
          
          {!isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreview}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewMembers}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
        
        {previewData?.memberCount > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onSendMessage}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Mensagem
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateOffer}
              className="flex-1"
            >
              <Gift className="h-4 w-4 mr-1" />
              Oferta
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}




