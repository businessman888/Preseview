import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import { ScreenHome } from "@/pages/ScreenHome";
import { ScreenMessages } from "@/pages/ScreenMessages";
import { ScreenSearch } from "@/pages/ScreenSearch";
import { ScreenNotifications } from "@/pages/ScreenNotifications";
import { ScreenProfile } from "@/pages/ScreenProfile";
import { ScreenSettings } from "@/pages/ScreenSettings";
import AuthPage from "@/pages/AuthPage";
import BecomeCreatorPage from "@/pages/BecomeCreatorPage";

function Router() {
  return (
    <Switch>
      {/* Auth route */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected routes */}
      <ProtectedRoute path="/" component={ScreenHome} />
      <ProtectedRoute path="/messages" component={ScreenMessages} />
      <ProtectedRoute path="/search" component={ScreenSearch} />
      <ProtectedRoute path="/notifications" component={ScreenNotifications} />
      <ProtectedRoute path="/profile" component={ScreenProfile} />
      <ProtectedRoute path="/settings/:rest*" component={ScreenSettings} />
      <ProtectedRoute path="/become-creator" component={BecomeCreatorPage} />
      
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
