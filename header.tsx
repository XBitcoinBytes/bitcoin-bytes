import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Bitcoin, List, ChevronDown } from "lucide-react";
import { openSecureLink } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const absoluteElementTop = rect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2);
        
        window.scrollTo({
          top: middle,
          behavior: 'smooth'
        });
      }
    }, 300);
  };

  const tableOfContents = [
    { id: "hero", label: "🏠 Home", icon: "🏠" },
    { id: "live-prices", label: "💰 Live Prices", icon: "💰" },
    { id: "market-stats", label: "📊 Market Stats", icon: "📊" },
    { id: "price-charts", label: "📈 Price Charts", icon: "📈" },
    { id: "news-feed", label: "📰 News Feed", icon: "📰" },
    { id: "newsletter", label: "📧 Newsletter", icon: "📧" }
  ];

  return (
    <header className="relative z-50 bg-surface/90 backdrop-blur-md border-b border-white/10 sticky top-0">
      <nav className="container mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-bitcoin to-electric rounded-lg flex items-center justify-center animate-glow hover:scale-110 transition-transform duration-300 cursor-pointer group relative">
              <Bitcoin className="text-white text-xl group-hover:rotate-12 transition-transform duration-300" />
              {/* Hover tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 border border-gray-700">
                Bitcoin Price Tracker
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>

          {/* Centered Brand */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div 
              className="text-xl font-bold tracking-wider relative cursor-pointer group hover:scale-105 transition-transform duration-300"
              onClick={() => openSecureLink('https://x.com/xbitcoinbytes')}
            >
              <span className="relative z-10 animate-color-shift group-hover:text-bitcoin transition-colors duration-300" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', letterSpacing: '0.1em'}}>
                BitcoinBytes
              </span>
              {/* Hover tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 border border-gray-700">
                Follow @xbitcoinbytes
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>

          {/* Desktop Table of Contents Dropdown */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-bitcoin/10 hover:text-bitcoin transition-all duration-300">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 bg-gray-900 border-gray-700 text-white"
                sideOffset={5}
              >
                {tableOfContents.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center space-x-3 p-3 hover:bg-bitcoin/10 hover:text-bitcoin cursor-pointer transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label.replace(/^[^\s]+ /, '')}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-bitcoin/10 hover:text-bitcoin transition-all duration-300">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-gray-700 text-white w-[85vw] sm:w-80 p-6">
              <div className="flex flex-col space-y-2 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-bitcoin">Navigation</h3>
                </div>
                <div className="space-y-2">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center space-x-3 w-full text-left text-base hover:text-bitcoin hover:bg-bitcoin/10 transition-all duration-300 p-4 rounded-lg border border-transparent hover:border-bitcoin/20"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label.replace(/^[^\s]+ /, '')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
