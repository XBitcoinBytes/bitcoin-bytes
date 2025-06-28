import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, TrendingUp, TrendingDown, Target, Plus, X } from "lucide-react";
import { useCurrentPrices } from "@/hooks/use-bitcoin-price";

interface PriceAlert {
  id: number;
  targetPrice: number;
  type: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
}

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    { id: 1, targetPrice: 100000, type: 'above', isActive: true, createdAt: new Date() },
    { id: 2, targetPrice: 85000, type: 'below', isActive: true, createdAt: new Date() },
  ]);
  const [newAlert, setNewAlert] = useState({ price: '', type: 'above' as 'above' | 'below' });
  const [showForm, setShowForm] = useState(false);
  
  const currentPrice = 95000; // Using static price for demo

  const addAlert = () => {
    const price = parseFloat(newAlert.price);
    if (price && price > 0) {
      const alert: PriceAlert = {
        id: Date.now(),
        targetPrice: price,
        type: newAlert.type,
        isActive: true,
        createdAt: new Date()
      };
      setAlerts([...alerts, alert]);
      setNewAlert({ price: '', type: 'above' });
      setShowForm(false);
    }
  };

  const removeAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const getAlertStatus = (alert: PriceAlert) => {
    if (!alert.isActive) return 'inactive';
    
    if (alert.type === 'above' && currentPrice >= alert.targetPrice) {
      return 'triggered';
    }
    if (alert.type === 'below' && currentPrice <= alert.targetPrice) {
      return 'triggered';
    }
    return 'active';
  };

  const getDistanceToTarget = (targetPrice: number) => {
    const diff = Math.abs(targetPrice - currentPrice);
    const percentage = ((diff / currentPrice) * 100).toFixed(1);
    return { diff, percentage };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-bitcoin to-electric rounded-lg flex items-center justify-center">
            <Bell className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Price Alerts</h3>
            <p className="text-gray-400 text-xs">Set target notifications</p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="bg-bitcoin hover:bg-bitcoin/80 text-white px-3 py-1 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      {showForm && (
        <div className="bg-white/5 rounded-lg p-4 border border-bitcoin/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium text-sm">New Alert</span>
            <button 
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input
              type="number"
              placeholder="Price target"
              value={newAlert.price}
              onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
              className="bg-dark-bg border-bitcoin/30 text-white text-sm h-8"
            />
            <select
              value={newAlert.type}
              onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as 'above' | 'below' })}
              className="w-full p-1 bg-dark-bg border border-bitcoin/30 rounded-md text-white text-sm h-8"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>
          <Button
            onClick={addAlert}
            size="sm"
            className="w-full bg-bitcoin hover:bg-bitcoin/80 text-white h-8 text-xs"
          >
            Create Alert
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((alert) => {
          const status = getAlertStatus(alert);
          const { diff, percentage } = getDistanceToTarget(alert.targetPrice);
          
          return (
            <div key={alert.id} className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-bitcoin/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {alert.type === 'above' ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">
                      ${alert.targetPrice.toLocaleString()} {alert.type}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {status === 'triggered' ? 'Target reached!' : 
                       `${percentage}% away`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={status === 'triggered' ? 'default' : 'outline'}
                    className={
                      status === 'triggered' ? 'bg-green-500 text-white text-xs px-2 py-0' :
                      status === 'active' ? 'bg-bitcoin text-white text-xs px-2 py-0' :
                      'border-gray-500 text-gray-400 text-xs px-2 py-0'
                    }
                  >
                    {status === 'triggered' ? 'Hit' : status === 'active' ? 'Active' : 'Paused'}
                  </Badge>
                  
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded border border-bitcoin/30 hover:border-bitcoin/50"
                  >
                    {alert.isActive ? 'Pause' : 'Resume'}
                  </button>
                  
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {alerts.length === 0 && (
          <div className="bg-white/5 rounded-lg p-6 text-center border border-white/10">
            <Bell className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No alerts set</p>
            <p className="text-gray-500 text-xs">Click "Add" to create your first alert</p>
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-bitcoin/10 to-electric/10 border border-bitcoin/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Bell className="h-4 w-4 text-bitcoin mt-0.5" />
          <div>
            <h4 className="text-white font-medium mb-1 text-sm">How Alerts Work</h4>
            <p className="text-gray-300 text-xs">
              Set targets and get notified when Bitcoin hits your price levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}