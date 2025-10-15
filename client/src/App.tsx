import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";

import { ScreenHome } from "@/pages/ScreenHome";
import { ScreenMessages } from "@/pages/ScreenMessages";
import { ScreenChatConversation } from "@/pages/ScreenChatConversation";
import { ScreenSearch } from "@/pages/ScreenSearch";
import { ScreenNotifications } from "@/pages/ScreenNotifications";
import { ScreenProfile } from "@/pages/ScreenProfile";
import { ScreenSettings } from "@/pages/ScreenSettings";
import BecomeCreatorPage from "@/pages/BecomeCreatorPage";
import { CreatorProfile } from "@/pages/CreatorProfile";
import { CreatorDashboard } from "@/pages/CreatorDashboard";
import { useAuth } from "@/hooks/use-auth";
import AuthPage from "@/pages/AuthPage";

// Creator Tools Pages
import { StatisticsPage } from "@/pages/creator/tools/StatisticsPage";
import { VaultPage } from "@/pages/creator/tools/VaultPage";
import { QueuePage } from "@/pages/creator/tools/QueuePage";
import { PaidMediaLinksPage } from "@/pages/creator/tools/PaidMediaLinksPage";
import { TrackingLinksPage } from "@/pages/creator/tools/TrackingLinksPage";
import { PromotionsPage } from "@/pages/creator/tools/PromotionsPage";
import { AutoMessagesPage } from "@/pages/creator/tools/AutoMessagesPage";
import { ListsPage } from "@/pages/creator/tools/ListsPage";
import { AIToolsPage } from "@/pages/creator/tools/AIToolsPage";
import { ManagementPage } from "@/pages/creator/tools/ManagementPage";

// Creator Additional Pages
import { FinancesPage } from "@/pages/creator/FinancesPage";
import { WalletPage } from "@/pages/creator/WalletPage";
import { FavoritesPage } from "@/pages/creator/FavoritesPage";

function HomeRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Se o usuário é um criador, mostrar o dashboard do criador (aceita snake_case ou camelCase)
  const isCreator = (user as any)?.user_type === 'creator' || (user as any)?.userType === 'creator';
  if (isCreator) {
    return <CreatorDashboard />;
  }

  // Caso contrário, mostrar a home padrão
  return <ScreenHome />;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomeRoute} />
      <Route path="/messages" component={ScreenMessages} />
      <Route path="/messages/:userId" component={ScreenChatConversation} />
      <Route path="/search" component={ScreenSearch} />
      <Route path="/notifications" component={ScreenNotifications} />
      <Route path="/profile" component={ScreenProfile} />
      <Route path="/creator/:id" component={CreatorProfile} />
      <Route path="/settings" component={ScreenSettings} />
      <Route path="/settings/*" component={ScreenSettings} />
      <Route path="/become-creator" component={BecomeCreatorPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Creator Tools Routes */}
      <Route path="/creator/tools/statistics" component={StatisticsPage} />
      <Route path="/creator/tools/vault" component={VaultPage} />
      <Route path="/creator/tools/queue" component={QueuePage} />
      <Route path="/creator/tools/paid-media-links" component={PaidMediaLinksPage} />
      <Route path="/creator/tools/tracking-links" component={TrackingLinksPage} />
      <Route path="/creator/tools/promotions" component={PromotionsPage} />
      <Route path="/creator/tools/auto-messages" component={AutoMessagesPage} />
      <Route path="/creator/tools/lists" component={ListsPage} />
      <Route path="/creator/tools/ai-tools" component={AIToolsPage} />
      <Route path="/creator/tools/management" component={ManagementPage} />
      
      {/* Creator Additional Routes */}
      <Route path="/creator/finances" component={FinancesPage} />
      <Route path="/creator/wallet" component={WalletPage} />
      <Route path="/creator/favorites" component={FavoritesPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
