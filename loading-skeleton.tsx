import { Card, CardContent } from '@/components/ui/card';

interface LoadingSkeletonProps {
  type: 'price-card' | 'news-card' | 'chart' | 'stats' | 'hero';
  count?: number;
}

export default function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'price-card':
        return (
          <Card className="cyberpunk-card h-[200px] overflow-hidden">
            <CardContent className="p-6">
              {/* Exchange icon skeleton */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-20 animate-pulse"></div>
              </div>
              
              {/* Price skeleton */}
              <div className="space-y-3">
                <div className="h-8 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-full animate-pulse shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-2/3 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-1/2 animate-pulse"></div>
              </div>
              
              {/* Volume skeleton */}
              <div className="mt-4 pt-3 border-t border-gray-700">
                <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-3/4 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        );

      case 'news-card':
        return (
          <Card className="cyberpunk-card h-[320px] overflow-hidden">
            <CardContent className="p-6">
              {/* News header skeleton */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-24 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-16 animate-pulse"></div>
              </div>
              
              {/* Title skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-full animate-pulse shimmer"></div>
                <div className="h-5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-4/5 animate-pulse shimmer"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-5/6 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-3/4 animate-pulse"></div>
              </div>
              
              {/* Tags skeleton */}
              <div className="flex space-x-2 mb-4">
                <div className="h-6 bg-gradient-to-r from-electric/20 to-electric/10 rounded-full w-16 animate-pulse"></div>
                <div className="h-6 bg-gradient-to-r from-bitcoin/20 to-bitcoin/10 rounded-full w-20 animate-pulse"></div>
              </div>
              
              {/* Footer skeleton */}
              <div className="flex items-center justify-between">
                <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-20 animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded animate-pulse"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'chart':
        return (
          <Card className="cyberpunk-card h-[400px] overflow-hidden">
            <CardContent className="p-6">
              {/* Chart header skeleton */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-32 animate-pulse shimmer"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-12 animate-pulse"></div>
                  <div className="h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-12 animate-pulse"></div>
                  <div className="h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-12 animate-pulse"></div>
                </div>
              </div>
              
              {/* Chart area skeleton */}
              <div className="relative h-64 bg-gradient-to-b from-gray-800/50 to-gray-700/50 rounded-lg overflow-hidden">
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-30">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="absolute w-full h-px bg-gray-600" style={{ top: `${(i + 1) * 20}%` }} />
                  ))}
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute h-full w-px bg-gray-600" style={{ left: `${(i + 1) * 16.66}%` }} />
                  ))}
                </div>
                
                {/* Animated chart line */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-32 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric/30 to-transparent animate-pulse"></div>
                    <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-bitcoin via-electric to-bitcoin opacity-50 animate-shimmer"></div>
                  </div>
                </div>
              </div>
              
              {/* Chart footer skeleton */}
              <div className="flex items-center justify-between mt-4">
                <div className="h-4 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-32 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        );

      case 'stats':
        return (
          <Card className="cyberpunk-card h-[280px] overflow-hidden">
            <CardContent className="p-6">
              {/* Stats header skeleton */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg animate-pulse"></div>
                <div className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-32 animate-pulse shimmer"></div>
              </div>
              
              {/* Main stat skeleton */}
              <div className="text-center mb-6">
                <div className="h-12 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-full animate-pulse shimmer mb-2"></div>
                <div className="h-4 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-2/3 mx-auto animate-pulse"></div>
              </div>
              
              {/* Sub stats skeleton */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="h-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-full animate-pulse mb-1"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-3/4 mx-auto animate-pulse"></div>
                </div>
                <div className="text-center">
                  <div className="h-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-full animate-pulse mb-1"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-3/4 mx-auto animate-pulse"></div>
                </div>
              </div>
              
              {/* Progress bar skeleton */}
              <div className="mt-6">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-electric/50 to-bitcoin/50 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'hero':
        return (
          <div className="text-center space-y-6 py-12">
            {/* Title skeleton */}
            <div className="space-y-4">
              <div className="h-16 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-4/5 mx-auto animate-pulse shimmer"></div>
              <div className="h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded w-3/5 mx-auto animate-pulse"></div>
            </div>
            
            {/* Main price skeleton */}
            <div className="py-8">
              <div className="h-24 bg-gradient-to-r from-bitcoin/30 via-electric/30 to-bitcoin/30 rounded-xl w-2/3 mx-auto animate-pulse shimmer"></div>
            </div>
            
            {/* Action buttons skeleton */}
            <div className="flex justify-center space-x-4">
              <div className="h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg w-32 animate-pulse"></div>
              <div className="h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-32 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-pulse shimmer"></div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="opacity-90 hover:opacity-100 transition-opacity duration-300">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}

// Enhanced shimmer animation in CSS
const shimmerStyles = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = shimmerStyles;
  document.head.appendChild(styleSheet);
}