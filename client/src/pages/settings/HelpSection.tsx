import { ArrowLeftIcon, ChevronRightIcon, FileTextIcon, HelpCircleIcon, MessageCircleIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TermsAndConditionsPage } from "./help/TermsAndConditionsPage";

export const HelpSection = (): JSX.Element => {
  const [location] = useLocation();

  // Se está na subseção de termos, renderiza ela
  if (location === "/settings/help/terms") return <TermsAndConditionsPage />;

  const helpMenu = [
    {
      id: "terms",
      icon: FileTextIcon,
      title: "Termos e condições",
      description: "Leia nossos termos de uso",
      href: "/settings/help/terms",
      external: false,
    },
    {
      id: "help-center",
      icon: HelpCircleIcon,
      title: "Central de ajuda",
      description: "Encontre respostas para suas dúvidas",
      href: "#",
      external: true,
    },
    {
      id: "support",
      icon: MessageCircleIcon,
      title: "Falar com suporte",
      description: "Entre em contato com nossa equipe",
      href: "#",
      external: true,
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
          Ajuda, termos e suporte
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <p className="text-sm text-gray-600 mb-4">
          Veja informações sobre opções de suporte e nossas políticas.
        </p>

        <div className="space-y-2">
          {helpMenu.map((item) => (
            item.external ? (
              <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer">
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200" data-testid={`help-${item.id}`}>
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
              </a>
            ) : (
              <Link key={item.id} href={item.href}>
                <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200" data-testid={`help-${item.id}`}>
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
            )
          ))}
        </div>
      </div>
    </div>
  );
};
