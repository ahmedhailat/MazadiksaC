import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, TrendingUp, Target, Sparkles, Star, Brain, Zap, Award } from "lucide-react";
import { useRecommendations, useMarkRecommendationViewed, useMarkRecommendationClicked, useBehaviorTracker, type RecommendationWithAuction } from "@/hooks/use-recommendations";
import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface PersonalizedRecommendationsProps {
  userId: number;
  limit?: number;
  showTitle?: boolean;
}

export function PersonalizedRecommendations({ 
  userId, 
  limit = 6, 
  showTitle = true 
}: PersonalizedRecommendationsProps) {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const { data: recommendations, isLoading } = useRecommendations(userId, limit);
  const markViewed = useMarkRecommendationViewed();
  const markClicked = useMarkRecommendationClicked();
  const behaviorTracker = useBehaviorTracker(userId);

  const [viewedItems, setViewedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Track view for recommendations that come into view
    if (recommendations && recommendations.length > 0) {
      recommendations.forEach((rec: RecommendationWithAuction, index: number) => {
        if (!viewedItems.has(rec.auctionId)) {
          // Mark as viewed after 2 seconds of being in viewport
          setTimeout(() => {
            if (!viewedItems.has(rec.auctionId)) {
              markViewed.mutate({ userId, auctionId: rec.auctionId });
              behaviorTracker.trackView(rec.auctionId, rec.auction?.categoryId, 2);
              setViewedItems(prev => new Set(prev).add(rec.auctionId));
            }
          }, 2000 + index * 500); // Stagger the tracking
        }
      });
    }
  }, [recommendations, userId, viewedItems]);

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="h-4 w-4" />;
      case 'similar':
        return <Target className="h-4 w-4" />;
      case 'personalized':
        return <Brain className="h-4 w-4" />;
      case 'category':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getRecommendationBadgeColor = (type: string) => {
    switch (type) {
      case 'trending':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'similar':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'personalized':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'category':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRecommendationTypeLabel = (type: string) => {
    const labels = {
      trending: currentLanguage.code === 'ar' ? 'رائج' : 'Trending',
      similar: currentLanguage.code === 'ar' ? 'مشابه' : 'Similar',
      personalized: currentLanguage.code === 'ar' ? 'مخصص لك' : 'For You',
      category: currentLanguage.code === 'ar' ? 'استكشاف' : 'Explore'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return currentLanguage.code === 'ar' ? 'انتهى' : 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return currentLanguage.code === 'ar' ? `${days} أيام` : `${days}d`;
    } else if (hours > 0) {
      return currentLanguage.code === 'ar' ? `${hours} ساعات` : `${hours}h`;
    } else {
      return currentLanguage.code === 'ar' ? `${minutes} دقائق` : `${minutes}m`;
    }
  };

  const handleRecommendationClick = (recommendation: RecommendationWithAuction) => {
    markClicked.mutate({ userId, auctionId: recommendation.auctionId });
    behaviorTracker.trackClick(recommendation.auctionId, recommendation.auction?.categoryId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <div className="flex items-center gap-2 mb-6">
            <Brain className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold">
              {currentLanguage.code === 'ar' ? 'مقترحات ذكية لك' : 'AI Recommendations'}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Brain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {currentLanguage.code === 'ar' ? 'لا توجد اقتراحات متاحة' : 'No Recommendations Available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage.code === 'ar' 
              ? 'تصفح المزيد من المزادات لنتمكن من اقتراح عناصر مناسبة لك'
              : 'Browse more auctions so we can suggest items tailored for you'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {showTitle && (
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentLanguage.code === 'ar' ? 'مقترحات ذكية مخصصة لك' : 'AI-Powered Recommendations'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentLanguage.code === 'ar' 
                ? 'مزادات مختارة بعناية بناءً على اهتماماتك'
                : 'Carefully curated auctions based on your interests'
              }
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/auction/${recommendation.auctionId}`}>
              <Card 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200 dark:hover:border-purple-800"
                onClick={() => handleRecommendationClick(recommendation)}
              >
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-t-lg flex items-center justify-center">
                      <Award className="h-16 w-16 text-purple-400" />
                    </div>
                    
                    {/* Recommendation type badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className={`text-xs ${getRecommendationBadgeColor(recommendation.type)} flex items-center gap-1`}>
                        {getRecommendationIcon(recommendation.type)}
                        {getRecommendationTypeLabel(recommendation.type)}
                      </Badge>
                    </div>

                    {/* Score indicator */}
                    <div className="absolute top-2 right-2">
                      <div className="bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center gap-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs font-semibold">
                          {Math.round(recommendation.score * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {currentLanguage.code === 'ar' ? recommendation.auction.titleAr : recommendation.auction.titleEn}
                    </h3>

                    {/* AI-generated reason */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {recommendation.reason}
                    </p>

                    {/* Price and time */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {currentLanguage.code === 'ar' ? 'السعر الحالي' : 'Current Price'}
                        </span>
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                          {recommendation.auction.currentPrice} {currentLanguage.code === 'ar' ? 'ريال' : 'SAR'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {currentLanguage.code === 'ar' ? 'ينتهي خلال' : 'Ends in'}
                        </span>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeRemaining(recommendation.auction.endTime)}
                        </div>
                      </div>
                    </div>

                    {/* Bid count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {recommendation.auction.totalBids} {currentLanguage.code === 'ar' ? 'مزايدة' : 'bids'}
                      </span>
                      {recommendation.auction.featured && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {currentLanguage.code === 'ar' ? 'مميز' : 'Featured'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* View more button */}
      <div className="text-center">
        <Button variant="outline" className="group">
          <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          {currentLanguage.code === 'ar' ? 'عرض المزيد من الاقتراحات' : 'View More Recommendations'}
        </Button>
      </div>
    </div>
  );
}