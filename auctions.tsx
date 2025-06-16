import { useState } from "react";
import { useAuctions } from "@/hooks/use-auctions";
import { AuctionCard } from "@/components/auction/auction-card";
import { BiddingModal } from "@/components/auction/bidding-modal";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AuctionsPage() {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFeatured, setShowFeatured] = useState<boolean>(false);
  
  const [isBiddingModalOpen, setIsBiddingModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<{
    id: number;
    currentPrice: string;
    bidIncrement: string;
    title: string;
  } | null>(null);

  const filters = {
    ...(selectedCategory && selectedCategory !== "all" && { categoryId: parseInt(selectedCategory) }),
    ...(selectedStatus && selectedStatus !== "all" && { status: selectedStatus }),
    ...(showFeatured && { featured: true }),
  };

  const { data: auctions, isLoading } = useAuctions(filters);

  const handleBidClick = (auctionId: number, currentPrice: string, bidIncrement: string, title?: string) => {
    setSelectedAuction({
      id: auctionId,
      currentPrice,
      bidIncrement,
      title: title || '',
    });
    setIsBiddingModalOpen(true);
  };

  const handleCloseBiddingModal = () => {
    setIsBiddingModalOpen(false);
    setSelectedAuction(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auctions.allAuctions')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('auctions.browseDescription')}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('auctions.category')}</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('auctions.allCategories')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('auctions.allCategories')}</SelectItem>
                    <SelectItem value="1">{t('categories.cars')}</SelectItem>
                    <SelectItem value="2">{t('categories.electronics')}</SelectItem>
                    <SelectItem value="3">{t('categories.realEstate')}</SelectItem>
                    <SelectItem value="4">{t('categories.construction')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('auctions.status')}</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('auctions.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('auctions.allStatuses')}</SelectItem>
                    <SelectItem value="active">{t('auctions.active')}</SelectItem>
                    <SelectItem value="ended">{t('auctions.ended')}</SelectItem>
                    <SelectItem value="upcoming">{t('auctions.upcoming')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant={showFeatured ? "default" : "outline"}
                  onClick={() => setShowFeatured(!showFeatured)}
                  className="w-full"
                >
                  {t('auctions.featuredOnly')}
                </Button>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                    setShowFeatured(false);
                  }}
                  className="w-full"
                >
                  {t('auctions.reset')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auctions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : auctions && auctions.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">
                  {auctions.length} {t('auctions.available')}
                </span>
                {showFeatured && (
                  <Badge variant="secondary">{t('auctions.featured')}</Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  onBidClick={handleBidClick}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('auctions.noAuctions')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('auctions.tryFilters')}
            </p>
          </div>
        )}

        {/* Bidding Modal */}
        <BiddingModal
          isOpen={isBiddingModalOpen}
          onClose={handleCloseBiddingModal}
          auctionId={selectedAuction?.id || null}
          currentPrice={selectedAuction?.currentPrice || "0"}
          bidIncrement={selectedAuction?.bidIncrement || "100"}
          auctionTitle={selectedAuction?.title}
        />
      </div>
    </div>
  );
}