import { ArrowLeftIcon, ChevronRightIcon, WalletIcon, CreditCardIcon, ListIcon, HistoryIcon } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WalletPaymentMethodsSection } from "./payments/WalletPaymentMethodsSection";
import { SubscriptionsManagementSection } from "./payments/SubscriptionsManagementSection";
import { TransactionHistorySection } from "./payments/TransactionHistorySection";

export const PaymentsSection = (): JSX.Element => {
  const [matchWallet] = useRoute("/settings/payments/wallet");
  const [matchSubscriptions] = useRoute("/settings/payments/subscriptions");
  const [matchHistory] = useRoute("/settings/payments/history");

  // Se está em uma subseção, renderiza ela
  if (matchWallet) return <WalletPaymentMethodsSection />;
  if (matchSubscriptions) return <SubscriptionsManagementSection />;
  if (matchHistory) return <TransactionHistorySection />;

  const paymentsMenu = [
    {
      id: "wallet",
      icon: WalletIcon,
      title: "Carteira e métodos de pagamento",
      description: "Ver saldo, adicionar ou editar métodos de pagamento",
      href: "/settings/payments/wallet",
    },
    {
      id: "subscriptions",
      icon: ListIcon,
      title: "Gerenciar assinaturas",
      description: "Ver e gerenciar suas assinaturas ativas",
      href: "/settings/payments/subscriptions",
    },
    {
      id: "history",
      icon: HistoryIcon,
      title: "Histórico de transações",
      description: "Ver todo seu histórico de pagamentos e recebimentos",
      href: "/settings/payments/history",
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
          Pagamentos e assinaturas
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <div className="space-y-2">
          {paymentsMenu.map((item) => (
            <Link key={item.id} href={item.href}>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200" data-testid={`payments-${item.id}`}>
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
