import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { Mail, CheckCircle } from "lucide-react";

interface NewsletterSignupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterSignup({ isOpen, onClose }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        trackEvent('newsletter_signup', 'engagement', email);
        toast({
          title: "Successfully Subscribed!",
          description: "You'll receive daily Bitcoin insights and market updates.",
          duration: 5000,
        });
        setTimeout(() => {
          setIsSuccess(false);
          setEmail("");
          onClose();
        }, 3000);
      } else {
        throw new Error("Subscription failed");
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md cyberpunk-card border-green-400/30">
        <DialogHeader>
          <DialogTitle className="flex items-center tech-heading text-xl text-bitcoin">
            <Mail className="h-5 w-5 mr-2 text-bitcoin" />
            NEWSLETTER SUBSCRIPTION
          </DialogTitle>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-r from-bitcoin/20 to-electric/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-bitcoin/50">
              <CheckCircle className="h-12 w-12 text-bitcoin animate-pulse" />
            </div>
            <h3 className="tech-heading text-xl text-bitcoin mb-4">SUBSCRIPTION CONFIRMED!</h3>
            <p className="cyber-text text-gray-300 mb-4">
              You're all set to receive daily Bitcoin insights and market updates.
            </p>
            <div className="p-4 bg-gradient-to-r from-bitcoin/10 to-electric/10 rounded-lg border border-bitcoin/30">
              <p className="cyber-text text-sm text-electric">✓ Welcome to the Bitcoin Bytes community!</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-gray-300 mb-4">
                Get daily Bitcoin insights, market analysis, and price alerts delivered to your inbox.
              </p>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-dark-bg border-bitcoin/30 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="cyberpunk-btn w-full text-black font-bold hover:scale-105 transition-all duration-300"
              >
                {isLoading ? "SUBSCRIBING..." : "SUBSCRIBE TO NEWSLETTER"}
              </Button>
              
              <p className="text-xs text-gray-400 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}