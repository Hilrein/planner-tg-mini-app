import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface WelcomeProps {
  onAccept?: () => void;
}

export default function Welcome({ onAccept }: WelcomeProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [allAgreed, setAllAgreed] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState<Set<number>>(new Set());

  // Fetch terms from database
  const { data: terms = [] } = trpc.terms.list.useQuery();

  // Trigger animation on mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleTermsChange = (termId: number, checked: boolean) => {
    const newAgreed = new Set(agreedTerms);
    if (checked) {
      newAgreed.add(termId);
    } else {
      newAgreed.delete(termId);
    }
    setAgreedTerms(newAgreed);
    setAllAgreed(newAgreed.size === terms.length && terms.length > 0);
  };

  const [, navigate] = useLocation();

  const acceptTermsMutation = trpc.terms.acceptAll.useMutation({
    onSuccess: () => {
      console.log("[Welcome] Terms accepted successfully");
      // Add a small delay for animation before navigating
      setTimeout(() => {
        console.log("[Welcome] Calling onAccept and navigating");
        onAccept?.();
        navigate("/");
      }, 500);
    },
    onError: (error) => {
      console.error("[Welcome] Failed to accept terms:", error);
    },
  });

  const handleContinue = () => {
    if (!allAgreed) {
      console.warn("[Welcome] Not all terms agreed");
      return;
    }
    console.log("[Welcome] Submitting terms acceptance", Array.from(agreedTerms));
    acceptTermsMutation.mutate({
      termsIds: Array.from(agreedTerms),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
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

      {/* Main content */}
      <Card
        className={`w-full max-w-2xl relative z-10 transition-all duration-1000 ${
          animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <CardHeader className="text-center space-y-2 px-4 sm:px-6 pt-6 sm:pt-8">
          <CardTitle className="text-3xl sm:text-4xl">{APP_TITLE}</CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Welcome! Please review and accept our terms to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-6">
          {/* Terms list */}
          <div className="space-y-3 sm:space-y-4 mb-6 max-h-96 overflow-y-auto">
            {terms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No terms available</p>
              </div>
            ) : (
              terms.map((term, index) => (
                <div
                  key={term.id}
                  className={`transition-all duration-500 ${
                    animateIn
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: animateIn ? `${index * 100}ms` : "0ms",
                  }}
                >
                  <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={`term-${term.id}`}
                        checked={agreedTerms.has(term.id)}
                        onChange={(e) =>
                          handleTermsChange(term.id, e.target.checked)
                        }
                        className="mt-1 w-5 h-5 rounded border-border cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`term-${term.id}`}
                          className="text-sm sm:text-base font-medium cursor-pointer block mb-1"
                        >
                          {term.title}
                        </label>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                          {term.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Scroll indicator */}
          {!scrolled && terms.length > 0 && (
            <div className="flex justify-center mb-4 animate-bounce">
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </div>
          )}

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t transition-all duration-700 ${
              animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: animateIn ? `${terms.length * 100 + 200}ms` : "0ms",
            }}
          >
            {/* Agree button - small */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newAgreed = new Set(terms.map((t) => t.id));
                setAgreedTerms(newAgreed);
                setAllAgreed(true);
                console.log("[Welcome] Auto-agreed to all terms", Array.from(newAgreed));
              }}
              disabled={acceptTermsMutation.isPending || terms.length === 0}
              className="text-xs sm:text-sm h-9 sm:h-10"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              I Agree
            </Button>

            {/* Continue button - normal */}
            <Button
              onClick={handleContinue}
              disabled={!allAgreed || acceptTermsMutation.isPending || terms.length === 0}
              className="flex-1 sm:flex-none text-sm h-10 sm:h-11"
            >
              {acceptTermsMutation.isPending ? "Processing..." : "Continue"}
            </Button>
          </div>

          {/* Status message */}
          {terms.length > 0 && (
            <p className="text-xs sm:text-sm text-muted-foreground text-center mt-3">
              {allAgreed
                ? "✓ You have agreed to all terms"
                : `Please agree to all ${terms.length} terms to continue`}
            </p>
          )}
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
}
