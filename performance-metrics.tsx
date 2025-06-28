import { Activity, Zap, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  description: string;
}

export default function PerformanceMetrics() {
  const metrics: PerformanceMetric[] = [
    {
      label: "API Response Time",
      value: "147ms",
      change: "-23ms",
      isPositive: true,
      icon: <Zap className="w-5 h-5" />,
      description: "Average response time across all endpoints"
    },
    {
      label: "Uptime",
      value: "99.97%",
      change: "+0.02%",
      isPositive: true,
      icon: <Activity className="w-5 h-5" />,
      description: "Service availability over last 30 days"
    },
    {
      label: "Security Score",
      value: "A+",
      change: "Excellent",
      isPositive: true,
      icon: <Shield className="w-5 h-5" />,
      description: "Security headers and encryption status"
    },
    {
      label: "Data Freshness",
      value: "2.3s",
      change: "-0.7s",
      isPositive: true,
      icon: <Clock className="w-5 h-5" />,
      description: "Average age of price data from exchanges"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-blue-400">{metric.icon}</div>
            <div className={cn(
              "text-sm font-medium",
              metric.isPositive ? "text-green-400" : "text-red-400"
            )}>
              {metric.change}
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-2xl font-bold text-white">{metric.value}</div>
            <div className="text-sm font-medium text-gray-300">{metric.label}</div>
          </div>
          
          <div className="text-xs text-gray-400 leading-relaxed">
            {metric.description}
          </div>
        </div>
      ))}
    </div>
  );
}