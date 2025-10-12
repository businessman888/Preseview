import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, Image as ImageIcon, Mic, Gift, MoreVertical, Sparkles } from "lucide-react";
import { User as UserType, Message } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export const ScreenChatConversation = (): JSX.Element => {
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [audioDialogOpen, setAudioDialogOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const shouldPersistRecordingRef = useRef<boolean>(true);
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [giftAmount, setGiftAmount] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const otherUserId = parseInt(userId || "0");

  const { data: otherUser } = useQuery<UserType>({
    queryKey: ["/api/user", otherUserId],
  });

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: [`/api/messages/${otherUserId}`],
  });

  const { data: currentUser } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { receiverId: number; content: string; mediaUrl?: string }) => {
      return await apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    },
  });

  const sendTipMutation = useMutation({
    mutationFn: async (data: { receiverId: number; amount: number; message: string }) => {
      return await apiRequest("POST", "/api/tips", data);
    },
    onSuccess: () => {
      toast({
        title: "Presente enviado!",
        description: "Seu presente foi enviado com sucesso",
      });
      setGiftDialogOpen(false);
      setGiftAmount("");
      setGiftMessage("");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o presente",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PUT", `/api/messages/${otherUserId}/read`);
    },
  });

  useEffect(() => {
    if (messages.length > 0) {
      markAsReadMutation.mutate();
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({
      receiverId: otherUserId,
      content: message,
    });
  };

  const handleSendImage = () => {
    if (!imageUrl.trim()) return;
    
    sendMessageMutation.mutate({
      receiverId: otherUserId,
      content: "📷 Imagem",
      mediaUrl: imageUrl,
    });
    
    setImageDialogOpen(false);
    setImageUrl("");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Only persist the recording if it wasn't canceled
        if (shouldPersistRecordingRef.current) {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setAudioBlob(audioBlob);
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      shouldPersistRecordingRef.current = true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cleanupAudioRecording = () => {
    // Prevent onstop handler from persisting the recording
    shouldPersistRecordingRef.current = false;
    
    // Revoke any existing object URL to prevent memory leaks
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }
    
    // Stop recording if active
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    // Stop all media tracks
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    // Reset state
    setIsRecording(false);
    setAudioUrl("");
    setAudioBlob(null);
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
  };

  const handleSendAudio = async () => {
    if (!audioBlob) return;
    
    // Validate audio size (max 5MB to avoid payload issues)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (audioBlob.size > maxSize) {
      toast({
        title: "Áudio muito grande",
        description: "O áudio deve ter no máximo 5MB. Grave uma mensagem mais curta.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Convert audio blob to base64 for persistent storage
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        
        sendMessageMutation.mutate({
          receiverId: otherUserId,
          content: "🎤 Áudio",
          mediaUrl: base64Audio,
        });
        
        setAudioDialogOpen(false);
        
        // Clean up
        if (audioUrl && audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
        setIsRecording(false);
        setAudioUrl("");
        setAudioBlob(null);
        audioChunksRef.current = [];
        mediaRecorderRef.current = null;
        shouldPersistRecordingRef.current = true;
      };
      
      reader.onerror = () => {
        toast({
          title: "Erro ao processar áudio",
          description: "Não foi possível converter o áudio. Tente gravar novamente.",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar o áudio",
        variant: "destructive",
      });
    }
  };

  const handleSendGift = () => {
    const amount = parseFloat(giftAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }

    sendTipMutation.mutate({
      receiverId: otherUserId,
      amount,
      message: giftMessage,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!otherUser || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/messages">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <Avatar className="w-10 h-10">
              <AvatarImage src={otherUser.profileImage || ""} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                {otherUser.displayName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{otherUser.displayName}</h1>
              <p className="text-xs text-gray-500">@{otherUser.username}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" data-testid="button-options">
            <MoreVertical className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b dark:border-gray-800 bg-white dark:bg-gray-900">
          <TabsTrigger value="chat" className="flex-1" data-testid="tab-chat">
            Chat
          </TabsTrigger>
          <TabsTrigger value="multimedia" className="flex-1" data-testid="tab-multimedia">
            Multimídia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 dark:bg-black">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">Nenhuma mensagem ainda</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl mx-auto">
                {messages.map((msg, index) => {
                  const isSent = msg.senderId === currentUser.id;
                  const showDate =
                    index === 0 ||
                    new Date(messages[index - 1].createdAt).toDateString() !==
                      new Date(msg.createdAt).toDateString();

                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                            {new Date(msg.createdAt).toLocaleDateString("pt-BR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                            isSent
                              ? "bg-green-100 dark:bg-green-900 text-gray-900 dark:text-white rounded-tr-sm"
                              : "bg-white dark:bg-gray-800 rounded-tl-sm"
                          }`}
                          data-testid={`message-${msg.id}`}
                        >
                          {msg.mediaUrl && (
                            <div className="mb-2">
                              {msg.content.includes("📷") ? (
                                <img
                                  src={msg.mediaUrl}
                                  alt="Imagem"
                                  className="rounded-lg max-w-full h-auto"
                                />
                              ) : (
                                <audio src={msg.mediaUrl} controls className="w-full" />
                              )}
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">
                              {new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isSent && (
                              <span className="text-xs">
                                {msg.isRead ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* AI Generate Button */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-black border-t dark:border-gray-800">
            <div className="max-w-2xl mx-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                data-testid="button-ai-generate"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar mensagem com IA
              </Button>
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  placeholder="Escreva uma mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  data-testid="input-message"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="bg-pink-500 hover:bg-pink-600"
                  data-testid="button-send"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setImageDialogOpen(true)}
                  data-testid="button-image"
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAudioDialogOpen(true)}
                  data-testid="button-audio"
                >
                  <Mic className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setGiftDialogOpen(true)}
                  data-testid="button-gift"
                >
                  <Gift className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="multimedia" className="flex-1 overflow-y-auto mt-0">
          <div className="p-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-2">
              {messages
                .filter((msg) => msg.mediaUrl)
                .map((msg) => (
                  <div key={msg.id} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {msg.content.includes("📷") ? (
                      <img
                        src={msg.mediaUrl || ""}
                        alt="Mídia"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Mic className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Imagem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                placeholder="https://exemplo.com/imagem.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                data-testid="input-image-url"
              />
            </div>
            {imageUrl && (
              <div className="border rounded-lg p-2">
                <img src={imageUrl} alt="Preview" className="max-w-full h-auto rounded" />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setImageDialogOpen(false)}
                data-testid="button-cancel-image"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSendImage}
                disabled={!imageUrl.trim()}
                data-testid="button-send-image"
              >
                Enviar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audio Dialog */}
      <Dialog 
        open={audioDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            cleanupAudioRecording();
          }
          setAudioDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Áudio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-6">
              {!isRecording && !audioUrl ? (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="rounded-full w-20 h-20 bg-pink-500 hover:bg-pink-600"
                  data-testid="button-start-recording"
                >
                  <Mic className="w-8 h-8" />
                </Button>
              ) : isRecording ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm text-gray-500">Gravando...</p>
                  <Button
                    onClick={stopRecording}
                    variant="outline"
                    data-testid="button-stop-recording"
                  >
                    Parar Gravação
                  </Button>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="border rounded-lg p-4">
                    <audio src={audioUrl} controls className="w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        // Revoke the existing blob URL to prevent memory leak
                        if (audioUrl && audioUrl.startsWith('blob:')) {
                          URL.revokeObjectURL(audioUrl);
                        }
                        setAudioUrl("");
                        setAudioBlob(null);
                      }}
                      variant="outline"
                      className="flex-1"
                      data-testid="button-record-again"
                    >
                      Gravar Novamente
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  cleanupAudioRecording();
                  setAudioDialogOpen(false);
                }}
                data-testid="button-cancel-audio"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSendAudio}
                disabled={!audioBlob}
                className="bg-pink-500 hover:bg-pink-600"
                data-testid="button-send-audio"
              >
                Enviar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gift Dialog */}
      <Dialog open={giftDialogOpen} onOpenChange={setGiftDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Presente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="giftAmount">Valor (R$)</Label>
              <Input
                id="giftAmount"
                type="number"
                placeholder="10.00"
                value={giftAmount}
                onChange={(e) => setGiftAmount(e.target.value)}
                data-testid="input-gift-amount"
              />
            </div>
            <div>
              <Label htmlFor="giftMessage">Mensagem (opcional)</Label>
              <Input
                id="giftMessage"
                placeholder="Uma mensagem especial..."
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                data-testid="input-gift-message"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setGiftDialogOpen(false)}
                data-testid="button-cancel-gift"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSendGift}
                disabled={!giftAmount || sendTipMutation.isPending}
                className="bg-pink-500 hover:bg-pink-600"
                data-testid="button-send-gift"
              >
                Enviar Presente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
