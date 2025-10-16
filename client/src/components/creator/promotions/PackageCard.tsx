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
  calculatePackagePrice, 
  calculatePackageSavings, 
  formatCurrency 
} from "@/hooks/use-promotions";
import type { SubscriptionPackage } from "@shared/schema";
import { MoreVertical, Edit, Trash2, Power, Star } from "lucide-react";

interface PackageCardProps {
  pkg: SubscriptionPackage;
  basePrice: number;
  onEdit: (pkg: SubscriptionPackage) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export function PackageCard({ pkg, basePrice, onEdit, onDelete, onToggleStatus }: PackageCardProps) {
  const discountedPrice = calculatePackagePrice(basePrice, pkg.discountPercent);
  const totalSavings = calculatePackageSavings(basePrice, pkg.discountPercent, pkg.durationMonths);
  const originalTotal = basePrice * pkg.durationMonths;
  const discountedTotal = discountedPrice * pkg.durationMonths;

  const isPopular = pkg.durationMonths === 6 && pkg.discountPercent >= 20;

  return (
    <Card className={`relative ${!pkg.isActive ? 'opacity-60' : ''}`}>
      {isPopular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Mais Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">
              {pkg.durationMonths} {pkg.durationMonths === 1 ? 'mês' : 'meses'}
            </h3>
            <Badge variant={pkg.isActive ? "default" : "secondary"}>
              {pkg.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(pkg)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus(pkg.id)}>
                <Power className="h-4 w-4 mr-2" />
                {pkg.isActive ? 'Desativar' : 'Ativar'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(pkg.id)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Desconto
            </span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              -{pkg.discountPercent}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Preço mensal
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-gray-500">
                {formatCurrency(basePrice)}
              </span>
              <span className="font-semibold">
                {formatCurrency(discountedPrice)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-gray-500">
                {formatCurrency(originalTotal)}
              </span>
              <span className="font-bold text-lg">
                {formatCurrency(discountedTotal)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Economia total
            </span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalSavings)}
            </span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Criado em {new Date(pkg.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
}
