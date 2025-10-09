import { ArrowLeftIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NotificationPreferences } from "@shared/schema";

export const NotificationsSection = (): JSX.Element => {
  const { toast } = useToast();

  const { data: preferences, isLoading } = useQuery<NotificationPreferences>({
    queryKey: ["/api/notification-preferences"],
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: Partial<NotificationPreferences>) => {
      return await apiRequest("PUT", "/api/notification-preferences", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notification-preferences"] });
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram salvas",
      });
    },
  });

  const handleToggle = (field: keyof NotificationPreferences, value: boolean) => {
    updatePreferencesMutation.mutate({ [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-[#fdfdfa]">
        <div className="flex items-center justify-center flex-1">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const notificationOptions = [
    { id: "enableMessages", label: "Mensagens", description: "Notificações de novas mensagens" },
    { id: "enableNewPosts", label: "Novas postagens", description: "Quando criadores que você segue postam" },
    { id: "enableLikes", label: "Curtidas", description: "Quando alguém curte seu conteúdo" },
    { id: "enableComments", label: "Comentários", description: "Quando alguém comenta em suas postagens" },
    { id: "enableFollows", label: "Seguidores", description: "Quando alguém começa a te seguir" },
    { id: "enableSubscriptions", label: "Assinaturas", description: "Atualizações sobre suas assinaturas" },
    { id: "enableTips", label: "Gorjetas", description: "Quando você recebe gorjetas" },
    { id: "enablePlatform", label: "Plataforma", description: "Notificações da plataforma e atualizações" },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#fdfdfa]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link href="/settings">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeftIcon className="w-6 h-6 text-[#5d5b5b]" />
          </Button>
        </Link>
        <h1 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-xl">
          Notificações
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Mutar todas as notificações</CardTitle>
            <CardDescription>
              Desativar todas as notificações da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="mute-all">Mutar tudo</Label>
              <Switch
                id="mute-all"
                checked={preferences?.muteAll || false}
                onCheckedChange={(value) => handleToggle("muteAll", value)}
                data-testid="switch-mute-all"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferências de notificação</CardTitle>
            <CardDescription>
              Escolha quais notificações você quer receber
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <Label htmlFor={option.id} className="font-medium">{option.label}</Label>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                <Switch
                  id={option.id}
                  checked={Boolean(preferences?.[option.id as keyof NotificationPreferences])}
                  onCheckedChange={(value) => handleToggle(option.id as keyof NotificationPreferences, value)}
                  disabled={preferences?.muteAll ?? false}
                  data-testid={`switch-${option.id}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
