import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSmartListPreview, SmartListFilters } from '@/hooks/use-lists';
import { Users, Loader2, Eye, User } from 'lucide-react';

interface FilterPreviewProps {
  filters: SmartListFilters;
  onCreateList?: (filters: SmartListFilters) => void;
}

export function FilterPreview({ filters, onCreateList }: FilterPreviewProps) {
  const { data: previewData, isLoading, error } = useSmartListPreview(filters);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof SmartListFilters];
    if (key === 'spending') {
      return value && typeof value === 'object' && (value.type || value.value);
    }
    return value !== undefined && value !== null && value !== '';
  });

  if (!hasActiveFilters) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Selecione Filtros
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Configure os filtros para ver uma prévia dos membros que correspondem aos critérios.
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Calculando Preview...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Analisando seus assinantes e seguidores com base nos filtros selecionados.
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Erro ao Calcular Preview
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Não foi possível calcular a prévia dos membros. Tente novamente.
          </p>
        </div>
      </Card>
    );
  }

  const memberCount = previewData?.memberCount || 0;
  const previewMembers = previewData?.preview || [];

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Preview da Lista
          </h3>
        </div>
        
        {memberCount > 0 && onCreateList && (
          <Button onClick={() => onCreateList(filters)}>
            Criar Lista
          </Button>
        )}
      </div>

      {/* Member Count */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {memberCount}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              {memberCount === 1 ? 'membro encontrado' : 'membros encontrados'}
            </div>
          </div>
          <div className="text-4xl">👥</div>
        </div>
      </div>

      {/* Preview Members */}
      {memberCount > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview dos Membros
            </span>
            <Badge variant="outline" className="text-xs">
              {previewMembers.length} de {memberCount}
            </Badge>
          </div>

          <div className="grid gap-3">
            {previewMembers.map((member, index) => (
              <div key={member.id || index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={member.profile_image || undefined} 
                    alt={member.display_name}
                  />
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                    {getInitials(member.display_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {member.display_name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    @{member.username}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {memberCount > previewMembers.length && (
            <div className="text-center py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ... e mais {memberCount - previewMembers.length} membros
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum Membro Encontrado
          </h4>
          <p className="text-gray-500 dark:text-gray-400">
            Não há membros que correspondam aos filtros selecionados.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {memberCount > 0 && (
        <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {onCreateList && (
            <Button 
              onClick={() => onCreateList(filters)}
              className="flex-1"
            >
              Criar Lista Inteligente
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}




