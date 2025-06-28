import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Waves, 
  Shield, 
  BookOpen, 
  Home,
  ChevronUp
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: "hero", label: "Home", icon: <Home className="h-4 w-4" />, href: "#hero" },
  { id: "live-prices", label: "Prices", icon: <TrendingUp className="h-4 w-4" />, href: "#live-prices" },
  { id: "market-stats", label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, href: "#market-stats" },
  { id: "charts", label: "Charts", icon: <Activity className="h-4 w-4" />, href: "#charts" },
  { id: "news", label: "News", icon: <BookOpen className="h-4 w-4" />, href: "#news" },
];

export default function FloatingNavDock() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      
      setScrollProgress(scrollPercent);
      setIsVisible(scrollTop > 300);

      // Determine active section
      const sections = navItems.map(item => item.id);
      let current = "hero";
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = sectionId;
            break;
          }
        }
      }
      
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth",
        block: "start" 
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Navigation Dock */}
      <div 
        className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-500 ${
          isExpanded ? 'translate-x-0' : 'translate-x-2'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Progress Indicator */}
        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="w-full bg-gradient-to-b from-bitcoin via-electric to-bitcoin transition-all duration-300"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Navigation Items */}
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.href)}
                className={`
                  group relative h-12 transition-all duration-300 hover:scale-110 flex items-center
                  ${activeSection === item.id 
                    ? 'bg-bitcoin/20 text-bitcoin shadow-lg shadow-bitcoin/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }
                  ${isExpanded ? 'w-auto px-4 justify-start' : 'w-12 px-0 justify-center'}
                `}
              >
                {isExpanded ? (
                  <div className="flex items-center space-x-3">
                    <div className={`
                      flex-shrink-0 transition-transform duration-300
                      ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}
                    `}>
                      {item.icon}
                    </div>
                    
                    <span className="whitespace-nowrap font-medium transition-all duration-300">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <div className={`
                    transition-transform duration-300
                    ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </div>
                )}

                {/* Active indicator dot */}
                {activeSection === item.id && (
                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-bitcoin rounded-full shadow-lg shadow-bitcoin/50 animate-pulse" />
                )}

                {/* Hover tooltip when collapsed */}
                {!isExpanded && (
                  <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
                    {item.label}
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-gray-900" />
                  </div>
                )}
              </Button>
            ))}
          </div>

          {/* Scroll to top button */}
          <div className="mt-2 pt-2 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className={`
                group h-12 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 flex items-center
                ${isExpanded ? 'w-auto px-4 justify-start' : 'w-12 px-0 justify-center'}
              `}
            >
              {isExpanded ? (
                <div className="flex items-center space-x-3">
                  <ChevronUp className="h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span className="whitespace-nowrap font-medium transition-all duration-300">
                    Top
                  </span>
                </div>
              ) : (
                <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              )}

              {!isExpanded && (
                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
                  Back to Top
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-gray-900" />
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Expand/Collapse indicator */}
        <div className={`
          absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-l-lg flex items-center justify-center transition-all duration-300
          ${isExpanded ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
        `}>
          <div className="w-1 h-3 bg-gradient-to-b from-bitcoin to-electric rounded-full" />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
          <div className="flex justify-around">
            {navItems.slice(0, 5).map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.href)}
                className={`
                  flex-1 flex flex-col items-center space-y-1 py-3 transition-all duration-300
                  ${activeSection === item.id 
                    ? 'text-bitcoin' 
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                <div className={`
                  transition-transform duration-300
                  ${activeSection === item.id ? 'scale-110' : ''}
                `}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                
                {activeSection === item.id && (
                  <div className="w-1 h-1 bg-bitcoin rounded-full animate-pulse" />
                )}
              </Button>
            ))}
          </div>
          
          {/* Progress bar for mobile */}
          <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-bitcoin via-electric to-bitcoin transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}