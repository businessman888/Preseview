import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";

import { ScreenHome } from "@/pages/ScreenHome";
import { ScreenMessages } from "@/pages/ScreenMessages";
import { ScreenSearch } from "@/pages/ScreenSearch";
import { ScreenNotifications } from "@/pages/ScreenNotifications";
import { ScreenProfile } from "@/pages/ScreenProfile";
import { ScreenSettings } from "@/pages/ScreenSettings";
import BecomeCreatorPage from "@/pages/BecomeCreatorPage";
import { CreatorProfile } from "@/pages/CreatorProfile";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={ScreenHome} />
      <Route path="/messages" component={ScreenMessages} />
      <Route path="/search" component={ScreenSearch} />
      <Route path="/notifications" component={ScreenNotifications} />
      <Route path="/profile" component={ScreenProfile} />
      <Route path="/creator/:id" component={CreatorProfile} />
      <Route path="/settings" component={ScreenSettings} />
      <Route path="/settings/*" component={ScreenSettings} />
      <Route path="/become-creator" component={BecomeCreatorPage} />
      
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
