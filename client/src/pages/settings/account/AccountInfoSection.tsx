import { ArrowLeftIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const updateEmailSchema = z.object({
  email: z.string().email("Email inválido"),
});

type UpdateEmailForm = z.infer<typeof updateEmailSchema>;

export const AccountInfoSection = (): JSX.Element => {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<UpdateEmailForm>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: async (data: UpdateEmailForm) => {
      return await apiRequest("/api/user/email", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Email atualizado",
        description: "Seu email foi atualizado com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o email",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UpdateEmailForm) => {
    updateEmailMutation.mutate(data);
  };

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
          Informações da conta
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações básicas</CardTitle>
            <CardDescription>Veja as informações da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome de usuário</Label>
              <Input value={user?.username || ""} disabled className="mt-1" data-testid="input-username" />
              <p className="text-sm text-gray-500 mt-1">O nome de usuário não pode ser alterado</p>
            </div>

            <div>
              <Label>Nome de exibição</Label>
              <Input value={user?.displayName || ""} disabled className="mt-1" data-testid="input-displayname" />
            </div>

            <div>
              <Label>Tipo de conta</Label>
              <Input 
                value={user?.userType === "creator" ? "Criador" : "Usuário"}
                disabled 
                className="mt-1" 
                data-testid="input-usertype"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterar email</CardTitle>
            <CardDescription>Atualize o email da sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="seu@email.com"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#b24592] to-[#f15f79] hover:opacity-90"
                  disabled={updateEmailMutation.isPending}
                  data-testid="button-update-email"
                >
                  {updateEmailMutation.isPending ? "Atualizando..." : "Atualizar email"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
