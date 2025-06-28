// Centralized pricing configuration to prevent incorrect pricing issues
export const PRICE_CONFIG = {
  // Current market-based minimum Bitcoin price (updated December 2024)
  MIN_BITCOIN_PRICE: 85000,  // Conservative minimum based on recent market
  
  // Maximum reasonable Bitcoin price (generous upper bound)
  MAX_BITCOIN_PRICE: 200000, 
  
  // Current realistic baseline for fallback pricing
  BASELINE_PRICE: 107000,  // Should be updated regularly based on market
  
  // Cache and update intervals
  CACHE_DURATION: 120000,  // 2 minutes in milliseconds
  UPDATE_INTERVAL: 120000, // 2 minutes in milliseconds
  
  // API retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY_BASE: 1000,  // 1 second base delay
  
  // Validation thresholds
  MAX_PRICE_CHANGE_PERCENT: 0.15, // 15% max change between updates
  EXCHANGE_VARIATION_PERCENT: 0.02, // 2% max variation between exchanges
  
  // Update this timestamp when baseline price is changed
  LAST_PRICE_UPDATE: '2024-12-28T17:15:00Z',
  
  // Data source priorities (in order of preference)
  DATA_SOURCES: ['coingecko', 'coinbase-api', 'fallback'] as const,
  
  // Alert settings
  PRICE_ALERTS: {
    CRITICAL_LOW: 50000,   // Alert if below $50k
    WARNING_LOW: 80000,    // Warn if below $80k
    WARNING_HIGH: 150000,  // Warn if above $150k
    CRITICAL_HIGH: 200000  // Alert if above $200k
  }
};

// Type-safe configuration access
export type PriceDataSource = typeof PRICE_CONFIG.DATA_SOURCES[number];

// Helper function to check if pricing needs manual review
export function needsPriceReview(): boolean {
  const lastUpdate = new Date(PRICE_CONFIG.LAST_PRICE_UPDATE);
  const now = new Date();
  const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Recommend review if baseline hasn't been updated in 7 days
  return daysSinceUpdate > 7;
}

// Helper function to validate if a price is within reasonable bounds
export function isPriceValid(price: number): boolean {
  return price >= PRICE_CONFIG.MIN_BITCOIN_PRICE && 
         price <= PRICE_CONFIG.MAX_BITCOIN_PRICE;
}

// Helper function to get current baseline with variation
export function getBaselinePrice(): number {
  // Add small random variation to baseline (±0.5%)
  const variation = (Math.random() - 0.5) * 0.01;
  return PRICE_CONFIG.BASELINE_PRICE * (1 + variation);
}