import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Users, 
  MessageSquare, 
  Gift, 
  Edit, 
  Trash2,
  Power,
  PowerOff,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SubscriberList } from '@/hooks/use-lists';

interface ListCardProps {
  list: SubscriberList;
  onViewMembers: (listId: number) => void;
  onSendMessage: (listId: number) => void;
  onCreateOffer: (listId: number) => void;
  onEdit: (listId: number) => void;
  onDelete: (listId: number) => void;
  onToggleStatus: (listId: number) => void;
}

export function ListCard({
  list,
  onViewMembers,
  onSendMessage,
  onCreateOffer,
  onEdit,
  onDelete,
  onToggleStatus,
}: ListCardProps) {
  const getListTypeIcon = () => {
    return list.listType === 'smart' ? '🤖' : '📝';
  };

  const getListTypeColor = () => {
    return list.listType === 'smart' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  };

  const getStatusColor = () => {
    return list.isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getListTypeIcon()}</span>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {list.name}
            </h3>
            {list.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {list.description}
              </p>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewMembers(list.id)}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Membros
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSendMessage(list.id)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Enviar Mensagem
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateOffer(list.id)}>
              <Gift className="h-4 w-4 mr-2" />
              Criar Oferta
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {list.listType === 'custom' && (
              <>
                <DropdownMenuItem onClick={() => onEdit(list.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem 
              onClick={() => onToggleStatus(list.id)}
              className={list.isActive ? 'text-orange-600' : 'text-green-600'}
            >
              {list.isActive ? (
                <>
                  <PowerOff className="h-4 w-4 mr-2" />
                  Desativar
                </>
              ) : (
                <>
                  <Power className="h-4 w-4 mr-2" />
                  Ativar
                </>
              )}
            </DropdownMenuItem>
            {list.listType === 'custom' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(list.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {list.memberCount} membros
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getListTypeColor()}>
            {list.listType === 'smart' ? 'Inteligente' : 'Personalizada'}
          </Badge>
          <Badge className={getStatusColor()}>
            {list.isActive ? 'Ativa' : 'Inativa'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Criada em {new Date(list.createdAt).toLocaleDateString('pt-BR')}</span>
        {list.updatedAt !== list.createdAt && (
          <span>Atualizada em {new Date(list.updatedAt).toLocaleDateString('pt-BR')}</span>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewMembers(list.id)}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver Membros
        </Button>
        
        {list.memberCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendMessage(list.id)}
            className="flex-1"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensagem
          </Button>
        )}
      </div>
    </Card>
  );
}




