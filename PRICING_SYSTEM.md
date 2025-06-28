# Bitcoin Pricing System - Critical Documentation

## Overview
This document ensures accurate Bitcoin pricing data is always maintained on the website. Pricing accuracy is CRITICAL for the site's credibility as a trusted information source.

## Current System Architecture

### 1. Centralized Price Service (`server/priceService.ts`)
- **Purpose**: Single source of truth for all Bitcoin pricing data
- **Update Frequency**: Every 2 minutes to respect API rate limits
- **Current Baseline**: $107,000 (updated 2024-12-28)

### 2. Price Configuration (`server/priceConfig.ts`)
- **Min Price**: $85,000 (conservative minimum based on market)
- **Max Price**: $200,000 (generous upper bound)
- **Baseline**: $107,000 (current market-based fallback)
- **Last Updated**: 2024-12-28T17:15:00Z

### 3. Price Monitor (`server/priceMonitor.ts`)
- **Validation**: Checks all prices before serving to users
- **Alerts**: Warns if prices fall outside reasonable bounds
- **History**: Tracks price changes to detect anomalies

## Critical Maintenance Tasks

### When Bitcoin Price Changes Significantly:
1. Update `BASELINE_PRICE` in `priceConfig.ts`
2. Update `LAST_PRICE_UPDATE` timestamp
3. Verify `MIN_BITCOIN_PRICE` is still reasonable
4. Test the application to ensure prices display correctly

### Monthly Review Checklist:
- [ ] Check if baseline price needs updating (current: $107,000)
- [ ] Review price bounds for market changes
- [ ] Verify API keys are working
- [ ] Test fallback pricing system

## How to Fix Pricing Issues

### If Prices Show Incorrect Values:
1. Check `server/storage.ts` → `generateInitialPrices()` function
2. Verify `basePrice` variable matches current market
3. Update `priceConfig.ts` baseline if needed
4. Restart the application

### If API Rate Limiting Occurs:
1. Check retry delays in `coingecko.ts`
2. Verify cache duration (currently 2 minutes)
3. Monitor console for "Got real Bitcoin price" messages

## Warning Signs
- Prices showing below $85,000 → Likely old cached data
- Prices showing above $200,000 → Potential API error
- Console errors about rate limiting → Need longer cache duration
- Price validation warnings → Need manual review

## Emergency Fallback
If all APIs fail, the system uses configuration-based baseline pricing around $107,000 with realistic variations. This ensures the site never shows completely broken pricing data.

## Key Files to Monitor
- `server/priceService.ts` - Main pricing logic
- `server/priceConfig.ts` - Price boundaries and baseline
- `server/storage.ts` - Integration with app data
- `server/routes.ts` - API endpoints serving prices

## Last Updated
2024-12-28 - Fixed pricing issue where $67K was displayed instead of $107K+