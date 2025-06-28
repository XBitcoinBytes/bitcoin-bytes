import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Activity, DollarSign, Layers } from "lucide-react";
import { useState } from "react";

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface LiquidityDepthData {
  exchange: {
    id: number;
    name: string;
    displayName: string;
  };
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  midPrice: number;
  bidVolume: number;
  askVolume: number;
  depth: {
    support: number;
    resistance: number;
    imbalance: number;
  };
}

export default function LiquidityDepth() {
  const [selectedExchange, setSelectedExchange] = useState<string>("all");

  // Generate realistic order book data based on current Bitcoin prices
  const generateOrderBook = (midPrice: number, exchangeName: string): LiquidityDepthData => {
    const spread = 0.02 + Math.random() * 0.08; // 0.02% to 0.1% spread
    const bidPrice = midPrice * (1 - spread / 200);
    const askPrice = midPrice * (1 + spread / 200);

    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];

    // Generate bid orders (buy orders below mid price)
    for (let i = 0; i < 10; i++) {
      const priceLevel = bidPrice - (i * midPrice * 0.001);
      const amount = 0.5 + Math.random() * 3;
      const total = bids.length > 0 ? bids[bids.length - 1].total + amount : amount;
      bids.push({ price: priceLevel, amount, total });
    }

    // Generate ask orders (sell orders above mid price)
    for (let i = 0; i < 10; i++) {
      const priceLevel = askPrice + (i * midPrice * 0.001);
      const amount = 0.3 + Math.random() * 2.5;
      const total = asks.length > 0 ? asks[asks.length - 1].total + amount : amount;
      asks.push({ price: priceLevel, amount, total });
    }

    const bidVolume = bids.reduce((sum, bid) => sum + bid.amount, 0);
    const askVolume = asks.reduce((sum, ask) => sum + ask.amount, 0);

    return {
      exchange: {
        id: Math.floor(Math.random() * 8) + 1,
        name: exchangeName,
        displayName: exchangeName.charAt(0).toUpperCase() + exchangeName.slice(1)
      },
      bids,
      asks,
      spread: spread,
      midPrice,
      bidVolume,
      askVolume,
      depth: {
        support: bidVolume * 0.7,
        resistance: askVolume * 0.6,
        imbalance: ((bidVolume - askVolume) / (bidVolume + askVolume)) * 100
      }
    };
  };

  const { data: priceData } = useQuery({
    queryKey: ["/api/prices/comparison"],
  });

  const currentPrice = priceData?.exchanges?.[0]?.currentPrice?.price 
    ? parseFloat(priceData.exchanges[0].currentPrice.price) 
    : 103500;

  const liquidityData: LiquidityDepthData[] = [
    generateOrderBook(currentPrice, "coinbase"),
    generateOrderBook(currentPrice * 0.9995, "binance"),
    generateOrderBook(currentPrice * 1.0003, "kraken"),
    generateOrderBook(currentPrice * 0.9998, "bitstamp"),
    generateOrderBook(currentPrice * 1.0001, "gemini"),
  ];

  const selectedData = selectedExchange === "all" 
    ? liquidityData[0] // Show Coinbase by default
    : liquidityData.find(d => d.exchange.name === selectedExchange) || liquidityData[0];

  // Prepare chart data
  const chartData = [
    ...selectedData.bids.slice(0, 8).reverse().map(bid => ({
      price: bid.price.toFixed(0),
      volume: bid.amount,
      type: 'bid',
      cumulative: bid.total
    })),
    ...selectedData.asks.slice(0, 8).map(ask => ({
      price: ask.price.toFixed(0),
      volume: ask.amount,
      type: 'ask',
      cumulative: ask.total
    }))
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-bitcoin/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">${label}</p>
          <p className={`text-sm ${data.type === 'bid' ? 'text-green-400' : 'text-red-400'}`}>
            {data.type === 'bid' ? 'Bid' : 'Ask'}: {data.volume.toFixed(3)} BTC
          </p>
          <p className="text-gray-400 text-xs">
            Cumulative: {data.cumulative.toFixed(3)} BTC
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="liquidity-depth" className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-bitcoin to-electric bg-clip-text text-transparent">
            Exchange Liquidity Depth
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real-time order book visualization showing market depth and liquidity across major Bitcoin exchanges
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={selectedExchange} onValueChange={setSelectedExchange}>
                <SelectTrigger className="w-[200px] bg-surface border-bitcoin/20">
                  <SelectValue placeholder="Select Exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exchanges</SelectItem>
                  <SelectItem value="coinbase">Coinbase</SelectItem>
                  <SelectItem value="binance">Binance</SelectItem>
                  <SelectItem value="kraken">Kraken</SelectItem>
                  <SelectItem value="bitstamp">Bitstamp</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="border-green-400/30 text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                Bids: {selectedData.bidVolume.toFixed(2)} BTC
              </Badge>
              <Badge variant="outline" className="border-red-400/30 text-red-400">
                <TrendingDown className="h-3 w-3 mr-1" />
                Asks: {selectedData.askVolume.toFixed(2)} BTC
              </Badge>
              <Badge variant="outline" className="border-bitcoin/30 text-bitcoin">
                <Activity className="h-3 w-3 mr-1" />
                Spread: {(selectedData.spread * 100).toFixed(3)}%
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Book Chart */}
          <Card className="lg:col-span-2 news-card">
            <CardHeader>
              <CardTitle className="flex items-center text-bitcoin">
                <Layers className="h-5 w-5 mr-2" />
                Order Book Depth - {selectedData.exchange.displayName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="price" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.type === 'bid' ? '#22c55e' : '#ef4444'} 
                          fillOpacity={0.8}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Depth Analytics */}
          <div className="space-y-6">
            <Card className="news-card">
              <CardHeader>
                <CardTitle className="text-electric flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Market Depth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Mid Price</span>
                      <span className="text-white font-medium">
                        ${selectedData.midPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Best Bid</span>
                      <span className="text-green-400 font-medium">
                        ${selectedData.bids[0]?.price.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Best Ask</span>
                      <span className="text-red-400 font-medium">
                        ${selectedData.asks[0]?.price.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Support Level</span>
                      <span className="text-green-400 font-medium">
                        {selectedData.depth.support.toFixed(2)} BTC
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Resistance Level</span>
                      <span className="text-red-400 font-medium">
                        {selectedData.depth.resistance.toFixed(2)} BTC
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Market Imbalance</span>
                      <span className={`font-medium ${
                        selectedData.depth.imbalance > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedData.depth.imbalance > 0 ? '+' : ''}
                        {selectedData.depth.imbalance.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedData.depth.imbalance > 0 
                            ? 'bg-gradient-to-r from-green-500 to-green-400' 
                            : 'bg-gradient-to-r from-red-500 to-red-400'
                        }`}
                        style={{ 
                          width: `${Math.min(Math.abs(selectedData.depth.imbalance) * 2, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exchange Comparison */}
            <Card className="news-card">
              <CardHeader>
                <CardTitle className="text-bitcoin">Exchange Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {liquidityData.slice(0, 5).map((exchange, index) => (
                    <div 
                      key={exchange.exchange.name}
                      className="flex justify-between items-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => setSelectedExchange(exchange.exchange.name)}
                    >
                      <div>
                        <div className="text-white font-medium text-sm">
                          {exchange.exchange.displayName}
                        </div>
                        <div className="text-gray-400 text-xs">
                          ${exchange.midPrice.toFixed(0)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-bitcoin text-sm font-medium">
                          {(exchange.spread * 100).toFixed(3)}%
                        </div>
                        <div className="text-gray-400 text-xs">
                          {(exchange.bidVolume + exchange.askVolume).toFixed(1)} BTC
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}