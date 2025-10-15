import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreatorLayout } from "@/components/creator/CreatorLayout";
import { VaultToolbar } from "@/components/creator/vault/VaultToolbar";
import { VaultGrid } from "@/components/creator/vault/VaultGrid";
import { VaultActionsBar } from "@/components/creator/vault/VaultActionsBar";
import { useVaultContent, useVaultFolders } from "@/hooks/use-vault";

export function VaultPage() {
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'images' | 'videos' | 'audios',
    folderId: null as number | null,
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  const { data: vaultData, isLoading: contentLoading } = useVaultContent({
    ...filters,
    page: currentPage,
    limit: 20
  });

  const { data: folders = [], isLoading: foldersLoading } = useVaultFolders();

  const hasSelection = selectedIds.size > 0;

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSelect = (id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      
      // Update select mode based on selection
      if (newSet.size > 0 && !isSelectMode) {
        setIsSelectMode(true);
      } else if (newSet.size === 0 && isSelectMode) {
        setIsSelectMode(false);
      }
      
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (!vaultData?.content) return;
    
    const allIds = new Set(vaultData.content.map(item => item.id));
    setSelectedIds(allIds);
    setIsSelectMode(true);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const handleEdit = (id: number) => {
    // TODO: Implement edit functionality
    console.log('Edit item:', id);
  };

  const handleDelete = (id: number) => {
    setSelectedIds(new Set([id]));
    // The delete action will be handled by VaultActionsBar
  };

  const handleMove = (id: number) => {
    setSelectedIds(new Set([id]));
    // The move action will be handled by VaultActionsBar
  };

  return (
    <CreatorLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cofre
            </h1>
            <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Criar imagens IA
              <Badge variant="secondary" className="ml-2 bg-pink-100 text-pink-600 text-xs">
                Beta
              </Badge>
            </Button>
          </div>
        </header>

        {/* Toolbar */}
        <VaultToolbar
          filters={filters}
          folders={folders}
          onFiltersChange={handleFiltersChange}
          onSelectAll={handleSelectAll}
          isSelectMode={isSelectMode}
          hasSelection={hasSelection}
        />

        {/* Content Grid */}
        <main className="min-h-[calc(100vh-200px)]">
          <VaultGrid
            content={vaultData?.content || []}
            selectedIds={selectedIds}
            isSelectMode={isSelectMode}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMove={handleMove}
            loading={contentLoading || foldersLoading}
          />

          {/* Pagination */}
          {vaultData && vaultData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 p-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Página {currentPage} de {vaultData.totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(vaultData.totalPages, prev + 1))}
                disabled={currentPage === vaultData.totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </main>

        {/* Actions Bar */}
        <VaultActionsBar
          selectedIds={selectedIds}
          selectedCount={selectedIds.size}
          onClearSelection={handleClearSelection}
          folders={folders}
        />
      </div>
    </CreatorLayout>
  );
}

