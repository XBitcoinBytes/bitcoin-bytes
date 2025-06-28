import { priceService } from './priceService.js';

interface PriceAlert {
  threshold: number;
  message: string;
  action: 'warn' | 'fallback' | 'alert';
}

class PriceMonitor {
  private alerts: PriceAlert[] = [
    { threshold: 50000, message: 'Bitcoin price below $50k - potential data error', action: 'alert' },
    { threshold: 80000, message: 'Bitcoin price below $80k - verify data source', action: 'warn' },
    { threshold: 150000, message: 'Bitcoin price above $150k - verify data source', action: 'warn' }
  ];

  private lastValidPrice: number | null = null;
  private priceHistory: Array<{ price: number; timestamp: Date }> = [];
  private maxHistorySize = 10;

  async validatePricing(): Promise<boolean> {
    try {
      const prices = await priceService.getCurrentPrices();
      
      if (prices.size === 0) {
        console.error('CRITICAL: No pricing data available');
        return false;
      }

      // Get a representative price (first exchange)
      const firstPrice = Array.from(prices.values())[0];
      const currentPrice = firstPrice?.price;

      if (!currentPrice || currentPrice <= 0) {
        console.error('CRITICAL: Invalid price data detected');
        return false;
      }

      // Check against alerts
      for (const alert of this.alerts) {
        if (currentPrice < alert.threshold && alert.action === 'alert') {
          console.error(`PRICE ALERT: ${alert.message} - Current: $${currentPrice.toLocaleString()}`);
          return false;
        }
        if (currentPrice > alert.threshold && alert.threshold > 100000) {
          console.warn(`PRICE WARNING: ${alert.message} - Current: $${currentPrice.toLocaleString()}`);
        }
      }

      // Update price history
      this.priceHistory.push({ price: currentPrice, timestamp: new Date() });
      if (this.priceHistory.length > this.maxHistorySize) {
        this.priceHistory.shift();
      }

      // Check for sudden price changes (>20% in short time)
      if (this.lastValidPrice && Math.abs((currentPrice - this.lastValidPrice) / this.lastValidPrice) > 0.2) {
        console.warn(`PRICE WARNING: Large price change detected: $${this.lastValidPrice.toLocaleString()} -> $${currentPrice.toLocaleString()}`);
      }

      this.lastValidPrice = currentPrice;
      console.log(`Price validation successful: $${currentPrice.toLocaleString()}`);
      return true;

    } catch (error) {
      console.error('Price validation failed:', error);
      return false;
    }
  }

  getPriceHistory(): Array<{ price: number; timestamp: Date }> {
    return [...this.priceHistory];
  }

  getLastValidPrice(): number | null {
    return this.lastValidPrice;
  }

  // Check if current prices are within reasonable bounds
  isPriceReasonable(price: number): boolean {
    const currentYear = new Date().getFullYear();
    
    // Bitcoin price bounds based on historical context
    const minReasonablePrice = 20000;  // Very conservative minimum
    const maxReasonablePrice = 500000; // Very generous maximum for future growth
    
    return price >= minReasonablePrice && price <= maxReasonablePrice;
  }
}

export const priceMonitor = new PriceMonitor();