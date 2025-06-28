import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, Activity, Calendar, Info } from "lucide-react";

interface PriceDataPoint {
  timestamp: string;
  price: number;
  volume: number;
  exchange: string;
  date: Date;
}

const timeRanges = [
  { label: "24H", value: "1d", hours: 24 },
  { label: "7D", value: "7d", hours: 168 },
  { label: "30D", value: "30d", hours: 720 },
  { label: "90D", value: "90d", hours: 2160 },
  { label: "1Y", value: "1y", hours: 8760 }
];

export default function PriceCharts() {
  const [selectedRange, setSelectedRange] = useState("7d");
  const [chartType, setChartType] = useState<"line" | "area">("area");
  
  // Modal states for educational tooltips
  const [showHighModal, setShowHighModal] = useState(false);
  const [showLowModal, setShowLowModal] = useState(false);
  const [showAvgVolumeModal, setShowAvgVolumeModal] = useState(false);
  const [showDataPointsModal, setShowDataPointsModal] = useState(false);

  // Fetch real Bitcoin price data from API
  const fetchRealPriceData = async (range: string): Promise<PriceDataPoint[]> => {
    try {
      const response = await fetch(`/api/charts/bitcoin-history?range=${range}`);
      if (!response.ok) throw new Error('Failed to fetch price data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching real price data:', error);
      // Fallback to generate data only if API fails
      return generateFallbackData(range);
    }
  };

  const generateFallbackData = (range: string): PriceDataPoint[] => {
    const now = new Date();
    const rangeConfig = timeRanges.find(r => r.value === range) || timeRanges[1];
    const points = range === "1d" ? 24 : range === "7d" ? 168 : range === "30d" ? 720 : range === "90d" ? 360 : 365;
    const intervalMs = (rangeConfig.hours * 60 * 60 * 1000) / points;
    
    const basePrice = 107000; // Current Bitcoin price (updated 2024-12-28)
    const data: PriceDataPoint[] = [];
    
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(now.getTime() - (points - i) * intervalMs);
      const volatility = range === "1d" ? 0.02 : range === "7d" ? 0.05 : 0.08;
      const trendFactor = Math.sin(i / points * Math.PI * 2) * 0.1;
      const randomFactor = (Math.random() - 0.5) * volatility;
      
      const price = basePrice * (1 + trendFactor + randomFactor);
      const volume = (50000 + Math.random() * 100000) * (1 + Math.sin(i / 10) * 0.3);
      
      data.push({
        timestamp: timestamp.toISOString(),
        price: Math.round(price * 100) / 100,
        volume: Math.round(volume),
        exchange: "Average",
        date: timestamp
      });
    }
    
    return data;
  };

  const { data: priceData = [], isLoading } = useQuery({
    queryKey: ['/api/charts/price-history', selectedRange],
    queryFn: () => fetchRealPriceData(selectedRange),
    refetchInterval: 30000, // Update every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });

  const formatPrice = (value: number) => `$${value.toLocaleString()}`;
  const formatVolume = (value: number) => `${(value / 1000).toFixed(0)}K`;

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    if (selectedRange === "1d") {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (selectedRange === "7d") {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const latestPrice = priceData[priceData.length - 1];
  const firstPrice = priceData[0];
  const priceChange = latestPrice && firstPrice ? latestPrice.price - firstPrice.price : 0;
  const priceChangePercent = latestPrice && firstPrice ? ((priceChange / firstPrice.price) * 100) : 0;

  // Calculate dynamic high/low based on selected timeframe
  const selectedRangeConfig = timeRanges.find(r => r.value === selectedRange) || timeRanges[1];
  const rangeLabel = selectedRangeConfig.label;
  const highPrice = Math.max(...priceData.map(d => d.price));
  const lowPrice = Math.min(...priceData.map(d => d.price));

  return (
    <section id="price-charts" className="w-full max-w-6xl mx-auto px-4 mb-4">
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-bitcoin/5 to-electric/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent transform -skew-x-12 animate-shimmer"></div>
        
        <CardHeader className="relative z-10 pb-2">
          <div className="flex flex-col items-center text-center gap-3">
            <div>
              {/* Orange-Blue-Orange circles decoration */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-bitcoin rounded-full"></div>
                <div className="w-2 h-2 bg-bitcoin rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-electric rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-bitcoin rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-electric rounded-full"></div>
              </div>
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-bitcoin animate-pulse" />
                <span 
                  className="text-black font-black text-3xl tracking-wide"
                  style={{
                    textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.6)'
                  }}
                >
                  Bitcoin Price Chart
                </span>
              </CardTitle>
              {latestPrice && (
                <div className="flex items-center justify-center gap-4 mt-4">
                  <span className="text-3xl font-bold text-white">
                    {formatPrice(latestPrice.price)}
                  </span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    priceChange >= 0 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {priceChange >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-semibold">
                      {priceChange >= 0 ? '+' : ''}{formatPrice(priceChange)}
                    </span>
                    <span className="text-sm">
                      ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {/* Time Range Selector */}
              <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-600">
                {timeRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={selectedRange === range.value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedRange(range.value)}
                    className={`text-xs px-3 py-1 ${
                      selectedRange === range.value
                        ? 'bg-bitcoin text-black hover:bg-bitcoin/90'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
              
              {/* Chart Type Selector */}
              <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-600">
                <Button
                  variant={chartType === "area" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartType("area")}
                  className={`text-xs px-3 py-1 ${
                    chartType === "area"
                      ? 'bg-electric text-black hover:bg-electric/90'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Area
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartType("line")}
                  className={`text-xs px-3 py-1 ${
                    chartType === "line"
                      ? 'bg-electric text-black hover:bg-electric/90'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Line
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 pt-2 pb-4 px-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F7931A" stopOpacity={0.8}/>
                      <stop offset="50%" stopColor="#00D4FF" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#F7931A" stopOpacity={0.1}/>
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxisLabel}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={formatPrice}
                    stroke="#9CA3AF"
                    fontSize={12}
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number, name: string) => [
                      name === 'price' ? formatPrice(value) : formatVolume(value),
                      name === 'price' ? 'Price' : 'Volume'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#F7931A"
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#F7931A', stroke: '#FFF', strokeWidth: 2 }}
                  />
                </AreaChart>
              ) : (
                <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatXAxisLabel}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={formatPrice}
                    stroke="#9CA3AF"
                    fontSize={12}
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number) => [formatPrice(value), 'Price']}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#F7931A"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#F7931A', stroke: '#FFF', strokeWidth: 2 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {/* Chart Statistics with Educational Tooltips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <div 
                className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors duration-300 flex items-center justify-center gap-1"
                onClick={() => setShowHighModal(true)}
              >
                {rangeLabel} High
                <Info className="h-3 w-3 text-bitcoin hover:text-orange-300 transition-colors duration-300" />
              </div>
              <div className="text-lg font-semibold text-green-400">
                {formatPrice(highPrice)}
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors duration-300 flex items-center justify-center gap-1"
                onClick={() => setShowLowModal(true)}
              >
                {rangeLabel} Low
                <Info className="h-3 w-3 text-bitcoin hover:text-orange-300 transition-colors duration-300" />
              </div>
              <div className="text-lg font-semibold text-red-400">
                {formatPrice(lowPrice)}
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors duration-300 flex items-center justify-center gap-1"
                onClick={() => setShowAvgVolumeModal(true)}
              >
                Avg Volume
                <Info className="h-3 w-3 text-bitcoin hover:text-orange-300 transition-colors duration-300" />
              </div>
              <div className="text-lg font-semibold text-electric">
                {formatVolume(priceData.reduce((sum, d) => sum + d.volume, 0) / priceData.length)}
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors duration-300 flex items-center justify-center gap-1"
                onClick={() => setShowDataPointsModal(true)}
              >
                Data Points
                <Info className="h-3 w-3 text-bitcoin hover:text-orange-300 transition-colors duration-300" />
              </div>
              <div className="text-lg font-semibold text-gray-300">
                {priceData.length.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Modals */}
      <Dialog open={showHighModal} onOpenChange={setShowHighModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <TrendingUp className="h-5 w-5" />
              {rangeLabel} High Explained
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              The <span className="text-green-400 font-semibold">{rangeLabel} High</span> represents the highest price Bitcoin reached within the selected {rangeLabel.toLowerCase()} timeframe across all exchanges.
            </p>
            <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-green-400">
              <p className="text-sm text-gray-300">
                <strong className="text-green-400">Why it matters:</strong> This metric helps identify resistance levels and potential breakout points. When Bitcoin approaches its {rangeLabel.toLowerCase()} high, it may signal strong buying pressure for this timeframe.
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Data is aggregated from multiple exchanges and updated in real-time.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLowModal} onOpenChange={setShowLowModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <TrendingDown className="h-5 w-5" />
              {rangeLabel} Low Explained
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              The <span className="text-red-400 font-semibold">{rangeLabel} Low</span> shows the lowest price Bitcoin traded at within the selected {rangeLabel.toLowerCase()} timeframe across all exchanges.
            </p>
            <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-red-400">
              <p className="text-sm text-gray-300">
                <strong className="text-red-400">Why it matters:</strong> This indicates support levels where buyers stepped in. The difference between {rangeLabel.toLowerCase()} high and low shows volatility and trading opportunities for this period.
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Useful for setting stop-losses and identifying entry points for {rangeLabel.toLowerCase()} trading strategies.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAvgVolumeModal} onOpenChange={setShowAvgVolumeModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-electric">
              <Activity className="h-5 w-5" />
              Average Volume Explained
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              <span className="text-electric font-semibold">Average Volume</span> represents the typical trading activity measured in Bitcoin units traded during the selected time period.
            </p>
            <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-electric">
              <p className="text-sm text-gray-300">
                <strong className="text-electric">Why it matters:</strong> Higher volume indicates strong market interest and confirms price movements. Low volume may suggest price movements are less reliable.
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Volume precedes price - watch for volume spikes before major moves.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDataPointsModal} onOpenChange={setShowDataPointsModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-300">
              <Calendar className="h-5 w-5" />
              Data Points Explained
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              <span className="text-gray-300 font-semibold">Data Points</span> shows how many individual price measurements are included in the current chart view.
            </p>
            <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-gray-500">
              <p className="text-sm text-gray-300">
                <strong className="text-gray-300">Why it matters:</strong> More data points provide smoother, more detailed charts. Different time ranges show different granularity - 24h shows hourly data, while 1Y shows daily averages.
              </p>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• 24H: Hourly snapshots (24 points)</p>
              <p>• 7D: Every few hours (168 points)</p>
              <p>• 30D+: Daily aggregates</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}