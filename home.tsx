import { useState } from "react";
import { Link } from "wouter";
import { Car, Building, Gem, Smartphone, Cpu, HardHat, Hash, ShoppingCart, Home as HomeIcon, ArrowLeft, Shield, Award, Truck, Headphones, Star, Brain, Target, TrendingUp, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AuctionCard } from "@/components/auction/auction-card";
import { BiddingModal } from "@/components/auction/bidding-modal";
import { PersonalizedRecommendations } from "@/components/recommendations/personalized-recommendations";
import { useFeaturedAuctions, useActiveAuctions, useAuctionStats } from "@/hooks/use-auctions";
import { useTranslation } from "@/lib/i18n";
import { useBehaviorTracker } from "@/hooks/use-recommendations";
import { useAuth } from "@/hooks/use-auth";
import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingTour } from "@/components/onboarding/onboarding-tour";
import { CulturalHighlights } from "@/components/onboarding/cultural-highlights";

export default function Home() {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  
  const { data: featuredAuctions, isLoading: featuredLoading } = useFeaturedAuctions();
  const { data: activeAuctions, isLoading: activeLoading } = useActiveAuctions();
  const { data: stats } = useAuctionStats();
  const { user, isAuthenticated } = useAuth();
  const { showOnboarding, completeOnboarding, skipOnboarding, isFirstTime } = useOnboarding();
  
  // Use authenticated user ID or default to 1 for demo
  const userId = user?.id || 1;
  const behaviorTracker = useBehaviorTracker(userId);

  const [biddingModal, setBiddingModal] = useState<{
    isOpen: boolean;
    auctionId: number | null;
    currentPrice: string;
    bidIncrement: string;
    auctionTitle: string;
  }>({
    isOpen: false,
    auctionId: null,
    currentPrice: "0",
    bidIncrement: "0",
    auctionTitle: "",
  });

  const handleBidClick = (auctionId: number, currentPrice: string, bidIncrement: string) => {
    const auction = featuredAuctions?.find(a => a.id === auctionId) || 
                   activeAuctions?.find(a => a.id === auctionId);
    
    setBiddingModal({
      isOpen: true,
      auctionId,
      currentPrice,
      bidIncrement,
      auctionTitle: auction ? (currentLanguage.code === 'ar' ? auction.titleAr : auction.titleEn) : "",
    });
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

  // Auction categories matching the KSA market
  const auctionCategories = [
    {
      id: 1,
      nameAr: "مزاد السيارات",
      nameEn: "Cars Auction",
      icon: Car,
      color: "bg-blue-500",
      description: "سيارات جديدة ومستعملة"
    },
    {
      id: 2,
      nameAr: "مزاد الإلكترونيات",
      nameEn: "Electronics Auction", 
      icon: Smartphone,
      color: "bg-purple-500",
      description: "أحدث الأجهزة التقنية"
    },
    {
      id: 3,
      nameAr: "مزاد المجوهرات",
      nameEn: "Jewelry Auction",
      icon: Gem,
      color: "bg-yellow-500", 
      description: "مجوهرات فاخرة ونادرة"
    },
    {
      id: 4,
      nameAr: "مزاد متنوع",
      nameEn: "Mixed Auction",
      icon: ShoppingCart,
      color: "bg-green-500",
      description: "مزاد عام ومتنوع"
    },
    {
      id: 5,
      nameAr: "مزاد العقارات",
      nameEn: "Property Auction",
      icon: Building,
      color: "bg-orange-500",
      description: "عقارات سكنية وتجارية"
    },
    {
      id: 6,
      nameAr: "مزاد المعدات الثقيلة",
      nameEn: "Heavy Equipment Auction",
      icon: HardHat,
      color: "bg-gray-600",
      description: "معدات صناعية وإنشائية"
    },
    {
      id: 7,
      nameAr: "مزاد اللوحات المميزة",
      nameEn: "Special Plates Auction",
      icon: Hash,
      color: "bg-red-500",
      description: "لوحات سيارات مميزة"
    },
    {
      id: 8,
      nameAr: "بيع مباشر",
      nameEn: "Direct Sale",
      icon: Cpu,
      color: "bg-teal-500",
      description: "شراء مباشر بدون مزايدة"
    },
    {
      id: 9,
      nameAr: "تأجير متنوع",
      nameEn: "Various Rentals",
      icon: HomeIcon,
      color: "bg-indigo-500",
      description: "خدمات تأجير متنوعة"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section - EuroAuctions Style */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              مزاد السعودية
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              منصة المزادات الرائدة في المملكة العربية السعودية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg">
                تصفح المزادات الآن
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold rounded-lg">
                سجل كمزايد
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats?.activeAuctions || '125+'}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">مزاد نشط</div>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.totalUsers || '2.5K+'}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">مستخدم مسجل</div>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">رضا العملاء</div>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">دعم العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Sections - EuroAuctions Style */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              فئات المزادات
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              اكتشف مجموعة واسعة من المزادات في مختلف الفئات من السيارات إلى العقارات والمجوهرات
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctionCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-8 hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full -mr-16 -mt-16"></div>
                    <div className={`${category.color} w-20 h-20 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {currentLanguage.code === 'ar' ? category.nameAr : category.nameEn}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold">
                        تصفح المزادات ←
                      </Button>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium">
                        نشط
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-8 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats?.activeAuctions || '125+'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">مزاد نشط</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.totalUsers || '2.5K+'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">مستخدم مسجل</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">رضا العملاء</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">دعم العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              كيف تعمل منصة المزادات؟
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              خطوات بسيطة للبدء في المزايدة والفوز بأفضل الصفقات
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  ١
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                سجل حسابك
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                قم بإنشاء حساب مجاني والتحقق من هويتك للبدء في المزايدة بأمان وثقة
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  ٢
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                تصفح وزايد
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                استكشف المزادات المتاحة وضع عروضك على القطع التي تهمك واحصل على نقاط مكافآت
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                  ٣
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                اربح واستلم
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                عند فوزك بالمزاد، ادفع وانتظر توصيل مشترياتك إلى عنوانك بسهولة وأمان
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      {featuredAuctions && featuredAuctions.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  المزادات المميزة
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  اكتشف أفضل المزادات النشطة حالياً
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                عرض الكل
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredAuctions.slice(0, 8).map((auction) => (
                <div key={auction.id} className="group">
                  <AuctionCard
                    auction={auction}
                    onBidClick={handleBidClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              خدماتنا المتميزة
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              نوفر لك تجربة مزادات شاملة ومتكاملة مع خدمات احترافية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                ضمان الأمان
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                جميع المعاملات محمية بأعلى معايير الأمان والحماية
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                منتجات معتمدة
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                جميع المنتجات معتمدة ومفحوصة من قبل خبراء متخصصين
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                توصيل سريع
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                خدمة توصيل سريعة وآمنة إلى جميع مناطق المملكة
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                دعم 24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                فريق دعم متاح على مدار الساعة لمساعدتك في أي وقت
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized AI Recommendations */}
      {isAuthenticated ? (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <PersonalizedRecommendations userId={userId} limit={6} showTitle={true} />
          </div>
        </section>
      ) : (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-200 dark:border-purple-800">
                <Brain className="h-16 w-16 mx-auto text-purple-600 dark:text-purple-400 mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {currentLanguage.code === 'ar' ? 'اكتشف الذكاء الاصطناعي' : 'Discover AI-Powered Auctions'}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  {currentLanguage.code === 'ar' 
                    ? 'سجل دخولك للحصول على اقتراحات مزادات مخصصة بتقنية الذكاء الاصطناعي'
                    : 'Sign in to get personalized auction recommendations powered by AI technology'
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {currentLanguage.code === 'ar' ? 'توصيات دقيقة' : 'Precise Recommendations'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {currentLanguage.code === 'ar' ? 'تحليل الاتجاهات' : 'Trend Analysis'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {currentLanguage.code === 'ar' ? 'تجربة مخصصة' : 'Personalized Experience'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3">
                      <Brain className="h-5 w-5 mr-2" />
                      {currentLanguage.code === 'ar' ? 'اختبر الذكاء الاصطناعي الآن' : 'Experience AI Now'}
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => {
                      // Quick demo login
                      fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: 'demo', password: '1234' })
                      }).then(() => {
                        window.location.reload();
                      });
                    }}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
                  >
                    <User className="h-5 w-5 mr-2" />
                    {currentLanguage.code === 'ar' ? 'تجربة سريعة' : 'Quick Demo'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              آراء عملائنا
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              شاهد ما يقوله عملاؤنا عن تجربتهم معنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  أ.م
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">أحمد محمد</h4>
                  <p className="text-gray-600 dark:text-gray-400">مستثمر عقاري</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "منصة رائعة وموثوقة، حصلت على عقار بسعر ممتاز من خلال المزاد. الخدمة احترافية والدعم متميز."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  س.ع
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">سارة عبدالله</h4>
                  <p className="text-gray-600 dark:text-gray-400">جامعة المجوهرات</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "اشتريت قطعة مجوهرات نادرة بسعر لا يُصدق. المنصة آمنة والتوصيل سريع جداً."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  خ.ف
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">خالد فهد</h4>
                  <p className="text-gray-600 dark:text-gray-400">تاجر سيارات</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "أفضل منصة مزادات تعاملت معها. حصلت على سيارات بأسعار ممتازة ونقاط المكافآت رائعة."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                لماذا تختار مزاد السعودية؟
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      أكبر تشكيلة في المملكة
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      آلاف القطع من مختلف الفئات متاحة للمزايدة يومياً
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      أسعار منافسة
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      احصل على أفضل الصفقات بأسعار أقل من السوق
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      نظام مكافآت متطور
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      اكسب نقاط مع كل مزايدة وانفقها على مشتريات مستقبلية
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  احصائيات المنصة
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">150K+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">مزايدة مكتملة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">25K+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">عميل راضي</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">500M+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">ريال قيمة المبيعات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">99.8%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">معدل الأمان</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Updates */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              آخر الأخبار والتحديثات
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              تابع آخر الأخبار ونصائح المزادات والتحديثات المهمة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
              <div className="p-6">
                <div className="text-sm text-blue-600 font-medium mb-2">نصائح المزادات</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  كيفية الفوز في مزادات السيارات
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  تعرف على أفضل الاستراتيجيات للفوز بأفضل السيارات في المزادات...
                </p>
                <Button variant="ghost" className="text-blue-600 p-0 h-auto">
                  اقرأ المزيد ←
                </Button>
              </div>
            </article>

            <article className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600"></div>
              <div className="p-6">
                <div className="text-sm text-green-600 font-medium mb-2">تحديثات المنصة</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  ميزات جديدة في نظام المكافآت
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  اكتشف المزايا الجديدة في نظام نقاط المكافآت والإنجازات...
                </p>
                <Button variant="ghost" className="text-green-600 p-0 h-auto">
                  اقرأ المزيد ←
                </Button>
              </div>
            </article>

            <article className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600"></div>
              <div className="p-6">
                <div className="text-sm text-purple-600 font-medium mb-2">دليل المبتدئين</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  دليل شامل للمزايدة الآمنة
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  تعلم كيفية المزايدة بأمان وثقة للحصول على أفضل الصفقات...
                </p>
                <Button variant="ghost" className="text-purple-600 p-0 h-auto">
                  اقرأ المزيد ←
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <PersonalizedRecommendations userId={userId} limit={6} showTitle={true} />
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              اشترك في النشرة الإخبارية
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              احصل على آخر المزادات والعروض الحصرية مباشرة في بريدك الإلكتروني
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 h-12 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-lg font-semibold">
                اشتراك
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              لن نشارك بريدك الإلكتروني مع أطراف ثالثة ويمكنك إلغاء الاشتراك في أي وقت
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            ابدأ رحلتك في عالم المزادات اليوم
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            انضم إلى آلاف المستخدمين الذين يثقون بمنصتنا للحصول على أفضل الصفقات
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg">
              إنشاء حساب مجاني
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg">
              تعرف على المزيد
            </Button>
          </div>
        </div>
      </section>

      {/* Cultural Heritage Section for New Users */}
      {isAuthenticated && isFirstTime && (
        <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20">
          <div className="container mx-auto px-4">
            <CulturalHighlights />
          </div>
        </section>
      )}

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboarding}
        onClose={skipOnboarding}
        onComplete={completeOnboarding}
      />

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
