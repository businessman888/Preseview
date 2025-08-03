import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { ScreenHome } from "@/pages/ScreenHome";
import { ScreenMessages } from "@/pages/ScreenMessages";
import { ScreenSearch } from "@/pages/ScreenSearch";
import { ScreenNotifications } from "@/pages/ScreenNotifications";
import { ScreenProfile } from "@/pages/ScreenProfile";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={ScreenHome} />
      <Route path="/messages" component={ScreenMessages} />
      <Route path="/search" component={ScreenSearch} />
      <Route path="/notifications" component={ScreenNotifications} />
      <Route path="/profile" component={ScreenProfile} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
