import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, FolderPlus, Plus } from "lucide-react";
import { CreateFolderModal } from "./CreateFolderModal";

interface VaultToolbarProps {
  filters: {
    type: 'all' | 'images' | 'videos' | 'audios';
    folderId: number | null;
    search: string;
  };
  folders: Array<{
    id: number;
    name: string;
    contentCount: number;
  }>;
  onFiltersChange: (filters: {
    type: 'all' | 'images' | 'videos' | 'audios';
    folderId: number | null;
    search: string;
  }) => void;
  onSelectAll: () => void;
  isSelectMode: boolean;
  hasSelection: boolean;
}

export function VaultToolbar({
  filters,
  folders,
  onFiltersChange,
  onSelectAll,
  isSelectMode,
  hasSelection
}: VaultToolbarProps) {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

  const handleTypeChange = (type: string) => {
    onFiltersChange({
      ...filters,
      type: type as 'all' | 'images' | 'videos' | 'audios'
    });
  };

  const handleFolderChange = (folderId: string) => {
    const newFolderId = folderId === 'all' ? null : parseInt(folderId);
    onFiltersChange({
      ...filters,
      folderId: newFolderId
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search
    });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        {/* Folder Management */}
        <div className="flex items-center gap-3">
          <Select 
            value={filters.folderId?.toString() || 'all'} 
            onValueChange={handleFolderChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todas as pastas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as pastas</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id.toString()}>
                  {folder.name} ({folder.contentCount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateFolderModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Fol
          </Button>
        </div>

        {/* Search */}
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar no cofre..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content Type Filters */}
        <div className="flex items-center gap-2">
          {['all', 'images', 'videos', 'audios'].map((type) => (
            <Button
              key={type}
              variant={filters.type === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange(type)}
              className={filters.type === type ? 'bg-black text-white hover:bg-gray-800' : ''}
            >
              {type === 'all' && 'Todos'}
              {type === 'images' && 'Imagens'}
              {type === 'videos' && 'Videos'}
              {type === 'audios' && 'Audios'}
            </Button>
          ))}
        </div>

        {/* Select All */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={isSelectMode && hasSelection}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectAll();
              }
            }}
          />
          <label 
            htmlFor="select-all" 
            className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Selecionar tudo
          </label>
        </div>
      </div>

      {/* Create Folder Modal */}
      <CreateFolderModal
        open={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
      />
    </>
  );
}
