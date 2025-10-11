import { ArrowLeftIcon, UserXIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const BlockedUsersSection = (): JSX.Element => {
  const { toast } = useToast();

  const { data: blockedUsers = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/blocked-users"],
  });

  const unblockMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest("DELETE", `/api/blocked-users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blocked-users"] });
      toast({
        title: "Usuário desbloqueado",
        description: "O usuário foi desbloqueado com sucesso",
      });
    },
  });

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
          Usuários bloqueados
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : blockedUsers && blockedUsers.length > 0 ? (
          <div className="space-y-2">
            {blockedUsers.map((blockedUser: any) => (
              <Card key={blockedUser.id} data-testid={`blocked-user-${blockedUser.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={blockedUser.blocked?.profileImage} />
                        <AvatarFallback>
                          {blockedUser.blocked?.displayName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{blockedUser.blocked?.displayName}</p>
                        <p className="text-sm text-gray-500">@{blockedUser.blocked?.username}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => unblockMutation.mutate(blockedUser.blockedId)}
                      disabled={unblockMutation.isPending}
                      data-testid={`button-unblock-${blockedUser.id}`}
                    >
                      Desbloquear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <UserXIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Nenhum usuário bloqueado</p>
              <p className="text-sm text-gray-400 mt-2">Usuários que você bloquear aparecerão aqui</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
