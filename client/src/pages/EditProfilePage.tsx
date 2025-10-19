import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Camera, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { UserLayout } from "@/components/user/UserLayout";

export const EditProfilePage = (): JSX.Element => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // TODO: Implementar upload de imagem
    console.log("Upload de imagem:", file);
    setTimeout(() => setIsUploading(false), 2000);
  };

  return (
    <UserLayout>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
          <Link href="/profile">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Editar perfil
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Banner */}
        <div className="relative h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
          {/* Banner content could be added here */}
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center -mt-16 mb-6">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900">
              <AvatarImage src={user?.profilePicture || ""} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            
            {/* Camera Icon Overlay */}
            <div className="absolute bottom-2 right-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-image-upload"
              />
              <label
                htmlFor="profile-image-upload"
                className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Camera className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </label>
            </div>
          </div>
        </div>

        {/* Username Display */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.displayName || user?.username || "Usuário"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            @{user?.username || "username"}
          </p>
        </div>

        {/* Profile Information Card */}
        <div className="px-4">
          <Link href="/profile/edit/info">
            <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Informações de perfil
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Adiciona ou altera o handle, nome, bio e localização.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Upload Status */}
        {isUploading && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg">
            Enviando imagem...
          </div>
        )}
      </div>
    </UserLayout>
  );
};
