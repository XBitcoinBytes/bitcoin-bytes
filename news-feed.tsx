import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNews } from "@/hooks/use-news";
import { useQuery } from "@tanstack/react-query";

import { Eye, Share2, ExternalLink, Newspaper, TrendingUp, Globe, Rss, Calculator, DollarSign, Zap, Clock, Shield, Activity, Database, Info, Cpu, AlertTriangle, ArrowUpRight, ArrowDownLeft, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";


const impactColors = {
  HIGH: "bg-bitcoin text-black",
  MEDIUM: "bg-electric text-black", 
  LOW: "bg-green-500 text-black",
};

const sourceIcons = {
  CoinDesk: Newspaper,
  "Bitcoin Magazine": TrendingUp,
  Reuters: Globe,
  "The Block": Rss,
};

const sourceUrls: { [key: string]: string } = {
  CoinDesk: "https://www.coindesk.com/",
  "Bitcoin Magazine": "https://bitcoinmagazine.com/",
  Reuters: "https://www.reuters.com/markets/cryptocurrency/",
  "The Block": "https://www.blockchain.com/explorer",
};

export default function NewsFeed() {
  const { data: news, isLoading } = useNews(18, 0);
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null);
  const [showingMore, setShowingMore] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState<string>('');
  
  // Modal states for blockchain health explanations
  const [showBlockHeightModal, setShowBlockHeightModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showBlockTimeModal, setShowBlockTimeModal] = useState(false);
  const [showMempoolModal, setShowMempoolModal] = useState(false);
  const { data: priceData } = useQuery({
    queryKey: ["/api/prices/comparison"],
  }) as { data: { exchanges: Array<{ currentPrice: { price: string } }> } | undefined };

  const { data: trendingTopics = [] } = useQuery({
    queryKey: ["/api/news/trending"],
  }) as { data: Array<{ topic: string; growth: number }> };

  const filteredNews = selectedImpact 
    ? news?.filter(article => article.impact === selectedImpact)
    : news;

  const displayedNews = showingMore ? filteredNews : filteredNews?.slice(0, 8);

  const handleArticleClick = (url: string, id: number) => {
    // Increment view count
    fetch(`/api/news/${id}/view`, { method: 'POST' });
    
    // Use the actual article URL directly
    window.open(url, '_blank');
  };

  const handleShare = async (id: number) => {
    // Increment share count
    await fetch(`/api/news/${id}/share`, { method: 'POST' });
  };

  if (isLoading) {
    return (
      <section id="news-feed" className="section-spacing bg-gradient-to-b from-surface to-dark-bg fade-in-up">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="cyber-text text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-bitcoin to-electric bg-clip-text text-transparent relative glitch-hover" role="heading" aria-level={2}>
              <span className="relative z-10">Bitcoin News Feed</span>
              <div className="absolute -top-1 -right-6 bg-gradient-to-r from-bitcoin/20 to-electric/20 rounded-full px-3 py-1 text-xs font-medium text-white/80 border border-white/10 animate-pulse-slow">
                BitcoinBytes
              </div>
            </h3>
            <p className="text-xl text-gray-300">Loading latest Bitcoin news...</p>
          </div>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="news-card rounded-2xl p-6 animate-pulse">
                  <div className="h-32 bg-gray-700 rounded mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news-feed" className="py-20 bg-gradient-to-b from-surface to-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-bitcoin/10 via-electric/10 to-bitcoin/10 p-8 border-2 border-bitcoin/40 epic-float">
              <div className="absolute inset-0 epic-gradient opacity-20 blur-sm"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer"></div>
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center space-x-6 mb-4">
                  <div className="w-4 h-4 bg-bitcoin rounded-full animate-pulse shadow-lg shadow-bitcoin/50"></div>
                  <div className="w-4 h-4 bg-electric rounded-full animate-pulse shadow-lg shadow-electric/50" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-4 h-4 bg-bitcoin rounded-full animate-pulse shadow-lg shadow-bitcoin/50" style={{animationDelay: '1s'}}></div>
                </div>
                <div className="mb-4">
                  <span 
                    className="text-3xl md:text-4xl font-black text-bitcoin animate-pulse-slow tracking-wider cursor-pointer hover:text-orange-300 transition-colors duration-300"
                    onClick={() => window.open('https://bitcoinvisuals.com/', '_blank')}
                  >
                    LIVE
                  </span>
                  <div className="absolute -top-2 -right-4 bg-gradient-to-r from-bitcoin/20 to-electric/20 rounded-full px-3 py-1 text-xs font-medium text-white/80 border border-white/10 animate-pulse-slow">
                    BitcoinBytes
                  </div>

                  <span 
                    className="text-3xl md:text-4xl font-black text-bitcoin animate-pulse-slow tracking-wider mx-2 cursor-pointer hover:text-orange-300 transition-colors duration-300"
                    onClick={() => window.open('https://coinmarketcap.com/currencies/bitcoin/', '_blank')}
                  >
                    MARKET
                  </span>
                  <span 
                    className="text-black font-black text-3xl md:text-4xl tracking-wider cursor-pointer hover:text-gray-800 transition-colors duration-300"
                    style={{
                      textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.6)'
                    }}
                    onClick={() => window.open('https://x.com/xbitcoinbytes', '_blank')}
                  >
                    BITCOINBYTES
                  </span>
                </div>
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-bitcoin rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-sm text-green-400 font-bold tracking-wide">STREAMING LIVE</span>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-bitcoin rounded-full"></div>
                </div>
                <p className="text-xl text-gray-100 font-semibold leading-relaxed">
                  <span 
                    className="cursor-pointer hover:text-bitcoin transition-colors duration-300"
                    onClick={() => window.open('https://www.coindesk.com/', '_blank')}
                  >
                    ⚡ Lightning-fast Bitcoin news
                  </span>
                  <span> • </span>
                  <span 
                    className="cursor-pointer hover:text-electric transition-colors duration-300"
                    onClick={() => window.open('https://alternative.me/crypto/fear-and-greed-index/', '_blank')}
                  >
                    🤖 AI-powered impact analysis
                  </span>
                  <span> • </span>
                  <span 
                    className="cursor-pointer hover:text-bitcoin transition-colors duration-300"
                    onClick={() => window.open('https://bitcoinmagazine.com/', '_blank')}
                  >
                    🛡️ Trusted sources only
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact filter */}
        <div className="flex justify-center mb-8 px-2">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Button
              variant={selectedImpact === null ? "default" : "outline"}
              onClick={() => setSelectedImpact(null)}
              className={`${selectedImpact === null ? "bg-bitcoin text-black" : ""} text-xs sm:text-sm px-3 py-2`}
            >
              All News
            </Button>
            {["HIGH", "MEDIUM", "LOW"].map((impact) => (
              <Button
                key={impact}
                variant={selectedImpact === impact ? "default" : "outline"}
                onClick={() => setSelectedImpact(impact)}
                className={`${selectedImpact === impact ? impactColors[impact as keyof typeof impactColors] : ""} text-xs sm:text-sm px-3 py-2`}
              >
                {impact} Impact
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Featured news - Enhanced Mobile Layout */}
          <div className="lg:col-span-3 w-full overflow-hidden">
            <div className="grid gap-4 sm:gap-5 md:gap-6">
              {displayedNews?.slice(0, 18).map((article) => {
                const SourceIcon = sourceIcons[article.source as keyof typeof sourceIcons] || Newspaper;
                
                return (
                  <Card 
                    key={article.id}
                    className="news-card rounded-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-2xl w-full overflow-hidden"
                    onClick={() => handleArticleClick(article.url, article.id)}
                  >
                    <CardContent className="p-4 sm:p-5 md:p-6 w-full">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6">
                        {/* Epic Dynamic article image with enhanced shimmer - Mobile Optimized */}
                        <div className="w-full sm:w-48 md:w-1/3 h-32 sm:h-36 md:h-28 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden epic-float group-hover:scale-105 transition-all duration-500 shadow-2xl border-2 border-blue-500/30 group-hover:border-cyan-500/50 mx-auto sm:mx-0 flex-shrink-0">
                          {/* Enhanced multi-layer shimmer effects */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/20 to-purple-500/10 animate-pulse-slow"></div>
                          <div className="absolute inset-0 bg-gradient-to-45deg from-bitcoin/15 via-electric/20 to-cyan-500/15 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                          
                          {/* Dynamic background with enhanced gradients matching page sections */}
                          <div className={`absolute inset-0 opacity-40 ${
                            article.impact === 'HIGH' ? 'bg-gradient-to-br from-red-500/20 via-orange-500/30 to-yellow-500/20' :
                            article.impact === 'MEDIUM' ? 'bg-gradient-to-br from-yellow-500/20 via-amber-500/30 to-orange-500/20' :
                            'bg-gradient-to-br from-blue-500/20 via-purple-500/30 to-indigo-500/20'
                          } animate-pulse-slow`}></div>
                          
                          {/* Epic animated border glow */}
                          <div className="absolute inset-0 rounded-xl border border-gradient-to-r from-cyan-500/50 via-blue-500/60 to-purple-500/50 opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                          
                          {/* Epic Dynamic icon based on content */}
                          <div className="relative z-10 text-white transform group-hover:scale-110 transition-transform duration-300">
                            {article.tags?.includes('mining') ? (
                              <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-gray-900 via-orange-900/30 to-gray-800 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 border-2 border-orange-500/40 animate-pulse-slow relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-yellow-500/30 to-red-500/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                                  <span className="text-2xl filter drop-shadow-2xl relative z-10">⛏️</span>
                                </div>
                                <span className="text-xs font-bold tracking-wider bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/40 backdrop-blur-sm">MINING</span>
                              </div>
                            ) : article.tags?.includes('institutional') ? (
                              <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-gray-900 via-emerald-900/30 to-gray-800 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50 border-2 border-emerald-500/40 animate-pulse-slow relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-green-500/30 to-teal-500/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                                  <span className="text-2xl filter drop-shadow-2xl relative z-10">🏦</span>
                                </div>
                                <span className="text-xs font-bold tracking-wider bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/40 backdrop-blur-sm">INSTITUTIONAL</span>
                              </div>
                            ) : article.tags?.includes('regulation') || article.tags?.includes('policy') ? (
                              <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-800 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 border-2 border-blue-500/40 animate-pulse-slow relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/30 to-purple-500/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                                  <span className="text-2xl filter drop-shadow-2xl relative z-10">⚖️</span>
                                </div>
                                <span className="text-xs font-bold tracking-wider bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/40 backdrop-blur-sm">REGULATION</span>
                              </div>
                            ) : article.tags?.includes('lightning') || article.tags?.includes('layer2') || article.tags?.includes('defi') ? (
                              <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-gray-900 via-cyan-900/30 to-gray-800 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50 border-2 border-cyan-500/40 animate-pulse-slow relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/30 to-purple-500/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                                  <span className="text-2xl filter drop-shadow-2xl relative z-10">⚡</span>
                                </div>
                                <span className="text-xs font-bold tracking-wider bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/40 backdrop-blur-sm">TECH</span>
                              </div>
                            ) : article.tags?.includes('etf') || article.tags?.includes('derivatives') ? (
                              <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-800 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-purple-500/40 animate-pulse-slow relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/30 to-violet-500/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                                  <span className="text-2xl filter drop-shadow-2xl relative z-10">📈</span>
                                </div>
                                <span className="text-xs font-bold tracking-wider bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/40 backdrop-blur-sm">TRADING</span>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-gray-900 via-orange-900/30 to-gray-800 rounded-full flex items-center justify-center shadow-2xl shadow-bitcoin/50 border-2 border-bitcoin/40 animate-pulse-slow relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                  <div className="absolute inset-0 bg-gradient-to-br from-bitcoin/20 via-orange-500/30 to-yellow-500/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                                  <span className="text-2xl filter drop-shadow-2xl relative z-10">₿</span>
                                </div>
                                <span className="text-xs font-bold tracking-wider bg-bitcoin/20 text-bitcoin px-3 py-1 rounded-full border border-bitcoin/40 backdrop-blur-sm">BITCOIN</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          {/* Header with ranking and impact */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {/* Importance ranking badge */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                article.impact === 'High' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30' :
                                article.impact === 'Medium' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-500/30' :
                                'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                              }`}>
                                #{(displayedNews?.findIndex(n => n.id === article.id) || 0) + 1}
                              </div>
                              
                              <Badge className={`text-xs font-semibold px-3 py-1 ${
                                article.impact === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                article.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              }`}>
                                {article.impact.toUpperCase()}
                              </Badge>
                            </div>
                            
                            {/* Live indicator for recent articles */}
                            {new Date(article.publishedAt).getTime() > Date.now() - 3600000 && (
                              <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded-full">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-red-400 font-medium">LIVE</span>
                              </div>
                            )}
                          </div>

                          {/* Source and time */}
                          <div className="flex items-center space-x-2 mb-3">
                            <SourceIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-300">{article.source}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                            </span>
                          </div>
                          
                          {/* Title with better typography */}
                          <h4 className="text-lg font-bold mb-3 group-hover:text-bitcoin transition-colors duration-300 line-clamp-2 leading-tight">
                            {article.title}
                          </h4>

                          {/* Engagement metrics and category */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                                <Eye className="h-4 w-4" />
                                <span className="text-sm font-medium">{(article.views || 0).toLocaleString()}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(article.id);
                                }}
                                className="flex items-center space-x-1 text-gray-400 hover:text-bitcoin transition-colors group"
                              >
                                <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">{(article.shares || 0).toLocaleString()}</span>
                              </button>
                              
                              {/* Category tag */}
                              {article.tags && article.tags.length > 0 && (
                                <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-400 border border-white/10">
                                  {article.tags[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-gradient-to-r from-bitcoin/10 to-electric/10 border-bitcoin/30 hover:border-bitcoin hover:bg-bitcoin/20 text-bitcoin font-semibold transition-all duration-300 group shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArticleClick(article.url, article.id);
                              }}
                            >
                              Read Story
                              <ExternalLink className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {/* Show More/Less Button */}
              {filteredNews && filteredNews.length > 6 && (
                <div className="text-center mt-8">
                  <Button
                    onClick={() => setShowingMore(!showingMore)}
                    variant="outline"
                    className="border border-bitcoin/30 hover:border-bitcoin hover:bg-bitcoin/10 transition-all duration-300"
                  >
                    {showingMore ? "Show Less Headlines" : `Show All ${filteredNews.length} Headlines`}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* News sidebar */}
          <div className="space-y-4 sm:space-y-6 w-full overflow-hidden">
            {/* Trending topics */}
            <Card 
              className="news-card rounded-2xl group cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-electric/20 transition-all duration-300 relative overflow-hidden"
              onClick={() => window.open('https://x.com/xbitcoinbytes', '_blank')}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-bitcoin/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              
              <CardContent className="p-4 sm:p-6 relative z-10">
                <h4 className="text-lg font-semibold mb-4 group-hover:text-electric transition-colors duration-300">Trending Topics</h4>
                <div className="space-y-3">
                  {trendingTopics.map((topic: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-all duration-300 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open('https://x.com/xbitcoinbytes', '_blank');
                      }}
                    >
                      <span className="text-sm group-hover:text-gray-200 transition-colors duration-300">{topic.topic}</span>
                      <span className="text-xs text-bitcoin group-hover:text-orange-300 transition-colors duration-300">+{topic.growth}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* News sources */}
            <Card className="news-card rounded-2xl">
              <CardContent className="p-4 sm:p-6">
                <h4 className="text-lg font-semibold mb-4">News Sources</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(sourceIcons).map(([source, IconComponent]) => (
                    <div 
                      key={source}
                      className="text-center p-3 bg-surface-light rounded-lg hover:bg-surface transition-colors cursor-pointer group hover:scale-105 hover:shadow-lg hover:shadow-bitcoin/20"
                      onClick={() => {
                        const url = sourceUrls[source];
                        if (url && url !== "#") {
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      <IconComponent className="h-6 w-6 text-bitcoin mb-2 mx-auto group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-xs group-hover:text-bitcoin transition-colors duration-300">{source}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>





            {/* Twitter/X Feed Widget */}
            <Card className="news-card rounded-2xl group cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-electric/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-bitcoin/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              
              <CardContent className="p-4 sm:p-6 relative z-10">
                <h4 
                  className="text-lg font-semibold mb-4 group-hover:text-electric transition-colors duration-300 cursor-pointer flex items-center"
                  onClick={() => window.open('https://x.com/xbitcoinbytes', '_blank')}
                >
                  <Globe className="h-5 w-5 text-bitcoin mr-2" />
                  @xbitcoinbytes
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                    <p className="text-sm text-gray-300 mb-2">
                      "Bitcoin network hash rate just hit another all-time high! 🚀 
                      Network security stronger than ever. #Bitcoin #HashRate"
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>2 hours ago</span>
                      <div className="flex items-center space-x-3">
                        <span>245 likes</span>
                        <span>89 retweets</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                    <p className="text-sm text-gray-300 mb-2">
                      "Lightning Network capacity surpasses $200M milestone! 
                      Layer-2 scaling is transforming Bitcoin payments. ⚡"
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>6 hours ago</span>
                      <div className="flex items-center space-x-3">
                        <span>189 likes</span>
                        <span>67 retweets</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-bitcoin/20 to-electric/20 border border-bitcoin/30 hover:from-bitcoin/30 hover:to-electric/30 text-white rounded-lg p-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                    onClick={() => window.open('https://x.com/xbitcoinbytes', '_blank')}
                  >
                    Follow for Bitcoin Insights
                  </button>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </section>
  );
}
