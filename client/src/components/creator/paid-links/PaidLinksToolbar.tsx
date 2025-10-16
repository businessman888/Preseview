import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";

interface PaidLinksToolbarProps {
  onCreateLink: () => void;
  onSearch: (query: string) => void;
  onFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  onSortChange: (sort: 'recent' | 'popular' | 'revenue') => void;
  isLoading?: boolean;
}

export function PaidLinksToolbar({
  onCreateLink,
  onSearch,
  onFilterChange,
  onSortChange,
  isLoading = false
}: PaidLinksToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sort, setSort] = useState<'recent' | 'popular' | 'revenue'>('recent');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (value: 'all' | 'active' | 'inactive') => {
    setFilter(value);
    onFilterChange(value);
  };

  const handleSortChange = (value: 'recent' | 'popular' | 'revenue') => {
    setSort(value);
    onSortChange(value);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-4">
      {/* Header com botão de criar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Links de Mídia Paga
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gerencie seus links pagos e monitore o desempenho
          </p>
        </div>
        
        <Button 
          onClick={onCreateLink}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Link
        </Button>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Campo de busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por título ou descrição..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Filtro de status */}
          <Select value={filter} onValueChange={handleFilterChange} disabled={isLoading}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>

          {/* Ordenação */}
          <Select value={sort} onValueChange={handleSortChange} disabled={isLoading}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mais recentes</SelectItem>
              <SelectItem value="popular">Mais vendidos</SelectItem>
              <SelectItem value="revenue">Maior receita</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estatísticas rápidas (opcional) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : "4"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total de Links
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {isLoading ? "..." : "3"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Ativos
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {isLoading ? "..." : "28"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total de Vendas
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {isLoading ? "..." : "R$ 389,20"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Receita Total
          </div>
        </div>
      </div>
    </div>
  );
}
