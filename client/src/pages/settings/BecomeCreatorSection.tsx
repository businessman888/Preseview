import { ArrowLeftIcon, BadgeDollarSign } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const becomeCreatorSchema = z.object({
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  subscriptionPrice: z.string().min(1, "Preço é obrigatório"),
  categories: z.string().optional(),
});

type BecomeCreatorForm = z.infer<typeof becomeCreatorSchema>;

export const BecomeCreatorSection = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<BecomeCreatorForm>({
    resolver: zodResolver(becomeCreatorSchema),
    defaultValues: {
      description: "",
      subscriptionPrice: "",
      categories: "",
    },
  });

  const becomeCreatorMutation = useMutation({
    mutationFn: async (data: BecomeCreatorForm) => {
      return await apiRequest("/api/become-creator", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          subscriptionPrice: parseFloat(data.subscriptionPrice),
          categories: data.categories?.split(",").map(c => c.trim()).filter(Boolean),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Sucesso!",
        description: "Você agora é um criador!",
      });
      setLocation("/profile");
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível completar a solicitação",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BecomeCreatorForm) => {
    becomeCreatorMutation.mutate(data);
  };

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
          Torne-se criador
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BadgeDollarSign className="w-8 h-8 text-[#5d5b5b]" />
              <div>
                <CardTitle>Comece a monetizar seu conteúdo</CardTitle>
                <CardDescription>
                  Preencha as informações abaixo para se tornar um criador na plataforma
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do perfil</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Conte um pouco sobre você e seu conteúdo..."
                          className="min-h-[100px]"
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscriptionPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço da assinatura (R$)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="9.90"
                          data-testid="input-price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categorias (separadas por vírgula)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Fitness, Lifestyle, Culinária"
                          data-testid="input-categories"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#b24592] to-[#f15f79] hover:opacity-90"
                  disabled={becomeCreatorMutation.isPending}
                  data-testid="button-submit-creator"
                >
                  {becomeCreatorMutation.isPending ? "Processando..." : "Tornar-se criador"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
