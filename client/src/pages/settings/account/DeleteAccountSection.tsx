import { ArrowLeftIcon, AlertTriangleIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export const DeleteAccountSection = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/user", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Conta deletada",
        description: "Sua conta foi removida permanentemente",
      });
      setLocation("/auth");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível deletar a conta",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex flex-col h-screen bg-[#fdfdfa]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link href="/settings/account">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeftIcon className="w-6 h-6 text-[#5d5b5b]" />
          </Button>
        </Link>
        <h1 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-xl">
          Deletar conta
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <AlertTriangleIcon className="w-8 h-8 text-red-600" />
              <div>
                <CardTitle className="text-red-600">Deletar permanentemente minha conta</CardTitle>
                <CardDescription>Esta ação não pode ser desfeita</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Aviso importante</h3>
              <p className="text-sm text-red-700">
                Ao deletar sua conta, você perderá permanentemente:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                <li>Todos os seus posts e conteúdos</li>
                <li>Suas assinaturas e seguidores</li>
                <li>Seu histórico de transações</li>
                <li>Todas as configurações e dados da conta</li>
              </ul>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                  data-testid="button-delete-account"
                >
                  Deletar minha conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá deletar permanentemente sua conta
                    e remover todos os seus dados de nossos servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAccountMutation.mutate()}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deleteAccountMutation.isPending}
                    data-testid="button-confirm-delete"
                  >
                    {deleteAccountMutation.isPending ? "Deletando..." : "Sim, deletar conta"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
