import { useState, useMemo } from "react";
import { PaidLinkCard } from "./PaidLinkCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { PaidMediaLink } from "@shared/schema";

interface PaidLinksGridProps {
  links: PaidMediaLink[];
  isLoading?: boolean;
  onCreateLink: () => void;
  onEdit: (link: PaidMediaLink) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onViewStats: (id: number) => void;
  onCopyLink: (link: PaidMediaLink) => void;
  onGenerateQR: (link: PaidMediaLink) => void;
  searchQuery?: string;
  sortBy?: 'recent' | 'popular' | 'revenue';
}

// Componente de loading skeleton
function LinkCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center space-y-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
          </div>
          <div className="text-center space-y-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6 mx-auto"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
          </div>
          <div className="text-center space-y-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
          </div>
        </div>
        
        <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Componente de estado vazio
function EmptyState({ onCreateLink }: { onCreateLink: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <Plus className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Nenhum link de mídia paga encontrado
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Crie seu primeiro link de mídia paga para começar a monetizar seu conteúdo. 
        Você pode criar links para imagens, vídeos ou áudios.
      </p>
      
      <Button onClick={onCreateLink} size="lg">
        <Plus className="w-4 h-4 mr-2" />
        Criar Primeiro Link
      </Button>
    </div>
  );
}

export function PaidLinksGrid({
  links,
  isLoading = false,
  onCreateLink,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewStats,
  onCopyLink,
  onGenerateQR,
  searchQuery = "",
  sortBy = 'recent'
}: PaidLinksGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtrar e ordenar links
  const filteredAndSortedLinks = useMemo(() => {
    let filtered = links;

    // Aplicar busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(link => 
        link.title.toLowerCase().includes(query) ||
        (link.description && link.description.toLowerCase().includes(query))
      );
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.purchasesCount - a.purchasesCount);
        break;
      case 'revenue':
        filtered = [...filtered].sort((a, b) => b.totalEarnings - a.totalEarnings);
        break;
      case 'recent':
      default:
        filtered = [...filtered].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [links, searchQuery, sortBy]);

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLinks = filteredAndSortedLinks.slice(startIndex, endIndex);

  // Reset página quando filtros mudam
  useState(() => {
    setCurrentPage(1);
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <LinkCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return <EmptyState onCreateLink={onCreateLink} />;
  }

  if (currentLinks.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12 px-6">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <div className="w-12 h-12 text-gray-400">🔍</div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum resultado encontrado
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Não encontramos links que correspondam à sua busca por "{searchQuery}".
          Tente usar outros termos ou criar um novo link.
        </p>
        
        <Button onClick={onCreateLink} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentLinks.map((link) => (
          <PaidLinkCard
            key={link.id}
            link={link}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            onViewStats={onViewStats}
            onCopyLink={onCopyLink}
            onGenerateQR={onGenerateQR}
          />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredAndSortedLinks.length)} de {filteredAndSortedLinks.length} links
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
