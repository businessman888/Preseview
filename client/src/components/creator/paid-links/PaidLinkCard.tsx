import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Copy, 
  QrCode, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign,
  ExternalLink,
  Lock,
  Unlock
} from "lucide-react";
import type { PaidMediaLink } from "@shared/schema";
import { 
  formatPrice, 
  formatNumber, 
  getMediaTypeIcon, 
  getMediaTypeColor,
  copyToClipboard 
} from "@/hooks/use-paid-links";
import { toast } from "@/hooks/use-toast";

interface PaidLinkCardProps {
  link: PaidMediaLink;
  onEdit: (link: PaidMediaLink) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onViewStats: (id: number) => void;
  onCopyLink: (link: PaidMediaLink) => void;
  onGenerateQR: (link: PaidMediaLink) => void;
}

export function PaidLinkCard({
  link,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewStats,
  onCopyLink,
  onGenerateQR
}: PaidLinkCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const linkUrl = `${window.location.origin}/l/${link.slug}`;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(linkUrl);
    if (success) {
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    }
    onCopyLink(link);
  };

  const handleToggleStatus = () => {
    onToggleStatus(link.id);
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir o link "${link.title}"?`)) {
      onDelete(link.id);
    }
  };

  const getStatusBadge = () => {
    return link.isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
        <Unlock className="w-3 h-3 mr-1" />
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
        <Lock className="w-3 h-3 mr-1" />
        Inativo
      </Badge>
    );
  };

  const getMediaTypeBadge = () => {
    return (
      <Badge variant="outline" className={getMediaTypeColor(link.mediaType)}>
        {getMediaTypeIcon(link.mediaType)} {link.mediaType}
      </Badge>
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-800">
      <CardContent className="p-0">
        {/* Thumbnail da mídia */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden">
          {link.thumbnailUrl && !imageError ? (
            <img
              src={link.thumbnailUrl}
              alt={link.title}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center">
                <div className="text-4xl mb-2">{getMediaTypeIcon(link.mediaType)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {link.mediaType === 'image' ? 'Imagem' : 
                   link.mediaType === 'video' ? 'Vídeo' : 
                   link.mediaType === 'audio' ? 'Áudio' : 'Mídia'}
                </div>
              </div>
            </div>
          )}
          
          {/* Overlay com preço */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-black/80 text-white hover:bg-black/90">
              {formatPrice(link.price)}
            </Badge>
          </div>

          {/* Badges de tipo e status */}
          <div className="absolute top-3 left-3 flex gap-2">
            {getMediaTypeBadge()}
            {getStatusBadge()}
          </div>
        </div>

        {/* Conteúdo do card */}
        <div className="p-4 space-y-3">
          {/* Título e descrição */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
              {link.title}
            </h3>
            {link.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {link.description}
              </p>
            )}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                <Eye className="w-4 h-4" />
                {formatNumber(link.viewsCount)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                <DollarSign className="w-4 h-4" />
                {link.purchasesCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Vendas</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                {formatPrice(link.totalEarnings)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Receita</div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copiar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGenerateQR(link)}
                className="text-xs"
              >
                <QrCode className="w-3 h-3 mr-1" />
                QR Code
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => window.open(linkUrl, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visualizar Link
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onViewStats(link.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Estatísticas
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => onEdit(link)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleToggleStatus}>
                  {link.isActive ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Ativar
                    </>
                  )}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Link URL (pequeno) */}
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded truncate">
            {linkUrl}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
