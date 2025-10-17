import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MemberCard } from './MemberCard';
import { ListMember } from '@/hooks/use-lists';
import { Search, Users, Filter, RefreshCw } from 'lucide-react';

interface MemberListProps {
  members: ListMember[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onRemoveMember?: (userId: number) => void;
  onRefresh?: () => void;
  showRemoveButton?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export function MemberList({
  members,
  totalCount,
  totalPages,
  currentPage,
  isLoading = false,
  onPageChange,
  onRemoveMember,
  onRefresh,
  showRemoveButton = false,
  searchTerm = '',
  onSearchChange,
}: MemberListProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const filteredMembers = members.filter(member => {
    if (!localSearchTerm) return true;
    
    const searchLower = localSearchTerm.toLowerCase();
    return (
      member.user.display_name.toLowerCase().includes(searchLower) ||
      member.user.username.toLowerCase().includes(searchLower) ||
      member.user.user_type.toLowerCase().includes(searchLower)
    );
  });

  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Botão "Anterior"
    if (currentPage > 1) {
      buttons.push(
        <Button
          key="prev"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isLoading}
        >
          Anterior
        </Button>
      );
    }

    // Primeira página se não estiver visível
    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={isLoading}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2">...</span>);
      }
    }

    // Páginas visíveis
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          disabled={isLoading}
        >
          {i}
        </Button>
      );
    }

    // Última página se não estiver visível
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2">...</span>);
      }
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={isLoading}
        >
          {totalPages}
        </Button>
      );
    }

    // Botão "Próxima"
    if (currentPage < totalPages) {
      buttons.push(
        <Button
          key="next"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLoading}
        >
          Próxima
        </Button>
      );
    }

    return buttons;
  };

  if (isLoading && members.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Carregando membros...
            </span>
          </div>
        </div>
        
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {totalCount} membros
          </span>
          {isLoading && (
            <RefreshCw className="h-4 w-4 text-gray-500 animate-spin" />
          )}
        </div>
        
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        )}
      </div>

      {/* Search */}
      {onSearchChange && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar membros..."
            value={localSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Member Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span>
          Mostrando {filteredMembers.length} de {members.length} membros
        </span>
        {localSearchTerm && (
          <span className="text-blue-600 dark:text-blue-400">
            Filtrado por: "{localSearchTerm}"
          </span>
        )}
      </div>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {localSearchTerm ? 'Nenhum membro encontrado' : 'Nenhum membro na lista'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {localSearchTerm 
              ? 'Tente ajustar os termos de busca'
              : 'Adicione membros para começar a usar esta lista'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onRemove={onRemoveMember}
              showRemoveButton={showRemoveButton}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {getPaginationButtons()}
        </div>
      )}

      {/* Pagination Info */}
      {totalPages > 1 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Página {currentPage} de {totalPages}
        </div>
      )}
    </div>
  );
}



