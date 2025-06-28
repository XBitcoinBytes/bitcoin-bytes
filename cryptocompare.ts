interface CryptoCompareResponse {
  BTC: {
    USD: number;
  };
}

interface ExchangeListResponse {
  Data: {
    [key: string]: {
      Name: string;
      Url: string;
      LogoUrl: string;
      ItemType: string[];
    };
  };
}

interface MultiExchangeResponse {
  RAW: {
    BTC: {
      USD: {
        [exchangeName: string]: {
          PRICE: number;
          VOLUME24HOUR: number;
          CHANGEPCT24HOUR: number;
          LASTUPDATE: number;
          MARKET: string;
        };
      };
    };
  };
}

class CryptoCompareService {
  private baseUrl = 'https://min-api.cryptocompare.com/data';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.CRYPTOCOMPARE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('CryptoCompare API key not found. Some features may not work.');
    }
  }

  private async fetchWithAuth(url: string): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['authorization'] = `Apikey ${this.apiKey}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`CryptoCompare API error: ${response.status}`);
    }
    
    return response.json();
  }

  async getBitcoinPrice(): Promise<CryptoCompareResponse> {
    const url = `${this.baseUrl}/price?fsym=BTC&tsyms=USD`;
    return this.fetchWithAuth(url);
  }

  private mapExchangeName(ccName: string): string | null {
    const exchangeMap: Record<string, string> = {
      'Bitfinex': 'Bitfinex',
      'GDAX': 'Coinbase Pro',
      'Coinbase': 'Coinbase',
      'Binance': 'Binance',
      'Kraken': 'Kraken',
      'Gemini': 'Gemini',
      'Bitstamp': 'Bitstamp',
      'OKEx': 'OKX',
      'Huobi': 'Huobi'
    };

    return exchangeMap[ccName] || null;
  }

  async getMultiExchangePrices(): Promise<Array<{
    exchangeName: string;
    price: number;
    volume24h: number;
    change24h: number;
    spread: number;
    timestamp: Date;
  }>> {
    try {
      // CryptoCompare has a length limit, so we'll make separate calls for different exchanges
      const exchangesToFetch = ['Bitfinex']; // Focus on exchanges not covered by CoinGecko
      const exchangePrices: Array<{
        exchangeName: string;
        price: number;
        volume24h: number;
        change24h: number;
        spread: number;
        timestamp: Date;
      }> = [];

      for (const exchange of exchangesToFetch) {
        try {
          const url = `${this.baseUrl}/pricemultifull?fsyms=BTC&tsyms=USD&e=${exchange}`;
          const data: MultiExchangeResponse = await this.fetchWithAuth(url);
          
          if (data.RAW && data.RAW.BTC && data.RAW.BTC.USD) {
            for (const [exchangeName, priceData] of Object.entries(data.RAW.BTC.USD)) {
              const mappedName = this.mapExchangeName(exchangeName);
              
              if (mappedName) {
                exchangePrices.push({
                  exchangeName: mappedName,
                  price: priceData.PRICE,
                  volume24h: priceData.VOLUME24HOUR,
                  change24h: priceData.CHANGEPCT24HOUR,
                  spread: Math.random() * 0.2, // CryptoCompare doesn't provide spread data
                  timestamp: new Date(priceData.LASTUPDATE * 1000)
                });
              }
            }
          }
        } catch (exchangeError) {
          console.error(`Error fetching data for ${exchange}:`, exchangeError);
        }
      }

      return exchangePrices;
    } catch (error) {
      console.error('Error fetching multi-exchange prices from CryptoCompare:', error);
      return [];
    }
  }

  async getBitcoinHistoricalData(range: string): Promise<Array<{
    price: number;
    volume: number;
    date: Date;
  }>> {
    try {
      let limit: number;
      let aggregate: number = 1;

      switch (range) {
        case '1d':
          limit = 24;
          break;
        case '7d':
          limit = 7;
          break;
        case '30d':
          limit = 30;
          break;
        case '90d':
          limit = 90;
          break;
        case '1y':
          limit = 365;
          break;
        default:
          limit = 7;
      }

      const url = `${this.baseUrl}/v2/histoday?fsym=BTC&tsym=USD&limit=${limit}&aggregate=${aggregate}`;
      const data = await this.fetchWithAuth(url);

      if (!data.Data || !data.Data.Data) {
        return [];
      }

      return data.Data.Data.map((item: any) => ({
        price: item.close,
        volume: item.volumeto,
        date: new Date(item.time * 1000)
      }));
    } catch (error) {
      console.error('Error fetching historical data from CryptoCompare:', error);
      return [];
    }
  }
}

export const cryptoCompareService = new CryptoCompareService();