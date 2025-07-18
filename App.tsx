import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/settings-context";
import { ThemeProvider } from "next-themes";
import SplashScreen from "@/components/splash-screen";
import MobileBottomNav from "@/components/mobile-bottom-nav";

import Dashboard from "@/pages/dashboard";
import Budgets from "@/pages/budgets";
import Investments from "@/pages/investments";
import Transactions from "@/pages/transactions";
import Analytics from "@/pages/analytics";
import Calculator from "@/pages/calculator";
import Settings from "@/pages/settings";
import Welcome from "@/pages/welcome";
import NotFound from "@/pages/not-found";

function Router() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Check if this is the first time opening the app
    const hasCompletedWelcome = localStorage.getItem("budgetguard-welcome-completed");
    const skipWelcome = localStorage.getItem("budgetguard-welcome-skip");
    
    if (!hasCompletedWelcome && !skipWelcome && location === "/") {
      setLocation("/welcome");
    }
  }, [location, setLocation]);

  return (
    <>
      <div className="pb-16 md:pb-0">
        <Switch>
          <Route path="/welcome" component={Welcome} />
          <Route path="/" component={Dashboard} />
          <Route path="/budgets" component={Budgets} />
          <Route path="/investments" component={Investments} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <MobileBottomNav />
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Check if this is the first app load
    const hasSeenSplash = sessionStorage.getItem("budgetguard-splash-seen");
    if (hasSeenSplash) {
      setShowSplash(false);
      setAppReady(true);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("budgetguard-splash-seen", "true");
    setShowSplash(false);
    setAppReady(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light" 
        enableSystem
        disableTransitionOnChange
      >
        <SettingsProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
              {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
              {appReady && <Router />}
              <Toaster />
            </div>
          </TooltipProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
