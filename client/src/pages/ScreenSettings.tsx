import {
  ArrowLeftIcon,
  ChevronRightIcon,
  DollarSignIcon,
  BellIcon,
  ShieldIcon,
  HelpCircleIcon,
  UserIcon,
  BadgeDollarSign,
} from "lucide-react";
import { Link, useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { UserLayout } from "@/components/user/UserLayout";

// Seção: Torne-se criador
import { BecomeCreatorSection } from "./settings/BecomeCreatorSection";
// Seção: Conta
import { AccountSection } from "./settings/AccountSection";
// Seção: Pagamentos e assinaturas  
import { PaymentsSection } from "./settings/PaymentsSection";
// Seção: Notificações
import { NotificationsSection } from "./settings/NotificationsSection";
// Seção: Privacidade e segurança
import { PrivacySection } from "./settings/PrivacySection";
// Seção: Ajuda, termos e suporte
import { HelpSection } from "./settings/HelpSection";

export const ScreenSettings = (): JSX.Element => {
  const { user } = useAuth();
  const [location] = useLocation();

  // Verifica rotas por prefixo
  if (location === "/settings/become-creator") return <BecomeCreatorSection />;
  if (location.startsWith("/settings/account")) return <AccountSection />;
  if (location.startsWith("/settings/payments")) return <PaymentsSection />;
  if (location.startsWith("/settings/notifications")) return <NotificationsSection />;
  if (location.startsWith("/settings/privacy")) return <PrivacySection />;
  if (location.startsWith("/settings/help")) return <HelpSection />;

  // Menu principal de configurações
  const settingsMenu = [
    {
      id: "become-creator",
      icon: BadgeDollarSign,
      title: "Torne-se criador",
      href: "/settings/become-creator",
      show: user?.userType !== "creator",
    },
    {
      id: "account",
      icon: UserIcon,
      title: "Conta",
      href: "/settings/account",
      show: true,
    },
    {
      id: "payments",
      icon: DollarSignIcon,
      title: "Pagamentos e assinaturas",
      href: "/settings/payments",
      show: true,
    },
    {
      id: "notifications",
      icon: BellIcon,
      title: "Notificações",
      href: "/settings/notifications",
      show: true,
    },
    {
      id: "privacy",
      icon: ShieldIcon,
      title: "Privacidade e segurança",
      href: "/settings/privacy",
      show: true,
    },
    {
      id: "help",
      icon: HelpCircleIcon,
      title: "Ajuda, termos e suporte",
      href: "/settings/help",
      show: true,
    },
  ];

  return (
    <UserLayout>
      <div className="flex flex-col h-screen bg-[#fdfdfa]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link href="/profile">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeftIcon className="w-6 h-6 text-[#5d5b5b]" />
          </Button>
        </Link>
        <h1 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-xl">
          Configurações
        </h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Settings Menu */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <div className="space-y-2">
          {settingsMenu.filter(item => item.show).map((item) => (
            <Link key={item.id} href={item.href}>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200" data-testid={`settings-${item.id}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-[#5d5b5b]" />
                    <span className="text-[#5d5b5b] font-medium">{item.title}</span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </UserLayout>
  );
};
