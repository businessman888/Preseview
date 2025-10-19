import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MemberList } from './MemberList';
import { useListMembers, useRemoveMember } from '@/hooks/use-lists';
import { SubscriberList } from '@/hooks/use-lists';
import { Users, Calendar, Hash, MessageSquare, Gift } from 'lucide-react';

interface ListDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: SubscriberList | null;
  onSendMessage?: (listId: number) => void;
  onCreateOffer?: (listId: number) => void;
}

export function ListDetailsModal({ 
  isOpen, 
  onClose, 
  list, 
  onSendMessage,
  onCreateOffer 
}: ListDetailsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { 
    data: membersData, 
    isLoading, 
    refetch 
  } = useListMembers(list?.id || 0, currentPage, 20);

  const removeMemberMutation = useRemoveMember();

  const handleRemoveMember = async (userId: number) => {
    if (!list) return;
    
    try {
      await removeMemberMutation.mutateAsync({
        listId: list.id,
        userId,
      });
      
      // Refresh members list
      refetch();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (!list) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{getListTypeIcon()}</span>
            <div>
              <div className="flex items-center gap-2">
                <span>{list.name}</span>
                <Badge className={getListTypeColor()}>
                  {list.listType === 'smart' ? 'Inteligente' : 'Personalizada'}
                </Badge>
                <Badge className={getStatusColor()}>
                  {list.isActive ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
              {list.description && (
                <DialogDescription className="mt-1">
                  {list.description}
                </DialogDescription>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* List Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {list.memberCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Membros
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(list.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Criada em
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <Hash className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                #{list.id}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ID da Lista
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <MessageSquare className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {list.listType === 'smart' ? 'Auto' : 'Manual'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Gerenciamento
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {list.memberCount > 0 && (
            <div className="flex gap-2 mb-4 flex-shrink-0">
              {onSendMessage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onSendMessage(list.id);
                    onClose();
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Button>
              )}
              
              {onCreateOffer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onCreateOffer(list.id);
                    onClose();
                  }}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Criar Oferta
                </Button>
              )}
            </div>
          )}

          {/* Members List */}
          <div className="flex-1 overflow-hidden">
            <MemberList
              members={membersData?.members || []}
              totalCount={membersData?.totalCount || 0}
              totalPages={membersData?.totalPages || 0}
              currentPage={currentPage}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              onRemoveMember={list.listType === 'custom' ? handleRemoveMember : undefined}
              onRefresh={handleRefresh}
              showRemoveButton={list.listType === 'custom'}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}




