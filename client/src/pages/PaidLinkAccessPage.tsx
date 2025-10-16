import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Unlock, 
  User, 
  Calendar, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Heart,
  Star,
  ExternalLink
} from "lucide-react";
import { useVerifyPurchase } from "@/hooks/use-paid-links";

export function PaidLinkAccessPage() {
  const { slug, token } = useParams<{ slug: string; token: string }>();
  const { data: linkData, isLoading, error } = useVerifyPurchase(slug || "", token || "");

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleFollowCreator = () => {
    // TODO: Implementar follow do criador
    console.log('Follow creator:', linkData?.creator.username);
  };

  const handleSubscribeCreator = () => {
    // TODO: Implementar assinatura do criador
    console.log('Subscribe to creator:', linkData?.creator.username);
  };

  const handleViewMoreContent = () => {
    // TODO: Redirecionar para perfil do criador
    window.location.href = `/creator/${linkData?.creator.username}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600 dark:text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Verificando acesso...</p>
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
              Acesso Negado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Token inválido ou expirado. Verifique o link ou faça uma nova compra.
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Conteúdo Liberado</p>
            </div>
          </div>
        </div>
      </header>

      {/* Success Banner */}
      <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Unlock className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Acesso Liberado!
              </h2>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Você tem acesso permanente a este conteúdo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Mídia liberada */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800">
                  {link.mediaType === 'image' ? (
                    <img
                      src={link.mediaUrl}
                      alt={link.title}
                      className="w-full h-full object-cover"
                    />
                  ) : link.mediaType === 'video' ? (
                    <video
                      src={link.mediaUrl}
                      controls
                      className="w-full h-full"
                    >
                      Seu navegador não suporta vídeos.
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <audio controls className="w-full max-w-md">
                        <source src={link.mediaUrl} />
                        Seu navegador não suporta áudio.
                      </audio>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ações da mídia */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Curtir
              </Button>
              <Button variant="outline" className="flex-1">
                <Star className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Informações e ações do criador */}
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

            {/* Card do criador */}
            <Card className="border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    {creator.profile_image ? (
                      <img
                        src={creator.profile_image}
                        alt={creator.display_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {creator.display_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      @{creator.username}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Button
                        size="sm"
                        onClick={handleFollowCreator}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <User className="w-3 h-3 mr-1" />
                        Seguir
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSubscribeCreator}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Assinar
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      onClick={handleViewMoreContent}
                      className="w-full justify-start text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver mais conteúdo deste criador
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de compra */}
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Unlock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Compra confirmada
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Você tem acesso permanente a este conteúdo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recomendações */}
            <Card className="border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Mais conteúdo de {creator.display_name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <div className="text-sm">🎥</div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        Outro vídeo incrível
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        R$ 15,90
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Ver
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <div className="text-sm">🖼️</div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        Galeria de fotos
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        R$ 9,90
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Ver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
