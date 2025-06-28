# Installation Guide

## Prerequisites

Before setting up the Bitcoin Bytes platform, ensure you have:

- **Node.js 18+** (recommended: use Node.js 20 LTS)
- **PostgreSQL 14+** database
- **Git** for cloning the repository

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bitcoin-bytes.git
cd bitcoin-bytes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/bitcoin_bytes

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# External API Keys (Optional for demo)
COINGECKO_API_KEY=your_coingecko_api_key
CRYPTOCOMPARE_API_KEY=your_cryptocompare_api_key
NEWS_API_KEY=your_news_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
```

### 4. Database Setup

```bash
# Deploy database schema
npm run db:push

# Optional: Open database studio
npm run db:studio
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Production Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
VITE_GA_MEASUREMENT_ID=your_google_analytics_id
```

### Recommended Hosting Platforms

- **Vercel**: Ideal for full-stack applications
- **Railway**: Simple PostgreSQL + Node.js deployment
- **Render**: Free tier available with database
- **Heroku**: Traditional PaaS option

## API Keys Configuration

### CoinGecko API (Primary Price Data)
1. Visit [CoinGecko API](https://www.coingecko.com/en/api)
2. Sign up for free API access
3. Add your API key to `.env` as `COINGECKO_API_KEY`

### CryptoCompare API (Secondary Data)
1. Visit [CryptoCompare API](https://min-api.cryptocompare.com/)
2. Create free account
3. Add API key as `CRYPTOCOMPARE_API_KEY`

### News API (News Feed)
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Register for free API key
3. Add as `NEWS_API_KEY`

### SendGrid (Email Notifications)
1. Visit [SendGrid](https://sendgrid.com/)
2. Create account and verify sender
3. Add API key as `SENDGRID_API_KEY`

## Database Configuration

### PostgreSQL Setup

#### Local Development
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb bitcoin_bytes

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://localhost/bitcoin_bytes
```

#### Docker Setup
```bash
# Run PostgreSQL in Docker
docker run -d \
  --name bitcoin-postgres \
  -e POSTGRES_DB=bitcoin_bytes \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:14

# Update DATABASE_URL
DATABASE_URL=postgresql://user:password@localhost:5432/bitcoin_bytes
```

### Database Schema

The application uses Drizzle ORM with the following main tables:
- `exchanges` - Exchange information
- `bitcoin_prices` - Real-time price data
- `historical_prices` - Historical price data
- `news_articles` - News content and metadata
- `newsletter_subscriptions` - User email subscriptions

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or use different port
PORT=3000 npm run dev
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Test connection
psql postgresql://localhost/bitcoin_bytes
```

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

### Performance Optimization

#### Database Indexing
The schema includes optimized indexes for:
- Price lookups by exchange and timestamp
- News articles by impact and date
- Historical data queries

#### Caching Strategy
- TanStack Query handles client-side caching
- Server-side rate limiting prevents API overuse
- Historical data is cached for 2 minutes

## Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
npm run db:push      # Deploy schema changes
npm run db:studio    # Open Drizzle Studio
npm run db:generate  # Generate migrations

# Utilities
npm run type-check   # TypeScript checking
npm run lint         # Code linting
```

## Architecture Overview

```
bitcoin-bytes/
├── client/          # React frontend (Vite)
├── server/          # Express backend (Node.js)
├── shared/          # Shared TypeScript types
└── docs/           # Documentation
```

### Key Technologies
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript, WebSocket
- **Database**: PostgreSQL with Drizzle ORM
- **Build**: Vite (frontend), esbuild (backend)
- **State**: TanStack Query for server state

## Security Considerations

- All API endpoints include rate limiting
- Input validation using Zod schemas
- Secure headers (CSP, HSTS, X-Frame-Options)
- Environment variables for sensitive data
- CORS protection for API endpoints

## Performance Monitoring

The application includes:
- Real-time price validation
- API response time monitoring
- Database query optimization
- Client-side performance tracking with Google Analytics

## Support

For development issues:
1. Check the troubleshooting section
2. Review console logs for specific errors
3. Ensure all environment variables are set
4. Verify database connectivity

The application is designed to work with or without external API keys, using fallback data when needed for demonstration purposes.