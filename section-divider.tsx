import { useEffect, useState } from "react";

interface SectionDividerProps {
  variant?: "bitcoin" | "lightning" | "blocks" | "network";
  color?: "bitcoin" | "electric" | "cyan" | "green";
  size?: "sm" | "md" | "lg";
}

export default function SectionDivider({ 
  variant = "bitcoin", 
  color = "bitcoin",
  size = "md" 
}: SectionDividerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const colorClasses = {
    bitcoin: "text-bitcoin border-bitcoin/30 bg-bitcoin/5",
    electric: "text-electric border-electric/30 bg-electric/5",
    cyan: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5",
    green: "text-green-400 border-green-400/30 bg-green-400/5"
  };

  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16"
  };

  const renderBitcoinPattern = () => (
    <div className="flex items-center justify-center space-x-4">
      {/* Bitcoin symbol with rotating rings */}
      <div className="relative">
        <div className={`w-16 h-16 rounded-full border-2 ${colorClasses[color]} animate-spin-slow opacity-50`}></div>
        <div className={`absolute inset-2 w-12 h-12 rounded-full border-2 ${colorClasses[color]} animate-reverse-spin opacity-30`}></div>
        <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${colorClasses[color].split(' ')[0]} drop-shadow-lg`}>
          ₿
        </div>
      </div>
      
      {/* Geometric pattern lines */}
      <div className="flex flex-col space-y-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className={`h-0.5 ${colorClasses[color]} animate-pulse rounded-full transition-all duration-1000`}
            style={{
              width: `${20 + i * 8}px`,
              animationDelay: `${i * 0.2}s`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-20px)'
            }}
          />
        ))}
      </div>
      
      {/* Bitcoin symbol with rotating rings (mirrored) */}
      <div className="relative">
        <div className={`w-16 h-16 rounded-full border-2 ${colorClasses[color]} animate-reverse-spin opacity-50`}></div>
        <div className={`absolute inset-2 w-12 h-12 rounded-full border-2 ${colorClasses[color]} animate-spin-slow opacity-30`}></div>
        <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${colorClasses[color].split(' ')[0]} drop-shadow-lg`}>
          ₿
        </div>
      </div>
    </div>
  );

  const renderLightningPattern = () => (
    <div className="flex items-center justify-center space-x-6">
      {/* Lightning bolts */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="relative">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            className={`${colorClasses[color].split(' ')[0]} animate-pulse`}
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <path 
              fill="currentColor" 
              d="M7 2v11h3v9l7-12h-4l3-8z"
            />
          </svg>
          <div className={`absolute inset-0 ${colorClasses[color]} rounded-full animate-ping opacity-20`}></div>
        </div>
      ))}
      
      {/* Connecting lines */}
      <div className="flex items-center space-x-2">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className={`w-1 h-1 ${colorClasses[color]} rounded-full animate-pulse`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );

  const renderBlocksPattern = () => (
    <div className="flex items-center justify-center space-x-2">
      {/* Block chain visualization */}
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-1">
          <div 
            className={`w-8 h-8 ${colorClasses[color]} rounded border-2 animate-pulse transition-all duration-1000`}
            style={{ 
              animationDelay: `${i * 0.2}s`,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-xs font-bold">
              {i + 1}
            </div>
          </div>
          {i < 6 && (
            <div 
              className={`w-4 h-0.5 ${colorClasses[color]} animate-pulse`}
              style={{ animationDelay: `${i * 0.2 + 0.1}s` }}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderNetworkPattern = () => (
    <div className="flex items-center justify-center">
      <div className="relative w-40 h-16">
        {/* Network nodes */}
        {[
          { x: 20, y: 8, size: 'w-3 h-3' },
          { x: 80, y: 4, size: 'w-4 h-4' },
          { x: 120, y: 12, size: 'w-2 h-2' },
          { x: 60, y: 16, size: 'w-3 h-3' },
          { x: 100, y: 8, size: 'w-2 h-2' },
        ].map((node, i) => (
          <div
            key={i}
            className={`absolute ${node.size} ${colorClasses[color]} rounded-full animate-pulse`}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
        
        {/* Network connections */}
        <svg className="absolute inset-0 w-full h-full">
          {[
            { x1: 32, y1: 20, x2: 92, y2: 16 },
            { x1: 92, y1: 16, x2: 132, y2: 24 },
            { x1: 32, y1: 20, x2: 72, y2: 28 },
            { x1: 72, y1: 28, x2: 112, y2: 20 },
          ].map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth="1"
              className={`${colorClasses[color].split(' ')[0]} opacity-50 animate-pulse`}
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </svg>
      </div>
    </div>
  );

  const renderPattern = () => {
    switch (variant) {
      case "lightning":
        return renderLightningPattern();
      case "blocks":
        return renderBlocksPattern();
      case "network":
        return renderNetworkPattern();
      default:
        return renderBitcoinPattern();
    }
  };

  return (
    <div className={`w-full flex items-center justify-center ${sizeClasses[size]}`}>
      <div className="w-full max-w-md">
        {renderPattern()}
      </div>
    </div>
  );
}