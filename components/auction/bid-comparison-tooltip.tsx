import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/lib/i18n";
import { TrendingUp, TrendingDown, Minus, Info, Clock, Users, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BidTrend {
  timestamp: string;
  amount: number;
  bidderId: number;
}

interface BidComparisonData {
  currentPrice: number;
  previousPrice: number;
  priceChange: number;
  priceChangePercent: number;
  totalBids: number;
  uniqueBidders: number;
  averageBidIncrement: number;
  timeRemaining: string;
  recentBids: BidTrend[];
  marketValue: number;
  competitionLevel: 'low' | 'medium' | 'high';
}

interface BidComparisonTooltipProps {
  auctionId: number;
  currentPrice: string;
  bidIncrement: string;
  totalBids: number;
  endTime: string;
  children: React.ReactNode;
}

export function BidComparisonTooltip({
  auctionId,
  currentPrice,
  bidIncrement,
  totalBids,
  endTime,
  children
}: BidComparisonTooltipProps) {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const [comparisonData, setComparisonData] = useState<BidComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate realistic comparison data based on auction info
  useEffect(() => {
    const generateComparisonData = (): BidComparisonData => {
      const current = parseFloat(currentPrice);
      const increment = parseFloat(bidIncrement);
      const previous = current - increment;
      const change = current - previous;
      const changePercent = (change / previous) * 100;
      
      // Generate recent bid trend
      const recentBids: BidTrend[] = [];
      const now = new Date();
      for (let i = 0; i < 5; i++) {
        recentBids.push({
          timestamp: new Date(now.getTime() - (i + 1) * 15 * 60 * 1000).toISOString(),
          amount: current - (increment * (i + 1)),
          bidderId: Math.floor(Math.random() * 100) + 1
        });
      }

      // Calculate competition level based on bid frequency
      const bidFrequency = totalBids / Math.max(1, (new Date().getTime() - new Date(endTime).getTime() + 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
      let competitionLevel: 'low' | 'medium' | 'high' = 'low';
      if (bidFrequency > 5) competitionLevel = 'high';
      else if (bidFrequency > 2) competitionLevel = 'medium';

      return {
        currentPrice: current,
        previousPrice: previous,
        priceChange: change,
        priceChangePercent: changePercent,
        totalBids,
        uniqueBidders: Math.max(1, Math.floor(totalBids * 0.6)),
        averageBidIncrement: increment,
        timeRemaining: endTime,
        recentBids,
        marketValue: current * (1 + Math.random() * 0.2),
        competitionLevel
      };
    };

    setIsLoading(true);
    setTimeout(() => {
      setComparisonData(generateComparisonData());
      setIsLoading(false);
    }, 300);
  }, [auctionId, currentPrice, bidIncrement, totalBids, endTime]);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    }
  };

  const getCompetitionLabel = (level: string) => {
    switch (level) {
      case 'high': return 'منافسة عالية';
      case 'medium': return 'منافسة متوسطة';
      default: return 'منافسة منخفضة';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center"
          className={`max-w-sm p-0 bg-white dark:bg-gray-800 border-2 shadow-xl ${isRTL ? 'font-arabic' : ''}`}
        >
          <AnimatePresence>
            {comparisonData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-0 shadow-none">
                  <CardContent className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-sm">تحليل المزايدة الفوري</span>
                    </div>

                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                      </div>
                    ) : (
                      <>
                        {/* Price Trend */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">اتجاه السعر</span>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(comparisonData.priceChange)}
                              <span className={`text-sm font-medium ${
                                comparisonData.priceChange > 0 ? 'text-green-600' : 
                                comparisonData.priceChange < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {comparisonData.priceChangePercent > 0 ? '+' : ''}
                                {comparisonData.priceChangePercent.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            من {comparisonData.previousPrice.toLocaleString()} إلى {comparisonData.currentPrice.toLocaleString()} ريال
                          </div>
                        </div>

                        {/* Competition Level */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">مستوى المنافسة</span>
                          <Badge className={`text-xs ${getCompetitionColor(comparisonData.competitionLevel)}`}>
                            {getCompetitionLabel(comparisonData.competitionLevel)}
                          </Badge>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-blue-500" />
                            <div>
                              <div className="text-gray-500">إجمالي المزايدات</div>
                              <div className="font-medium">{comparisonData.totalBids}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-purple-500" />
                            <div>
                              <div className="text-gray-500">المزايدون</div>
                              <div className="font-medium">{comparisonData.uniqueBidders}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <div>
                              <div className="text-gray-500">متوسط الزيادة</div>
                              <div className="font-medium">{comparisonData.averageBidIncrement.toLocaleString()} ريال</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-orange-500" />
                            <div>
                              <div className="text-gray-500">القيمة السوقية</div>
                              <div className="font-medium">{comparisonData.marketValue.toLocaleString()} ريال</div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Bid Trend */}
                        <div className="space-y-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">آخر المزايدات</span>
                          <div className="space-y-1">
                            {comparisonData.recentBids.slice(0, 3).map((bid, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">
                                  {new Date(bid.timestamp).toLocaleTimeString('ar-SA', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <span className="font-medium">{bid.amount.toLocaleString()} ريال</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Smart Suggestions */}
                        <div className="pt-2 border-t">
                          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            {comparisonData.competitionLevel === 'high' && (
                              <div className="flex items-center gap-1 text-orange-600">
                                <span>⚡</span>
                                <span>منافسة عالية - فكر في المزايدة سريعاً</span>
                              </div>
                            )}
                            {comparisonData.currentPrice > comparisonData.marketValue * 0.9 && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <span>💡</span>
                                <span>السعر قريب من القيمة السوقية</span>
                              </div>
                            )}
                            {comparisonData.priceChangePercent > 10 && (
                              <div className="flex items-center gap-1 text-green-600">
                                <span>📈</span>
                                <span>نمو سعري قوي</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}