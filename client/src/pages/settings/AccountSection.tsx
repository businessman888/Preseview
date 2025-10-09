import { ArrowLeftIcon, ChevronRightIcon, UserIcon, LockIcon, TrashIcon } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { AccountInfoSection } from "./account/AccountInfoSection";
import { PasswordSecuritySection } from "./account/PasswordSecuritySection";
import { DeleteAccountSection } from "./account/DeleteAccountSection";

export const AccountSection = (): JSX.Element => {
  const { user } = useAuth();
  const [matchInfo] = useRoute("/settings/account/info");
  const [matchPassword] = useRoute("/settings/account/password");
  const [matchDelete] = useRoute("/settings/account/delete");

  // Se está em uma subseção, renderiza ela
  if (matchInfo) return <AccountInfoSection />;
  if (matchPassword) return <PasswordSecuritySection />;
  if (matchDelete) return <DeleteAccountSection />;

  const accountMenu = [
    {
      id: "info",
      icon: UserIcon,
      title: "Informações da conta",
      description: "Ver informações sobre sua conta, alterar email",
      href: "/settings/account/info",
    },
    {
      id: "password",
      icon: LockIcon,
      title: "Senha e segurança",
      description: "Alterar senha e configurações de segurança",
      href: "/settings/account/password",
    },
    {
      id: "delete",
      icon: TrashIcon,
      title: "Deletar minha conta",
      description: "Remover permanentemente sua conta e dados",
      href: "/settings/account/delete",
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
          Conta
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <p className="text-sm text-gray-600 mb-4">
          Veja informações sobre sua conta, altere senha ou saiba mais sobre as opções de desativação da conta.
        </p>
        
        <div className="space-y-2">
          {accountMenu.map((item) => (
            <Link key={item.id} href={item.href}>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200" data-testid={`account-${item.id}`}>
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
