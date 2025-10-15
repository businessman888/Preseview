import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Gift, 
  Play, 
  Edit3,
  MoreVertical
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VaultItemProps {
  content: {
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
  };
  isSelected: boolean;
  isSelectMode: boolean;
  onSelect: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onMove?: (id: number) => void;
}

export function VaultItem({
  content,
  isSelected,
  isSelectMode,
  onSelect,
  onEdit,
  onDelete,
  onMove
}: VaultItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isHovered ? 'shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
        <img
          src={content.thumbnail}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        
        {/* Badge "Publicado" */}
        <Badge className="absolute top-2 left-2 bg-pink-500 hover:bg-pink-600 text-white text-xs">
          Publicado
        </Badge>

        {/* Play Button for Videos */}
        {content.mediaType === 'video' && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <Play className="h-3 w-3" />
            <span>0:05</span>
          </div>
        )}

        {/* Edit Button */}
        {isHovered && !isSelectMode && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(content.id);
            }}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        )}

        {/* More Options */}
        {isHovered && !isSelectMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-12 h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(content.id)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove?.(content.id)}>
                <MoreVertical className="h-4 w-4 mr-2" />
                Mover
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(content.id)}
                className="text-red-600 focus:text-red-600"
              >
                <MoreVertical className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Checkbox for Selection */}
        {isSelectMode && (
          <div className="absolute top-2 left-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(content.id)}
              className="bg-white/90 border-gray-300"
            />
          </div>
        )}

        {/* Stats Overlay */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <div className="grid grid-cols-4 gap-2 text-white text-xs">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{formatNumber(content.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{formatNumber(content.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{formatNumber(content.comments)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gift className="h-3 w-3" />
                <span>{formatNumber(content.gifts)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
          {content.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(content.createdAt), { 
            addSuffix: true, 
            locale: ptBR 
          })}
        </p>
      </div>
    </Card>
  );
}
