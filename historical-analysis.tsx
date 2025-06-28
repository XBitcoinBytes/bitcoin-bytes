import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Inbox, ChartBar, Bolt, Waves, Shield, CreditCard, Gem, WavesIcon } from "lucide-react";
import type { HistoricalComparison } from "@shared/schema";

const exchangeIcons = {
  coinbase: Inbox,
  binance: ChartBar,
  strike: Bolt,
  kraken: Waves,
  robinhood: Shield,
  "crypto.com": CreditCard,
  gemini: Gem,
  river: WavesIcon,
};

export default function HistoricalAnalysis() {
  const [selectedDate, setSelectedDate] = useState("2024-01-15");
  const [selectedTime, setSelectedTime] = useState("14:30");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: historicalData, refetch } = useQuery<HistoricalComparison>({
    queryKey: ["/api/prices/historical"],
    enabled: false, // Don't auto-fetch
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const timestamp = new Date(`${selectedDate}T${selectedTime}:00.000Z`);
      const params = new URLSearchParams({ timestamp: timestamp.toISOString() });
      await fetch(`/api/prices/historical?${params}`);
      await refetch();
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const setQuickDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    setSelectedDate(date.toISOString().split('T')[0]);
    setSelectedTime("14:30");
  };

  return (
    <section id="historical-analysis" className="py-20 bg-surface">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compare Bitcoin prices across exchanges for any date and time. 
            Analyze historical spreads and trading opportunities.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Date/Time Selector */}
          <div className="lg:col-span-1">
            <Card className="price-card rounded-2xl">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-6">Select Date & Time</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Date</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-surface-light border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bitcoin focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Time (UTC)</Label>
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-surface-light border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bitcoin focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Quick Select</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickDate(1)}
                        className="bg-surface-light border border-white/10 hover:border-bitcoin transition-colors"
                      >
                        24h ago
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickDate(7)}
                        className="bg-surface-light border border-white/10 hover:border-bitcoin transition-colors"
                      >
                        1 week
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickDate(30)}
                        className="bg-surface-light border border-white/10 hover:border-bitcoin transition-colors"
                      >
                        1 month
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickDate(365)}
                        className="bg-surface-light border border-white/10 hover:border-bitcoin transition-colors"
                      >
                        1 year
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-bitcoin to-electric py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {isAnalyzing ? "Analyzing..." : "Analyze Prices"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historical Results */}
          <div className="lg:col-span-2">
            <Card className="price-card rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-semibold">Historical Comparison</h4>
                  <div className="text-sm text-gray-400">
                    {selectedDate} at {selectedTime} UTC
                  </div>
                </div>
                
                {/* Historical price chart placeholder */}
                <div className="bg-surface-light rounded-xl p-6 mb-6">
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg">
                    <div className="text-center">
                      <ChartBar className="h-16 w-16 text-gray-400 mb-4 mx-auto" />
                      <p className="text-gray-400">Historical Price Chart</p>
                      <p className="text-sm text-gray-500">Interactive chart showing price differences across exchanges</p>
                      {!historicalData && (
                        <p className="text-sm text-bitcoin mt-2">Click "Analyze Prices" to view historical data</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Historical price table */}
                {historicalData ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 text-gray-400">Exchange</th>
                          <th className="text-right py-3 text-gray-400">Price (USD)</th>
                          <th className="text-right py-3 text-gray-400">vs Now</th>
                          <th className="text-right py-3 text-gray-400">Market Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historicalData.exchanges.map((exchangeData) => {
                          const { exchange, price, vsNow } = exchangeData;
                          const IconComponent = exchangeIcons[exchange.name as keyof typeof exchangeIcons] || Inbox;
                          
                          return (
                            <tr key={exchange.id} className="border-b border-white/5">
                              <td className="py-4">
                                <div className="flex items-center space-x-3">
                                  <div 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: exchange.color || '#F7931A' }}
                                  >
                                    <IconComponent className="text-white text-sm" />
                                  </div>
                                  <span>{exchange.displayName}</span>
                                </div>
                              </td>
                              <td className="text-right py-4 font-semibold">
                                ${parseFloat(price.price).toLocaleString()}
                              </td>
                              <td className="text-right py-4">
                                <span className={vsNow >= 0 ? "text-green-400" : "text-red-400"}>
                                  {vsNow >= 0 ? "+" : ""}{vsNow.toFixed(1)}%
                                </span>
                              </td>
                              <td className="text-right py-4 text-gray-400">
                                {parseFloat(price.marketShare || "0").toFixed(0)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Select a date and time to view historical price comparison</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
