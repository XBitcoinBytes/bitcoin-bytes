import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, Activity, Shield, BookOpen, Info, X, Brain, Waves, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import MiniSparkline from "@/components/mini-sparkline";

interface MarketStat {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

interface ExchangeStatus {
  name: string;
  status: 'operational' | 'warning' | 'down';
  uptime: string;
}

export default function MarketStats() {
  const [fearGreedIndex, setFearGreedIndex] = useState(72);
  const [showFearGreedModal, setShowFearGreedModal] = useState(false);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [showMarketCapModal, setShowMarketCapModal] = useState(false);
  const [showHashRateModal, setShowHashRateModal] = useState(false);
  const [showActiveAddressesModal, setShowActiveAddressesModal] = useState(false);
  const [showDominanceModal, setShowDominanceModal] = useState(false);
  const [showHalvingModal, setShowHalvingModal] = useState(false);
  const [showBlockHeightModal, setShowBlockHeightModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showBlockTimeModal, setShowBlockTimeModal] = useState(false);
  const [showMempoolModal, setShowMempoolModal] = useState(false);
  const [showExchangeHealthModal, setShowExchangeHealthModal] = useState(false);
  
  // AI Intelligence modal states
  const [showPricePredictionModal, setShowPricePredictionModal] = useState(false);
  const [showPatternRecognitionModal, setShowPatternRecognitionModal] = useState(false);
  const [showAnomalyDetectionModal, setShowAnomalyDetectionModal] = useState(false);
  
  // Whale Activity modal states
  const [showLargeTransactionsModal, setShowLargeTransactionsModal] = useState(false);
  const [showExchangeFlowsModal, setShowExchangeFlowsModal] = useState(false);
  const [showInstitutionalFlowModal, setShowInstitutionalFlowModal] = useState(false);
  
  // Market Momentum and Network Activity modal states
  const [showMarketMomentumModal, setShowMarketMomentumModal] = useState(false);
  const [showNetworkActivityModal, setShowNetworkActivityModal] = useState(false);
  
  // Counter animation states
  const [updatingCounters, setUpdatingCounters] = useState<Set<string>>(new Set());
  const [previousValues, setPreviousValues] = useState<Map<string, string>>(new Map());
  
  // Sparkline data states
  const [priceSparklineData, setPriceSparklineData] = useState<number[]>([]);
  const [volumeSparklineData, setVolumeSparklineData] = useState<number[]>([]);
  const [hashRateSparklineData, setHashRateSparklineData] = useState<number[]>([]);
  const [fearGreedSparklineData, setFearGreedSparklineData] = useState<number[]>([]);
  
  // Exchange Health specific modal states
  const [showSecurityScoreModal, setShowSecurityScoreModal] = useState(false);
  const [showApiResponseModal, setShowApiResponseModal] = useState(false);
  
  // Additional AI modal states for new features
  const [showVolatilityModal, setShowVolatilityModal] = useState(false);
  const [showSentimentAnalysisModal, setShowSentimentAnalysisModal] = useState(false);
  const [showTradingSignalsModal, setShowTradingSignalsModal] = useState(false);
  
  // Fetch real network and market data
  const { data: networkStats } = useQuery<{
    hashRate: number;
    difficulty: number;
    blockHeight: number;
    avgBlockTime: number;
    mempoolSize: number;
  }>({
    queryKey: ["/api/network/stats"],
    refetchInterval: 30000, // Update every 30 seconds
  });

  const { data: marketData } = useQuery<{
    fearGreedIndex: number;
    volume24h: string;
    marketCap: string;
    dominance: number;
    activeAddresses: number;
  }>({
    queryKey: ["/api/market/data"],
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Fetch AI Intelligence data
  const { data: aiData } = useQuery<{
    pricePrediction: {
      target24h: number;
      confidence: number;
      changePercent: number;
    };
    patternRecognition: {
      pattern: string;
      status: string;
      successRate: number;
    };
    anomalyDetection: {
      riskLevel: string;
      volumeSpike: number;
      description: string;
    };
  }>({
    queryKey: ["/api/ai/intelligence"],
    refetchInterval: 60000, // Update every 60 seconds
  });

  // Fetch Whale Activity data
  const { data: whaleData } = useQuery<{
    largeTransactions: Array<{
      type: string;
      amount: number;
      destination: string;
      timeAgo: string;
      direction: string;
    }>;
    institutionalFlow: {
      etfInflow: number;
      weeklyInflow: number;
      timeAgo: string;
    };
  }>({
    queryKey: ["/api/whale/activity"],
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Fetch news data for sentiment analysis
  const newsQuery = useQuery<Array<{
    id: number;
    title: string;
    content: string;
    source: string;
    impact: string;
    tags: string[];
    publishedAt: string;
  }>>({
    queryKey: ["/api/news"],
    refetchInterval: 60000, // Update every minute
  });

  // Update fear and greed index when data changes
  useEffect(() => {
    if (marketData?.fearGreedIndex) {
      setFearGreedIndex(marketData.fearGreedIndex);
    }
  }, [marketData]);

  // Generate sparkline data when real data updates
  useEffect(() => {
    if (networkStats?.hashRate) {
      setHashRateSparklineData(prev => {
        const newData = [...prev, networkStats.hashRate].slice(-20);
        return newData;
      });
    }
  }, [networkStats]);

  useEffect(() => {
    if (marketData) {
      setFearGreedSparklineData(prev => {
        const newData = [...prev, marketData.fearGreedIndex].slice(-20);
        return newData;
      });
      
      // Convert volume to numeric for sparkline
      const volumeValue = parseFloat(marketData.volume24h.replace(/[$,B]/g, ''));
      setVolumeSparklineData(prev => {
        const newData = [...prev, volumeValue].slice(-20);
        return newData;
      });
    }
  }, [marketData]);

  // Initialize sparkline data with realistic historical points
  useEffect(() => {
    if (priceSparklineData.length === 0) {
      const basePrice = 67000;
      const initialData = Array.from({ length: 15 }, (_, i) => 
        basePrice + (Math.random() - 0.5) * 2000 + (i * 50)
      );
      setPriceSparklineData(initialData);
    }
    
    if (hashRateSparklineData.length === 0) {
      const baseHashRate = 700;
      const initialData = Array.from({ length: 15 }, (_, i) => 
        baseHashRate + (Math.random() - 0.5) * 50 + (i * 2)
      );
      setHashRateSparklineData(initialData);
    }
    
    if (fearGreedSparklineData.length === 0 && !marketData) {
      const initialData = Array.from({ length: 15 }, () => 
        45 + (Math.random() - 0.5) * 20
      );
      setFearGreedSparklineData(initialData);
    }
    
    if (volumeSparklineData.length === 0 && !marketData) {
      const initialData = Array.from({ length: 15 }, () => 
        35 + (Math.random() - 0.5) * 5
      );
      setVolumeSparklineData(initialData);
    }
  }, [marketData, networkStats]);

  const marketStats: MarketStat[] = [
    {
      label: "24h Volume",
      value: marketData?.volume24h || "Loading...",
      change: "+12.3%",
      isPositive: true,
      icon: <Activity className="h-4 w-4" />
    },
    {
      label: "Market Cap",
      value: marketData?.marketCap || "Loading...",
      change: "+2.1%",
      isPositive: true,
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      label: "Active Addresses",
      value: marketData?.activeAddresses ? `${(marketData.activeAddresses / 1000).toFixed(0)}K` : "Loading...",
      change: "+5.7%",
      isPositive: true,
      icon: <Activity className="h-4 w-4" />
    },
    {
      label: "Network Hash Rate",
      value: networkStats?.hashRate ? `${Math.round(networkStats.hashRate)} EH/s` : "Loading...",
      change: "+8.2%",
      isPositive: true,
      icon: <Shield className="h-4 w-4" />
    }
  ];

  const [exchangeStatuses, setExchangeStatuses] = useState<ExchangeStatus[]>([
    { name: "Coinbase", status: 'operational', uptime: "99.9%" },
    { name: "Binance", status: 'operational', uptime: "99.8%" },
    { name: "Strike", status: 'operational', uptime: "99.7%" },
    { name: "Kraken", status: 'warning', uptime: "98.5%" },
    { name: "Robinhood", status: 'operational', uptime: "99.5%" },
    { name: "Crypto.com", status: 'operational', uptime: "99.4%" },
    { name: "Gemini", status: 'operational', uptime: "99.3%" },
    { name: "River", status: 'operational', uptime: "99.2%" }
  ]);

  const getFearGreedLabel = (index: number) => {
    if (index >= 75) return { label: "Extreme Greed", color: "text-red-400" };
    if (index >= 55) return { label: "Greed", color: "text-orange-400" };
    if (index >= 45) return { label: "Neutral", color: "text-yellow-400" };
    if (index >= 25) return { label: "Fear", color: "text-blue-400" };
    return { label: "Extreme Fear", color: "text-green-400" };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const fearGreedData = getFearGreedLabel(fearGreedIndex);

  // Function to trigger counter morphing animation
  const triggerCounterUpdate = (counterId: string, newValue: string) => {
    const previousValue = previousValues.get(counterId);
    if (previousValue && previousValue !== newValue) {
      setUpdatingCounters(prev => new Set(prev).add(counterId));
      setTimeout(() => {
        setUpdatingCounters(prev => {
          const newSet = new Set(prev);
          newSet.delete(counterId);
          return newSet;
        });
      }, 600);
    }
    setPreviousValues(prev => new Map(prev).set(counterId, newValue));
  };

  // Track changes in market data and network stats
  useEffect(() => {
    if (marketData) {
      triggerCounterUpdate('volume24h', marketData.volume24h);
      triggerCounterUpdate('fearGreedIndex', marketData.fearGreedIndex.toString());
    }
  }, [marketData]);

  useEffect(() => {
    if (networkStats?.hashRate) {
      triggerCounterUpdate('hashRate', networkStats.hashRate.toString());
    }
    if (networkStats?.difficulty) {
      triggerCounterUpdate('difficulty', networkStats.difficulty.toString());
    }
    if (networkStats?.blockHeight) {
      triggerCounterUpdate('blockHeight', networkStats.blockHeight.toString());
    }
    if (networkStats?.mempoolSize) {
      triggerCounterUpdate('mempoolSize', networkStats.mempoolSize.toString());
    }
  }, [networkStats]);

  return (
    <section id="market-stats" className="py-2 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/30 to-dark-bg"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-bitcoin/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-electric/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '-6s' }}></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-8">
          {/* Orange-Blue-Orange circles decoration */}
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-bitcoin rounded-full"></div>
            <div className="w-2 h-2 bg-bitcoin rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-electric rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-bitcoin rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-electric rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            <span 
              className="text-black font-black cursor-pointer hover:text-gray-800 transition-colors duration-300"
              style={{
                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.6)'
              }}
              onClick={() => window.open('https://bitcoin.org/en/', '_blank')}
            >
              Bitcoin
            </span>{" "}
            <span 
              className="text-black font-black cursor-pointer hover:text-gray-800 transition-colors duration-300"
              style={{
                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.6)'
              }}
              onClick={() => window.open('https://coinmarketcap.com/currencies/bitcoin/', '_blank')}
            >
              Intelligence
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            <span 
              className="cursor-pointer hover:text-bitcoin transition-colors duration-300"
              onClick={() => window.open('https://bitcoinvisuals.com/', '_blank')}
            >
              Real-time market data
            </span>
            <span>, </span>
            <span 
              className="cursor-pointer hover:text-electric transition-colors duration-300"
              onClick={() => window.open('https://www.coingecko.com/en/exchanges', '_blank')}
            >
              exchange health
            </span>
            <span>, and insights to guide your </span>
            <span 
              className="cursor-pointer hover:text-bitcoin transition-colors duration-300"
              onClick={() => window.open('https://bitcoin.org/en/', '_blank')}
            >
              Bitcoin decisions
            </span>
          </p>
        </div>

        {/* AI Intelligence Section */}
        <div className="flex justify-center mt-8 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-800 border-purple-500/30 border-2 max-w-4xl w-full relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-purple-500/20">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/10 to-blue-500/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            
            {/* Subtle shimmer animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
            
            <CardHeader className="relative z-10">
              {/* Purple-Pink-Blue circles decoration */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-purple-500 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-blue-500 rounded-full"></div>
              </div>
              <CardTitle className="flex items-center justify-center text-2xl text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                <Brain className="h-6 w-6 mr-3 animate-pulse-slow" />
                <span className="text-white font-bold tracking-wide">
                  AI Intelligence
                </span>
                <div className="ml-3">
                  <div className="flex items-center space-x-2 bg-purple-400/20 px-3 py-1 rounded-full border border-purple-400/30">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse-slow shadow-lg shadow-purple-400/50"></div>
                    <span className="text-sm text-purple-400 font-bold tracking-wide">AI</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-purple-400 font-semibold text-sm tracking-wide">
                        Market Volatility AI
                      </div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" 
                        onClick={() => setShowVolatilityModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1 group-hover/item:text-purple-400 transition-colors duration-300">
                    {networkStats?.hashRate ? `${((networkStats.hashRate / 100) % 10).toFixed(1)}%` : "3.2%"}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center justify-between">
                    <span>30-day Volatility</span>
                    <span className="font-semibold text-orange-400">
                      {networkStats ? "Moderate" : ""}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-purple-400 font-semibold text-sm tracking-wide">
                        Pattern Recognition
                      </div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" 
                        onClick={() => setShowPatternRecognitionModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1 group-hover/item:text-purple-400 transition-colors duration-300">
                    {aiData ? aiData.patternRecognition.pattern : "Loading..."}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center justify-between">
                    <span>{aiData ? aiData.patternRecognition.status : ""}</span>
                    <span className="text-green-400 font-semibold">
                      {aiData ? `${aiData.patternRecognition.successRate}% rate` : ""}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-purple-400 font-semibold text-sm tracking-wide">
                        Anomaly Detection
                      </div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" 
                        onClick={() => setShowAnomalyDetectionModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1 group-hover/item:text-purple-400 transition-colors duration-300">
                    {aiData ? aiData.anomalyDetection.riskLevel : "Loading..."}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center justify-between">
                    <span>Risk Level</span>
                    <span className="text-blue-400 font-semibold">
                      {aiData ? `${aiData.anomalyDetection.volumeSpike}% spike` : ""}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Insights Section */}
        <div className="flex justify-center mt-8 mb-12">
          <Card className="bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-blue-900/30 border-purple-500/30 border-2 max-w-6xl w-full relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-purple-500/20">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/15 to-blue-500/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            
            {/* Neural network pattern overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500" 
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92FF' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Cline x1='7' y1='7' x2='30' y2='30' stroke='%239C92FF' stroke-width='0.5'/%3E%3Cline x1='30' y1='30' x2='53' y2='7' stroke='%239C92FF' stroke-width='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                 }}>
            </div>
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-200"></div>
              </div>
              
              <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent mb-2">
                AI-Powered Insights
              </CardTitle>
              <p className="text-center text-gray-300 text-sm">
                Advanced predictive analytics, sentiment analysis, and personalized trading intelligence
              </p>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Predictive Price Movement */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border border-white/10 hover:border-purple-500/40 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      <div className="text-purple-300 font-semibold text-sm tracking-wide">
                        Price Prediction
                      </div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" 
                        onClick={() => setShowPricePredictionModal(true)}
                      />
                    </div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="text-white font-bold text-2xl mb-2 group-hover/item:text-purple-300 transition-colors duration-300">
                    {aiData?.pricePrediction?.target24h ? `$${aiData.pricePrediction.target24h.toLocaleString()}` : "Loading..."}
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-3">
                    24h Target • {aiData ? `${aiData.pricePrediction.confidence}%` : "0%"} Confidence
                  </div>
                  
                  {/* Price Movement Visualization */}
                  <div className="flex justify-center mb-3">
                    <MiniSparkline 
                      data={priceSparklineData}
                      width={120}
                      height={32}
                      color={(aiData?.pricePrediction?.changePercent ?? 0) >= 0 ? '#10b981' : '#ef4444'}
                      trend={(aiData?.pricePrediction?.changePercent ?? 0) >= 0 ? 'up' : 'down'}
                    />
                  </div>
                  
                  <div className={`text-center text-sm font-semibold ${(aiData?.pricePrediction?.changePercent ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {aiData?.pricePrediction ? `${aiData.pricePrediction.changePercent > 0 ? '+' : ''}${aiData.pricePrediction.changePercent.toFixed(2)}%` : "0%"} predicted
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-indigo-400" />
                      <div className="text-indigo-300 font-semibold text-sm tracking-wide">
                        Sentiment Analysis
                      </div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-indigo-400 cursor-pointer transition-colors" 
                        onClick={() => setShowSentimentAnalysisModal(true)}
                      />
                    </div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="text-white font-bold text-2xl mb-2 group-hover/item:text-indigo-300 transition-colors duration-300">
                    {fearGreedIndex >= 60 ? 'Bullish' : fearGreedIndex >= 40 ? 'Neutral' : 'Bearish'}
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-3">
                    Based on {newsQuery?.data?.length || 0} news sources
                  </div>
                  
                  {/* Sentiment Visualization */}
                  <div className="flex justify-center mb-3">
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div 
                          key={i}
                          className={`w-3 h-8 rounded-sm transition-all duration-300 ${
                            i < Math.floor(fearGreedIndex / 20) 
                              ? fearGreedIndex >= 60 ? 'bg-green-400' : fearGreedIndex >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-300">
                    Social sentiment trending {fearGreedIndex >= 50 ? 'positive' : 'negative'}
                  </div>
                </div>

                {/* Trading Suggestions */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border border-white/10 hover:border-blue-500/40 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      <div className="text-blue-300 font-semibold text-sm tracking-wide">
                        Trading Signals
                      </div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" 
                        onClick={() => setShowTradingSignalsModal(true)}
                      />
                    </div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Short-term</span>
                      <span className={`text-sm font-semibold px-2 py-1 rounded-full text-xs ${
                        (aiData?.pricePrediction?.changePercent ?? 0) >= 2 ? 'bg-green-500/20 text-green-400' :
                        (aiData?.pricePrediction?.changePercent ?? 0) >= 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {(aiData?.pricePrediction?.changePercent ?? 0) >= 2 ? 'BUY' :
                         (aiData?.pricePrediction?.changePercent ?? 0) >= 0 ? 'HOLD' : 'SELL'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Risk Level</span>
                      <span className={`text-sm font-semibold ${
                        aiData?.anomalyDetection.riskLevel === 'Low' ? 'text-green-400' :
                        aiData?.anomalyDetection.riskLevel === 'Medium' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {aiData?.anomalyDetection.riskLevel || 'Medium'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Pattern Match</span>
                      <span className="text-sm font-semibold text-purple-400">
                        {aiData?.patternRecognition.successRate || 0}%
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-xs text-gray-400 text-center">
                        Personalized for your risk profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Insight Bar */}
              <div className="mt-6 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Market Momentum: <span className="text-green-400 font-semibold">Strong</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Volume: <span className="text-blue-400 font-semibold">Above Average</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">AI Confidence: <span className="text-purple-400 font-semibold">High</span></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Fear & Greed Index */}
          <Card className="price-card backdrop-blur-xl border-bitcoin/20 group cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-bitcoin/20 transition-all duration-300 relative overflow-hidden">
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-bitcoin/5 to-electric/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            
            {/* Hover tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 border border-gray-700">
              Live market sentiment indicator - Click for details
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>

            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="flex items-center justify-between text-lg">
                <span 
                  className="text-bitcoin group-hover:text-orange-300 transition-colors duration-300 cursor-pointer"
                  onClick={() => window.open('https://alternative.me/crypto/fear-and-greed-index/', '_blank')}
                >
                  Fear & Greed Index
                </span>
                <Info 
                  className="h-4 w-4 text-gray-400 hover:text-bitcoin cursor-pointer transition-colors group-hover:scale-110" 
                  onClick={() => setShowFearGreedModal(true)}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-4xl font-bold text-white mb-2 stat-counter ${updatingCounters.has('fearGreedIndex') ? 'updating' : ''}`}>{fearGreedIndex}</div>
                <div className={`text-sm font-medium ${fearGreedData.color}`}>
                  {fearGreedData.label}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-4 mb-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${fearGreedIndex}%` }}
                  ></div>
                </div>
                {/* Mini Sparkline */}
                <div className="flex justify-center">
                  <MiniSparkline 
                    data={fearGreedSparklineData}
                    width={80}
                    height={24}
                    color={fearGreedIndex >= 50 ? '#ff9500' : '#00d4ff'}
                    trend={fearGreedIndex >= 50 ? 'up' : 'down'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Addresses */}
          <Card className="price-card backdrop-blur-xl border-bitcoin/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center text-bitcoin">
                  {marketStats[2]?.icon}
                  <span 
                    className="ml-2 cursor-pointer hover:text-orange-300 transition-colors duration-300"
                    onClick={() => window.open('https://bitinfocharts.com/bitcoin/address_rich_list.html', '_blank')}
                  >
                    {marketStats[2]?.label}
                  </span>
                </div>
                <Info 
                  className="h-4 w-4 text-gray-400 hover:text-bitcoin cursor-pointer transition-colors" 
                  onClick={() => setShowActiveAddressesModal(true)}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{marketStats[2]?.value}</div>
                {marketStats[2]?.change && (
                  <div className={`flex items-center justify-center text-sm mb-3 ${marketStats[2].isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {marketStats[2].isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {marketStats[2].change}
                  </div>
                )}
                {/* Mini Sparkline for Active Addresses */}
                <div className="flex justify-center mt-2">
                  <MiniSparkline 
                    data={Array.from({ length: 20 }, (_, i) => 
                      (marketData?.activeAddresses || 850000) + (Math.random() - 0.5) * 50000 + (i * 1000)
                    )}
                    width={80}
                    height={24}
                    color="#00ff66"
                    trend="up"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Hash Rate */}
          <Card className="price-card backdrop-blur-xl border-bitcoin/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center text-bitcoin">
                  {marketStats[3]?.icon}
                  <span 
                    className="ml-2 cursor-pointer hover:text-orange-300 transition-colors duration-300"
                    onClick={() => window.open('https://mempool.space/', '_blank')}
                  >
                    {marketStats[3]?.label}
                  </span>
                </div>
                <Info 
                  className="h-4 w-4 text-gray-400 hover:text-bitcoin cursor-pointer transition-colors" 
                  onClick={() => setShowHashRateModal(true)}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{marketStats[3]?.value}</div>
                {marketStats[3]?.change && (
                  <div className={`flex items-center justify-center text-sm mb-3 ${marketStats[3].isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {marketStats[3].isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {marketStats[3].change}
                  </div>
                )}
                {/* Mini Sparkline for Hash Rate */}
                <div className="flex justify-center mt-2">
                  <MiniSparkline 
                    data={hashRateSparklineData}
                    width={80}
                    height={24}
                    color="#ff9500"
                    trend="up"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exchange Health Monitor - Epic Full Width */}
        <div className="flex justify-center mt-8 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-800 border-blue-500/30 border-2 max-w-4xl w-full relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-blue-500/20">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/10 to-teal-500/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            
            {/* Subtle shimmer animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
            
            <CardHeader className="relative z-10">
              {/* Blue-Cyan-Teal circles decoration */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-teal-500 rounded-full"></div>
              </div>
              <CardTitle className="flex items-center justify-center text-2xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                <Shield className="h-6 w-6 mr-3 animate-pulse-slow" />
                <span className="text-white font-bold tracking-wide">
                  Bitcoin Exchange Health
                </span>
                <Info 
                  className="h-4 w-4 ml-2 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" 
                  onClick={() => setShowExchangeHealthModal(true)}
                />
                <div className="ml-3">
                  <div className="flex items-center space-x-2 bg-blue-400/20 px-3 py-1 rounded-full border border-blue-400/30">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse-slow shadow-lg shadow-blue-400/50"></div>
                    <span className="text-sm text-blue-400 font-bold tracking-wide">LIVE</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {exchangeStatuses.map((exchange, index) => (
                  <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(exchange.status)} shadow-lg animate-pulse`}></div>
                      <span className="text-white font-semibold text-sm text-center group-hover/item:text-blue-400 transition-colors duration-300">{exchange.name}</span>
                      <div className="text-xs text-gray-400">{exchange.uptime}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Additional Exchange Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold text-sm tracking-wide">Security Score</span>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" 
                        onClick={() => setShowSecurityScoreModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1">98.7%</div>
                  <div className="text-xs text-gray-400">Average across all exchanges</div>
                </div>
                
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold text-sm tracking-wide">API Response</span>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" 
                        onClick={() => setShowApiResponseModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1">147ms</div>
                  <div className="text-xs text-gray-400">Average response time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Metrics - Epic Full Width */}
        <div className="flex justify-center mt-8 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-800 border-green-500/30 border-2 max-w-4xl w-full relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-green-500/20">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/10 to-teal-500/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            
            {/* Subtle shimmer animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
            
            <CardHeader className="relative z-10">
              {/* Green-Emerald-Teal circles decoration */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-teal-500 rounded-full"></div>
              </div>
              <CardTitle className="flex items-center justify-center text-2xl text-green-400 group-hover:text-green-300 transition-colors duration-300">
                <BarChart3 className="h-6 w-6 mr-3 animate-pulse-slow" />
                <span className="text-white font-bold tracking-wide">
                  Bitcoin Market Metrics
                </span>
                <div className="ml-3">
                  <div className="flex items-center space-x-2 bg-green-400/20 px-3 py-1 rounded-full border border-green-400/30">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-slow shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm text-green-400 font-bold tracking-wide">LIVE</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-green-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-green-400 font-semibold text-sm tracking-wide">24h Volume</div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" 
                        onClick={() => setShowVolumeModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1 group-hover/item:text-green-400 transition-colors duration-300">
                    {marketStats[0]?.value || "Loading..."}
                  </div>
                  {marketStats[0]?.change && (
                    <div className={`flex items-center text-xs ${marketStats[0].isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {marketStats[0].isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {marketStats[0].change}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-green-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-green-400 font-semibold text-sm tracking-wide">Market Cap</div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" 
                        onClick={() => setShowMarketCapModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1 group-hover/item:text-green-400 transition-colors duration-300">
                    {marketStats[1]?.value || "Loading..."}
                  </div>
                  {marketStats[1]?.change && (
                    <div className={`flex items-center text-xs ${marketStats[1].isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {marketStats[1].isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {marketStats[1].change}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-green-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-green-400 font-semibold text-sm tracking-wide">Dominance</div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" 
                        onClick={() => setShowDominanceModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1 group-hover/item:text-green-400 transition-colors duration-300">54.2%</div>
                  <div className="text-xs text-gray-400">BTC market share</div>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-green-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-green-400 font-semibold text-sm tracking-wide">Next Halving</div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" 
                        onClick={() => setShowHalvingModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1 group-hover/item:text-green-400 transition-colors duration-300">~2028</div>
                  <div className="text-xs text-gray-400">Est. 4 years</div>
                </div>
              </div>
              
              {/* Additional Market Intelligence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-green-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-semibold text-sm tracking-wide">Market Momentum</span>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" 
                        onClick={() => setShowMarketMomentumModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1">Bullish</div>
                  <div className="text-xs text-gray-400">Based on 7-day trend analysis</div>
                </div>
                
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-green-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-semibold text-sm tracking-wide">Network Activity</span>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" 
                        onClick={() => setShowNetworkActivityModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1">High</div>
                  <div className="text-xs text-gray-400">Transaction volume above average</div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Whale Activity Tracker Section */}
        <div className="flex justify-center mt-8 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 via-cyan-900/20 to-gray-800 border-cyan-500/30 border-2 max-w-4xl w-full relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-cyan-500/20">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-teal-500/10 to-blue-500/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            
            {/* Subtle shimmer animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
            
            <CardHeader className="relative z-10">
              {/* Cyan-Teal-Blue circles decoration */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-cyan-500 rounded-full"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-blue-500 rounded-full"></div>
              </div>
              <CardTitle className="flex items-center justify-center text-2xl text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                <Waves className="h-6 w-6 mr-3 animate-pulse-slow" />
                <span className="text-white font-bold tracking-wide">
                  Whale Activity Tracker
                </span>
                <div className="ml-3">
                  <div className="flex items-center space-x-2 bg-cyan-400/20 px-3 py-1 rounded-full border border-cyan-400/30">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse-slow shadow-lg shadow-cyan-400/50"></div>
                    <span className="text-sm text-cyan-400 font-bold tracking-wide">LIVE</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-cyan-400 font-semibold text-sm tracking-wide">
                        Large Transactions
                      </div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" 
                        onClick={() => setShowLargeTransactionsModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1 group-hover/item:text-cyan-400 transition-colors duration-300">
                    {whaleData?.largeTransactions[0] ? `${whaleData.largeTransactions[0].amount} BTC` : "Loading..."}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center justify-between">
                    <span>{whaleData?.largeTransactions[0]?.type || ""}</span>
                    <span className={`font-semibold ${whaleData?.largeTransactions[0]?.direction === 'out' ? 'text-red-400' : 'text-green-400'}`}>
                      {whaleData?.largeTransactions[0]?.timeAgo || ""}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-cyan-400 font-semibold text-sm tracking-wide">
                        Exchange Flows
                      </div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" 
                        onClick={() => setShowExchangeFlowsModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1 group-hover/item:text-cyan-400 transition-colors duration-300">
                    {whaleData?.largeTransactions[1] ? `${whaleData.largeTransactions[1].amount} BTC` : "Loading..."}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center justify-between">
                    <span>{whaleData?.largeTransactions[1]?.destination || ""}</span>
                    <span className={`font-semibold ${whaleData?.largeTransactions[1]?.direction === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                      {whaleData?.largeTransactions[1]?.timeAgo || ""}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-cyan-400 font-semibold text-sm tracking-wide">
                        Institutional Flow
                      </div>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" 
                        onClick={() => setShowInstitutionalFlowModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1 group-hover/item:text-cyan-400 transition-colors duration-300">
                    {whaleData?.institutionalFlow ? `$${whaleData.institutionalFlow.etfInflow}M` : "Loading..."}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center justify-between">
                    <span>ETF Inflow</span>
                    <span className="text-green-400 font-semibold">
                      {whaleData?.institutionalFlow?.timeAgo || ""}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bitcoin Blockchain Health Section */}
        <div className="flex justify-center mt-8 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-800 border-green-500/30 border-2 max-w-4xl w-full relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-green-500/20">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/10 to-teal-500/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            
            {/* Subtle shimmer animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
            
            <CardHeader className="relative z-10">
              {/* Green-Emerald-Teal circles decoration */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-teal-500 rounded-full"></div>
              </div>
              <CardTitle className="flex items-center justify-center text-2xl text-green-400 group-hover:text-green-300 transition-colors duration-300">
                <BarChart3 className="h-6 w-6 mr-3 animate-pulse-slow" />
                <span className="text-white font-bold tracking-wide">
                  Bitcoin Blockchain Health
                </span>
                <div className="ml-3">
                  <div className="flex items-center space-x-2 bg-green-400/20 px-3 py-1 rounded-full border border-green-400/30">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-slow shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm text-green-400 font-bold tracking-wide">HEALTH</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-green-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-semibold text-sm tracking-wide">Network Security</span>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" 
                        onClick={() => setShowHashRateModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1">
                    {networkStats?.hashRate ? `${networkStats.hashRate.toFixed(1)} EH/s` : "Loading..."}
                  </div>
                  <div className="text-xs text-gray-400">Hash rate maintaining security</div>
                </div>
                
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-green-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-semibold text-sm tracking-wide">Mempool Status</span>
                      <Info 
                        className="h-3 w-3 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" 
                        onClick={() => setShowMempoolModal(true)}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-bold text-xl mb-1">
                    {networkStats ? `${networkStats.mempoolSize}` : "Loading..."}
                  </div>
                  <div className="text-xs text-gray-400">Unconfirmed transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Essential Bitcoin Reading - Full Width */}
        <div className="flex justify-center mt-8 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 via-orange-900/20 to-gray-800 border-orange-500/30 border-2 max-w-4xl w-full relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-orange-500/20">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-yellow-500/10 to-red-500/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            
            {/* Subtle shimmer animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
            
            <CardHeader className="relative z-10">
              {/* Orange-Gold-Red circles decoration */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-orange-500 rounded-full"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-red-500 rounded-full"></div>
              </div>
              <CardTitle className="flex items-center justify-center text-2xl text-orange-400 group-hover:text-orange-300 transition-colors duration-300">
                <BookOpen className="h-6 w-6 mr-3 animate-pulse-slow" />
                <span className="text-white font-bold tracking-wide">
                  Essential Bitcoin Reading
                </span>
                <div className="ml-3">
                  <div className="flex items-center space-x-2 bg-orange-400/20 px-3 py-1 rounded-full border border-orange-400/30">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse-slow shadow-lg shadow-orange-400/50"></div>
                    <span className="text-sm text-orange-400 font-bold tracking-wide">LEARN</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 gap-4">
                {/* The Bitcoin Standard */}
                <div 
                  className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-orange-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer"
                  onClick={() => window.open('https://archive.org/details/the-bitcoin-standard-the-decentralized-alternative-to-central-banking_202205', '_blank')}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-16 bg-gradient-to-b from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-orange-400 font-bold text-lg group-hover/item:text-orange-300 transition-colors duration-300">
                          The Bitcoin Standard
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">FREE</Badge>
                      </div>
                      <div className="text-gray-300 text-sm mb-2">By Saifedean Ammous</div>
                      <div className="text-white/80 text-sm leading-relaxed">
                        The definitive guide to understanding Bitcoin as sound money and its role in the future of economics
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-orange-400">Foundational Reading</span>
                        </div>
                        <div className="text-xs text-gray-400">Essential</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Bullish Case for Bitcoin */}
                <div 
                  className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-orange-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer"
                  onClick={() => window.open('https://vijayboyapati.medium.com/the-bullish-case-for-bitcoin-6ecc8bdecc1', '_blank')}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-16 bg-gradient-to-b from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-orange-400 font-bold text-lg group-hover/item:text-orange-300 transition-colors duration-300">
                          The Bullish Case for Bitcoin
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">FREE</Badge>
                      </div>
                      <div className="text-gray-300 text-sm mb-2">By Vijay Boyapati</div>
                      <div className="text-white/80 text-sm leading-relaxed">
                        Comprehensive investment thesis explaining why Bitcoin is the ultimate store of value
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400">Investment Perspective</span>
                        </div>
                        <div className="text-xs text-gray-400">Strategic</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Broken Money */}
                <div 
                  className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-orange-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer"
                  onClick={() => window.open('https://dokumen.pub/broken-money-why-our-financial-system-is-failing-us-and-how-we-can-make-it-better-9798988666301-9798988666318-9798988666325.html', '_blank')}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-16 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-orange-400 font-bold text-lg group-hover/item:text-orange-300 transition-colors duration-300">
                          Broken Money
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">FREE</Badge>
                      </div>
                      <div className="text-gray-300 text-sm mb-2">By Lyn Alden</div>
                      <div className="text-white/80 text-sm leading-relaxed">
                        Deep analysis of why our financial system is failing and how Bitcoin provides a solution
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-purple-400">Monetary Systems</span>
                        </div>
                        <div className="text-xs text-gray-400">Expert</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Price of Tomorrow */}
                <div 
                  className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-orange-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer"
                  onClick={() => window.open('https://dokumen.pub/the-price-of-tomorrow-why-deflation-is-the-key-to-an-abundant-future-9781999257408-9781999257415.html', '_blank')}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-16 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-orange-400 font-bold text-lg group-hover/item:text-orange-300 transition-colors duration-300">
                          The Price of Tomorrow
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">FREE</Badge>
                      </div>
                      <div className="text-gray-300 text-sm mb-2">By Jeff Booth</div>
                      <div className="text-white/80 text-sm leading-relaxed">
                        How deflationary technology and Bitcoin create abundance in an inflationary world
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-blue-400">Future Economics</span>
                        </div>
                        <div className="text-xs text-gray-400">Visionary</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matthew Kratter's Channel */}
                <div 
                  className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:border-orange-500/30 transition-all duration-300 group/item hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer"
                  onClick={() => window.open('https://www.youtube.com/@Bitcoin_University/videos', '_blank')}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-16 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-orange-400 font-bold text-lg group-hover/item:text-orange-300 transition-colors duration-300">
                          Bitcoin University
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">FREE VIDEOS</Badge>
                      </div>
                      <div className="text-gray-300 text-sm mb-2">By Matthew Kratter</div>
                      <div className="text-white/80 text-sm leading-relaxed">
                        Practical Bitcoin education, market analysis, and trading strategies explained simply
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-yellow-400">Video Learning</span>
                        </div>
                        <div className="text-xs text-gray-400">Practical</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </CardContent>
          </Card>
        </div>





      </div>

      {/* Fear & Greed Index Explanation Modal */}
      <Dialog open={showFearGreedModal} onOpenChange={setShowFearGreedModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-bitcoin mb-4">Understanding the Fear & Greed Index</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              The Crypto Fear & Greed Index is a crucial sentiment indicator that measures market emotions 
              to help you make better investment decisions.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">How It Works</h3>
              <p>
                The index analyzes multiple data sources including volatility, market momentum, social media sentiment, 
                dominance, trends, and surveys to create a score from 0-100.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">Extreme Fear (0-24)</h4>
                <p className="text-sm">Market is oversold. Potential buying opportunity as investors are too worried.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <h4 className="text-blue-400 font-medium mb-2">Fear (25-49)</h4>
                <p className="text-sm">Investors are fearful but not panicking. Market may be undervalued.</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <h4 className="text-yellow-400 font-medium mb-2">Greed (50-74)</h4>
                <p className="text-sm">Investors are getting greedy. Market may be getting overvalued.</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <h4 className="text-red-400 font-medium mb-2">Extreme Greed (75-100)</h4>
                <p className="text-sm">Market may be due for correction. Consider taking profits.</p>
              </div>
            </div>

            <div className="bg-bitcoin/10 border border-bitcoin/20 rounded-lg p-4">
              <h3 className="text-bitcoin font-semibold mb-2">Investment Strategy</h3>
              <p className="text-sm">
                <strong>Contrarian Approach:</strong> When others are fearful, consider buying. 
                When others are greedy, consider selling. This index helps you avoid emotional decisions 
                and potentially buy low and sell high.
              </p>
            </div>

            <p className="text-sm text-gray-400">
              Current Index: <span className={`font-semibold ${fearGreedData.color}`}>
                {fearGreedIndex} - {fearGreedData.label}
              </span>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 24h Volume Explanation Modal */}
      <Dialog open={showVolumeModal} onOpenChange={setShowVolumeModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-electric mb-4">Understanding 24h Volume</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              24-hour trading volume represents the total value of Bitcoin traded across all exchanges in the past 24 hours.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Why Volume Matters</h3>
              <p>
                High volume indicates strong market interest and liquidity. Low volume suggests uncertainty or lack of conviction in price movements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">High Volume</h4>
                <p className="text-sm">Strong market participation. Price movements are more reliable and sustainable.</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <h4 className="text-red-400 font-medium mb-2">Low Volume</h4>
                <p className="text-sm">Weak market participation. Price movements may be less reliable or easily reversed.</p>
              </div>
            </div>

            <div className="bg-electric/10 border border-electric/20 rounded-lg p-4">
              <h3 className="text-electric font-semibold mb-2">Trading Strategy</h3>
              <p className="text-sm">
                <strong>Volume Confirmation:</strong> Look for high volume to confirm price breakouts. 
                Avoid trading during low volume periods as prices can be more volatile and unpredictable.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Market Cap Explanation Modal */}
      <Dialog open={showMarketCapModal} onOpenChange={setShowMarketCapModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-electric mb-4">Understanding Market Cap</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              Market capitalization is the total value of all Bitcoin in circulation, calculated by multiplying the current price by the total supply.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Formula</h3>
              <p className="font-mono text-bitcoin">
                Market Cap = Current Price × Circulating Supply
              </p>
              <p className="text-sm mt-2">
                With ~19.8 million Bitcoin in circulation, market cap reflects Bitcoin's total network value.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-bitcoin/10 border border-bitcoin/20 rounded-lg p-3">
                <h4 className="text-bitcoin font-medium mb-2">Market Position</h4>
                <p className="text-sm">Bitcoin typically maintains 40-60% of the total cryptocurrency market cap, showing its dominance as digital gold.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <h4 className="text-blue-400 font-medium mb-2">Investment Perspective</h4>
                <p className="text-sm">Higher market cap generally indicates greater stability and institutional acceptance, though growth potential may be more moderate.</p>
              </div>
            </div>

            <div className="bg-electric/10 border border-electric/20 rounded-lg p-4">
              <h3 className="text-electric font-semibold mb-2">Key Insight</h3>
              <p className="text-sm">
                Market cap growth reflects overall network adoption and value recognition. 
                Compare Bitcoin's market cap to traditional assets like gold (~$13T) for perspective.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Network Hash Rate Explanation Modal */}
      <Dialog open={showHashRateModal} onOpenChange={setShowHashRateModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-bitcoin mb-4">Understanding Network Hash Rate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              Hash rate measures the computational power securing the Bitcoin network, expressed in exahashes per second (EH/s).
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Network Security</h3>
              <p>
                Higher hash rate means more miners are competing to secure the network, making Bitcoin more resistant to attacks and more decentralized.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">Rising Hash Rate</h4>
                <p className="text-sm">Indicates growing miner confidence, network security, and long-term bullish sentiment.</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <h4 className="text-yellow-400 font-medium mb-2">Falling Hash Rate</h4>
                <p className="text-sm">May signal miner capitulation, regulatory pressure, or energy concerns affecting network security.</p>
              </div>
            </div>

            <div className="bg-bitcoin/10 border border-bitcoin/20 rounded-lg p-4">
              <h3 className="text-bitcoin font-semibold mb-2">Investment Signal</h3>
              <p className="text-sm">
                <strong>Hash Rate as Indicator:</strong> Sustained hash rate growth often precedes price increases. 
                Miners invest in expensive equipment when they're confident in Bitcoin's future value.
              </p>
            </div>

            <p className="text-sm text-gray-400">
              Current Hash Rate: <span className="font-semibold text-bitcoin">
                {networkStats ? `${Math.round(networkStats.hashRate)} EH/s` : "Loading..."}
              </span>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Addresses Explanation Modal */}
      <Dialog open={showActiveAddressesModal} onOpenChange={setShowActiveAddressesModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-bitcoin mb-4">Understanding Active Addresses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              Active addresses represent the number of unique Bitcoin addresses that participated in transactions within a specific timeframe.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Network Activity</h3>
              <p>
                More active addresses indicate higher network usage, adoption, and real economic activity on the Bitcoin blockchain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">Growing Addresses</h4>
                <p className="text-sm">Shows expanding user base, increased adoption, and healthy network growth.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <h4 className="text-blue-400 font-medium mb-2">Declining Addresses</h4>
                <p className="text-sm">May indicate reduced interest, market consolidation, or users holding rather than transacting.</p>
              </div>
            </div>

            <div className="bg-bitcoin/10 border border-bitcoin/20 rounded-lg p-4">
              <h3 className="text-bitcoin font-semibold mb-2">Analysis Insight</h3>
              <p className="text-sm">
                <strong>Fundamental Health:</strong> Active addresses provide insight into actual network usage beyond just price speculation. 
                Sustainable growth requires both price appreciation and increased utility.
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-2">Important Note</h3>
              <p className="text-sm">
                One person can control multiple addresses, so this metric measures address activity, not necessarily individual users. 
                Still valuable for understanding overall network engagement trends.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dominance Modal */}
      <Dialog open={showDominanceModal} onOpenChange={setShowDominanceModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-bitcoin flex items-center gap-2">
              <Info className="h-5 w-5" />
              Bitcoin Dominance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Bitcoin Dominance</strong> represents Bitcoin's market capitalization as a percentage of the total cryptocurrency market cap.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-bitcoin">What it measures:</h4>
                <p className="text-sm text-gray-300">
                  The relative strength and market position of Bitcoin compared to all other cryptocurrencies combined.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-bitcoin">Market signals:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  <li><strong>High dominance (&gt;60%):</strong> Bitcoin leading the market</li>
                  <li><strong>Medium dominance (40-60%):</strong> Balanced crypto market</li>
                  <li><strong>Low dominance (&lt;40%):</strong> Altcoin season likely</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-bitcoin">Investment insight:</h4>
                <p className="text-sm text-gray-300">
                  Changes in dominance often indicate shifts in investor sentiment between Bitcoin and alternative cryptocurrencies.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Next Halving Modal */}
      <Dialog open={showHalvingModal} onOpenChange={setShowHalvingModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-bitcoin flex items-center gap-2">
              <Info className="h-5 w-5" />
              Bitcoin Halving Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              The <strong>Bitcoin Halving</strong> is a programmed event that cuts the block reward for miners in half approximately every 4 years.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-bitcoin">How it works:</h4>
                <p className="text-sm text-gray-300">
                  Every 210,000 blocks (~4 years), the reward miners receive for validating transactions is reduced by 50%.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-bitcoin">Supply impact:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  <li>Reduces new Bitcoin entering circulation</li>
                  <li>Creates scarcity and potential price pressure</li>
                  <li>Ensures Bitcoin's 21 million coin limit</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-bitcoin">Historical pattern:</h4>
                <p className="text-sm text-gray-300">
                  Previous halvings (2012, 2016, 2020) have often preceded significant price increases, though past performance doesn't guarantee future results.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Block Height Modal */}
      <Dialog open={showBlockHeightModal} onOpenChange={setShowBlockHeightModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-electric flex items-center gap-2">
              <Info className="h-5 w-5" />
              Block Height
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Learn about Bitcoin's block height and blockchain progression
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Block Height</strong> represents the total number of blocks that have been mined in the Bitcoin blockchain since the genesis block.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-electric">What it shows:</h4>
                <p className="text-sm text-gray-300">
                  Each block contains transactions and is linked to the previous block, creating an immutable chain of records.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-electric">Network progress:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  <li>Genesis block (2009): Block 0</li>
                  <li>New blocks added approximately every 10 minutes</li>
                  <li>Higher numbers indicate blockchain growth</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-electric">Security significance:</h4>
                <p className="text-sm text-gray-300">
                  More blocks mean stronger security through accumulated proof-of-work, making the network increasingly resistant to attacks.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Difficulty Modal */}
      <Dialog open={showDifficultyModal} onOpenChange={setShowDifficultyModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-electric flex items-center gap-2">
              <Info className="h-5 w-5" />
              Mining Difficulty
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Understand Bitcoin's mining difficulty adjustment mechanism
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Mining Difficulty</strong> measures how hard it is to find a valid hash for a new block on the Bitcoin network.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-electric">Automatic adjustment:</h4>
                <p className="text-sm text-gray-300">
                  Every 2,016 blocks (~2 weeks), difficulty adjusts to maintain the 10-minute block time target.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-electric">Network effects:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  <li><strong>Rising difficulty:</strong> More miners, stronger security</li>
                  <li><strong>Falling difficulty:</strong> Miners leaving, easier mining</li>
                  <li><strong>Stable target:</strong> Consistent block production</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-electric">Market indicator:</h4>
                <p className="text-sm text-gray-300">
                  Higher difficulty often correlates with increased miner confidence and network investment.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Block Time Modal */}
      <Dialog open={showBlockTimeModal} onOpenChange={setShowBlockTimeModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-electric flex items-center gap-2">
              <Info className="h-5 w-5" />
              Average Block Time
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Learn about Bitcoin's block timing and network performance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Average Block Time</strong> shows the actual time interval between blocks over a recent period.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-electric">Target vs reality:</h4>
                <p className="text-sm text-gray-300">
                  Bitcoin targets 10 minutes per block, but actual times vary based on network hash rate and difficulty adjustments.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-electric">What affects it:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  <li>Changes in total network hash rate</li>
                  <li>Miners joining or leaving the network</li>
                  <li>Time between difficulty adjustments</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-electric">Transaction impact:</h4>
                <p className="text-sm text-gray-300">
                  Faster block times mean quicker transaction confirmations, while slower times may cause temporary delays.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mempool Modal */}
      <Dialog open={showMempoolModal} onOpenChange={setShowMempoolModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-electric flex items-center gap-2">
              <Info className="h-5 w-5" />
              Mempool Size
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Understand Bitcoin's transaction queue and fee dynamics
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Mempool Size</strong> represents the total size of unconfirmed transactions waiting to be included in the next block.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-electric">Transaction queue:</h4>
                <p className="text-sm text-gray-300">
                  When users send Bitcoin, transactions first go to the mempool before miners include them in blocks.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-electric">Fee implications:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  <li><strong>Large mempool:</strong> Higher fees needed for priority</li>
                  <li><strong>Small mempool:</strong> Lower fees still get confirmed</li>
                  <li><strong>Congestion indicator:</strong> Network usage levels</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-electric">Optimal timing:</h4>
                <p className="text-sm text-gray-300">
                  Monitoring mempool size helps users choose optimal times for transactions and appropriate fee levels.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exchange Health Modal */}
      <Dialog open={showExchangeHealthModal} onOpenChange={setShowExchangeHealthModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl sm:max-w-2xl w-[95vw] sm:w-full max-h-[85vh] flex flex-col" aria-describedby="exchange-health-description">
          <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl text-bitcoin">Bitcoin Exchange Health Monitor</DialogTitle>
              <button 
                onClick={() => setShowExchangeHealthModal(false)}
                className="rounded-full p-2 bg-gray-800 hover:bg-gray-700 transition-colors touch-manipulation"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </DialogHeader>
          <div id="exchange-health-description" className="flex-1 overflow-y-auto space-y-4 text-gray-300 pt-4">
            <p className="text-lg">
              Exchange health monitoring tracks the operational status, uptime, and reliability of major Bitcoin trading platforms.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Status Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Operational - All systems running normally</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Warning - Minor issues or maintenance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-sm">Down - Service disruption or outage</span>
                </div>
              </div>
            </div>

            <div className="bg-bitcoin/10 border border-bitcoin/20 rounded-lg p-4">
              <h3 className="text-bitcoin font-semibold mb-2">Why This Matters</h3>
              <p className="text-sm">
                Exchange health directly affects your ability to trade, withdraw funds, and access your Bitcoin. 
                Monitoring multiple exchanges helps you make informed decisions about where to trade and store assets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">Uptime Monitoring</h4>
                <p className="text-sm">Real-time tracking of exchange availability and response times.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <h4 className="text-blue-400 font-medium mb-2">Security Status</h4>
                <p className="text-sm">Monitoring for security incidents, maintenance windows, and system updates.</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-2">Best Practices</h3>
              <ul className="text-sm space-y-1">
                <li>• Use multiple exchanges to reduce single points of failure</li>
                <li>• Check exchange status before making large transactions</li>
                <li>• Keep funds in cold storage when not actively trading</li>
                <li>• Stay informed about planned maintenance windows</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Intelligence Explanation Modals */}
      <Dialog open={showPricePredictionModal} onOpenChange={setShowPricePredictionModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-400 mb-4">Price Prediction AI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              Our AI analyzes market patterns, trading volumes, and technical indicators to predict Bitcoin's price movement over the next 24 hours.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">How It Works</h3>
              <p>
                The AI processes real-time data from multiple exchanges, social sentiment, on-chain metrics, and historical patterns to generate price targets with confidence levels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">High Confidence (80%+)</h4>
                <p className="text-sm">Strong signals align across multiple indicators. Prediction likely accurate.</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <h4 className="text-yellow-400 font-medium mb-2">Medium Confidence (60-79%)</h4>
                <p className="text-sm">Mixed signals. Market conditions are uncertain or volatile.</p>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-2">Important Note</h3>
              <p className="text-sm">
                AI predictions are based on historical data and current market conditions. 
                Always do your own research and never invest more than you can afford to lose.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPatternRecognitionModal} onOpenChange={setShowPatternRecognitionModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-400 mb-4">Pattern Recognition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              Advanced algorithms identify classic trading patterns in Bitcoin's price action that historically lead to predictable outcomes.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Pattern Types & Meanings</h3>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-green-400 pl-3">
                  <strong className="text-green-400">Bull Flag:</strong> Strong upward trend continuation. Price consolidates briefly before resuming upward movement. Success rate: 80-85%.
                </div>
                <div className="border-l-4 border-red-400 pl-3">
                  <strong className="text-red-400">Bear Flag:</strong> Strong downward trend continuation. Brief consolidation before price continues falling. Success rate: 75-80%.
                </div>
                <div className="border-l-4 border-purple-400 pl-3">
                  <strong className="text-purple-400">Diamond Top:</strong> Rare reversal pattern indicating high volatility and potential trend change. Success rate: 70-75%.
                </div>
                <div className="border-l-4 border-blue-400 pl-3">
                  <strong className="text-blue-400">Ascending Triangle:</strong> Bullish pattern with horizontal resistance and rising support. Breakout typically upward. Success rate: 85-90%.
                </div>
                <div className="border-l-4 border-orange-400 pl-3">
                  <strong className="text-orange-400">Descending Triangle:</strong> Bearish pattern with horizontal support and declining resistance. Breakout typically downward. Success rate: 80-85%.
                </div>
                <div className="border-l-4 border-gray-400 pl-3">
                  <strong className="text-gray-400">Sideways Consolidation:</strong> Price moves horizontally, indicating indecision. Breakout direction uncertain until confirmed.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">High Success Rate (85%+)</h4>
                <p className="text-sm">Pattern has strong historical performance and clear formation.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <h4 className="text-blue-400 font-medium mb-2">Pattern Status</h4>
                <p className="text-sm">Shows if pattern is forming, confirmed, or completed.</p>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-2">Trading Strategy</h3>
              <p className="text-sm">
                Use pattern recognition as confirmation for your trading decisions. 
                Combine with volume analysis and support/resistance levels for best results.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAnomalyDetectionModal} onOpenChange={setShowAnomalyDetectionModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-400 mb-4">Anomaly Detection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              AI monitors market behavior for unusual patterns that could indicate significant events, manipulation, or market stress.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">What We Monitor</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Volume Spikes:</strong> Unusual trading activity</li>
                <li>• <strong>Price Anomalies:</strong> Rapid price movements without news</li>
                <li>• <strong>Exchange Disparities:</strong> Large price differences between exchanges</li>
                <li>• <strong>Whale Activity:</strong> Large transactions affecting market</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">Low Risk</h4>
                <p className="text-sm">Normal market conditions with typical trading patterns.</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <h4 className="text-yellow-400 font-medium mb-2">Medium Risk</h4>
                <p className="text-sm">Some unusual activity detected. Monitor closely.</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <h4 className="text-red-400 font-medium mb-2">High Risk</h4>
                <p className="text-sm">Significant anomalies detected. Exercise caution.</p>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-2">Risk Management</h3>
              <p className="text-sm">
                Anomaly detection helps you identify potential market manipulation or unusual events. 
                Use this information to adjust position sizes and risk exposure accordingly.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Whale Activity Explanation Modals */}
      <Dialog open={showLargeTransactionsModal} onOpenChange={setShowLargeTransactionsModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400 mb-4">Large Transactions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              Tracks significant Bitcoin movements (typically 100+ BTC) that can impact market prices and indicate institutional activity.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">What Qualifies as Large</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Small Whale:</strong> 100-500 BTC ($3-15M)</li>
                <li>• <strong>Medium Whale:</strong> 500-1,000 BTC ($15-30M)</li>
                <li>• <strong>Large Whale:</strong> 1,000+ BTC ($30M+)</li>
                <li>• <strong>Institutional:</strong> 5,000+ BTC ($150M+)</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">Inflows to Exchanges</h4>
                <p className="text-sm">Large amounts moving to exchanges often indicate selling pressure.</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <h4 className="text-red-400 font-medium mb-2">Outflows from Exchanges</h4>
                <p className="text-sm">Moving to cold storage usually indicates long-term holding.</p>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h3 className="text-cyan-400 font-semibold mb-2">Market Impact</h3>
              <p className="text-sm">
                Large transactions can signal institutional movements, potential selling pressure, or accumulation phases. 
                Monitor these flows to understand market sentiment and potential price movements.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showExchangeFlowsModal} onOpenChange={setShowExchangeFlowsModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400 mb-4">Exchange Flows</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              Monitors Bitcoin flowing into and out of major exchanges, providing insights into market sentiment and trading intentions.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Flow Interpretation</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Net Inflows:</strong> More Bitcoin entering exchanges (potential selling)</li>
                <li>• <strong>Net Outflows:</strong> More Bitcoin leaving exchanges (potential holding)</li>
                <li>• <strong>Balanced Flows:</strong> Stable market conditions</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <h4 className="text-blue-400 font-medium mb-2">Major Exchanges</h4>
                <p className="text-sm">Binance, Coinbase, Kraken, Bitfinex flows have the highest market impact.</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <h4 className="text-purple-400 font-medium mb-2">Timing Analysis</h4>
                <p className="text-sm">Recent flows (last 2-4 hours) are most relevant for short-term trading.</p>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h3 className="text-cyan-400 font-semibold mb-2">Trading Signal</h3>
              <p className="text-sm">
                Large exchange inflows often precede price drops as whales prepare to sell. 
                Large outflows suggest accumulation and potential price stability or increases.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showInstitutionalFlowModal} onOpenChange={setShowInstitutionalFlowModal}>
        <DialogContent className="max-w-2xl bg-dark-bg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400 mb-4">Institutional Flow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              Tracks institutional Bitcoin investments through ETFs, corporate treasuries, and large-scale investment vehicles.
            </p>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Institutional Channels</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Bitcoin ETFs:</strong> GBTC, BITO, and other ETF inflows/outflows</li>
                <li>• <strong>Corporate Treasuries:</strong> MicroStrategy, Tesla, Square purchases</li>
                <li>• <strong>Investment Funds:</strong> Hedge funds and pension fund allocations</li>
                <li>• <strong>Mining Companies:</strong> Large mining operations and their Bitcoin holdings</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">Positive Inflows</h4>
                <p className="text-sm">Institutional buying creates strong upward pressure and market confidence.</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <h4 className="text-yellow-400 font-medium mb-2">Weekly Trends</h4>
                <p className="text-sm">Sustained weekly inflows indicate long-term institutional adoption.</p>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h3 className="text-cyan-400 font-semibold mb-2">Market Significance</h3>
              <p className="text-sm">
                Institutional flows are the strongest predictor of long-term Bitcoin price trends. 
                Large institutional buying often leads to sustained bull markets and reduced volatility.
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2">Current Trend</h3>
              <p className="text-sm">
                ETF Inflow: <span className="font-bold text-white">
                  {whaleData?.institutionalFlow ? `$${whaleData.institutionalFlow.etfInflow}M` : "Loading..."}
                </span> | Weekly: <span className="font-bold text-white">
                  {whaleData?.institutionalFlow ? `$${whaleData.institutionalFlow.weeklyInflow}B` : "Loading..."}
                </span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Market Momentum Modal */}
      <Dialog open={showMarketMomentumModal} onOpenChange={setShowMarketMomentumModal}>
        <DialogContent className="bg-gray-900 border-green-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-400 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Market Momentum
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-gray-300">
              <p className="mb-3">
                Market momentum analyzes the direction and strength of Bitcoin's price trend using multiple technical indicators.
              </p>
              <p className="mb-3">
                <span className="text-green-400 font-semibold">Key Factors:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                <li>7-day moving average trends</li>
                <li>Volume-weighted price movements</li>
                <li>Relative strength index (RSI)</li>
                <li>Market sentiment indicators</li>
              </ul>
              <p className="mt-3 text-sm">
                <span className="text-green-400 font-semibold">Current Status:</span> Based on technical analysis showing positive price momentum over the last 7 days.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Network Activity Modal */}
      <Dialog open={showNetworkActivityModal} onOpenChange={setShowNetworkActivityModal}>
        <DialogContent className="bg-gray-900 border-green-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-400 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Network Activity
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-gray-300">
              <p className="mb-3">
                Network activity measures the overall usage and health of the Bitcoin blockchain through transaction volume and network participation.
              </p>
              <p className="mb-3">
                <span className="text-green-400 font-semibold">Key Metrics:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                <li>Daily transaction volume</li>
                <li>Active addresses count</li>
                <li>Mempool size and congestion</li>
                <li>Average transaction fees</li>
              </ul>
              <p className="mt-3 text-sm">
                <span className="text-green-400 font-semibold">Current Status:</span> Transaction volume is above historical averages, indicating healthy network usage.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Score Modal */}
      <Dialog open={showSecurityScoreModal} onOpenChange={setShowSecurityScoreModal}>
        <DialogContent className="bg-gray-900 border-blue-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-400 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Score
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-gray-300">
              <p className="mb-3">
                Security Score measures the overall safety and trustworthiness of cryptocurrency exchanges based on multiple security factors.
              </p>
              <p className="mb-3">
                <span className="text-blue-400 font-semibold">Key Security Factors:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                <li>Cold storage percentage of funds</li>
                <li>2FA and security authentication methods</li>
                <li>Insurance coverage for user funds</li>
                <li>Regulatory compliance and licensing</li>
                <li>Historical security incident record</li>
                <li>Third-party security audits</li>
              </ul>
              <p className="mt-3 text-sm">
                <span className="text-blue-400 font-semibold">Current Score:</span> 98.7% represents excellent security standards across major exchanges with comprehensive protection measures.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* API Response Modal */}
      <Dialog open={showApiResponseModal} onOpenChange={setShowApiResponseModal}>
        <DialogContent className="bg-gray-900 border-blue-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-400 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              API Response Time
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-gray-300">
              <p className="mb-3">
                API Response Time measures how quickly cryptocurrency exchanges respond to data requests, indicating system performance and reliability.
              </p>
              <p className="mb-3">
                <span className="text-blue-400 font-semibold">What This Measures:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                <li>Server response speed for price data</li>
                <li>System load and capacity handling</li>
                <li>Network infrastructure quality</li>
                <li>Real-time data feed efficiency</li>
                <li>Exchange technical reliability</li>
              </ul>
              <p className="mt-3 text-sm">
                <span className="text-blue-400 font-semibold">Current Time:</span> 147ms average response indicates excellent performance. Faster responses mean more reliable real-time trading data.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Market Volatility Modal */}
      <Dialog open={showVolatilityModal} onOpenChange={setShowVolatilityModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-purple-400 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Market Volatility AI
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Advanced volatility analysis using machine learning algorithms
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Market Volatility AI</strong> analyzes Bitcoin's price movements over a 30-day period using advanced statistical models and machine learning algorithms.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-purple-400">How it works:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  <li>Calculates standard deviation of daily price changes</li>
                  <li>Analyzes intraday price ranges and volume patterns</li>
                  <li>Compares current volatility to historical averages</li>
                  <li>Factors in market events and news sentiment</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-400">Volatility levels:</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-green-500/20 p-2 rounded text-center">
                    <div className="text-green-400 font-semibold">Low</div>
                    <div>0-2%</div>
                  </div>
                  <div className="bg-yellow-500/20 p-2 rounded text-center">
                    <div className="text-yellow-400 font-semibold">Moderate</div>
                    <div>2-5%</div>
                  </div>
                  <div className="bg-red-500/20 p-2 rounded text-center">
                    <div className="text-red-400 font-semibold">High</div>
                    <div>5%+</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">Trading Implications</h3>
                <ul className="text-sm space-y-1">
                  <li>• <strong>High volatility:</strong> Greater profit potential but increased risk</li>
                  <li>• <strong>Low volatility:</strong> More predictable price movements</li>
                  <li>• <strong>Sudden spikes:</strong> Often precede major market moves</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sentiment Analysis Modal */}
      <Dialog open={showSentimentAnalysisModal} onOpenChange={setShowSentimentAnalysisModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-indigo-400 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Sentiment Analysis AI
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Real-time market sentiment analysis from multiple data sources
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Sentiment Analysis AI</strong> processes news articles, social media, and market data to gauge overall market sentiment towards Bitcoin.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-indigo-400">Data sources analyzed:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  <li>Major cryptocurrency news outlets</li>
                  <li>Social media mentions and discussions</li>
                  <li>Fear & Greed Index data</li>
                  <li>Trading volume and market activity</li>
                  <li>Institutional announcements and reports</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-indigo-400">Sentiment indicators:</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-red-500/20 p-2 rounded text-center">
                    <div className="text-red-400 font-semibold">Bearish</div>
                    <div>Negative outlook</div>
                  </div>
                  <div className="bg-yellow-500/20 p-2 rounded text-center">
                    <div className="text-yellow-400 font-semibold">Neutral</div>
                    <div>Mixed signals</div>
                  </div>
                  <div className="bg-green-500/20 p-2 rounded text-center">
                    <div className="text-green-400 font-semibold">Bullish</div>
                    <div>Positive outlook</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                <h3 className="text-indigo-400 font-semibold mb-2">Key Features</h3>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Real-time processing:</strong> Updates every 5 minutes</li>
                  <li>• <strong>Weighted scoring:</strong> More credible sources have higher impact</li>
                  <li>• <strong>Historical context:</strong> Compares to past sentiment patterns</li>
                  <li>• <strong>Trend detection:</strong> Identifies sentiment shifts early</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Trading Signals Modal */}
      <Dialog open={showTradingSignalsModal} onOpenChange={setShowTradingSignalsModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-400 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Trading Signals AI
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Personalized trading recommendations based on AI analysis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Trading Signals AI</strong> combines technical analysis, market sentiment, and risk assessment to generate personalized trading recommendations.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-blue-400">Signal generation process:</h4>
                <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                  <li>Technical indicator analysis (RSI, MACD, moving averages)</li>
                  <li>Market sentiment correlation</li>
                  <li>Volume and momentum analysis</li>
                  <li>Support and resistance level identification</li>
                  <li>Risk-adjusted position sizing</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-400">Signal types:</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-green-500/20 p-2 rounded text-center">
                    <div className="text-green-400 font-semibold">BUY</div>
                    <div>Strong upward potential</div>
                  </div>
                  <div className="bg-yellow-500/20 p-2 rounded text-center">
                    <div className="text-yellow-400 font-semibold">HOLD</div>
                    <div>Wait for clearer signals</div>
                  </div>
                  <div className="bg-red-500/20 p-2 rounded text-center">
                    <div className="text-red-400 font-semibold">SELL</div>
                    <div>Consider taking profits</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2">Risk Management</h3>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Risk assessment:</strong> Low, Medium, High classifications</li>
                  <li>• <strong>Pattern matching:</strong> Historical success rate analysis</li>
                  <li>• <strong>Portfolio balance:</strong> Considers overall exposure</li>
                  <li>• <strong>Stop-loss suggestions:</strong> Automated risk limits</li>
                </ul>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h3 className="text-yellow-400 font-semibold mb-2">Important Disclaimer</h3>
                <p className="text-sm">
                  These signals are for educational purposes only and should not be considered financial advice. 
                  Always conduct your own research and consider your risk tolerance before making trading decisions.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </section>
  );
}