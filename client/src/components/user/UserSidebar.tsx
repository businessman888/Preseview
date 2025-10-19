import { Link, useLocation } from "wouter";
import {
  Home,
  Bell,
  MessageCircle,
  Search,
  Settings,
  LogOut,
  Wallet,
  UserPlus,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function UserSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth";
  };

  const handlePlaceholderClick = (feature: string) => {
    toast({
      title: "Em desenvolvimento",
      description: `A funcionalidade "${feature}" está sendo desenvolvida e estará disponível em breve.`,
      duration: 3000,
    });
  };

  const isActive = (path: string) => location === path;

  const navItems = [
    {
      id: "become-creator",
      icon: UserPlus,
      label: "Tornar-se Criador",
      href: "/become-creator",
    },
    {
      id: "wallet",
      icon: Wallet,
      label: "Minha Carteira",
      isPlaceholder: true,
      placeholderText: "Minha Carteira",
    },
    {
      id: "messages",
      icon: MessageCircle,
      label: "Mensagens",
      href: "/messages",
    },
    {
      id: "search",
      icon: Search,
      label: "Pesquisar",
      href: "/search",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notificações",
      href: "/notifications",
    },
    {
      id: "refer-earn",
      icon: Gift,
      label: "Indique e Ganhe",
      isPlaceholder: true,
      placeholderText: "Indique e Ganhe",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Configurações",
      href: "/settings",
    },
  ];

  const bottomItems = [
    {
      id: "logout",
      icon: LogOut,
      label: "Sair",
      onClick: handleLogout,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-30">
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/profile">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profilePicture || ""} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.displayName || "Usuário"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{user?.username || "username"}
              </p>
            </div>
          </button>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {/* Home Link */}
          <Link href="/">
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Principal</span>
            </button>
          </Link>

          {/* Navigation Items */}
          {navItems.map((item) => {
            const Icon = item.icon!;
            
            if (item.isPlaceholder) {
              return (
                <button
                  key={item.id}
                  onClick={() => handlePlaceholderClick(item.placeholderText!)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link key={item.id} href={item.href!}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href!)
                      ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 dark:border-gray-800 py-4">
        <nav className="space-y-1 px-3">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
