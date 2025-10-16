import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Archive,
  Calendar,
  Link as LinkIcon,
  MapPin,
  Tag,
  MessageSquare,
  List,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CreatorToolsMenu() {
  const [location] = useLocation();

  const toolItems = [
    {
      id: "statistics",
      icon: BarChart3,
      label: "Estatísticas",
      href: "/creator/tools/statistics",
    },
    {
      id: "vault",
      icon: Archive,
      label: "Cofre",
      href: "/creator/tools/vault",
    },
    {
      id: "queue",
      icon: Calendar,
      label: "Fila",
      href: "/creator/tools/queue",
    },
    {
      id: "paid-media-links",
      icon: LinkIcon,
      label: "Links de mídia paga",
      href: "/creator/tools/paid-media-links",
    },
    {
      id: "tracking-links",
      icon: MapPin,
      label: "Links de rastreio",
      href: "/creator/tools/tracking-links",
    },
    {
      id: "promotions",
      icon: Tag,
      label: "Promoções",
      href: "/creator/tools/promotions",
    },
    {
      id: "automatic-messages",
      icon: MessageSquare,
      label: "Mensagens automáticas",
      href: "/creator/tools/automatic-messages",
    },
    {
      id: "lists",
      icon: List,
      label: "Listas",
      href: "/creator/tools/lists",
    },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="mt-2 ml-4 space-y-1">
      {toolItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.id} href={item.href}>
            <button
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          </Link>
        );
      })}
    </div>
  );
}

