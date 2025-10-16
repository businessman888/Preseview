import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  getOfferTypeLabel, 
  getTargetAudienceLabel, 
  getOfferStatus,
  isOfferExpired
} from "@/hooks/use-promotions";
import type { PromotionalOffer } from "@shared/schema";
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Power, 
  Gift, 
  Percent, 
  Users, 
  Calendar,
  TrendingUp
} from "lucide-react";

interface OfferCardProps {
  offer: PromotionalOffer;
  onEdit: (offer: PromotionalOffer) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export function OfferCard({ offer, onEdit, onDelete, onToggleStatus }: OfferCardProps) {
  const status = getOfferStatus(offer);
  const isExpired = isOfferExpired(offer.endDate);

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expirado</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>;
      default:
        return <Badge variant="secondary">Inativo</Badge>;
    }
  };

  const getOfferIcon = () => {
    return offer.offerType === 'trial' ? (
      <Gift className="h-4 w-4 text-blue-500" />
    ) : (
      <Percent className="h-4 w-4 text-purple-500" />
    );
  };

  const getOfferDetails = () => {
    if (offer.offerType === 'trial') {
      return `${offer.trialDays} dias grátis`;
    } else {
      return `${offer.discountPercent}% de desconto por ${offer.discountDurationMonths} ${offer.discountDurationMonths === 1 ? 'mês' : 'meses'}`;
    }
  };

  return (
    <Card className={`relative ${!offer.isActive ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1">
            {getOfferIcon()}
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1">
                {offer.title}
              </h3>
              {offer.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                  {offer.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(offer)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus(offer.id)}>
                  <Power className="h-4 w-4 mr-2" />
                  {offer.isActive ? 'Desativar' : 'Ativar'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(offer.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <span>Tipo</span>
            </span>
            <span className="font-medium">
              {getOfferTypeLabel(offer.offerType)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <span>Detalhes</span>
            </span>
            <span className="font-medium text-sm">
              {getOfferDetails()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Público-alvo</span>
            </span>
            <span className="text-sm">
              {getTargetAudienceLabel(offer.targetAudience)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>Uso</span>
            </span>
            <span className="text-sm font-medium">
              {offer.usageCount} {offer.usageCount === 1 ? 'vez' : 'vezes'}
            </span>
          </div>
        </div>
        
        {(offer.startDate || offer.endDate) && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Período</span>
              </span>
              <span>
                {offer.startDate && new Date(offer.startDate).toLocaleDateString('pt-BR')}
                {offer.startDate && offer.endDate && ' - '}
                {offer.endDate && new Date(offer.endDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Criado em {new Date(offer.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
}
