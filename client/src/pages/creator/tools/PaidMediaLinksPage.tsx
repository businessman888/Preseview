import { useState } from "react";
import { CreatorLayout } from "@/components/creator/CreatorLayout";
import { PaidLinksToolbar } from "@/components/creator/paid-links/PaidLinksToolbar";
import { PaidLinksGrid } from "@/components/creator/paid-links/PaidLinksGrid";
import { CreatePaidLinkModal } from "@/components/creator/paid-links/CreatePaidLinkModal";
import { usePaidMediaLinks, useDeletePaidMediaLink, useTogglePaidMediaLink } from "@/hooks/use-paid-links";
import type { PaidMediaLink } from "@shared/schema";

export function PaidMediaLinksPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'revenue'>('recent');
  
  // Fetch links with current filter
  const { data: links = [], isLoading } = usePaidMediaLinks(
    filter === 'all' ? undefined : { isActive: filter === 'active' }
  );
  
  const deleteMutation = useDeletePaidMediaLink();
  const toggleMutation = useTogglePaidMediaLink();

  const handleCreateLink = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleEdit = (link: PaidMediaLink) => {
    // TODO: Implementar modal de edição
    console.log('Edit link:', link);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleToggleStatus = (id: number) => {
    toggleMutation.mutate(id);
  };

  const handleViewStats = (id: number) => {
    // TODO: Implementar modal de estatísticas
    console.log('View stats for link:', id);
  };

  const handleCopyLink = (link: PaidMediaLink) => {
    console.log('Copy link:', link);
  };

  const handleGenerateQR = (link: PaidMediaLink) => {
    // TODO: Implementar geração de QR Code
    console.log('Generate QR for link:', link);
  };

  return (
    <CreatorLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Links de Mídia Paga
          </h1>
        </header>
        
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Toolbar */}
          <PaidLinksToolbar
            onCreateLink={handleCreateLink}
            onSearch={setSearchQuery}
            onFilterChange={setFilter}
            onSortChange={setSortBy}
            isLoading={isLoading}
          />
          
          {/* Grid */}
          <PaidLinksGrid
            links={links}
            isLoading={isLoading}
            onCreateLink={handleCreateLink}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onViewStats={handleViewStats}
            onCopyLink={handleCopyLink}
            onGenerateQR={handleGenerateQR}
            searchQuery={searchQuery}
            sortBy={sortBy}
          />
        </main>
        
        {/* Modals */}
        <CreatePaidLinkModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
        />
      </div>
    </CreatorLayout>
  );
}

