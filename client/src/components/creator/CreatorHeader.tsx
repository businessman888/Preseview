import { Settings } from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCreatorStats } from "@/hooks/use-creator-stats";

export function CreatorHeader() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useCreatorStats();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Preseview
          </h1>
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-900">
            <AvatarImage src={user.profile_image || undefined} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              {user.display_name?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.display_name}
              </h2>
              {user.is_verified && (
                <img src="/figmaAssets/verified.png" alt="Verificado" className="w-5 h-5" />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>

            <div className="flex gap-6 mt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {isLoading ? "..." : stats?.subscriberCount || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Assinantes
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {isLoading ? "..." : stats?.postCount || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Posts
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {isLoading ? "..." : stats?.likesCount || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Curtidas
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Link href="/profile">
            <Button variant="outline" className="flex-1 sm:flex-none">
              Editar perfil
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" className="flex-1 sm:flex-none">
              Insights
            </Button>
          </Link>
          <Button variant="outline" className="flex-1 sm:flex-none">
            Promotion
          </Button>
        </div>
      </div>
    </header>
  );
}

