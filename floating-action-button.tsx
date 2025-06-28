import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Star, TrendingUp, Calculator, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { 
      icon: Bell, 
      label: "Price Alerts", 
      color: "from-yellow-500 to-orange-500", 
      action: () => {
        const element = document.getElementById('price-alerts');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
      }
    },
    { 
      icon: Star, 
      label: "Favorites", 
      color: "from-blue-500 to-purple-500", 
      action: () => {
        const element = document.getElementById('live-prices');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
      }
    },
    { 
      icon: TrendingUp, 
      label: "Analytics", 
      color: "from-green-500 to-emerald-500", 
      action: () => {
        const element = document.getElementById('price-charts');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
      }
    },
    { 
      icon: Calculator, 
      label: "Calculator", 
      color: "from-red-500 to-pink-500", 
      action: () => {
        const element = document.getElementById('bitcoin-calculator');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
      }
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={action.action}
                  className={`h-12 w-12 rounded-full bg-gradient-to-r ${action.color} hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  size="sm"
                >
                  <action.icon className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full bg-gradient-to-r from-bitcoin to-electric hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl ${
          isOpen ? 'rotate-45' : ''
        }`}
        size="sm"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}