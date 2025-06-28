import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBitcoinPrice } from "@/hooks/use-bitcoin-price";
import { Inbox, ChartBar, Bolt, Waves, Shield, CreditCard, Gem, WavesIcon, Eye, TrendingUp, TrendingDown, RotateCcw, History, Newspaper, Info, Bell, Bookmark, Star } from "lucide-react";
import PriceAlertsModal from "./price-alerts-modal";
import LoadingSkeleton from "./loading-skeleton";
import { useToast } from "@/hooks/use-toast";

const exchangeIcons = {
  coinbase: Inbox,
  binance: ChartBar,
  strike: Bolt,
  kraken: Waves,
  robinhood: Shield,
  "crypto.com": CreditCard,
  gemini: Gem,
  river: WavesIcon,
  bisq: RotateCcw,
};

export default function LivePrices() {
  const { data: priceComparison, isLoading } = useBitcoinPrice();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showMaxSpreadModal, setShowMaxSpreadModal] = useState(false);
  const [showAverageSpreadModal, setShowAverageSpreadModal] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [glitchingPrices, setGlitchingPrices] = useState<Set<string>>(new Set());
  const [previousPrices, setPreviousPrices] = useState<Map<string, string>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Track price changes and trigger glitch effects
  useEffect(() => {
    if (priceComparison?.exchanges) {
      priceComparison.exchanges.forEach(({ exchange, currentPrice }) => {
        const exchangeKey = exchange.name;
        const currentPriceValue = currentPrice.price;
        const previousPrice = previousPrices.get(exchangeKey);

        if (previousPrice && previousPrice !== currentPriceValue) {
          // Price changed - trigger glitch effect
          setGlitchingPrices(prev => new Set(prev).add(exchangeKey));
          
          // Remove glitch effect after animation completes
          setTimeout(() => {
            setGlitchingPrices(prev => {
              const newSet = new Set(prev);
              newSet.delete(exchangeKey);
              return newSet;
            });
          }, 300);
        }

        // Update previous prices
        setPreviousPrices(prev => new Map(prev).set(exchangeKey, currentPriceValue));
      });
    }
  }, [priceComparison?.exchanges, previousPrices]);

  if (isLoading) {
    return (
      <section id="live-prices" className="py-8 bg-gradient-to-b from-dark-bg to-surface">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-bitcoin to-electric bg-clip-text text-transparent">
              Live Price Comparison
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Loading real-time Bitcoin prices...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 sm:mb-8 md:mb-12 max-w-7xl mx-auto px-2 sm:px-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="h-[200px]">
                <LoadingSkeleton type="price-card" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!priceComparison) {
    return (
      <section id="live-prices" className="py-8 bg-gradient-to-b from-dark-bg to-surface">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-6 text-red-400">
            Price Data Unavailable
          </h3>
          <p className="text-gray-300">
            Unable to fetch real-time Bitcoin prices. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <section id="live-prices" className="section-spacing bg-gradient-to-b from-dark-bg to-surface fade-in-up" role="region" aria-labelledby="live-prices-heading">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-4 sm:mb-6">

          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-bitcoin/5 via-electric/5 to-bitcoin/5 p-4 sm:p-6 md:p-8 border border-bitcoin/20 epic-float">
              <div className="absolute inset-0 bg-gradient-to-r from-bitcoin/10 via-electric/10 to-bitcoin/10 animate-pulse opacity-50"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/3 to-transparent shimmer"></div>
              <div className="relative z-10 text-center">
                <div className="flex justify-center items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm sm:text-base md:text-lg font-bold text-green-400 tracking-wider">REAL-TIME UPDATES</span>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-relaxed px-2">
                  <span 
                    className="text-bitcoin animate-pulse-slow cursor-pointer hover:text-orange-300 transition-colors duration-300"
                    onClick={() => window.open('https://bitcoin.org/en/', '_blank')}
                  >
                    Real-time Bitcoin prices
                  </span>
                  <span className="text-gray-200 mx-1 sm:mx-2">updated every second across</span>
                  <span 
                    className="text-electric animate-pulse-slow cursor-pointer hover:text-blue-300 transition-colors duration-300"
                    onClick={() => window.open('https://www.coingecko.com/en/exchanges', '_blank')}
                  >
                    major exchanges
                  </span>
                  <br className="hidden sm:block" />
                  <span className="text-gray-200 block sm:inline mt-2 sm:mt-0">Find the</span>
                  <span 
                    className="text-bitcoin mx-1 sm:mx-2 font-bold cursor-pointer hover:text-orange-300 transition-colors duration-300"
                    onClick={() => window.open('https://coinmarketcap.com/currencies/bitcoin/', '_blank')}
                  >
                    best rates
                  </span>
                  <span className="text-gray-200">and save money on your </span>
                  <span 
                    className="cursor-pointer hover:text-bitcoin transition-colors duration-300"
                    onClick={() => window.open('https://bitcoin.org/en/', '_blank')}
                  >
                    Bitcoin purchases
                  </span>
                </p>
                <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-3 sm:mt-4">
                  <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-transparent to-bitcoin rounded-full"></div>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-bitcoin rounded-full animate-pulse"></div>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-electric rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-bitcoin rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-l from-transparent to-electric rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced responsive 3x3 Exchange comparison grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 sm:mb-8 md:mb-12 max-w-7xl mx-auto px-2 sm:px-4">
          {priceComparison.exchanges.slice(0, 9).map((exchangeData, index) => {
            const { exchange, currentPrice, isBestPrice } = exchangeData;
            const IconComponent = exchangeIcons[exchange.name as keyof typeof exchangeIcons] || Inbox;
            const change24h = parseFloat(currentPrice.change24h || "0");
            const isPositive = change24h >= 0;

            return (
              <Card 
                key={exchange.id} 
                className={`cyberpunk-card price-card exchange-card card-3d-tilt tilt-container magnetic-zone rounded-xl sm:rounded-2xl transition-all duration-500 group cursor-pointer relative h-[160px] sm:h-[180px] md:h-[190px] lg:h-[200px] xl:h-[210px] w-full cyber-glow scale-in transform-3d ${
                  isBestPrice ? 'border-2 border-green-400/50 shadow-green-400/30' : 'hover:border-cyan-400/50'
                } ${glitchingPrices.has(exchange.name) ? 'neon-glow-border' : ''} ${
                  isPositive ? 'market-bullish' : 'market-bearish'
                }`}
                style={{ animationDelay: `${exchange.id * 0.1}s` }}
                role="gridcell"
                aria-label={`${exchange.name} Bitcoin price: ${parseFloat(currentPrice.price).toLocaleString()} USD`}
                tabIndex={0}
                data-aos="fade-up"
                data-aos-delay={100 + (index * 50)}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = (y - centerY) / 10;
                  const rotateY = (centerX - x) / 10;
                  
                  card.style.setProperty('--tilt-x', `${rotateX}deg`);
                  card.style.setProperty('--tilt-y', `${rotateY}deg`);
                  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                }}
                onClick={() => {
                  let exchangeUrl = '';
                  switch(exchange.name) {
                    case 'coinbase': exchangeUrl = 'https://www.coinbase.com'; break;
                    case 'binance': exchangeUrl = 'https://www.binance.com/en'; break;
                    case 'strike': exchangeUrl = 'https://strike.me/'; break;
                    case 'kraken': exchangeUrl = 'https://www.kraken.com/'; break;
                    case 'robinhood': exchangeUrl = 'https://robinhood.com/'; break;
                    case 'crypto.com': exchangeUrl = 'https://crypto.com/us'; break;
                    case 'gemini': exchangeUrl = 'https://www.gemini.com/'; break;
                    case 'river': exchangeUrl = 'https://river.com/'; break;
                    case 'bitfinex': exchangeUrl = 'https://www.bitfinex.com/'; break;
                    case 'bisq': exchangeUrl = 'https://bisq.network/'; break;
                    default: exchangeUrl = 'https://www.coingecko.com/en/exchanges';
                  }
                  window.open(exchangeUrl, '_blank');
                }}
              >
                {isBestPrice && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/15 via-cyan-400/15 to-green-400/15 animate-pulse rounded-2xl"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 rounded-t-2xl animate-pulse"></div>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 cyberpunk-btn px-3 py-1.5 rounded-full text-xs tech-heading text-black shadow-xl z-20">
                      BEST PRICE
                    </div>
                  </div>
                )}
                
                {/* Hover overlay with additional actions */}
                <div className="absolute inset-0 bg-gradient-to-r from-bitcoin/10 to-electric/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                
                {/* Hidden hover tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 border border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span>Volume 24h: ${currentPrice.volume24h || 'N/A'}</span>
                    <span>•</span>
                    <span>Spread: {currentPrice.spread || 'N/A'}</span>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>

                <CardContent className="p-2 sm:p-3 md:p-4 lg:p-5 relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div 
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0 shadow-lg"
                        style={{ backgroundColor: exchange.color || '#F7931A' }}
                      >
                        <IconComponent className="text-white text-xs sm:text-sm md:text-base lg:text-lg" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="cyber-text text-base sm:text-lg md:text-xl lg:text-2xl font-bold group-hover:text-bitcoin transition-all duration-300 truncate glitch-hover">
                          {exchange.displayName}
                        </h4>

                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-400">Updated</div>
                      <div className="text-xs text-green-400">
                        {formatTimeAgo(new Date(currentPrice.timestamp))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center flex-1 flex flex-col justify-center py-2 sm:py-3 md:py-4">
                    <div className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 ${isBestPrice ? 'text-bitcoin' : ''} ${glitchingPrices.has(exchange.name) ? 'price-glitch' : ''}`} aria-label={`Price: ${parseFloat(currentPrice.price).toLocaleString()} dollars`}>
                      ${parseFloat(currentPrice.price).toLocaleString()}
                    </div>
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400 flex-shrink-0" />
                      )}
                      <span className={`text-xs sm:text-sm ${isPositive ? 'text-green-400' : 'text-red-500'} truncate`}>
                        {isPositive ? '+' : ''}${Math.abs(change24h * parseFloat(currentPrice.price) / 100).toFixed(2)} ({change24h.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  

                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Price difference summary */}
        <Card className="price-card rounded-2xl max-w-4xl mx-auto relative overflow-hidden epic-float">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent shimmer"></div>
          <CardContent className="p-6 relative z-10">
            {/* Orange-Blue-Orange circles decoration */}
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-bitcoin rounded-full"></div>
              <div className="w-2 h-2 bg-bitcoin rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-electric rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-2 h-2 bg-bitcoin rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-electric rounded-full"></div>
            </div>
            <h4 
              className="text-2xl font-bold mb-6 text-center text-white cursor-pointer hover:text-bitcoin hover:scale-105 transition-all duration-300"
              onClick={() => window.open('https://www.investopedia.com/terms/b/bid-askspread.asp', '_blank')}
            >
              Price Spread Analysis
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2 animate-pulse-slow">
                  ${priceComparison.maxSpread.toFixed(2)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-sm text-gray-300">Max Price Difference</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-green-400/20 rounded-full"
                    onClick={() => setShowMaxSpreadModal(true)}
                  >
                    <Info className="h-3 w-3 text-green-400" />
                  </Button>
                </div>
                <div className="text-xs text-gray-400">
                  Between {priceComparison.bestExchange.displayName} & others
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-bitcoin mb-2 animate-pulse-slow">
                  {priceComparison.averageSpread.toFixed(2)}%
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-sm text-gray-300">Average Spread</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-bitcoin/20 rounded-full"
                    onClick={() => setShowAverageSpreadModal(true)}
                  >
                    <Info className="h-3 w-3 text-bitcoin" />
                  </Button>
                </div>
                <div className="text-xs text-gray-400">Across all exchanges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-electric mb-2 animate-pulse-slow">
                  {priceComparison.bestExchange.displayName}
                </div>
                <div className="text-sm text-gray-300">Best Exchange</div>
                <div className="text-xs text-gray-400">Lowest price currently</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Max Price Difference Modal */}
        <Dialog open={showMaxSpreadModal} onOpenChange={setShowMaxSpreadModal}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-green-400 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Max Price Difference
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300">
                The <strong>Max Price Difference</strong> shows the largest gap between Bitcoin prices across all exchanges we monitor.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-400">What it means:</h4>
                  <p className="text-sm text-gray-300">
                    This represents the maximum opportunity for arbitrage - buying Bitcoin at the lowest price and selling at the highest price.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-400">Why it matters:</h4>
                  <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                    <li>Shows market inefficiencies</li>
                    <li>Indicates trading opportunities</li>
                    <li>Reflects liquidity differences between exchanges</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-400">Current calculation:</h4>
                  <p className="text-sm text-gray-300">
                    Highest price minus lowest price across all {priceComparison?.exchanges?.length || 8} exchanges.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Average Spread Modal */}
        <Dialog open={showAverageSpreadModal} onOpenChange={setShowAverageSpreadModal}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-bitcoin flex items-center gap-2">
                <Info className="h-5 w-5" />
                Average Spread
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300">
                The <strong>Average Spread</strong> represents the typical percentage difference between Bitcoin prices across all exchanges.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-bitcoin">What it measures:</h4>
                  <p className="text-sm text-gray-300">
                    The average percentage deviation from the mean Bitcoin price across all monitored exchanges.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-bitcoin">Market indicators:</h4>
                  <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                    <li><strong>Low spread (&lt;0.5%):</strong> Efficient market, high liquidity</li>
                    <li><strong>Medium spread (0.5-2%):</strong> Normal market conditions</li>
                    <li><strong>High spread (&gt;2%):</strong> Market volatility or low liquidity</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-bitcoin">Trading impact:</h4>
                  <p className="text-sm text-gray-300">
                    Lower spreads indicate better market efficiency and more favorable conditions for large trades.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </section>
  );

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
