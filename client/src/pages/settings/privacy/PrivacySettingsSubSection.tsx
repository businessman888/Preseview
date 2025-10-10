import { ArrowLeftIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PrivacySettings } from "@shared/schema";

export const PrivacySettingsSubSection = (): JSX.Element => {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<PrivacySettings>({
    queryKey: ["/api/privacy-settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<PrivacySettings>) => {
      return await apiRequest("PUT", "/api/privacy-settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/privacy-settings"] });
      toast({
        title: "Configurações atualizadas",
        description: "Suas configurações de privacidade foram salvas",
      });
    },
  });

  const handleUpdate = (field: keyof PrivacySettings, value: any) => {
    updateSettingsMutation.mutate({ [field]: value });
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

  return (
    <div className="flex flex-col h-screen bg-[#fdfdfa]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link href="/settings/privacy">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeftIcon className="w-6 h-6 text-[#5d5b5b]" />
          </Button>
        </Link>
        <h1 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-xl">
          Configurações de privacidade
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Visibilidade do perfil</CardTitle>
            <CardDescription>Controle quem pode ver seu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="visibility">Perfil visível para</Label>
            <Select
              value={settings?.profileVisibility || "public"}
              onValueChange={(value) => handleUpdate("profileVisibility", value)}
            >
              <SelectTrigger id="visibility" className="mt-2" data-testid="select-visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Todos</SelectItem>
                <SelectItem value="followers">Apenas seguidores</SelectItem>
                <SelectItem value="private">Privado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status online</CardTitle>
            <CardDescription>Mostre quando você está online</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="online-status">Mostrar status online</Label>
              <Switch
                id="online-status"
                checked={settings?.showOnlineStatus || false}
                onCheckedChange={(value) => handleUpdate("showOnlineStatus", value)}
                data-testid="switch-online-status"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensagens</CardTitle>
            <CardDescription>Controle quem pode te enviar mensagens</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="messages">Permitir mensagens de</Label>
            <Select
              value={settings?.allowMessagesFrom || "everyone"}
              onValueChange={(value) => handleUpdate("allowMessagesFrom", value)}
            >
              <SelectTrigger id="messages" className="mt-2" data-testid="select-messages">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Todos</SelectItem>
                <SelectItem value="followers">Apenas seguidores</SelectItem>
                <SelectItem value="none">Ninguém</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assinaturas</CardTitle>
            <CardDescription>Mostre suas assinaturas no perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="subscriptions">Mostrar assinaturas</Label>
              <Switch
                id="subscriptions"
                checked={settings?.showSubscriptions || false}
                onCheckedChange={(value) => handleUpdate("showSubscriptions", value)}
                data-testid="switch-subscriptions"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
