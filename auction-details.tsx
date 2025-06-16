import { useState } from "react";
import { useParams } from "wouter";
import { ArrowLeft, Heart, Share2, Eye } from "lucide-react";
import { ARPreviewButton } from "@/components/ar/ar-preview-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AuctionTimer } from "@/components/auction/auction-timer";
import { BiddingModal } from "@/components/auction/bidding-modal";
import { PaymentButton } from "@/components/auction/payment-button";
import { useAuction } from "@/hooks/use-auctions";
import { useBidsForAuction } from "@/hooks/use-bids";
import { useTranslation } from "@/lib/i18n";

export default function AuctionDetails() {
  const { id } = useParams();
  const auctionId = parseInt(id as string);
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';

  const { data: auction, isLoading: auctionLoading } = useAuction(auctionId);
  const { data: bids, isLoading: bidsLoading } = useBidsForAuction(auctionId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [biddingModal, setBiddingModal] = useState({
    isOpen: false,
    auctionId: null as number | null,
    currentPrice: "0",
    bidIncrement: "0",
    auctionTitle: "",
  });

  const handleBidClick = () => {
    if (auction) {
      setBiddingModal({
        isOpen: true,
        auctionId: auction.id,
        currentPrice: auction.currentPrice,
        bidIncrement: auction.bidIncrement,
        auctionTitle: currentLanguage.code === 'ar' ? auction.titleAr : auction.titleEn,
      });
    }
  };

  const closeBiddingModal = () => {
    setBiddingModal({
      isOpen: false,
      auctionId: null,
      currentPrice: "0",
      bidIncrement: "0",
      auctionTitle: "",
    });
  };

  if (auctionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            المزاد غير موجود
          </h1>
          <Button onClick={() => history.back()} variant="outline">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''} ml-2`} />
            العودة
          </Button>
        </div>
      </div>
    );
  }

  const title = currentLanguage.code === 'ar' ? auction.titleAr : auction.titleEn;
  const description = currentLanguage.code === 'ar' ? auction.descriptionAr : auction.descriptionEn;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => history.back()}
            className="flex items-center gap-2 hover:text-primary"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            العودة
          </Button>
          <span>/</span>
          <span>{t('nav.auctions')}</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate">{title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={auction.images[selectedImageIndex]}
                alt={title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <ARPreviewButton 
                  auctionItem={{
                    id: auction.id,
                    titleAr: auction.titleAr,
                    titleEn: auction.titleEn,
                    images: auction.images,
                    categoryId: auction.categoryId
                  }}
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                />
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {auction.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {auction.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                      selectedImageIndex === index
                        ? 'border-primary'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auction Details */}
          <div className="space-y-6">
            {/* Title and Status */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                <Badge variant={auction.status === 'active' ? 'default' : 'secondary'}>
                  {auction.status === 'active' ? t('auction.active') : auction.status}
                </Badge>
                {auction.featured && (
                  <Badge className="bg-secondary">{t('auction.featured')}</Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
            </div>

            {/* Current Price and Timer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('auction.current-price')}</span>
                  <AuctionTimer endTime={auction.endTime} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent mb-4 arabic-numbers">
                  {parseFloat(auction.currentPrice).toLocaleString()} {t('currency.aed')}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>{t('bid.min-increment')}: {parseFloat(auction.bidIncrement).toLocaleString()} {t('currency.aed')}</span>
                  <span>{auction.totalBids} {t('auction.bid-count')}</span>
                </div>
                <Button
                  onClick={handleBidClick}
                  className="w-full bg-primary hover:bg-blue-700 text-white py-3 text-lg font-medium"
                  disabled={auction.status !== 'active'}
                >
                  {t('auction.bid-now')}
                </Button>
              </CardContent>
            </Card>

            {/* Auction Info */}
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل المزاد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">السعر الابتدائي:</span>
                  <span className="font-medium arabic-numbers">
                    {parseFloat(auction.startingPrice).toLocaleString()} {t('currency.aed')}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">بداية المزاد:</span>
                  <span className="font-medium">
                    {new Date(auction.startTime).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">نهاية المزاد:</span>
                  <span className="font-medium">
                    {new Date(auction.endTime).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">عدد المشاهدات:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    1,234
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Button for Winners */}
            <PaymentButton
              auctionId={auction.id}
              auctionTitle={title}
              winningBid={parseFloat(auction.currentPrice)}
              isWinner={true} // Mock: user is winner for demo
              isPaid={false} // Mock: payment not completed
              auctionStatus={auction.status === 'active' ? 'ended' : auction.status} // Mock ended for demo
            />
          </div>
        </div>

        {/* Bidding History */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('auction.recent-bids')}</CardTitle>
            </CardHeader>
            <CardContent>
              {bidsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center animate-pulse">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : bids && bids.length > 0 ? (
                <div className="space-y-3">
                  {bids.slice(0, 10).map((bid) => (
                    <div key={bid.id} className="flex justify-between items-center py-2 border-b last:border-b-0 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">
                        {bid.bidder?.fullName || bid.bidder?.username || 'مجهول'}
                      </span>
                      <span className="font-medium arabic-numbers">
                        {parseFloat(bid.amount).toLocaleString()} {t('currency.aed')}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(bid.placedAt).toLocaleTimeString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  لا توجد مزايدات حتى الآن
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bidding Modal */}
      <BiddingModal
        isOpen={biddingModal.isOpen}
        onClose={closeBiddingModal}
        auctionId={biddingModal.auctionId}
        currentPrice={biddingModal.currentPrice}
        bidIncrement={biddingModal.bidIncrement}
        auctionTitle={biddingModal.auctionTitle}
      />
    </div>
  );
}
