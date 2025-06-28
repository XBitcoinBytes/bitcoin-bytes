import { MailService } from '@sendgrid/mail';

class NewsletterService {
  private mailService: MailService;
  private isConfigured: boolean = false;

  constructor() {
    this.mailService = new MailService();
    this.configure();
  }

  private configure() {
    if (process.env.SENDGRID_API_KEY) {
      this.mailService.setApiKey(process.env.SENDGRID_API_KEY);
      this.isConfigured = true;
    }
  }

  async sendWelcomeEmail(email: string): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('SendGrid not configured, skipping welcome email');
      return false;
    }

    try {
      await this.mailService.send({
        to: email,
        from: 'noreply@xbitcoinbytes.com',
        subject: 'Welcome to XBitcoinBytes Newsletter!',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #1a1a2e; color: white; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #f7931a; margin-bottom: 10px;">Welcome to XBitcoinBytes!</h1>
              <p style="color: #00d4ff; font-size: 18px;">Your Real-Time Bitcoin Intelligence Platform</p>
            </div>
            
            <div style="background: #16213e; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #f7931a; margin-top: 0;">Thank you for subscribing!</h2>
              <p>You'll now receive the latest Bitcoin insights, price alerts, and market analysis directly in your inbox.</p>
              
              <h3 style="color: #00d4ff;">What you'll get:</h3>
              <ul style="color: #e0e0e0;">
                <li>Real-time Bitcoin price comparisons across major exchanges</li>
                <li>Breaking Bitcoin news and market analysis</li>
                <li>Weekly market insights and trend predictions</li>
                <li>Exclusive Bitcoin educational content</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
              <p style="color: #888; font-size: 14px;">
                Follow us on Twitter: <a href="https://x.com/xbitcoinbytes" style="color: #00d4ff;">@xbitcoinbytes</a>
              </p>
              <p style="color: #888; font-size: 12px;">
                You can unsubscribe at any time by visiting our website
              </p>
            </div>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  async sendPriceAlert(email: string, targetPrice: number, currentPrice: number): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      const isAbove = currentPrice >= targetPrice;
      await this.mailService.send({
        to: email,
        from: 'alerts@xbitcoinbytes.com',
        subject: `🚨 Bitcoin Price Alert: ${isAbove ? 'Target Reached' : 'Price Drop'}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #1a1a2e; color: white; padding: 20px; border-radius: 10px;">
            <h1 style="color: #f7931a; text-align: center;">Bitcoin Price Alert</h1>
            <div style="background: #16213e; padding: 20px; border-radius: 8px; text-align: center;">
              <h2 style="color: ${isAbove ? '#00ff88' : '#ff4444'}; margin: 0;">
                ${isAbove ? '🎯 Target Reached!' : '📉 Price Alert'}
              </h2>
              <p style="font-size: 24px; margin: 10px 0;">
                Current Price: <strong style="color: #00d4ff;">$${currentPrice.toLocaleString()}</strong>
              </p>
              <p style="font-size: 18px; color: #888;">
                Your target: $${targetPrice.toLocaleString()}
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="#" style="background: #f7931a; color: black; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Live Prices
              </a>
            </div>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error('Failed to send price alert:', error);
      return false;
    }
  }
}

export const newsletterService = new NewsletterService();