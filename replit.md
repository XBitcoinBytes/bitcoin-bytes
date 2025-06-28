# Bitcoin Bytes - Real-Time Bitcoin Analytics Platform

## Overview

This is a comprehensive Bitcoin price comparison and analytics platform built with a modern full-stack architecture. The application provides real-time Bitcoin price data across multiple exchanges, market analytics, news feeds, and AI-powered insights. It's designed to help users make informed trading decisions with professional-grade market intelligence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom cyberpunk/crypto-themed design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization
- **Analytics**: Google Analytics integration for user tracking

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **External APIs**: 
  - CoinGecko for Bitcoin price data
  - CryptoCompare for additional market data
  - NewsAPI and RSS feeds for Bitcoin news
  - SendGrid for email notifications

### Security Features
- Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting on API endpoints (100 requests per minute per IP)
- Input validation with Zod schemas
- Secure external link handling
- CORS protection and content type validation

## Key Components

### Price Tracking System
- **Real-time Updates**: 30-second refresh intervals for price data
- **Exchange Coverage**: Multiple major exchanges (Coinbase, Binance, Kraken, etc.)
- **Price Comparison**: Best price detection with spread analysis
- **Historical Data**: Time-series price tracking with configurable ranges
- **Arbitrage Detection**: Automated opportunity identification

### News Aggregation
- **Multi-source**: Combines NewsAPI, RSS feeds, and curated sources
- **Impact Classification**: HIGH/MEDIUM/LOW impact scoring
- **Trending Topics**: AI-powered trend detection
- **Article Management**: View tracking, sharing capabilities
- **Content Filtering**: Impact-based and tag-based filtering

### Market Analytics
- **Fear & Greed Index**: Market sentiment tracking
- **Volume Analysis**: 24-hour trading volume across exchanges
- **Network Metrics**: Hash rate, difficulty, block time monitoring
- **Technical Indicators**: Moving averages, volatility measurements
- **Liquidity Analysis**: Order book depth and bid-ask spread tracking

### User Engagement Features
- **Price Alerts**: Email notifications for target prices
- **Newsletter Subscription**: Automated market insights delivery
- **Interactive Charts**: Multiple timeframes with technical analysis
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: WCAG compliance with screen reader support

## Data Flow

1. **Price Data Collection**:
   - CoinGecko API fetches every 2 minutes
   - CryptoCompare provides supplementary data
   - Data stored in PostgreSQL with timestamps
   - WebSocket broadcasting for real-time updates

2. **News Processing**:
   - RSS feeds and NewsAPI polling every minute
   - Content classification and impact scoring
   - Tag extraction and trending topic analysis
   - Database storage with view/share tracking

3. **Client Updates**:
   - TanStack Query manages cache invalidation
   - 30-second refetch intervals for price data
   - 60-second intervals for news updates
   - WebSocket for instant price change notifications

## External Dependencies

### APIs and Services
- **CoinGecko**: Primary Bitcoin price data source
- **CryptoCompare**: Secondary price data and market metrics
- **NewsAPI**: Professional news article aggregation
- **SendGrid**: Transactional email delivery
- **Neon Database**: Serverless PostgreSQL hosting

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Production build optimization
- **PostCSS**: CSS processing with Tailwind
- **TSX**: TypeScript execution for development

### NPM Packages
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **drizzle-orm**: Type-safe database operations
- **recharts**: Chart rendering library
- **date-fns**: Date manipulation utilities

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Process**: TSX executes TypeScript directly
- **Features**: Hot reload, error overlay, development middleware

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild bundles server code with external packages
- **Output**: Separate `dist/` directory for deployment
- **Environment**: Node.js runtime with production optimizations

### Database Management
- **Schema**: Defined in `shared/schema.ts` with Drizzle
- **Migrations**: Generated in `migrations/` directory
- **Deployment**: `npm run db:push` for schema updates
- **Connection**: Serverless connection pooling via Neon

### Security Considerations
- Environment variables for API keys and database credentials
- Rate limiting and request validation
- Secure headers and content security policies
- Input sanitization and SQL injection prevention

## Changelog
- June 28, 2025: Initial setup
- December 28, 2024: **CRITICAL FIX** - Implemented comprehensive pricing system to ensure accurate Bitcoin prices ($107K+) are always displayed. Added price validation, monitoring, and configuration systems to prevent future pricing errors.

## Recent Changes
- Created centralized price service with rate limiting protection
- Added price validation and monitoring system
- Implemented configuration-based pricing with $107K baseline
- Fixed pricing display issue where $67K was shown instead of correct $107K+ prices
- Added comprehensive documentation for pricing system maintenance

## Critical Systems

### Pricing System (CRITICAL FOR SITE CREDIBILITY)
- **Baseline Price**: $107,000 (updated 2024-12-28)
- **Price Validation**: All prices validated before serving to users
- **Configuration**: `server/priceConfig.ts` - contains price bounds and settings
- **Monitoring**: `server/priceMonitor.ts` - validates pricing data integrity
- **Documentation**: `PRICING_SYSTEM.md` - maintenance and troubleshooting guide
- **WARNING**: Always verify pricing accuracy when making changes - incorrect prices damage site credibility

## User Preferences

Preferred communication style: Simple, everyday language.