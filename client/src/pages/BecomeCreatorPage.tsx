import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, DollarSign, FileText } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BecomeCreatorPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    subscriptionPrice: "",
    description: "",
  });

  useEffect(() => {
    if (user?.userType === 'creator') {
      setLocation("/profile");
    }
  }, [user, setLocation]);

  const becomeCreatorMutation = useMutation({
    mutationFn: async (data: { subscriptionPrice: number; description: string }) => {
      const response = await apiRequest("POST", "/api/user/become-creator", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Parabéns! 🎉",
        description: "Você agora é um criador! Comece a publicar conteúdo exclusivo.",
      });
      setLocation("/profile");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao se tornar criador. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.subscriptionPrice) || 0;
    becomeCreatorMutation.mutate({
      subscriptionPrice: price,
      description: formData.description,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-white/20"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Torne-se um Criador</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Benefits Section */}
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-yellow-500" />
                  Por que se tornar um criador?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Monetize seu conteúdo</h3>
                      <p className="text-sm text-gray-600">
                        Defina o preço da sua assinatura e ganhe com conteúdo exclusivo
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-pink-100 p-2 rounded-full">
                      <FileText className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Publique conteúdo exclusivo</h3>
                      <p className="text-sm text-gray-600">
                        Compartilhe posts, stories e vídeos apenas para seus assinantes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Construa sua comunidade</h3>
                      <p className="text-sm text-gray-600">
                        Interaja diretamente com seus fãs através de mensagens e presentes
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Configure seu perfil de criador</CardTitle>
              <CardDescription>
                Preencha as informações básicas para começar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subscriptionPrice">
                    Preço da assinatura mensal (R$)
                  </Label>
                  <Input
                    id="subscriptionPrice"
                    data-testid="input-subscription-price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.subscriptionPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, subscriptionPrice: e.target.value })
                    }
                  />
                  <p className="text-sm text-gray-500">
                    Você pode definir como R$ 0,00 para conteúdo gratuito
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descrição do seu perfil de criador
                  </Label>
                  <Textarea
                    id="description"
                    data-testid="input-description"
                    placeholder="Conte aos seus futuros assinantes sobre o conteúdo que você vai criar..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  data-testid="button-become-creator"
                  disabled={becomeCreatorMutation.isPending}
                >
                  {becomeCreatorMutation.isPending
                    ? "Criando perfil..."
                    : "Tornar-se Criador"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
