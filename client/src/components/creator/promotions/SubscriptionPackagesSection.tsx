import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscriptionPackages, useDeletePackage, useTogglePackage } from "@/hooks/use-promotions";
import { useSubscriptionPrice } from "@/hooks/use-promotions";
import { PackageCard } from "./PackageCard";
import { CreatePackageModal } from "./CreatePackageModal";
import { EditPackageModal } from "./EditPackageModal";
import { toast } from "@/hooks/use-toast";
import { Plus, Package } from "lucide-react";
import type { SubscriptionPackage } from "@shared/schema";

export function SubscriptionPackagesSection() {
  const { data: packages = [], isLoading } = useSubscriptionPackages();
  const { data: basePrice = 0 } = useSubscriptionPrice();
  const deleteMutation = useDeletePackage();
  const toggleMutation = useTogglePackage();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | null>(null);

  const handleCreatePackage = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditPackage = (pkg: SubscriptionPackage) => {
    setEditingPackage(pkg);
  };

  const handleCloseEditModal = () => {
    setEditingPackage(null);
  };

  const handleDeletePackage = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Pacote excluído!",
        description: "O pacote de subscrição foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir pacote",
        description: "Não foi possível excluir o pacote.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePackage = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast({
        title: "Status alterado!",
        description: "O status do pacote foi alterado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do pacote.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pacotes de subscrição
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ofereça desconto aos seus fãs durante vários meses como pacote de subscrição.
          </p>
        </CardHeader>
        <CardContent>
          {basePrice === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium">Defina um preço base primeiro</p>
                  <p className="text-xs mt-1">
                    Você precisa definir um preço mensal antes de criar pacotes promocionais.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum pacote criado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Crie pacotes promocionais para oferecer descontos aos seus fãs.
              </p>
              <Button 
                onClick={handleCreatePackage}
                disabled={basePrice === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar pacote promocional
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {packages.length} pacote{packages.length !== 1 ? 's' : ''} criado{packages.length !== 1 ? 's' : ''}
                </p>
                <Button 
                  onClick={handleCreatePackage}
                  disabled={basePrice === 0 || packages.length >= 3}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar pacote promocional
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    basePrice={basePrice}
                    onEdit={handleEditPackage}
                    onDelete={handleDeletePackage}
                    onToggleStatus={handleTogglePackage}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CreatePackageModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        basePrice={basePrice}
      />

      {editingPackage && (
        <EditPackageModal
          pkg={editingPackage}
          isOpen={!!editingPackage}
          onClose={handleCloseEditModal}
          basePrice={basePrice}
        />
      )}
    </>
  );
}
