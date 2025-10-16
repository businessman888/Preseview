import { CreatorLayout } from "@/components/creator/CreatorLayout";
import { SubscriptionPriceSection } from "@/components/creator/promotions/SubscriptionPriceSection";
import { FreeTrialSection } from "@/components/creator/promotions/FreeTrialSection";
import { SubscriptionPackagesSection } from "@/components/creator/promotions/SubscriptionPackagesSection";
import { PromotionalOffersSection } from "@/components/creator/promotions/PromotionalOffersSection";
import { Separator } from "@/components/ui/separator";

export function PromotionsPage() {
  return (
    <CreatorLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Definições de subscrição
          </h1>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          <SubscriptionPriceSection />
          <Separator />
          <FreeTrialSection />
          <Separator />
          <SubscriptionPackagesSection />
          <Separator />
          <PromotionalOffersSection />
        </main>
      </div>
    </CreatorLayout>
  );
}

