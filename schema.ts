import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const exchanges = pgTable("exchanges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  apiUrl: text("api_url"),
  tradingUrl: text("trading_url"),
  isActive: boolean("is_active").default(true),
  color: text("color").default("#F7931A"),
  icon: text("icon"),
});

export const bitcoinPrices = pgTable("bitcoin_prices", {
  id: serial("id").primaryKey(),
  exchangeId: integer("exchange_id").references(() => exchanges.id).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }),
  change24h: decimal("change_24h", { precision: 10, scale: 4 }),
  spread: decimal("spread", { precision: 6, scale: 4 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"),
  url: text("url").notNull(),
  source: text("source").notNull(),
  author: text("author"),
  publishedAt: timestamp("published_at").notNull(),
  impact: text("impact").notNull().default("LOW"), // HIGH, MEDIUM, LOW
  tags: jsonb("tags").$type<string[]>().default([]),
  views: integer("views").default(0),
  shares: integer("shares").default(0),
  isActive: boolean("is_active").default(true),
});

export const historicalPrices = pgTable("historical_prices", {
  id: serial("id").primaryKey(),
  exchangeId: integer("exchange_id").references(() => exchanges.id).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }),
  marketShare: decimal("market_share", { precision: 5, scale: 2 }),
  timestamp: timestamp("timestamp").notNull(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

// Price Alert System
export const priceAlerts = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  targetPrice: decimal("target_price", { precision: 15, scale: 2 }).notNull(),
  alertType: text("alert_type").notNull(), // 'above', 'below', 'change'
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  exchangeId: integer("exchange_id").references(() => exchanges.id),
  isActive: boolean("is_active").default(true),
  triggered: boolean("triggered").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  triggeredAt: timestamp("triggered_at"),
});

// Portfolio Tracking
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const portfolioAssets = pgTable("portfolio_assets", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").references(() => portfolios.id).notNull(),
  symbol: text("symbol").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  averagePrice: decimal("average_price", { precision: 15, scale: 2 }).notNull(),
  exchangeId: integer("exchange_id").references(() => exchanges.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Arbitrage Opportunities
export const arbitrageOpportunities = pgTable("arbitrage_opportunities", {
  id: serial("id").primaryKey(),
  buyExchangeId: integer("buy_exchange_id").references(() => exchanges.id).notNull(),
  sellExchangeId: integer("sell_exchange_id").references(() => exchanges.id).notNull(),
  buyPrice: decimal("buy_price", { precision: 15, scale: 2 }).notNull(),
  sellPrice: decimal("sell_price", { precision: 15, scale: 2 }).notNull(),
  profitPercentage: decimal("profit_percentage", { precision: 5, scale: 2 }).notNull(),
  volume: decimal("volume", { precision: 15, scale: 8 }),
  detectedAt: timestamp("detected_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Market Predictions
export const marketPredictions = pgTable("market_predictions", {
  id: serial("id").primaryKey(),
  predictedPrice: decimal("predicted_price", { precision: 15, scale: 2 }).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  timeframe: text("timeframe").notNull(),
  modelUsed: text("model_used"),
  factors: jsonb("factors"),
  createdAt: timestamp("created_at").defaultNow(),
  actualPrice: decimal("actual_price", { precision: 15, scale: 2 }),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
});

// Order Book Data
export const orderBookData = pgTable("order_book_data", {
  id: serial("id").primaryKey(),
  exchangeId: integer("exchange_id").references(() => exchanges.id).notNull(),
  bids: jsonb("bids").notNull(),
  asks: jsonb("asks").notNull(),
  spread: decimal("spread", { precision: 15, scale: 2 }),
  midPrice: decimal("mid_price", { precision: 15, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow(),
});

// User Activity Logs
export const userLogs = pgTable("user_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  action: text("action").notNull(),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertExchangeSchema = createInsertSchema(exchanges).omit({
  id: true,
});

export const insertBitcoinPriceSchema = createInsertSchema(bitcoinPrices).omit({
  id: true,
  timestamp: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  views: true,
  shares: true,
  isActive: true,
});

export const insertHistoricalPriceSchema = createInsertSchema(historicalPrices).omit({
  id: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  subscribedAt: true,
  isActive: true,
});

export type Exchange = typeof exchanges.$inferSelect;
export type InsertExchange = z.infer<typeof insertExchangeSchema>;

export type BitcoinPrice = typeof bitcoinPrices.$inferSelect;
export type InsertBitcoinPrice = z.infer<typeof insertBitcoinPriceSchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

export type HistoricalPrice = typeof historicalPrices.$inferSelect;
export type InsertHistoricalPrice = z.infer<typeof insertHistoricalPriceSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

export const insertPriceAlertSchema = createInsertSchema(priceAlerts).omit({
  id: true,
  triggered: true,
  createdAt: true,
  triggeredAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertArbitrageOpportunitySchema = createInsertSchema(arbitrageOpportunities).omit({
  id: true,
  detectedAt: true,
});

export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;

export type PortfolioAsset = typeof portfolioAssets.$inferSelect;

export type ArbitrageOpportunity = typeof arbitrageOpportunities.$inferSelect;
export type InsertArbitrageOpportunity = z.infer<typeof insertArbitrageOpportunitySchema>;

export type MarketPrediction = typeof marketPredictions.$inferSelect;

export type OrderBookDataType = typeof orderBookData.$inferSelect;

export type UserLog = typeof userLogs.$inferSelect;

// API Response Types
export type ExchangePriceData = {
  exchange: Exchange;
  currentPrice: BitcoinPrice;
  isBestPrice?: boolean;
};

export type PriceComparison = {
  exchanges: ExchangePriceData[];
  bestExchange: Exchange;
  maxSpread: number;
  averageSpread: number;
  lastUpdated: Date;
};

export type HistoricalComparison = {
  timestamp: Date;
  exchanges: Array<{
    exchange: Exchange;
    price: HistoricalPrice;
    vsNow: number;
  }>;
};

export type MovingAverageData = {
  ma7: number;
  ma30: number;
  ma50: number;
  ma200: number;
  currentPrice: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: 'strong' | 'moderate' | 'weak';
  prediction: {
    shortTerm: 'up' | 'down' | 'sideways';
    confidence: number;
    targetPrice: number;
  };
};

export type OrderBookEntry = {
  price: number;
  amount: number;
  total: number;
};

export type LiquidityDepthData = {
  exchange: Exchange;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  midPrice: number;
  bidVolume: number;
  askVolume: number;
  depth: {
    support: number;
    resistance: number;
    imbalance: number;
  };
};
