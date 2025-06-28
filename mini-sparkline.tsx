import { useEffect, useRef } from 'react';

interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  trend?: 'up' | 'down' | 'neutral';
  animate?: boolean;
}

export default function MiniSparkline({ 
  data, 
  width = 60, 
  height = 20, 
  color = '#00d4ff', 
  strokeWidth = 1.5,
  trend = 'neutral',
  animate = true 
}: MiniSparklineProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (animate && pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      
      // Set initial state
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;
      
      // Animate
      path.style.transition = 'stroke-dashoffset 1s ease-in-out';
      path.style.strokeDashoffset = '0';
    }
  }, [data, animate]);

  if (!data || data.length < 2) {
    return (
      <svg width={width} height={height} className="opacity-30">
        <line 
          x1={0} 
          y1={height / 2} 
          x2={width} 
          y2={height / 2} 
          stroke={color} 
          strokeWidth={strokeWidth}
          opacity={0.3}
          strokeDasharray="2,2"
        />
      </svg>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Avoid division by zero

  // Create path points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;

  // Determine color based on trend
  const getColor = () => {
    if (trend === 'up') return '#00ff66';
    if (trend === 'down') return '#ff3333';
    return color;
  };

  // Calculate trend direction for gradient
  const isRising = data[data.length - 1] > data[0];
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={getColor()} stopOpacity={0.1} />
          <stop offset="100%" stopColor={getColor()} stopOpacity={isRising ? 0.3 : 0.1} />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id={`glow-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Fill area under the line */}
      <path
        d={`${pathData} L ${width},${height} L 0,${height} Z`}
        fill={`url(#${gradientId})`}
        opacity={0.2}
      />

      {/* Main sparkline */}
      <path
        ref={pathRef}
        d={pathData}
        fill="none"
        stroke={getColor()}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${gradientId})`}
        className="transition-all duration-300"
      />

      {/* Data points */}
      {data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        const isLastPoint = index === data.length - 1;
        
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={isLastPoint ? 1.5 : 0.8}
            fill={getColor()}
            opacity={isLastPoint ? 1 : 0.6}
            className={`transition-all duration-300 ${isLastPoint ? 'animate-pulse' : ''}`}
          />
        );
      })}
    </svg>
  );
}