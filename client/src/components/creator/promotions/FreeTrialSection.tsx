import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useFreeTrialSetting, useUpdateFreeTrialSetting } from "@/hooks/use-promotions";
import { toast } from "@/hooks/use-toast";
import { Gift } from "lucide-react";

export function FreeTrialSection() {
  const { data: allowFreeTrial = false, isLoading } = useFreeTrialSetting();
  const updateSettingMutation = useUpdateFreeTrialSetting();

  const handleToggle = async (checked: boolean) => {
    try {
      await updateSettingMutation.mutateAsync(checked);
      toast({
        title: checked ? "Teste gratuito ativado!" : "Teste gratuito desativado!",
        description: checked 
          ? "Seus fãs agora podem se inscrever sem método de pagamento."
          : "Teste gratuito desativado para novos assinantes.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar configuração",
        description: "Não foi possível atualizar a configuração de teste gratuito.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Testes gratuitos sem método de pagamento
          <Badge variant={allowFreeTrial ? "default" : "secondary"}>
            {allowFreeTrial ? "Ativo" : "Inativo"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ative isto para permitir que os seus fãs se subscrevam usando as suas campanhas ou links de teste gratuito sem precisarem de adicionar um método de pagamento.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Status:</span>
              <Badge variant={allowFreeTrial ? "default" : "outline"} className="text-xs">
                {allowFreeTrial ? "Permitido" : "Bloqueado"}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Switch
              checked={allowFreeTrial}
              onCheckedChange={handleToggle}
              disabled={updateSettingMutation.isPending}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {updateSettingMutation.isPending ? "Atualizando..." : "Ativar/Desativar"}
            </span>
          </div>
        </div>
        
        {allowFreeTrial && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div className="text-sm text-green-700 dark:text-green-300">
                <p className="font-medium">Teste gratuito ativo</p>
                <p className="text-xs mt-1">
                  Seus fãs podem experimentar seu conteúdo por 7 dias gratuitamente sem precisar fornecer dados de pagamento.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
