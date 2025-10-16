import { useParams } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  User, 
  Calendar, 
  DollarSign,
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { usePaidLinkPreview, usePurchasePaidLink, formatPrice } from "@/hooks/use-paid-links";
import { toast } from "@/hooks/use-toast";

export function PaidLinkPreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const { data: linkData, isLoading, error } = usePaidLinkPreview(slug || "");
  const purchaseMutation = usePurchasePaidLink();

  const handlePurchase = async () => {
    if (!slug) return;
    
    setIsPurchasing(true);
    try {
      const result = await purchaseMutation.mutateAsync(slug);
      
      // Redirecionar para página de acesso com token
      window.location.href = `/l/${slug}/access/${result.accessToken}`;
    } catch (error) {
      // Error já tratado no hook
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600 dark:text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (error || !linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Link não encontrado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Este link pode ter sido removido, desativado ou não existe.
            </p>
            <Button onClick={handleGoHome}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { creator, ...link } = linkData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleGoHome} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Preseview</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conteúdo Premium</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Preview da mídia com blur */}
          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-800">
                  {/* Thumbnail com blur */}
                  <img
                    src={link.thumbnailUrl || link.mediaUrl}
                    alt={link.title}
                    className="w-full h-full object-cover filter blur-xl scale-110"
                  />
                  
                  {/* Overlay com cadeado */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Lock className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-white font-medium">Conteúdo Bloqueado</p>
                      <p className="text-white/80 text-sm">Faça o pagamento para acessar</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações e botão de compra */}
          <div className="space-y-6">
            {/* Informações do conteúdo */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="text-sm">
                  {link.mediaType === 'image' ? '🖼️ Imagem' : 
                   link.mediaType === 'video' ? '🎥 Vídeo' : 
                   link.mediaType === 'audio' ? '🎵 Áudio' : '📄 Mídia'}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(link.createdAt).toLocaleDateString('pt-BR')}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {link.title}
              </h1>
              
              {link.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {link.description}
                </p>
              )}
            </div>

            {/* Informações do criador */}
            <Card className="border border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {creator.profile_image ? (
                      <img
                        src={creator.profile_image}
                        alt={creator.display_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {creator.display_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{creator.username}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preço e botão de compra */}
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Preço para acesso
                    </p>
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                      {formatPrice(link.price)}
                    </div>
                  </div>
                  
                  <Button
                    size="lg"
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5 mr-2" />
                        Pagar {formatPrice(link.price)} para ver
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Após o pagamento, você terá acesso permanente ao conteúdo
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Informações adicionais */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🔒 Pagamento seguro e protegido
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ✅ Acesso imediato após confirmação
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📱 Compatível com todos os dispositivos
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 Preseview. Todos os direitos reservados.
            </p>
            <div className="flex justify-center gap-6 mt-4">
              <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Termos de Uso
              </a>
              <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Política de Privacidade
              </a>
              <a href="/support" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
