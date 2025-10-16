import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useUpdatePackage, calculatePackagePrice, calculatePackageSavings, formatCurrency } from "@/hooks/use-promotions";
import { toast } from "@/hooks/use-toast";
import { Package, Percent } from "lucide-react";
import type { SubscriptionPackage } from "@shared/schema";

interface EditPackageModalProps {
  pkg: SubscriptionPackage;
  isOpen: boolean;
  onClose: () => void;
  basePrice: number;
}

export function EditPackageModal({ pkg, isOpen, onClose, basePrice }: EditPackageModalProps) {
  const updatePackageMutation = useUpdatePackage();
  
  const [durationMonths, setDurationMonths] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");

  useEffect(() => {
    if (pkg) {
      setDurationMonths(pkg.durationMonths.toString());
      setDiscountPercent(pkg.discountPercent.toString());
    }
  }, [pkg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = parseInt(durationMonths);
    const discount = parseFloat(discountPercent);
    
    if (isNaN(duration) || ![3, 6, 12].includes(duration)) {
      toast({
        title: "Duração inválida",
        description: "Selecione uma duração válida (3, 6 ou 12 meses).",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(discount) || discount < 1 || discount > 50) {
      toast({
        title: "Desconto inválido",
        description: "O desconto deve estar entre 1% e 50%.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se houve mudanças
    if (duration === pkg.durationMonths && discount === pkg.discountPercent) {
      toast({
        title: "Nenhuma alteração",
        description: "Não foram feitas alterações no pacote.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePackageMutation.mutateAsync({
        id: pkg.id,
        data: {
          durationMonths: duration,
          discountPercent: discount
        }
      });
      
      toast({
        title: "Pacote atualizado!",
        description: "O pacote promocional foi atualizado com sucesso.",
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: "Erro ao atualizar pacote",
        description: "Não foi possível atualizar o pacote promocional.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setDurationMonths(pkg.durationMonths.toString());
    setDiscountPercent(pkg.discountPercent.toString());
    onClose();
  };

  const getPreviewData = () => {
    if (!durationMonths || !discountPercent) return null;
    
    const duration = parseInt(durationMonths);
    const discount = parseFloat(discountPercent);
    
    if (isNaN(duration) || isNaN(discount)) return null;
    
    const discountedPrice = calculatePackagePrice(basePrice, discount);
    const originalTotal = basePrice * duration;
    const discountedTotal = discountedPrice * duration;
    const totalSavings = calculatePackageSavings(basePrice, discount, duration);
    
    return {
      duration,
      discount,
      discountedPrice,
      originalTotal,
      discountedTotal,
      totalSavings
    };
  };

  const preview = getPreviewData();
  const hasChanges = preview && (
    preview.duration !== pkg.durationMonths || 
    preview.discount !== pkg.discountPercent
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Editar Pacote Promocional
          </DialogTitle>
          <DialogDescription>
            Edite as configurações do seu pacote promocional.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duração</Label>
            <Select value={durationMonths} onValueChange={setDurationMonths}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a duração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 meses</SelectItem>
                <SelectItem value="6">6 meses</SelectItem>
                <SelectItem value="12">12 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discount">Desconto (%)</Label>
            <div className="relative">
              <Input
                id="discount"
                type="number"
                step="0.1"
                min="1"
                max="50"
                placeholder="20"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="pr-8"
              />
              <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Entre 1% e 50%
            </p>
          </div>
          
          {preview && (
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Preview do Pacote
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duração:</span>
                    <span className="font-medium">{preview.duration} {preview.duration === 1 ? 'mês' : 'meses'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Desconto:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">-{preview.discount}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Preço mensal:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm line-through text-gray-500">
                        {formatCurrency(basePrice)}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(preview.discountedPrice)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm line-through text-gray-500">
                        {formatCurrency(preview.originalTotal)}
                      </span>
                      <span className="font-bold">
                        {formatCurrency(preview.discountedTotal)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Economia total:
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(preview.totalSavings)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {hasChanges && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium">Alterações detectadas</p>
                  <p className="text-xs mt-1">
                    O pacote será atualizado com as novas configurações.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={updatePackageMutation.isPending || !hasChanges}
            >
              {updatePackageMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
