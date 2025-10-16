import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useSubscriberLists } from '@/hooks/use-lists';
import { ListCard } from './ListCard';
import { CreateListModal } from './CreateListModal';
import { EditListModal } from './EditListModal';
import { ListDetailsModal } from './ListDetailsModal';
import { SendMessageModal } from './SendMessageModal';
import { AddMembersModal } from './AddMembersModal';
import { SubscriberList } from '@/hooks/use-lists';

interface CustomListsTabProps {
  onCreateOffer: (listId: number) => void;
}

export function CustomListsTab({ onCreateOffer }: CustomListsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  
  const [selectedList, setSelectedList] = useState<SubscriberList | null>(null);

  const { 
    data: customLists = [], 
    isLoading, 
    refetch 
  } = useSubscriberLists({ listType: 'custom' });

  const filteredLists = customLists.filter(list => {
    const matchesSearch = list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesActiveFilter = showActiveOnly ? list.isActive : true;
    return matchesSearch && matchesActiveFilter;
  });

  const handleCreateList = () => {
    setShowCreateModal(true);
  };

  const handleEditList = (listId: number) => {
    const list = customLists.find(l => l.id === listId);
    if (list) {
      setSelectedList(list);
      setShowEditModal(true);
    }
  };

  const handleViewMembers = (listId: number) => {
    const list = customLists.find(l => l.id === listId);
    if (list) {
      setSelectedList(list);
      setShowDetailsModal(true);
    }
  };

  const handleSendMessage = (listId: number) => {
    const list = customLists.find(l => l.id === listId);
    if (list) {
      setSelectedList(list);
      setShowSendMessageModal(true);
    }
  };

  const handleAddMembers = (listId: number) => {
    const list = customLists.find(l => l.id === listId);
    if (list) {
      setSelectedList(list);
      setShowAddMembersModal(true);
    }
  };

  const handleDeleteList = (listId: number) => {
    // This would be implemented with a confirmation dialog
    console.log('Delete list:', listId);
  };

  const handleToggleStatus = (listId: number) => {
    // This would be implemented with the toggle mutation
    console.log('Toggle status:', listId);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedList(null);
    refetch();
  };

  const handleSendMessageSuccess = (result: { sentCount: number; failedCount: number }) => {
    setShowSendMessageModal(false);
    setSelectedList(null);
    // Show success message
    console.log('Messages sent:', result);
  };

  const handleAddMembersSuccess = (addedCount: number) => {
    setShowAddMembersModal(false);
    setSelectedList(null);
    refetch();
    // Show success message
    console.log('Members added:', addedCount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Listas Personalizadas
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas listas criadas manualmente
          </p>
        </div>
        
        <Button onClick={handleCreateList}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Lista
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar listas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={showActiveOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowActiveOnly(!showActiveOnly)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showActiveOnly ? 'Ativas' : 'Todas'}
          </Button>
          
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Lists Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredLists.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || showActiveOnly ? 'Nenhuma lista encontrada' : 'Nenhuma lista criada'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || showActiveOnly 
              ? 'Tente ajustar os filtros ou termos de busca.'
              : 'Crie sua primeira lista personalizada para organizar seus assinantes.'
            }
          </p>
          {!searchTerm && !showActiveOnly && (
            <Button onClick={handleCreateList}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Lista
            </Button>
          )}
        </Card>
      ) : (
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredLists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onViewMembers={handleViewMembers}
              onSendMessage={handleSendMessage}
              onCreateOffer={onCreateOffer}
              onEdit={handleEditList}
              onDelete={handleDeleteList}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {customLists.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Mostrando {filteredLists.length} de {customLists.length} listas
            </span>
            <span>
              {customLists.filter(l => l.isActive).length} ativas
            </span>
          </div>
        </Card>
      )}

      {/* Modals */}
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditListModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedList(null);
        }}
        list={selectedList}
        onSuccess={handleEditSuccess}
      />

      <ListDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedList(null);
        }}
        list={selectedList}
        onSendMessage={handleSendMessage}
        onCreateOffer={onCreateOffer}
      />

      <SendMessageModal
        isOpen={showSendMessageModal}
        onClose={() => {
          setShowSendMessageModal(false);
          setSelectedList(null);
        }}
        listId={selectedList?.id || 0}
        listName={selectedList?.name || ''}
        memberCount={selectedList?.memberCount || 0}
        onSuccess={handleSendMessageSuccess}
      />

      <AddMembersModal
        isOpen={showAddMembersModal}
        onClose={() => {
          setShowAddMembersModal(false);
          setSelectedList(null);
        }}
        listId={selectedList?.id || 0}
        listName={selectedList?.name || ''}
        onSuccess={handleAddMembersSuccess}
      />
    </div>
  );
}
