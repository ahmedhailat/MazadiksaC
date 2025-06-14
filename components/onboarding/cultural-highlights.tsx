import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";
import { 
  Building2, 
  Crown, 
  Palmtree, 
  Star, 
  Gem, 
  Book,
  Scroll,
  Diamond
} from "lucide-react";

interface CulturalHighlight {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryAr: string;
  categoryEn: string;
  priceRange: string;
  icon: any;
  color: string;
  bgColor: string;
}

const culturalHighlights: CulturalHighlight[] = [
  {
    id: "islamic-art",
    titleAr: "الفنون الإسلامية التراثية",
    titleEn: "Traditional Islamic Arts",
    descriptionAr: "مخطوطات قرآنية نادرة وخط عربي أصيل من عصور إسلامية مختلفة",
    descriptionEn: "Rare Quranic manuscripts and authentic Arabic calligraphy from various Islamic eras",
    categoryAr: "تراث إسلامي",
    categoryEn: "Islamic Heritage",
    priceRange: "5,000 - 50,000 ريال",
    icon: Building2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  {
    id: "royal-items",
    titleAr: "قطع ملكية تاريخية",
    titleEn: "Historical Royal Items",
    descriptionAr: "أدوات وحلي ملكية من العائلة المالكة السعودية والحقب التاريخية",
    descriptionEn: "Royal tools and jewelry from Saudi Royal Family and historical periods",
    categoryAr: "تراث ملكي",
    categoryEn: "Royal Heritage",
    priceRange: "25,000 - 500,000 ريال",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    id: "bedouin-heritage",
    titleAr: "تراث البدو الأصيل",
    titleEn: "Authentic Bedouin Heritage",
    descriptionAr: "خناجر وسيوف بدوية، سروج الإبل، وأدوات الحياة البدوية التقليدية",
    descriptionEn: "Bedouin daggers and swords, camel saddles, and traditional Bedouin life tools",
    categoryAr: "تراث بدوي",
    categoryEn: "Bedouin Heritage",
    priceRange: "2,000 - 75,000 ريال",
    icon: Palmtree,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20"
  },
  {
    id: "precious-stones",
    titleAr: "الأحجار الكريمة النادرة",
    titleEn: "Rare Precious Stones",
    descriptionAr: "أحجار كريمة من المناجم السعودية التاريخية والمنطقة العربية",
    descriptionEn: "Precious stones from historical Saudi mines and Arab region",
    categoryAr: "أحجار كريمة",
    categoryEn: "Precious Stones",
    priceRange: "10,000 - 200,000 ريال",
    icon: Diamond,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    id: "arabic-literature",
    titleAr: "المخطوطات الأدبية العربية",
    titleEn: "Arabic Literary Manuscripts",
    descriptionAr: "مخطوطات شعرية ونثرية لكبار الأدباء العرب والشعراء السعوديين",
    descriptionEn: "Poetic and prose manuscripts by great Arab writers and Saudi poets",
    categoryAr: "أدب عربي",
    categoryEn: "Arabic Literature",
    priceRange: "3,000 - 100,000 ريال",
    icon: Book,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
  },
  {
    id: "traditional-crafts",
    titleAr: "الحرف اليدوية التراثية",
    titleEn: "Traditional Handicrafts",
    descriptionAr: "منسوجات السدو، الفخار النجدي، والأعمال الحرفية من مناطق المملكة",
    descriptionEn: "Sadu textiles, Najdi pottery, and handicrafts from Kingdom regions",
    categoryAr: "حرف تراثية",
    categoryEn: "Traditional Crafts",
    priceRange: "500 - 25,000 ريال",
    icon: Star,
    color: "text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-900/20"
  }
];

export function CulturalHighlights() {
  const { currentLanguage } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {currentLanguage.code === 'ar' ? 'كنوز التراث السعودي' : 'Saudi Heritage Treasures'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {currentLanguage.code === 'ar' 
            ? 'اكتشف مجموعة متنوعة من القطع التراثية والثقافية التي تعكس تاريخ وحضارة المملكة العربية السعودية'
            : 'Discover a diverse collection of heritage and cultural pieces reflecting the history and civilization of Saudi Arabia'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {culturalHighlights.map((highlight) => {
          const IconComponent = highlight.icon;
          
          return (
            <Card key={highlight.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${highlight.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${highlight.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {currentLanguage.code === 'ar' ? highlight.categoryAr : highlight.categoryEn}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {currentLanguage.code === 'ar' ? highlight.titleAr : highlight.titleEn}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {currentLanguage.code === 'ar' ? highlight.descriptionAr : highlight.descriptionEn}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-sm">
                      <span className="text-gray-500">
                        {currentLanguage.code === 'ar' ? 'النطاق السعري:' : 'Price Range:'}
                      </span>
                      <div className="font-semibold text-green-600">
                        {highlight.priceRange}
                      </div>
                    </div>
                    <Gem className={`h-4 w-4 ${highlight.color} opacity-60`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white text-center">
        <div className="space-y-3">
          <h4 className="text-xl font-bold">
            {currentLanguage.code === 'ar' ? 'اكتشف المزيد من الكنوز' : 'Discover More Treasures'}
          </h4>
          <p className="text-green-100 max-w-2xl mx-auto">
            {currentLanguage.code === 'ar' 
              ? 'انضم إلى مزادات مزاد السعودية واكتشف قطعاً نادرة تحكي تاريخ وثقافة المملكة'
              : 'Join Mazad KSA auctions and discover rare pieces that tell the history and culture of the Kingdom'
            }
          </p>
          <div className="flex justify-center gap-6 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-green-200">
                {currentLanguage.code === 'ar' ? 'قطعة تراثية' : 'Heritage Items'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-green-200">
                {currentLanguage.code === 'ar' ? 'موثقة تاريخياً' : 'Historically Verified'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-green-200">
                {currentLanguage.code === 'ar' ? 'مزادات نشطة' : 'Active Auctions'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}