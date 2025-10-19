import { useState } from "react";
import { Play, Image, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserPurchases, PurchasedContent } from "@/hooks/useUserPurchases";

export function PurchasedGrid() {
  const { purchases, isLoading, isEmpty } = useUserPurchases();
  const [selectedContent, setSelectedContent] = useState<PurchasedContent | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma compra ainda
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Quando comprar conteúdo exclusivo, ele aparecerá aqui.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {purchases.map((content) => (
          <div
            key={content.id}
            className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedContent(content)}
          >
            {content.thumbnailUrl ? (
              <img
                src={content.thumbnailUrl}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            ) : content.mediaUrls.length > 0 ? (
              <img
                src={content.mediaUrls[0]}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                <p className="text-white text-center p-2 text-sm line-clamp-3">
                  {content.title}
                </p>
              </div>
            )}

            {/* Type indicator */}
            <div className="absolute top-2 right-2">
              {content.type === 'video' ? (
                <Play className="w-4 h-4 text-white drop-shadow-lg" />
              ) : content.type === 'image' ? (
                <Image className="w-4 h-4 text-white drop-shadow-lg" />
              ) : content.isExclusive ? (
                <Lock className="w-4 h-4 text-white drop-shadow-lg" />
              ) : null}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />
          </div>
        ))}
      </div>

      {/* Content Viewer Modal */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedContent?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-4">
              {/* Media Content */}
              {selectedContent.mediaUrls.length > 0 && (
                <div className="space-y-2">
                  {selectedContent.mediaUrls.map((url, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      {url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                        <video src={url} controls className="w-full" />
                      ) : (
                        <img src={url} alt={`Mídia ${index + 1}`} className="w-full" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Content Info */}
              <div className="space-y-2">
                {selectedContent.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedContent.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Por {selectedContent.creatorName}</span>
                  <span>Comprado em {new Date(selectedContent.purchaseDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
