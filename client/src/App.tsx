import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./lib/theme";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { Analytics } from "@/components/Analytics";
import Home from "@/pages/Home";
import RiskManagement from "@/pages/RiskManagement";
import RetrospectiveBuilder from "@/pages/RetrospectiveBuilder";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/risk-management" component={RiskManagement} />
      <Route path="/retrospective-builder" component={RetrospectiveBuilder} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <SettingsProvider>
          <TooltipProvider>
            <Analytics />
            <Toaster />
            <Router />
          </TooltipProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
