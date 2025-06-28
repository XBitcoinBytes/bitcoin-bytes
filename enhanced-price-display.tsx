import { useState, useEffect, useRef } from 'react';
import { useBitcoinPrice } from '@/hooks/use-bitcoin-price';
import { Card, CardContent } from '@/components/ui/card';

interface VolatilityData {
  current: number;
  volatility: number; // 0-1 scale
  trend: 'up' | 'down' | 'neutral';
}

export default function EnhancedPriceDisplay() {
  const { data: priceComparison, isLoading } = useBitcoinPrice();
  const [volatilityData, setVolatilityData] = useState<VolatilityData>({
    current: 0,
    volatility: 0,
    trend: 'neutral'
  });
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Track price changes for volatility calculation
  useEffect(() => {
    if (priceComparison?.bestExchange) {
      const bestExchangeData = priceComparison.exchanges.find(e => e.isBestPrice);
      if (bestExchangeData) {
        const currentPrice = parseFloat(bestExchangeData.currentPrice.price);
        
        setPriceHistory(prev => {
          const newHistory = [...prev, currentPrice].slice(-10); // Keep last 10 prices
          
          if (newHistory.length >= 3) {
            // Calculate volatility based on price movement
            const prices = newHistory.slice(-5);
            const changes = prices.slice(1).map((price, i) => 
              Math.abs((price - prices[i]) / prices[i])
            );
            const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
            const volatility = Math.min(avgChange * 100, 1); // Cap at 1
            
            // Determine trend
            const recentChange = (currentPrice - newHistory[newHistory.length - 3]) / newHistory[newHistory.length - 3];
            const trend = recentChange > 0.001 ? 'up' : recentChange < -0.001 ? 'down' : 'neutral';
            
            setVolatilityData({
              current: currentPrice,
              volatility,
              trend
            });
          }
          
          return newHistory;
        });
      }
    }
  }, [priceComparison]);

  // Magnetic hover effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate magnetic pull effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxDistance = 100;
    
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
    if (distance < maxDistance) {
      const pullStrength = (maxDistance - distance) / maxDistance;
      const pullX = (centerX - x) * pullStrength * 0.1;
      const pullY = (centerY - y) * pullStrength * 0.1;
      
      setMousePosition({ x: x + pullX, y: y + pullY });
    } else {
      setMousePosition({ x, y });
    }
  };

  // Dynamic font weight based on volatility
  const getFontWeight = () => {
    const baseWeight = 700;
    const volatilityBonus = volatilityData.volatility * 200; // 0-200 additional weight
    return Math.min(900, baseWeight + volatilityBonus);
  };

  // Dynamic text shadow based on trend and volatility
  const getTextShadow = () => {
    const intensity = volatilityData.volatility * 0.5 + 0.2;
    const color = volatilityData.trend === 'up' ? '0, 255, 100' : 
                  volatilityData.trend === 'down' ? '255, 50, 50' : '255, 255, 255';
    
    return `0 0 ${intensity * 20}px rgba(${color}, ${intensity}), 
            0 0 ${intensity * 40}px rgba(${color}, ${intensity * 0.5}),
            0 0 ${intensity * 80}px rgba(${color}, ${intensity * 0.25})`;
  };

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden group cursor-pointer">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-700 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const bestExchangeData = priceComparison?.exchanges.find(e => e.isBestPrice);
  if (!bestExchangeData) return null;

  const change24h = parseFloat(bestExchangeData.currentPrice.change24h || "0");
  const isPositive = change24h >= 0;

  return (
    <Card 
      ref={cardRef}
      className="relative overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        transform: isHovering ? `translateX(${mousePosition.x * 0.02}px) translateY(${mousePosition.y * 0.02}px)` : 'none'
      }}
    >
      {/* Magnetic field visualization */}
      {isHovering && (
        <div 
          className="absolute pointer-events-none opacity-30 transition-all duration-100"
          style={{
            left: mousePosition.x - 10,
            top: mousePosition.y - 10,
            width: 20,
            height: 20,
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      )}
      
      {/* Dynamic background based on volatility */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse at ${mousePosition.x}px ${mousePosition.y}px, 
                      ${volatilityData.trend === 'up' ? 'rgba(0, 255, 100, 0.3)' : 
                        volatilityData.trend === 'down' ? 'rgba(255, 50, 50, 0.3)' : 
                        'rgba(0, 212, 255, 0.3)'} 0%, 
                      transparent 70%)`,
        }}
      />
      
      <CardContent className="p-4 relative z-10">
        <div className="text-center space-y-2">
          {/* Price with dynamic typography */}
          <div 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl transition-all duration-300"
            style={{
              fontWeight: getFontWeight(),
              textShadow: getTextShadow(),
              letterSpacing: `${volatilityData.volatility * 2}px`,
            }}
          >
            ${Math.round(volatilityData.current).toLocaleString()}
          </div>
          
          {/* Volatility indicator */}
          <div className="flex items-center justify-center space-x-2">
            <div className="text-sm text-gray-400">Volatility</div>
            <div 
              className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden"
              style={{
                boxShadow: `0 0 ${volatilityData.volatility * 10}px rgba(0, 212, 255, ${volatilityData.volatility})`
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 transition-all duration-500"
                style={{ width: `${volatilityData.volatility * 100}%` }}
              />
            </div>
            <div 
              className="text-sm font-bold transition-colors duration-300"
              style={{
                color: volatilityData.volatility > 0.7 ? '#ff3333' : 
                       volatilityData.volatility > 0.4 ? '#ffaa00' : '#00ff66'
              }}
            >
              {(volatilityData.volatility * 100).toFixed(1)}%
            </div>
          </div>
          
          {/* Exchange info */}
          <div className="text-sm text-gray-300">
            Best rate on {bestExchangeData.exchange.name}
          </div>
          
          {/* 24h change with enhanced styling */}
          <div 
            className={`text-lg font-bold transition-all duration-300 ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}
            style={{
              fontWeight: getFontWeight() * 0.8,
              textShadow: isPositive ? 
                '0 0 10px rgba(0, 255, 100, 0.5)' : 
                '0 0 10px rgba(255, 50, 50, 0.5)'
            }}
          >
            {isPositive ? '+' : ''}{change24h.toFixed(2)}%
          </div>
        </div>
      </CardContent>
      
      {/* Ripple effect on hover */}
      {isHovering && (
        <div 
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x - 25,
            top: mousePosition.y - 25,
            width: 50,
            height: 50,
            border: '2px solid rgba(0, 212, 255, 0.6)',
            borderRadius: '50%',
            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
      )}
    </Card>
  );
}