import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRightLeft, DollarSign, Bitcoin } from "lucide-react";
import { useBitcoinPrice } from "@/hooks/use-bitcoin-price";

export default function BitcoinCalculator() {
  const { data: priceComparison } = useBitcoinPrice();
  const [usdAmount, setUsdAmount] = useState("");
  const [btcAmount, setBtcAmount] = useState("");
  const [calculationType, setCalculationType] = useState<"usd-to-btc" | "btc-to-usd">("usd-to-btc");

  const currentPrice = priceComparison?.exchanges?.[0]?.currentPrice?.price || "67420";
  const price = parseFloat(currentPrice);

  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const btc = parseFloat(value) / price;
      setBtcAmount(btc.toFixed(8));
    } else {
      setBtcAmount("");
    }
  };

  const handleBtcChange = (value: string) => {
    setBtcAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const usd = parseFloat(value) * price;
      setUsdAmount(usd.toFixed(2));
    } else {
      setUsdAmount("");
    }
  };

  const swapCalculation = () => {
    setCalculationType(calculationType === "usd-to-btc" ? "btc-to-usd" : "usd-to-btc");
    setUsdAmount("");
    setBtcAmount("");
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Calculator className="h-5 w-5 mr-2 text-bitcoin" />
          Bitcoin Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">Current Bitcoin Price</div>
          <div className="text-2xl font-bold text-bitcoin">${price.toLocaleString()}</div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Label htmlFor="usd" className="text-white flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              USD Amount
            </Label>
            <Input
              id="usd"
              type="number"
              step="0.01"
              value={usdAmount}
              onChange={(e) => handleUsdChange(e.target.value)}
              placeholder="Enter USD amount"
              className="bg-gray-800 border-gray-600 text-white text-lg pl-8"
            />
            <DollarSign className="absolute left-2 top-9 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={swapCalculation}
              variant="outline"
              size="sm"
              className="border-bitcoin/30 hover:border-bitcoin/50 text-bitcoin hover:text-white"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <Label htmlFor="btc" className="text-white flex items-center">
              <Bitcoin className="h-4 w-4 mr-1" />
              BTC Amount
            </Label>
            <Input
              id="btc"
              type="number"
              step="0.00000001"
              value={btcAmount}
              onChange={(e) => handleBtcChange(e.target.value)}
              placeholder="Enter BTC amount"
              className="bg-gray-800 border-gray-600 text-white text-lg pl-8"
            />
            <Bitcoin className="absolute left-2 top-9 h-4 w-4 text-orange-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-green-900/20 rounded-lg border border-green-700/30">
            <div className="text-xs text-green-400">If BTC +10%</div>
            <div className="text-sm font-bold text-green-300">
              ${(price * 1.1).toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-red-900/20 rounded-lg border border-red-700/30">
            <div className="text-xs text-red-400">If BTC -10%</div>
            <div className="text-sm font-bold text-red-300">
              ${(price * 0.9).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}