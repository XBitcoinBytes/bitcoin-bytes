import { useState } from "react";
import { Bitcoin, Twitter, MessageCircle, Hash } from "lucide-react";
import NewsletterSignup from "@/components/newsletter-signup";

export default function Footer() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="newsletter" className="relative overflow-hidden bg-gradient-to-b from-surface to-dark-bg border-t border-bitcoin/30 section-spacing fade-in-up">
      <div className="absolute inset-0 epic-gradient opacity-10 blur-2xl"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/2 to-transparent shimmer"></div>
      
      {/* Color bar */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-r from-bitcoin/60 via-electric/60 to-bitcoin/60 animate-pulse">
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-bitcoin to-electric rounded-lg flex items-center justify-center epic-float">
                <Bitcoin className="text-white text-xl animate-pulse-slow" />
              </div>
              <h5 className="text-2xl font-bold epic-gradient bg-clip-text text-transparent animate-pulse-slow">
                XBitcoinBytes
              </h5>
            </div>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6 px-2 sm:px-0">
              <span className="text-bitcoin animate-pulse-slow">Your trusted source</span>
              <span className="text-gray-200 mx-1">for</span>
              <span className="text-electric animate-pulse-slow">real-time Bitcoin price comparison</span>
              <span className="text-gray-200 mx-1">across major exchanges.</span>
              <br />
              <span className="text-gray-200">Make</span>
              <span className="text-bitcoin mx-1 font-semibold">informed trading decisions</span>
              <span className="text-gray-200">with our comprehensive analysis tools.</span>
            </p>
          </div>

          {/* Connect Section */}
          <div className="text-center md:text-left">
            <h6 className="font-semibold mb-6 text-bitcoin animate-pulse-slow text-lg">Stay Connected</h6>
            <div className="flex justify-center md:justify-start space-x-4 mb-6">
              <a 
                href="https://x.com/xbitcoinbytes" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-r from-bitcoin/20 to-electric/20 rounded-lg flex items-center justify-center hover:from-bitcoin hover:to-electric transition-all epic-float"
              >
                <Twitter className="h-5 w-5 text-white animate-pulse-slow" />
              </a>
              <a 
                href="https://x.com/xbitcoinbytes" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-r from-electric/20 to-bitcoin/20 rounded-lg flex items-center justify-center hover:from-electric hover:to-bitcoin transition-all epic-float"
              >
                <MessageCircle className="h-5 w-5 text-white animate-pulse-slow" />
              </a>
              <a 
                href="https://x.com/xbitcoinbytes" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-r from-bitcoin/20 to-electric/20 rounded-lg flex items-center justify-center hover:from-bitcoin hover:to-electric transition-all epic-float"
              >
                <Hash className="h-5 w-5 text-white animate-pulse-slow" />
              </a>
            </div>
            <div className="bg-gradient-to-r from-bitcoin/10 to-electric/10 rounded-lg p-4 border border-bitcoin/20">
              <p className="text-sm text-gray-200 leading-relaxed">
                <button 
                  onClick={() => setIsNewsletterOpen(true)}
                  className="text-electric animate-pulse-slow hover:text-bitcoin transition-colors duration-300 cursor-pointer underline font-semibold"
                >
                  Subscribe to our newsletter
                </button>
                <span className="text-gray-200 block mt-2">Get daily Bitcoin insights and market updates delivered to your inbox.</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-bitcoin/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-200">
            <span className="text-gray-200">© 2024 All rights reserved.</span>
          </p>
          <div className="flex space-x-6 text-sm mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-electric transition-colors hover:animate-pulse-slow">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-bitcoin transition-colors hover:animate-pulse-slow">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-electric transition-colors hover:animate-pulse-slow">Support</a>
          </div>
        </div>
      </div>
      
      <NewsletterSignup 
        isOpen={isNewsletterOpen} 
        onClose={() => setIsNewsletterOpen(false)} 
      />
    </footer>
  );
}
