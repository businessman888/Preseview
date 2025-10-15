import { VaultItem } from "./VaultItem";

interface VaultGridProps {
  content: Array<{
    id: number;
    title: string;
    mediaUrl: string;
    mediaType: 'image' | 'video' | 'audio';
    thumbnail: string;
    views: number;
    likes: number;
    comments: number;
    gifts: number;
    createdAt: string;
    folderId: number | null;
  }>;
  selectedIds: Set<number>;
  isSelectMode: boolean;
  onSelect: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onMove?: (id: number) => void;
  loading?: boolean;
}

export function VaultGrid({
  content,
  selectedIds,
  isSelectMode,
  onSelect,
  onEdit,
  onDelete,
  onMove,
  loading = false
}: VaultGridProps) {
  if (loading) {
    return <VaultGridSkeleton />;
  }

  if (content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📁</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum conteúdo encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Seu cofre está vazio ou não há conteúdo que corresponda aos filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {content.map((item) => (
        <VaultItem
          key={item.id}
          content={item}
          isSelected={selectedIds.has(item.id)}
          isSelectMode={isSelectMode}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
    </div>
  );
}

function VaultGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Thumbnail skeleton */}
            <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
            
            {/* Content skeleton */}
            <div className="p-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
