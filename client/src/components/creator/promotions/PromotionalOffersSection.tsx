import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePromotionalOffers, useDeleteOffer, useToggleOffer } from "@/hooks/use-promotions";
import { OfferCard } from "./OfferCard";
import { CreateOfferModal } from "./CreateOfferModal";
import { EditOfferModal } from "./EditOfferModal";
import { toast } from "@/hooks/use-toast";
import { Plus, Megaphone } from "lucide-react";
import type { PromotionalOffer } from "@shared/schema";

export function PromotionalOffersSection() {
  const { data: offers = [], isLoading } = usePromotionalOffers({ isActive: true });
  const deleteMutation = useDeleteOffer();
  const toggleMutation = useToggleOffer();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<PromotionalOffer | null>(null);

  const handleCreateOffer = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditOffer = (offer: PromotionalOffer) => {
    setEditingOffer(offer);
  };

  const handleCloseEditModal = () => {
    setEditingOffer(null);
  };

  const handleDeleteOffer = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Oferta excluída!",
        description: "A oferta promocional foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir oferta",
        description: "Não foi possível excluir a oferta.",
        variant: "destructive",
      });
    }
  };

  const handleToggleOffer = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast({
        title: "Status alterado!",
        description: "O status da oferta foi alterado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status da oferta.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Iniciar uma oferta promocional de conta
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ofereça um período de teste gratuito ou um desconto de subscrição no seu perfil a novos ou antigos subscritores.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhuma oferta ativa
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Crie ofertas promocionais para atrair novos assinantes ou recompensar os existentes.
              </p>
              <Button onClick={handleCreateOffer}>
                <Plus className="h-4 w-4 mr-2" />
                Criar oferta promocional
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {offers.length} oferta{offers.length !== 1 ? 's' : ''} ativa{offers.length !== 1 ? 's' : ''}
                </p>
                <Button 
                  onClick={handleCreateOffer}
                  disabled={offers.length >= 5}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar oferta promocional
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onEdit={handleEditOffer}
                    onDelete={handleDeleteOffer}
                    onToggleStatus={handleToggleOffer}
                  />
                ))}
              </div>
              
              {offers.length >= 5 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                      <p className="font-medium">Limite de ofertas atingido</p>
                      <p className="text-xs mt-1">
                        Você pode ter no máximo 5 ofertas ativas simultaneamente. Desative uma oferta existente para criar uma nova.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateOfferModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />

      {editingOffer && (
        <EditOfferModal
          offer={editingOffer}
          isOpen={!!editingOffer}
          onClose={handleCloseEditModal}
        />
      )}
    </>
  );
}
