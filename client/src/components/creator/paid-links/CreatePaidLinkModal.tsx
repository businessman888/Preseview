import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image, 
  Video, 
  Music, 
  File, 
  Check,
  Copy,
  QrCode,
  Share2,
  MessageCircle,
  Twitter,
  Facebook,
  Send
} from "lucide-react";
import { useCreatePaidMediaLink, generateSlug, getShareUrls, copyToClipboard } from "@/hooks/use-paid-links";
import { toast } from "@/hooks/use-toast";
import type { InsertPaidMediaLink } from "@shared/schema";

interface CreatePaidLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedMedia {
  type: 'upload' | 'feed' | 'vault';
  data: {
    url: string;
    thumbnailUrl?: string;
    title: string;
    mediaType: 'image' | 'video' | 'audio';
  } | null;
}

export function CreatePaidLinkModal({ isOpen, onClose }: CreatePaidLinkModalProps) {
  const [activeTab, setActiveTab] = useState("select");
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia>({ type: 'upload', data: null });
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  
  // Generated link data
  const [createdLink, setCreatedLink] = useState<InsertPaidMediaLink | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createMutation = useCreatePaidMediaLink();

  const handleClose = () => {
    // Reset form
    setActiveTab("select");
    setSelectedMedia({ type: 'upload', data: null });
    setTitle("");
    setDescription("");
    setPrice("");
    setCreatedLink(null);
    setLinkUrl("");
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simular upload (em produção, enviaria para servidor)
    const url = URL.createObjectURL(file);
    const mediaType = file.type.startsWith('image/') ? 'image' : 
                     file.type.startsWith('video/') ? 'video' : 'audio';

    setSelectedMedia({
      type: 'upload',
      data: {
        url,
        title: file.name,
        mediaType
      }
    });
  };

  const handleCreateLink = async () => {
    if (!selectedMedia.data || !title || !price) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const linkData = {
      title,
      description: description || null,
      mediaUrl: selectedMedia.data.url,
      mediaType: selectedMedia.data.mediaType,
      thumbnailUrl: selectedMedia.data.thumbnailUrl || selectedMedia.data.url,
      price: parseFloat(price),
      sourceType: selectedMedia.type,
      sourceId: null,
    };

    try {
      const result = await createMutation.mutateAsync(linkData);
      setCreatedLink(result);
      setLinkUrl(`${window.location.origin}/l/${result.slug}`);
      setActiveTab("share");
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(linkUrl);
    if (success) {
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    const shareUrls = getShareUrls(linkUrl);
    const url = shareUrls[platform as keyof typeof shareUrls];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Link de Mídia Paga</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select">1. Selecionar Conteúdo</TabsTrigger>
            <TabsTrigger value="configure" disabled={!selectedMedia.data}>2. Configurar Link</TabsTrigger>
            <TabsTrigger value="share" disabled={!createdLink}>3. Compartilhar</TabsTrigger>
          </TabsList>

          {/* Tab 1: Selecionar Conteúdo */}
          <TabsContent value="select" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Upload Novo */}
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMedia.type === 'upload' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedMedia({ type: 'upload', data: null });
                  fileInputRef.current?.click();
                }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Upload Novo</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Fazer upload de um arquivo novo
                    </p>
                  </div>
                  {selectedMedia.type === 'upload' && selectedMedia.data && (
                    <Badge variant="default">
                      <Check className="w-3 h-3 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Do Feed */}
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMedia.type === 'feed' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedMedia({ type: 'feed', data: null });
                  // TODO: Abrir seletor de posts do feed
                }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Do Feed</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selecionar post existente
                    </p>
                  </div>
                  {selectedMedia.type === 'feed' && selectedMedia.data && (
                    <Badge variant="default">
                      <Check className="w-3 h-3 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Do Cofre */}
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMedia.type === 'vault' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedMedia({ type: 'vault', data: null });
                  // TODO: Abrir seletor de itens do cofre
                }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <File className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Do Cofre</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selecionar item do cofre
                    </p>
                  </div>
                  {selectedMedia.type === 'vault' && selectedMedia.data && (
                    <Badge variant="default">
                      <Check className="w-3 h-3 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview da mídia selecionada */}
            {selectedMedia.data && (
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Preview:</h4>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    {getMediaIcon(selectedMedia.data.mediaType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-gray-900 dark:text-white">{selectedMedia.data.title}</h5>
                      <Badge variant="outline">{selectedMedia.data.mediaType}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Fonte: {selectedMedia.type === 'upload' ? 'Upload' : 
                              selectedMedia.type === 'feed' ? 'Feed' : 'Cofre'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </TabsContent>

          {/* Tab 2: Configurar Link */}
          <TabsContent value="configure" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formulário */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título do conteúdo"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o conteúdo (opcional)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <Label>Preview do Link</Label>
                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                      {selectedMedia.data ? (
                        getMediaIcon(selectedMedia.data.mediaType)
                      ) : (
                        <div className="text-gray-400">Preview</div>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {title || "Título do conteúdo"}
                    </h4>
                    {description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {selectedMedia.data?.mediaType || 'mídia'}
                      </Badge>
                      <span className="font-bold text-lg text-green-600 dark:text-green-400">
                        {price ? `R$ ${price}` : 'R$ 0,00'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setActiveTab("select")}>
                Voltar
              </Button>
              <Button 
                onClick={handleCreateLink}
                disabled={!title || !price || createMutation.isPending}
              >
                {createMutation.isPending ? "Criando..." : "Criar Link"}
              </Button>
            </div>
          </TabsContent>

          {/* Tab 3: Compartilhar */}
          <TabsContent value="share" className="space-y-6">
            {createdLink && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Link criado com sucesso!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Seu link de mídia paga está pronto para ser compartilhado.
                  </p>
                </div>

                {/* Link gerado */}
                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Link gerado:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={linkUrl}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button size="sm" onClick={handleCopyLink}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Ações de compartilhamento */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Compartilhar em:
                  </Label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialShare('whatsapp')}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleSocialShare('twitter')}
                      className="flex items-center gap-2"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleSocialShare('facebook')}
                      className="flex items-center gap-2"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleSocialShare('telegram')}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Telegram
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleClose}>
                    Fechar
                  </Button>
                  <Button onClick={() => window.open(linkUrl, '_blank')}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Visualizar Link
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
