import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, TrendingUp, TrendingDown, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriceAlertsModalProps {
  currentPrice: number;
  exchangeName: string;
}

export default function PriceAlertsModal({ currentPrice, exchangeName }: PriceAlertsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [alertType, setAlertType] = useState<"above" | "below">("above");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/price-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetPrice: price,
          type: alertType,
          email,
          exchangeName
        }),
      });

      if (response.ok) {
        toast({
          title: "Alert Created",
          description: `You'll be notified when Bitcoin ${alertType === "above" ? "exceeds" : "drops below"} $${price.toLocaleString()}`,
        });
        setIsOpen(false);
        setTargetPrice("");
        setEmail("");
      } else {
        throw new Error("Failed to create alert");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create price alert",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-bitcoin/20 to-electric/20 border-bitcoin/30 hover:border-bitcoin/50 transition-all duration-300"
        >
          <Bell className="h-4 w-4 mr-1" />
          Set Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <Target className="h-5 w-5 mr-2 text-bitcoin" />
            Price Alert for {exchangeName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-400">Current Price</div>
            <div className="text-2xl font-bold text-bitcoin">${currentPrice.toLocaleString()}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={alertType === "above" ? "default" : "outline"}
              onClick={() => setAlertType("above")}
              className={`${
                alertType === "above" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "border-gray-600 hover:border-green-500"
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Above
            </Button>
            <Button
              type="button"
              variant={alertType === "below" ? "default" : "outline"}
              onClick={() => setAlertType("below")}
              className={`${
                alertType === "below" 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "border-gray-600 hover:border-red-500"
              }`}
            >
              <TrendingDown className="h-4 w-4 mr-1" />
              Below
            </Button>
          </div>

          <div>
            <Label htmlFor="targetPrice" className="text-white">Target Price ($)</Label>
            <Input
              id="targetPrice"
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Enter target price"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-bitcoin to-electric hover:from-bitcoin/80 hover:to-electric/80"
          >
            Create Alert
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}