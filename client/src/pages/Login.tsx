import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { Loader2, Send, MessageCircle } from "lucide-react";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your Telegram username");
      return;
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
      setError("Invalid Telegram username. Use 5-32 alphanumeric characters and underscore.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/telegram/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telegramUsername: username }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      // Login successful
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4 transition-all duration-1000 ${
      animateIn ? "opacity-100" : "opacity-0"
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          style={{
            animation: animateIn ? "float 6s ease-in-out infinite" : "none",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          style={{
            animation: animateIn ? "float 8s ease-in-out infinite reverse" : "none",
          }}
        />
      </div>

      <Card className={`w-full max-w-md relative z-10 transition-all duration-1000 ${
        animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}>
        <CardHeader className="text-center space-y-2 px-4 sm:px-6 pt-8 pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">{APP_TITLE}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Plan your tasks and get smart reminders
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main CTA */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-center text-foreground">
                Sign in with your Telegram account to get started
              </p>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Telegram Username</label>
                <div className="flex items-center gap-2 border border-input rounded-lg px-3 py-3 bg-background hover:border-primary/50 transition-colors">
                  <span className="text-muted-foreground text-sm font-medium">@</span>
                  <Input
                    type="text"
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    disabled={isLoading}
                    autoFocus
                    className="flex-1 border-0 p-0 text-sm focus:outline-none focus:ring-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  5-32 characters, alphanumeric and underscore only
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs sm:text-sm border border-destructive/20">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 sm:h-12 text-base font-semibold" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Continue with Telegram
                  </>
                )}
              </Button>
            </div>

            {/* Help section */}
            <div className="space-y-3 pt-6 border-t border-border">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                First time here? Create a Telegram account:
              </p>
              <ol className="text-xs sm:text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                <li>Download Telegram from <span className="font-medium">telegram.org</span></li>
                <li>Create account with your phone number</li>
                <li>Set a username in Settings</li>
                <li>Return and sign in</li>
              </ol>
            </div>
          </form>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
