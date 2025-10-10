import { ArrowLeftIcon, UserIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const SubscriptionsManagementSection = (): JSX.Element => {
  const { toast } = useToast();

  const { data: subscriptions, isLoading } = useQuery<any[]>({
    queryKey: ["/api/subscriptions"],
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      return await apiRequest("POST", `/api/subscriptions/${subscriptionId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
      toast({
        title: "Assinatura cancelada",
        description: "A assinatura foi cancelada com sucesso",
      });
    },
  });

  return (
    <div className="flex flex-col h-screen bg-[#fdfdfa]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link href="/settings/payments">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeftIcon className="w-6 h-6 text-[#5d5b5b]" />
          </Button>
        </Link>
        <h1 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-xl">
          Minhas assinaturas
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : subscriptions && subscriptions.length > 0 ? (
          <div className="space-y-2">
            {subscriptions.map((subscription: any) => (
              <Card key={subscription.id} data-testid={`subscription-${subscription.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={subscription.creator?.profileImage} />
                        <AvatarFallback>
                          {subscription.creator?.displayName?.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{subscription.creator?.displayName}</p>
                        <p className="text-sm text-gray-500">@{subscription.creator?.username}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                            {subscription.status === "active" ? "Ativa" : subscription.status}
                          </Badge>
                          <p className="text-sm text-gray-500">R$ {subscription.amount?.toFixed(2)}/mês</p>
                        </div>
                      </div>
                    </div>
                    {subscription.status === "active" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" data-testid={`button-cancel-${subscription.id}`}>
                            Cancelar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar assinatura?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Você perderá acesso ao conteúdo exclusivo de {subscription.creator?.displayName}.
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Não, manter</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => cancelSubscriptionMutation.mutate(subscription.id)}
                              disabled={cancelSubscriptionMutation.isPending}
                            >
                              Sim, cancelar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Você não tem assinaturas ativas</p>
              <p className="text-sm text-gray-400 mt-2">Assine criadores para ter acesso a conteúdo exclusivo</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
