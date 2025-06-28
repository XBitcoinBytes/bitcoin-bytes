import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useBitcoinPrice } from "@/hooks/use-bitcoin-price";
import { trackEvent } from "@/lib/analytics";
import LoadingSkeleton from "./loading-skeleton";
import { ChartLine, History } from "lucide-react";

export default function HeroSection() {
  const { data: priceComparison, isLoading } = useBitcoinPrice();
  const [currentPrice, setCurrentPrice] = useState(67420);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [volatility, setVolatility] = useState(0);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  // Update current price and calculate volatility
  useEffect(() => {
    if (priceComparison?.bestExchange && priceComparison.exchanges.length > 0) {
      const bestExchangeData = priceComparison.exchanges.find(e => e.isBestPrice);
      if (bestExchangeData) {
        const newPrice = parseFloat(bestExchangeData.currentPrice.price);
        
        setPriceHistory(prev => {
          const newHistory = [...prev, newPrice].slice(-10);
          
          if (newHistory.length >= 3) {
            const prices = newHistory.slice(-5);
            const changes = prices.slice(1).map((price, i) => 
              Math.abs((price - prices[i]) / prices[i])
            );
            const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
            setVolatility(Math.min(avgChange * 100, 1));
          }
          
          return newHistory;
        });
        
        if (previousPrice !== null && newPrice !== previousPrice) {
          setPreviousPrice(newPrice);
        } else if (previousPrice === null) {
          setPreviousPrice(newPrice);
        }
        
        setCurrentPrice(newPrice);
      }
    }
  }, [priceComparison, previousPrice]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      trackEvent('navigation', 'scroll_to_section', sectionId);
    }
  };

  // Dynamic font weight and styling based on volatility
  const getDynamicStyles = () => {
    const baseWeight = 700;
    const volatilityBonus = volatility * 200;
    const fontWeight = Math.min(900, baseWeight + volatilityBonus);
    
    const trend = previousPrice && currentPrice > previousPrice ? 'up' : 
                 previousPrice && currentPrice < previousPrice ? 'down' : 'neutral';
    
    return {
      fontWeight,
      letterSpacing: `${volatility * 2}px`,
      textShadow: volatility > 0.3 ? 
        `0 0 ${volatility * 20}px currentColor, 0 0 ${volatility * 40}px currentColor` : 
        '0 0 5px currentColor',
      className: volatility > 0.5 ? 'volatility-text' : '',
      marketClass: trend === 'up' ? 'market-bullish' : trend === 'down' ? 'market-bearish' : ''
    };
  };

  if (isLoading) {
    return (
      <section id="hero" className="relative overflow-hidden py-2 sm:py-3 md:py-4 lg:py-5">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10">
          <LoadingSkeleton type="hero" />
        </div>
      </section>
    );
  }

  const dynamicStyles = getDynamicStyles();

  return (
    <section id="hero" className="relative overflow-hidden py-2 sm:py-3 md:py-4 lg:py-5">
      {/* Enhanced responsive animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-bitcoin/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-32 sm:w-48 h-32 sm:h-48 bg-electric/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-gradient-to-r from-bitcoin/5 to-electric/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="tech-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl epic-gradient bg-clip-text text-transparent mb-4 sm:mb-6 cursor-pointer hover:scale-105 transition-all duration-300 leading-tight">
              Bitcoin Bytes
            </h1>
            <div className="cyber-text text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-4 tracking-wide">
              Real-Time Bitcoin Analytics & Market Intelligence
            </div>

          </div>
          <div className="relative">
            <h2 
              id="hero-heading"
              className={`cyber-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] mb-0 cursor-pointer transition-all duration-500 leading-none metallic-shimmer font-black tracking-tight magnetic-zone ${dynamicStyles.className} ${dynamicStyles.marketClass}`}
              onClick={() => {
                trackEvent('hero_price_click', 'engagement', 'coinmarketcap_visit');
                window.open('https://coinmarketcap.com/currencies/bitcoin/', '_blank');
              }}
              style={{ 
                fontWeight: dynamicStyles.fontWeight,
                letterSpacing: dynamicStyles.letterSpacing,
                textShadow: dynamicStyles.textShadow
              }}
              role="button"
              tabIndex={0}
              aria-label={`Current Bitcoin price: ${Math.round(currentPrice).toLocaleString()} dollars. Volatility: ${(volatility * 100).toFixed(1)}%. Click to view on CoinMarketCap`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  trackEvent('hero_price_click', 'engagement', 'coinmarketcap_visit');
                  window.open('https://coinmarketcap.com/currencies/bitcoin/', '_blank');
                }
              }}
            >
              ${Math.round(currentPrice).toLocaleString()}
            </h2>
            <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-green-500/20 to-transparent blur-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
