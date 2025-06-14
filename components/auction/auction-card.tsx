import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuctionTimer } from "./auction-timer";
import { BidComparisonTooltip } from "./bid-comparison-tooltip";
import { useTranslation } from "@/lib/i18n";
import { Coins, Star, TrendingUp, Heart, Share2 } from "lucide-react";
import { ARPreviewIconButton } from "@/components/ar/ar-preview-button";
import type { Auction } from "@shared/schema";

interface AuctionCardProps {
  auction: Auction;
  onBidClick?: (auctionId: number, currentPrice: string, bidIncrement: string) => void;
}

export function AuctionCard({ auction, onBidClick }: AuctionCardProps) {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';

  const getStatusBadge = () => {
    const endTime = new Date(auction.endTime);
    const now = new Date();
    const timeUntilEnd = endTime.getTime() - now.getTime();
    const hoursUntilEnd = timeUntilEnd / (1000 * 60 * 60);

    if (auction.status !== 'active') {
      return null;
    }

    if (hoursUntilEnd < 1) {
      return (
        <Badge variant="destructive" className="absolute top-3 right-3">
          {t('auction.ending-soon')}
        </Badge>
      );
    }

    if (auction.featured) {
      return (
        <Badge className="absolute top-3 right-3 bg-secondary">
          {t('auction.featured')}
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="absolute top-3 right-3 bg-success text-white">
        {t('auction.active')}
      </Badge>
    );
  };

  const handleBidClick = () => {
    if (onBidClick) {
      onBidClick(auction.id, auction.currentPrice, auction.bidIncrement);
    }
  };

  const title = currentLanguage.code === 'ar' ? auction.titleAr : auction.titleEn;
  const description = currentLanguage.code === 'ar' ? auction.descriptionAr : auction.descriptionEn;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <Link href={`/auction/${auction.id}`} className="block">
          <img
            src={auction.images[0]}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {getStatusBadge()}
        
        {/* AR Preview and Action Buttons */}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ARPreviewIconButton 
            auctionItem={{
              id: auction.id,
              titleAr: auction.titleAr,
              titleEn: auction.titleEn,
              images: auction.images,
              categoryId: auction.categoryId
            }}
          />
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <Link href={`/auction/${auction.id}`} className="block hover:opacity-80 transition-opacity">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {title}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        </Link>

        {/* Auction Timer */}
        <div className="flex items-center justify-between mb-3">
          <AuctionTimer endTime={auction.endTime.toString()} compact />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {auction.totalBids} {t('auction.bid-count')}
          </div>
        </div>

        {/* Current Price and Bid Button */}
        <div className="flex items-center justify-between">
          <BidComparisonTooltip
            auctionId={auction.id}
            currentPrice={auction.currentPrice}
            bidIncrement={auction.bidIncrement}
            totalBids={auction.totalBids || 0}
            endTime={auction.endTime.toString()}
          >
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('auction.current-price')}
              </div>
              <div className="text-lg font-bold text-accent arabic-numbers flex items-center gap-1">
                {parseFloat(auction.currentPrice).toLocaleString()} {t('currency.aed')}
                <TrendingUp className="h-4 w-4 text-green-500 opacity-70" />
              </div>
            </div>
          </BidComparisonTooltip>
          
          <Button
            onClick={handleBidClick}
            className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
            disabled={auction.status !== 'active'}
          >
            {t('auction.bid-now')}
          </Button>
        </div>

        {/* Rewards Indicator */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Coins className="h-3 w-3" />
              <span className="font-medium">+10 نقاط</span>
            </div>
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">تقدم المستوى</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
              <Star className="h-3 w-3" />
              <span className="font-medium">إنجازات</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
