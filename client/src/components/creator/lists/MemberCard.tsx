import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Trash2, 
  Crown, 
  Heart,
  Calendar,
  UserCheck
} from 'lucide-react';
import { ListMember } from '@/hooks/use-lists';

interface MemberCardProps {
  member: ListMember;
  onRemove?: (userId: number) => void;
  showRemoveButton?: boolean;
}

export function MemberCard({ 
  member, 
  onRemove, 
  showRemoveButton = false 
}: MemberCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserTypeIcon = () => {
    switch (member.user.user_type) {
      case 'creator':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'user':
        return <User className="h-3 w-3 text-blue-500" />;
      default:
        return <User className="h-3 w-3 text-gray-500" />;
    }
  };

  const getUserTypeColor = () => {
    switch (member.user.user_type) {
      case 'creator':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getAddedByIcon = () => {
    return member.addedBy === 'auto' ? (
      <UserCheck className="h-3 w-3 text-green-500" />
    ) : (
      <Heart className="h-3 w-3 text-purple-500" />
    );
  };

  const getAddedByColor = () => {
    return member.addedBy === 'auto' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hoje';
    } else if (diffDays === 2) {
      return 'Ontem';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <Card className="p-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={member.user.profile_image || undefined} 
              alt={member.user.display_name}
            />
            <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {getInitials(member.user.display_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                {member.user.display_name}
              </h4>
              {member.user.is_verified && (
                <Badge variant="secondary" className="h-4 px-1 text-xs">
                  ✓
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                @{member.user.username}
              </span>
              <div className="flex items-center gap-1">
                {getUserTypeIcon()}
                <Badge 
                  variant="outline" 
                  className={`h-4 px-1 text-xs ${getUserTypeColor()}`}
                >
                  {member.user.user_type === 'creator' ? 'Criador' : 'Usuário'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>Adicionado {formatDate(member.addedAt)}</span>
              <div className="flex items-center gap-1">
                {getAddedByIcon()}
                <Badge 
                  variant="outline" 
                  className={`h-4 px-1 text-xs ${getAddedByColor()}`}
                >
                  {member.addedBy === 'auto' ? 'Automático' : 'Manual'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {showRemoveButton && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(member.user.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
