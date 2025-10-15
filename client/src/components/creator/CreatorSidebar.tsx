import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  Bell,
  MessageCircle,
  Wrench,
  DollarSign,
  Wallet,
  Plus,
  Settings,
  Star,
  LogOut,
  Moon,
  Sun,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { CreatorToolsMenu } from "./CreatorToolsMenu";

interface CreatorSidebarProps {
  onAddContent: () => void;
}

export function CreatorSidebar({ onAddContent }: CreatorSidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth";
  };

  const isActive = (path: string) => location === path;

  const navItems = [
    {
      id: "profile",
      icon: null,
      label: "Perfil",
      href: "/profile",
      isProfile: true,
    },
    {
      id: "home",
      icon: Home,
      label: "Home",
      href: "/",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notificações",
      href: "/notifications",
    },
    {
      id: "messages",
      icon: MessageCircle,
      label: "Mensagens",
      href: "/messages",
    },
    {
      id: "tools",
      icon: Wrench,
      label: "Ferramentas do Criador",
      isExpandable: true,
    },
    {
      id: "finances",
      icon: DollarSign,
      label: "Finanças",
      href: "/creator/finances",
    },
    {
      id: "wallet",
      icon: Wallet,
      label: "Carteira e Pagamentos",
      href: "/creator/wallet",
    },
  ];

  const actionItems = [
    {
      id: "add",
      icon: Plus,
      label: "Adicionar Conteúdo",
      onClick: onAddContent,
    },
  ];

  const bottomItems = [
    {
      id: "more",
      icon: MoreHorizontal,
      label: "Mais",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Configurações",
      href: "/settings",
    },
    {
      id: "favorites",
      icon: Star,
      label: "Favoritos",
      href: "/creator/favorites",
    },
    {
      id: "logout",
      icon: LogOut,
      label: "Sair",
      onClick: handleLogout,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-30">
      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            if (item.isProfile) {
              return (
                <Link key={item.id} href={item.href!}>
                  <button className="w-full flex items-center justify-center py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profilePicture || ""} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </Link>
              );
            }

            if (item.isExpandable) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => setIsToolsExpanded(!isToolsExpanded)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.startsWith("/creator/tools")
                        ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" />}
                    <span className="text-sm font-medium flex-1 text-left">
                      {item.label}
                    </span>
                    {isToolsExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {isToolsExpanded && <CreatorToolsMenu />}
                </div>
              );
            }

            const Icon = item.icon!;
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

        {/* Action Button */}
        <div className="px-3 mt-4">
          {actionItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 dark:border-gray-800 py-4">
        <nav className="space-y-1 px-3">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            
            if (item.onClick) {
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
            }

            if (item.href) {
              return (
                <Link key={item.id} href={item.href}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Moon className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">
              {isDarkMode ? "Modo Claro" : "Modo Escuro"}
            </span>
          </button>
        </nav>
      </div>
    </aside>
  );
}

