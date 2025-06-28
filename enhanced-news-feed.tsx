import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Share2, ExternalLink, Clock, Tag, Eye, Filter, ChevronDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  url: string;
  source: string;
  author: string;
  publishedAt: Date;
  impact: string;
  tags: string[];
  views: number;
  shares: number;
}

interface TrendingTopic {
  topic: string;
  growth: number;
}

const impactColors = {
  HIGH: "text-red-400 bg-red-500/20",
  MEDIUM: "text-yellow-400 bg-yellow-500/20", 
  LOW: "text-green-400 bg-green-500/20"
};

export default function EnhancedNewsFeed() {
  const [selectedImpact, setSelectedImpact] = useState<string>("ALL");
  const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["/api/news"],
  });

  const { data: trending = [] } = useQuery({
    queryKey: ["/api/news/trending"],
  });

  const viewMutation = useMutation({
    mutationFn: (articleId: number) => apiRequest(`/api/news/${articleId}/view`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    },
  });

  const shareMutation = useMutation({
    mutationFn: (articleId: number) => apiRequest(`/api/news/${articleId}/share`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    },
  });

  const filteredArticles = selectedImpact === "ALL" 
    ? articles 
    : articles.filter((article: NewsArticle) => article.impact === selectedImpact);

  const toggleExpanded = (articleId: number) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId);
    } else {
      newExpanded.add(articleId);
      viewMutation.mutate(articleId);
    }
    setExpandedArticles(newExpanded);
  };

  const handleShare = (articleId: number) => {
    shareMutation.mutate(articleId);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 bg-white/10 rounded w-4"></div>
              <div className="h-4 bg-white/10 rounded w-20"></div>
              <div className="h-4 bg-white/10 rounded w-16"></div>
            </div>
            <div className="h-6 bg-white/10 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-white/10 rounded w-full mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div className="h-6 bg-white/10 rounded w-16"></div>
                <div className="h-6 bg-white/10 rounded w-20"></div>
              </div>
              <div className="h-4 bg-white/10 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-orange-400" />
          Trending Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {trending.map((topic: TrendingTopic, index: number) => (
            <div
              key={index}
              className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 border border-orange-500/30 rounded-full px-3 py-1 text-sm text-white flex items-center gap-2"
            >
              <span>{topic.topic}</span>
              <span className="text-green-400 text-xs">+{topic.growth}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Filter by impact:</span>
        </div>
        <div className="flex gap-2">
          {["ALL", "HIGH", "MEDIUM", "LOW"].map((impact) => (
            <button
              key={impact}
              onClick={() => setSelectedImpact(impact)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                selectedImpact === impact
                  ? "bg-orange-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              )}
            >
              {impact}
            </button>
          ))}
        </div>
      </div>

      {/* News Articles */}
      <div className="space-y-6">
        {filteredArticles.map((article: NewsArticle) => {
          const isExpanded = expandedArticles.has(article.id);
          
          return (
            <article
              key={article.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              {/* Article Header */}
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                <div className={cn("px-2 py-1 rounded-full text-xs font-medium", impactColors[article.impact as keyof typeof impactColors])}>
                  {article.impact}
                </div>
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.author}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(article.publishedAt)}
                </div>
              </div>

              {/* Article Title */}
              <h3 className="text-xl font-semibold text-white mb-3 leading-tight">
                {article.title}
              </h3>

              {/* Article Summary */}
              <p className="text-gray-300 mb-4 leading-relaxed">
                {article.summary}
              </p>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-gray-200 leading-relaxed">{article.content}</p>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Article Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleExpanded(article.id)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                  
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Source
                  </a>

                  <button
                    onClick={() => handleShare(article.id)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {article.shares.toLocaleString()}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}