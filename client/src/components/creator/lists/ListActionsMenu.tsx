import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Eye, 
  MessageSquare, 
  Gift, 
  Edit, 
  Trash2,
  Power,
  PowerOff,
  Users,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SubscriberList } from '@/hooks/use-lists';

interface ListActionsMenuProps {
  list: SubscriberList;
  onViewMembers: (listId: number) => void;
  onSendMessage: (listId: number) => void;
  onCreateOffer: (listId: number) => void;
  onEdit: (listId: number) => void;
  onDelete: (listId: number) => void;
  onToggleStatus: (listId: number) => void;
  onAddMembers?: (listId: number) => void;
}

export function ListActionsMenu({
  list,
  onViewMembers,
  onSendMessage,
  onCreateOffer,
  onEdit,
  onDelete,
  onToggleStatus,
  onAddMembers,
}: ListActionsMenuProps) {
  const isCustomList = list.listType === 'custom';
  const hasMembers = list.memberCount > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* View Members - Always available */}
        <DropdownMenuItem onClick={() => onViewMembers(list.id)}>
          <Eye className="h-4 w-4 mr-2" />
          Ver Membros ({list.memberCount})
        </DropdownMenuItem>

        {/* Add Members - Only for custom lists */}
        {isCustomList && onAddMembers && (
          <DropdownMenuItem onClick={() => onAddMembers(list.id)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Membros
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Send Message - Only if has members */}
        {hasMembers && (
          <DropdownMenuItem onClick={() => onSendMessage(list.id)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Enviar Mensagem
          </DropdownMenuItem>
        )}

        {/* Create Offer - Only if has members */}
        {hasMembers && (
          <DropdownMenuItem onClick={() => onCreateOffer(list.id)}>
            <Gift className="h-4 w-4 mr-2" />
            Criar Oferta
          </DropdownMenuItem>
        )}

        {/* Edit - Only for custom lists */}
        {isCustomList && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(list.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Lista
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Toggle Status */}
        <DropdownMenuItem 
          onClick={() => onToggleStatus(list.id)}
          className={list.isActive ? 'text-orange-600' : 'text-green-600'}
        >
          {list.isActive ? (
            <>
              <PowerOff className="h-4 w-4 mr-2" />
              Desativar Lista
            </>
          ) : (
            <>
              <Power className="h-4 w-4 mr-2" />
              Ativar Lista
            </>
          )}
        </DropdownMenuItem>

        {/* Delete - Only for custom lists */}
        {isCustomList && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(list.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Lista
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Alternative compact version for use in smaller spaces
export function ListActionsMenuCompact({
  list,
  onViewMembers,
  onSendMessage,
  onCreateOffer,
  onEdit,
  onDelete,
  onToggleStatus,
  onAddMembers,
}: ListActionsMenuProps) {
  const isCustomList = list.listType === 'custom';
  const hasMembers = list.memberCount > 0;

  return (
    <div className="flex items-center gap-1">
      {/* Quick Actions */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewMembers(list.id)}
        className="h-8 w-8 p-0"
        title={`Ver ${list.memberCount} membros`}
      >
        <Users className="h-4 w-4" />
      </Button>

      {hasMembers && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSendMessage(list.id)}
          className="h-8 w-8 p-0"
          title="Enviar mensagem"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}

      {isCustomList && onAddMembers && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddMembers(list.id)}
          className="h-8 w-8 p-0"
          title="Adicionar membros"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {hasMembers && (
            <DropdownMenuItem onClick={() => onCreateOffer(list.id)}>
              <Gift className="h-4 w-4 mr-2" />
              Criar Oferta
            </DropdownMenuItem>
          )}

          {isCustomList && (
            <DropdownMenuItem onClick={() => onEdit(list.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

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

          {isCustomList && (
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
  );
}



