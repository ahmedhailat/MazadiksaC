import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AuctionCard } from "@/components/auction/auction-card";
import { BiddingModal } from "@/components/auction/bidding-modal";
import { useTranslation } from "@/lib/i18n";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { Smartphone, Filter, Search, SlidersHorizontal, Laptop, Gamepad2 } from "lucide-react";
import type { Auction } from "@shared/schema";

export default function CategoryElectronicsPage() {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("ending_soon");
  const [priceRange, setPriceRange] = useState("all");
  const [deviceType, setDeviceType] = useState("all");
  const [selectedAuction, setSelectedAuction] = useState<{
    id: number;
    currentPrice: string;
    bidIncrement: string;
    title: string;
  } | null>(null);

  const { data: allAuctions, isLoading } = useQuery({
    queryKey: ['/api/auctions'],
    queryFn: getQueryFn<Auction[]>({ on401: "returnNull" }),
  });

  const auctions = allAuctions?.filter(auction => auction.categoryId === 2);

  const handleBidClick = (auctionId: number, currentPrice: string, bidIncrement: string, title: string) => {
    setSelectedAuction({ id: auctionId, currentPrice, bidIncrement, title });
  };

  const filteredAuctions = auctions?.filter((auction: Auction) => {
    const matchesSearch = auction.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (priceRange !== "all") {
      const price = parseFloat(auction.currentPrice);
      switch (priceRange) {
        case "under_1k":
          matchesPrice = price < 1000;
          break;
        case "1k_5k":
          matchesPrice = price >= 1000 && price < 5000;
          break;
        case "5k_10k":
          matchesPrice = price >= 5000 && price < 10000;
          break;
        case "over_10k":
          matchesPrice = price >= 10000;
          break;
      }
    }
    
    return matchesSearch && matchesPrice;
  });

  const sortedAuctions = filteredAuctions?.sort((a: Auction, b: Auction) => {
    switch (sortBy) {
      case "price_low":
        return parseFloat(a.currentPrice) - parseFloat(b.currentPrice);
      case "price_high":
        return parseFloat(b.currentPrice) - parseFloat(a.currentPrice);
      case "ending_soon":
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      case "newest":
        return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                مزاد الإلكترونيات
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                أحدث الأجهزة التقنية والإلكترونيات بأفضل الأسعار
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <Badge variant="secondary">
              {sortedAuctions?.length || 0} مزاد متاح
            </Badge>
            <span>آخر تحديث: منذ دقيقتين</span>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <Smartphone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium">الهواتف الذكية</div>
              <div className="text-sm text-gray-500">24 مزاد</div>
            </div>
          </Card>
          
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <Laptop className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium">أجهزة الكمبيوتر</div>
              <div className="text-sm text-gray-500">18 مزاد</div>
            </div>
          </Card>
          
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <Gamepad2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium">ألعاب الفيديو</div>
              <div className="text-sm text-gray-500">12 مزاد</div>
            </div>
          </Card>
          
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-orange-600 font-bold">+</span>
              </div>
              <div className="font-medium">أخرى</div>
              <div className="text-sm text-gray-500">15 مزاد</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">تصفية النتائج</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن جهاز..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending_soon">الأقرب للانتهاء</SelectItem>
                  <SelectItem value="price_low">السعر من الأقل</SelectItem>
                  <SelectItem value="price_high">السعر من الأعلى</SelectItem>
                  <SelectItem value="newest">الأحدث</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="نطاق السعر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأسعار</SelectItem>
                  <SelectItem value="under_1k">أقل من 1,000 ريال</SelectItem>
                  <SelectItem value="1k_5k">1,000 - 5,000 ريال</SelectItem>
                  <SelectItem value="5k_10k">5,000 - 10,000 ريال</SelectItem>
                  <SelectItem value="over_10k">أكثر من 10,000 ريال</SelectItem>
                </SelectContent>
              </Select>

              {/* Device Type */}
              <Select value={deviceType} onValueChange={setDeviceType}>
                <SelectTrigger>
                  <SelectValue placeholder="نوع الجهاز" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأجهزة</SelectItem>
                  <SelectItem value="smartphones">هواتف ذكية</SelectItem>
                  <SelectItem value="laptops">أجهزة كمبيوتر محمولة</SelectItem>
                  <SelectItem value="tablets">أجهزة لوحية</SelectItem>
                  <SelectItem value="gaming">ألعاب</SelectItem>
                  <SelectItem value="accessories">إكسسوارات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Featured Electronics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            إلكترونيات مميزة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedAuctions?.filter((auction: Auction) => auction.featured).slice(0, 3).map((auction: Auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                onBidClick={(id, price, increment) => 
                  handleBidClick(id, price, increment, auction.titleAr)
                }
              />
            ))}
          </div>
        </div>

        {/* All Electronics */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              جميع الإلكترونيات
            </h2>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              المزيد من الخيارات
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAuctions?.map((auction: Auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                onBidClick={(id, price, increment) => 
                  handleBidClick(id, price, increment, auction.titleAr)
                }
              />
            ))}
          </div>

          {sortedAuctions?.length === 0 && (
            <div className="text-center py-12">
              <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                لا توجد إلكترونيات متاحة
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                جرب تغيير معايير البحث أو تحقق مرة أخرى لاحقاً
              </p>
            </div>
          )}
        </div>

        {/* Bidding Modal */}
        <BiddingModal
          isOpen={!!selectedAuction}
          onClose={() => setSelectedAuction(null)}
          auctionId={selectedAuction?.id || null}
          currentPrice={selectedAuction?.currentPrice || ""}
          bidIncrement={selectedAuction?.bidIncrement || ""}
          auctionTitle={selectedAuction?.title}
        />
      </div>
    </div>
  );
}