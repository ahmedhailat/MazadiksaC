import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Language {
  code: 'ar' | 'en';
  name: string;
  direction: 'rtl' | 'ltr';
}

interface TranslationStore {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const languages: Record<string, Language> = {
  ar: { code: 'ar', name: 'العربية', direction: 'rtl' },
  en: { code: 'en', name: 'English', direction: 'ltr' },
};

const translations = {
  ar: {
    // Header
    'brand.name': 'مزاد السعودية',
    'search.placeholder': 'ابحث عن المنتجات...',
    'nav.auctions': 'المزادات',
    'nav.categories': 'الفئات',
    'nav.my-auctions': 'مزاداتي',
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب',

    // Categories
    'category.all': 'الكل',
    'category.cars': 'السيارات',
    'category.electronics': 'الإلكترونيات',
    'category.jewelry': 'المجوهرات',
    'category.about': 'عن مزاد السعودية',
    'category.contact': 'اتصل بنا',
    'category.general': 'مزاد متنوع',
    'category.real-estate': 'مزاد العقارات',
    'category.heavy-equipment': 'مزاد المعدات الثقيلة',
    'category.premium-paintings': 'مزاد اللوحات المميزة',
    'category.direct-sale': 'بيع مباشر',
    'category.diverse-rental': 'تأجير متنوع',
    'category.property-auction': 'مزاد العقار',

    // Hero Section
    'hero.title': 'اكتشف أفضل المزادات الإلكترونية',
    'hero.subtitle': 'انضم إلى آلاف المزايدين واعثر على قطع فريدة وعروض مميزة',
    'hero.start-bidding': 'ابدأ المزايدة الآن',
    'hero.learn-more': 'تعلم المزيد',
    'hero.active-auctions': 'مزاد نشط',
    'hero.registered-users': 'مزايد مسجل',

    // Auctions
    'auctions.featured': 'المزادات المميزة',
    'auctions.active-now': 'المزادات النشطة الآن',
    'auctions.view-all': 'عرض الكل',
    'auction.current-price': 'السعر الحالي',
    'auction.time-remaining': 'الوقت المتبقي',
    'auction.bid-count': 'مزايدة',
    'auction.bid-now': 'زايد الآن',
    'auction.place-bid': 'زايد',
    'auction.recent-bids': 'آخر المزايدات',
    'auction.ending-soon': 'ينتهي قريباً',
    'auction.new-auction': 'مزاد جديد',
    'auction.featured': 'مميز',
    'auction.active': 'نشط',
    'auction.live': 'مباشر',
    'auction.ends-in': 'ينتهي في',
    'auction.last-bidder': 'المزايد الأخير',
    'auction.minutes-ago': 'منذ {minutes} دقيقة',
    'auction.seconds-ago': 'منذ {seconds} ثواني',
    'auction.hours-ago': 'منذ {hours} ساعة',

    // Bidding
    'bid.confirm': 'تأكيد المزايدة',
    'bid.your-bid': 'مزايدتك',
    'bid.current-price': 'السعر الحالي',
    'bid.increase': 'الزيادة',
    'bid.cancel': 'إلغاء',
    'bid.confirm-bid': 'تأكيد المزايدة',
    'bid.success': 'تم تأكيد مزايدتك بنجاح!',
    'bid.min-increment': 'الحد الأدنى للزيادة',

    // How it works
    'how-it-works.title': 'كيف تعمل منصة مزاد السعودية؟',
    'how-it-works.subtitle': 'اتبع هذه الخطوات البسيطة للمشاركة في المزادات والفوز بأفضل العروض',
    'how-it-works.step1.title': 'سجل حسابك',
    'how-it-works.step1.desc': 'أنشئ حساباً مجانياً وأكمل عملية التحقق لتصبح مزايداً معتمداً',
    'how-it-works.step2.title': 'اختر وزايد',
    'how-it-works.step2.desc': 'تصفح المزادات النشطة واختر المنتجات المفضلة لديك وابدأ المزايدة',
    'how-it-works.step3.title': 'اربح واستلم',
    'how-it-works.step3.desc': 'عند فوزك بالمزاد، ادفع واستلم منتجك بأمان عبر خدمة التوصيل المعتمدة',
    'how-it-works.get-started': 'ابدأ رحلتك الآن',

    // Trust indicators
    'trust.secure-guarantee': 'ضمان آمن',
    'trust.secure-desc': 'جميع المعاملات محمية بأعلى معايير الأمان',
    'trust.verified-products': 'منتجات معتمدة',
    'trust.verified-desc': 'فحص دقيق لجميع المنتجات قبل عرضها',
    'trust.fast-delivery': 'توصيل سريع',
    'trust.delivery-desc': 'خدمة توصيل آمنة إلى جميع أنحاء المملكة',
    'trust.support-24-7': 'دعم ٢٤/٧',
    'trust.support-desc': 'فريق دعم العملاء متاح على مدار الساعة',

    // Footer
    'footer.description': 'منصة المزادات الإلكترونية الرائدة في الشرق الأوسط. نوفر تجربة مزايدة آمنة وممتعة للجميع.',
    'footer.quick-links': 'روابط سريعة',
    'footer.support': 'الدعم',
    'footer.contact-info': 'معلومات التواصل',
    'footer.copyright': '© ٢٠٢٤ مزاد السعودية. جميع الحقوق محفوظة.',

    // Time units
    'time.days': 'أيام',
    'time.hours': 'ساعات',
    'time.minutes': 'دقائق',
    'time.seconds': 'ثواني',
    'time.day': 'يوم',
    'time.hour': 'ساعة',
    'time.minute': 'دقيقة',
    'time.second': 'ثانية',

    // Currency
    'currency.aed': 'د.إ',

    // Auction page specific
    'auctions.allAuctions': 'جميع المزادات',
    'auctions.browseDescription': 'تصفح جميع المزادات النشطة واعثر على ما تبحث عنه',
    'auctions.category': 'الفئة',
    'auctions.status': 'الحالة',
    'auctions.allCategories': 'جميع الفئات',
    'auctions.allStatuses': 'جميع الحالات',
    'auctions.active': 'نشط',
    'auctions.ended': 'منتهي',
    'auctions.upcoming': 'قادم',
    'auctions.featuredOnly': 'المزادات المميزة فقط',
    'auctions.reset': 'إعادة تعيين',
    'categories.cars': 'السيارات',
    'categories.electronics': 'الإلكترونيات',
    'categories.realEstate': 'العقارات',
    'categories.construction': 'معدات البناء',
    'categories.title': 'فئات المزادات',
    'categories.description': 'تصفح المزادات حسب الفئة واعثر على ما تبحث عنه بسهولة',
    'categories.itemsAvailable': 'مزاد متاح',
  },
  en: {
    // Header
    'brand.name': 'Mazad KSA',
    'search.placeholder': 'Search for products...',
    'nav.auctions': 'Auctions',
    'nav.categories': 'Categories',
    'nav.my-auctions': 'My Auctions',
    'auth.login': 'Login',
    'auth.register': 'Register',

    // Categories
    'category.all': 'All',
    'category.cars': 'Cars',
    'category.electronics': 'Electronics',
    'category.jewelry': 'Jewelry',
    'category.about': 'About Mazad KSA',
    'category.contact': 'Contact Us',

    // Hero Section
    'hero.title': 'Discover the Best Online Auctions',
    'hero.subtitle': 'Join thousands of bidders and find unique pieces and amazing deals',
    'hero.start-bidding': 'Start Bidding Now',
    'hero.learn-more': 'Learn More',
    'hero.active-auctions': 'Active Auctions',
    'hero.registered-users': 'Registered Bidders',

    // Auctions
    'auctions.featured': 'Featured Auctions',
    'auctions.active-now': 'Active Auctions Now',
    'auctions.view-all': 'View All',
    'auction.current-price': 'Current Price',
    'auction.time-remaining': 'Time Remaining',
    'auction.bid-count': 'bids',
    'auction.bid-now': 'Bid Now',
    'auction.place-bid': 'Bid',
    'auction.recent-bids': 'Recent Bids',
    'auction.ending-soon': 'Ending Soon',
    'auction.new-auction': 'New Auction',
    'auction.featured': 'Featured',
    'auction.active': 'Active',
    'auction.live': 'Live',
    'auction.ends-in': 'Ends in',
    'auction.last-bidder': 'Last bidder',
    'auction.minutes-ago': '{minutes} minutes ago',
    'auction.seconds-ago': '{seconds} seconds ago',
    'auction.hours-ago': '{hours} hours ago',

    // Bidding
    'bid.confirm': 'Confirm Bid',
    'bid.your-bid': 'Your Bid',
    'bid.current-price': 'Current Price',
    'bid.increase': 'Increase',
    'bid.cancel': 'Cancel',
    'bid.confirm-bid': 'Confirm Bid',
    'bid.success': 'Your bid has been confirmed successfully!',
    'bid.min-increment': 'Minimum increment',

    // How it works
    'how-it-works.title': 'How does Mazad KSA work?',
    'how-it-works.subtitle': 'Follow these simple steps to participate in auctions and win the best deals',
    'how-it-works.step1.title': 'Register Your Account',
    'how-it-works.step1.desc': 'Create a free account and complete verification to become a certified bidder',
    'how-it-works.step2.title': 'Choose and Bid',
    'how-it-works.step2.desc': 'Browse active auctions, select your favorite products and start bidding',
    'how-it-works.step3.title': 'Win and Receive',
    'how-it-works.step3.desc': 'When you win an auction, pay and receive your product safely through our certified delivery service',
    'how-it-works.get-started': 'Get Started Now',

    // Trust indicators
    'trust.secure-guarantee': 'Secure Guarantee',
    'trust.secure-desc': 'All transactions are protected with the highest security standards',
    'trust.verified-products': 'Verified Products',
    'trust.verified-desc': 'Thorough inspection of all products before listing',
    'trust.fast-delivery': 'Fast Delivery',
    'trust.delivery-desc': 'Safe delivery service throughout Saudi Arabia',
    'trust.support-24-7': '24/7 Support',
    'trust.support-desc': 'Customer support team available around the clock',

    // Footer
    'footer.description': 'The leading online auction platform in the Middle East. We provide a safe and enjoyable bidding experience for everyone.',
    'footer.quick-links': 'Quick Links',
    'footer.support': 'Support',
    'footer.contact-info': 'Contact Information',
    'footer.copyright': '© 2024 Mazad KSA. All rights reserved.',

    // Time units
    'time.days': 'days',
    'time.hours': 'hours',
    'time.minutes': 'minutes',
    'time.seconds': 'seconds',
    'time.day': 'day',
    'time.hour': 'hour',
    'time.minute': 'minute',
    'time.second': 'second',

    // Currency
    'currency.aed': 'AED',

    // Auction page specific
    'auctions.allAuctions': 'All Auctions',
    'auctions.browseDescription': 'Browse all active auctions and find what you\'re looking for',
    'auctions.category': 'Category',
    'auctions.status': 'Status',
    'auctions.allCategories': 'All Categories',
    'auctions.allStatuses': 'All Statuses',
    'auctions.active': 'Active',
    'auctions.ended': 'Ended',
    'auctions.upcoming': 'Upcoming',
    'auctions.featuredOnly': 'Featured Only',
    'auctions.reset': 'Reset Filters',
    'auctions.available': 'auctions available',
    'auctions.noAuctions': 'No auctions available',
    'auctions.tryFilters': 'Try changing the filters to find other auctions',
    'categories.cars': 'Cars',
    'categories.electronics': 'Electronics',
    'categories.realEstate': 'Real Estate',
    'categories.construction': 'Construction Equipment',
    'categories.title': 'Auction Categories',
    'categories.description': 'Browse auctions by category and find what you\'re looking for easily',
    'categories.itemsAvailable': 'items available',
  },
};

export const useTranslation = create<TranslationStore>()(
  persist(
    (set, get) => ({
      currentLanguage: languages.ar,
      setLanguage: (language: Language) => {
        try {
          set({ currentLanguage: language });

          // Update document attributes safely
          if (typeof document !== 'undefined') {
            document.documentElement.lang = language.code;
            document.documentElement.dir = language.direction;

            // Update title
            document.title = language.code === 'ar' 
              ? 'مزاد السعودية - منصة المزادات الإلكترونية'
              : 'Mazad KSA - Online Auction Platform';
          }
        } catch (error) {
          console.error('Error setting language:', error);
        }
      },
      t: (key: string) => {
        const { currentLanguage } = get();
        const langTranslations = translations[currentLanguage.code];
        const translation = langTranslations && (langTranslations as any)[key];
        return translation || key;
      },
    }),
    {
      name: 'language-storage',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          try {
            // Apply language settings on page load
            document.documentElement.lang = state.currentLanguage.code;
            document.documentElement.dir = state.currentLanguage.direction;
          } catch (error) {
            console.error('Error rehydrating language settings:', error);
          }
        }
      },
    }
  )
);

export { languages };