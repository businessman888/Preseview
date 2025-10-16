import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SmartListFilters as SmartListFiltersType } from '@/hooks/use-lists';
import { Filter, RefreshCw, Users } from 'lucide-react';

interface SmartListFiltersProps {
  filters: SmartListFiltersType;
  onFiltersChange: (filters: SmartListFiltersType) => void;
  onPreview?: () => void;
  isPreviewLoading?: boolean;
}

export function SmartListFilters({
  filters,
  onFiltersChange,
  onPreview,
  isPreviewLoading = false,
}: SmartListFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SmartListFiltersType>(filters);

  const handleFilterChange = (key: keyof SmartListFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSpendingTypeChange = (type: 'spent_more_than' | 'purchased_paid_media' | 'sent_tips') => {
    const newFilters = {
      ...localFilters,
      spending: {
        ...localFilters.spending,
        type,
        value: type === 'spent_more_than' ? localFilters.spending?.value || 50 : undefined,
      },
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSpendingValueChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      const newFilters = {
        ...localFilters,
        spending: {
          ...localFilters.spending,
          value: numValue,
        },
      };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters: SmartListFiltersType = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(key => {
    const value = localFilters[key as keyof SmartListFiltersType];
    if (key === 'spending') {
      return value && typeof value === 'object' && (value.type || value.value);
    }
    return value !== undefined && value !== null && value !== '';
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filtros Inteligentes
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Limpar Filtros
            </Button>
          )}
          
          {onPreview && (
            <Button
              size="sm"
              onClick={onPreview}
              disabled={isPreviewLoading}
            >
              {isPreviewLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Preview
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status da Assinatura */}
        <div className="space-y-2">
          <Label>Status da Assinatura</Label>
          <Select
            value={localFilters.subscriptionStatus || ''}
            onValueChange={(value) => handleFilterChange('subscriptionStatus', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="expired">Expirados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Relacionamento */}
        <div className="space-y-2">
          <Label>Tipo de Relacionamento</Label>
          <Select
            value={localFilters.relationshipType || ''}
            onValueChange={(value) => handleFilterChange('relationshipType', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              <SelectItem value="subscriber">Apenas Assinantes</SelectItem>
              <SelectItem value="follower">Apenas Seguidores</SelectItem>
              <SelectItem value="both">Assinantes e Seguidores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Renovação Automática */}
        <div className="space-y-2">
          <Label>Renovação Automática</Label>
          <Select
            value={localFilters.autoRenewal || ''}
            onValueChange={(value) => handleFilterChange('autoRenewal', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a renovação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="auto_renewing">Com Renovação Automática</SelectItem>
              <SelectItem value="non_renewing">Sem Renovação Automática</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Período */}
        <div className="space-y-2">
          <Label>Período</Label>
          <Select
            value={localFilters.period || ''}
            onValueChange={(value) => handleFilterChange('period', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os períodos</SelectItem>
              <SelectItem value="new_subscribers">Novos Assinantes (30 dias)</SelectItem>
              <SelectItem value="this_month">Este Mês</SelectItem>
              <SelectItem value="long_term">Assinantes Fiéis (6+ meses)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comportamento de Compra */}
      <div className="space-y-4">
        <Label>Comportamento de Compra</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Compra</Label>
            <Select
              value={localFilters.spending?.type || ''}
              onValueChange={handleSpendingTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum filtro</SelectItem>
                <SelectItem value="spent_more_than">Gastaram Mais de X</SelectItem>
                <SelectItem value="purchased_paid_media">Compraram Mídia Paga</SelectItem>
                <SelectItem value="sent_tips">Enviaram Tips</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {localFilters.spending?.type === 'spent_more_than' && (
            <div className="space-y-2">
              <Label>Valor Mínimo (R$)</Label>
              <Input
                type="number"
                min="1"
                step="0.01"
                placeholder="50.00"
                value={localFilters.spending?.value || ''}
                onChange={(e) => handleSpendingValueChange(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Filtros Ativos:
          </h4>
          <div className="flex flex-wrap gap-2">
            {localFilters.subscriptionStatus && (
              <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                Status: {localFilters.subscriptionStatus}
              </span>
            )}
            {localFilters.relationshipType && (
              <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                Tipo: {localFilters.relationshipType}
              </span>
            )}
            {localFilters.autoRenewal && (
              <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                Renovação: {localFilters.autoRenewal}
              </span>
            )}
            {localFilters.period && (
              <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                Período: {localFilters.period}
              </span>
            )}
            {localFilters.spending?.type && (
              <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                Compra: {localFilters.spending.type}
                {localFilters.spending.value && ` (R$ ${localFilters.spending.value})`}
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
