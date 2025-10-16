import React, { useState } from 'react';
import { CreatorLayout } from "@/components/creator/CreatorLayout";
import { ListsOverview } from '@/components/creator/lists/ListsOverview';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink } from 'lucide-react';

export function ListsPage() {
  const [showPromotionRedirect, setShowPromotionRedirect] = useState(false);
  const [pendingListId, setPendingListId] = useState<number | null>(null);

  const handleCreateOffer = (listId: number) => {
    // For now, show a dialog explaining that this will redirect to promotions
    setPendingListId(listId);
    setShowPromotionRedirect(true);
  };

  const handleRedirectToPromotions = () => {
    // In a real implementation, this would navigate to the promotions page
    // with the listId pre-selected or pass it as a parameter
    window.location.href = '/creator/tools/promotions';
  };

  const handleClosePromotionDialog = () => {
    setShowPromotionRedirect(false);
    setPendingListId(null);
  };

  return (
    <CreatorLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Listas de Assinantes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize e gerencie seus assinantes e seguidores com listas personalizadas e inteligentes
            </p>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <ListsOverview onCreateOffer={handleCreateOffer} />
        </main>

        {/* Promotion Redirect Dialog */}
        <Dialog open={showPromotionRedirect} onOpenChange={handleClosePromotionDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Redirecionar para Promoções
              </DialogTitle>
              <DialogDescription>
                Para criar uma oferta específica para esta lista, você será redirecionado para a página de Promoções.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-800 dark:text-orange-200">
                  <p className="font-medium mb-1">Funcionalidade em Desenvolvimento:</p>
                  <p>
                    A integração direta entre listas e promoções está sendo implementada. 
                    Por enquanto, você pode criar promoções na página dedicada e selecionar 
                    manualmente os destinatários.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClosePromotionDialog}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRedirectToPromotions}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ir para Promoções
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CreatorLayout>
  );
}

