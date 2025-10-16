import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { useAddMultipleMembers } from '@/hooks/use-lists';
import { Users, Search, Loader2, Plus, User } from 'lucide-react';

interface User {
  id: number;
  username: string;
  display_name: string;
  profile_image: string | null;
  user_type: string;
  is_verified: boolean;
}

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: number;
  listName: string;
  onSuccess?: (addedCount: number) => void;
}

export function AddMembersModal({
  isOpen,
  onClose,
  listId,
  listName,
  onSuccess,
}: AddMembersModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const addMembersMutation = useAddMultipleMembers();

  // Mock data for demonstration - in real implementation, this would come from an API
  const mockUsers: User[] = [
    {
      id: 1,
      username: 'joao123',
      display_name: 'João Silva',
      profile_image: null,
      user_type: 'user',
      is_verified: false,
    },
    {
      id: 2,
      username: 'maria456',
      display_name: 'Maria Santos',
      profile_image: null,
      user_type: 'user',
      is_verified: true,
    },
    {
      id: 3,
      username: 'pedro789',
      display_name: 'Pedro Oliveira',
      profile_image: null,
      user_type: 'user',
      is_verified: false,
    },
  ];

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockUsers.filter(user =>
          user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setAvailableUsers(filtered);
        setIsSearching(false);
      }, 500);
    } else {
      setAvailableUsers([]);
    }
  }, [searchTerm]);

  const handleUserToggle = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === availableUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(availableUsers.map(user => user.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUsers.length === 0) return;

    try {
      await addMembersMutation.mutateAsync({
        listId,
        userIds: selectedUsers,
      });

      // Reset form
      setSelectedUsers([]);
      setSearchTerm('');
      setAvailableUsers([]);

      onSuccess?.(selectedUsers.length);
      onClose();
    } catch (error) {
      console.error('Error adding members:', error);
    }
  };

  const handleClose = () => {
    if (!addMembersMutation.isPending) {
      setSelectedUsers([]);
      setSearchTerm('');
      setAvailableUsers([]);
      onClose();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Membros
          </DialogTitle>
          <DialogDescription>
            Adicione membros à lista "{listName}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
          {/* Search */}
          <div className="space-y-2 flex-shrink-0">
            <Label htmlFor="search">Buscar Usuários</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Digite o nome ou username do usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={addMembersMutation.isPending}
              />
            </div>
          </div>

          {/* Selected Count */}
          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {selectedUsers.length} usuário{selectedUsers.length !== 1 ? 's' : ''} selecionado{selectedUsers.length !== 1 ? 's' : ''}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUsers([])}
                >
                  Limpar Seleção
                </Button>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Buscando usuários...</span>
              </div>
            ) : searchTerm.trim() === '' ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Buscar Usuários
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Digite o nome ou username do usuário para começar a busca.
                </p>
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Tente ajustar os termos de busca.
                </p>
              </div>
            ) : (
              <>
                {/* Select All */}
                {availableUsers.length > 1 && (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Checkbox
                      id="select-all"
                      checked={selectedUsers.length === availableUsers.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium">
                      Selecionar todos ({availableUsers.length})
                    </Label>
                  </div>
                )}

                {/* User List */}
                {availableUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleUserToggle(user.id)}
                    />
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={user.profile_image || undefined} 
                        alt={user.display_name}
                      />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {getInitials(user.display_name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {user.display_name}
                        </h4>
                        {user.is_verified && (
                          <span className="text-blue-500 text-xs">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={addMembersMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={addMembersMutation.isPending || selectedUsers.length === 0}
            >
              {addMembersMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar {selectedUsers.length} Membro{selectedUsers.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
