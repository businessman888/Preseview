import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { UserLayout } from "@/components/user/UserLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProfileFormData {
  displayName: string;
  username: string;
  bio: string;
  location: string;
}

export const EditProfileInfoPage = (): JSX.Element => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: "",
    username: "",
    bio: "",
    location: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      const initialData = {
        displayName: user.displayName || "",
        username: user.username || "",
        bio: user.bio || "",
        location: user.location || "",
      };
      setFormData(initialData);
    }
  }, [user]);

  // Check for changes
  useEffect(() => {
    if (user) {
      const hasFormChanges = 
        formData.displayName !== (user.displayName || "") ||
        formData.username !== (user.username || "") ||
        formData.bio !== (user.bio || "") ||
        formData.location !== (user.location || "");
      
      setHasChanges(hasFormChanges);
    }
  }, [formData, user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest("PATCH", "/api/user/profile", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      setHasChanges(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Erro ao salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!hasChanges) return;
    
    // Basic validation
    if (!formData.displayName.trim()) {
      toast({
        title: "Nome é obrigatório",
        description: "Por favor, preencha seu nome.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.username.trim()) {
      toast({
        title: "Username é obrigatório",
        description: "Por favor, preencha seu username.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  return (
    <UserLayout>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
          <Link href="/profile/edit">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Informações de perfil
          </h1>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateProfileMutation.isPending}
            className={`px-4 py-2 ${
              hasChanges 
                ? "bg-pink-600 hover:bg-pink-700 text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            data-testid="button-save"
          >
            {updateProfileMutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>

        {/* Form */}
        <div className="flex-1 p-4 space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome
            </Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Seu nome completo"
              value={formData.displayName}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              className="w-full"
              data-testid="input-display-name"
            />
          </div>

          {/* Handle/Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Handle
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="seu-username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="w-full"
              data-testid="input-username"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Podes usar letras, números, traços, pontos e underscores. Deve começar por letra.
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Escreve uma descrição sobre ti..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              maxLength={300}
              className="w-full resize-none"
              data-testid="textarea-bio"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {formData.bio.length}/300 caracteres
            </p>
          </div>

          {/* Localização */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Localização
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="A tua localização atual"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full"
              data-testid="input-location"
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
