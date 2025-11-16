import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Welcome from "@/pages/Welcome";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useTelegramAuth } from "./hooks/useTelegramAuth";
import { Loader2 } from "lucide-react";

function Router({ isAuthenticated, isLoading }: { isAuthenticated: boolean; isLoading: boolean }) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [checkingTerms, setCheckingTerms] = useState(true);

  // Check if user has accepted terms
  useEffect(() => {
    const checkTerms = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch("/api/trpc/terms.checkAccepted");
          if (response.ok) {
            const data = await response.json();
            const accepted = data.result?.data || false;
            setTermsAccepted(accepted);
          }
        } catch (error) {
          console.error("Failed to check terms:", error);
          setTermsAccepted(false);
        }
      } else {
        setTermsAccepted(false);
      }
      setCheckingTerms(false);
    };

    checkTerms();
  }, [isAuthenticated]);

  if (isLoading || (isAuthenticated && checkingTerms)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => window.location.reload()} />;
  }

  if (!termsAccepted) {
    return (
      <Welcome
        onAccept={() => {
          setTermsAccepted(true);
        }}
      />
    );
  }

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isAuthenticated, loading } = useTelegramAuth();

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router isAuthenticated={isAuthenticated} isLoading={loading} />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
