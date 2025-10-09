import { ArrowLeftIcon, ChevronRightIcon, ShieldIcon, UserXIcon } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PrivacySettingsSubSection } from "./privacy/PrivacySettingsSubSection";
import { BlockedUsersSection } from "./privacy/BlockedUsersSection";

export const PrivacySection = (): JSX.Element => {
  const [matchSettings] = useRoute("/settings/privacy/settings");
  const [matchBlocked] = useRoute("/settings/privacy/blocked");

  // Se está em uma subseção, renderiza ela
  if (matchSettings) return <PrivacySettingsSubSection />;
  if (matchBlocked) return <BlockedUsersSection />;

  const privacyMenu = [
    {
      id: "settings",
      icon: ShieldIcon,
      title: "Configurações de privacidade",
      description: "Controle quem pode ver seu perfil e conteúdo",
      href: "/settings/privacy/settings",
    },
    {
      id: "blocked",
      icon: UserXIcon,
      title: "Usuários bloqueados",
      description: "Ver e gerenciar usuários bloqueados",
      href: "/settings/privacy/blocked",
    },
  ];

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
          Privacidade e segurança
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <div className="space-y-2">
          {privacyMenu.map((item) => (
            <Link key={item.id} href={item.href}>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200" data-testid={`privacy-${item.id}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-[#5d5b5b]" />
                    <div>
                      <p className="text-[#5d5b5b] font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
