import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  Crown, 
  Shield, 
  Heart, 
  Users, 
  Zap,
  Star,
  Award,
  Brain,
  Globe
} from "lucide-react";

interface OnboardingStep {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  culturalInsightAr: string;
  culturalInsightEn: string;
  icon: any;
  color: string;
  bgGradient: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    titleAr: "مرحباً بك في مزاد السعودية",
    titleEn: "Welcome to Mazad KSA",
    descriptionAr: "منصة المزادات الأولى في السعودية التي تجمع بين التقاليد العريقة والتكنولوجيا المتطورة",
    descriptionEn: "Saudi Arabia's premier auction platform combining rich traditions with advanced technology",
    culturalInsightAr: "💡 في التراث السعودي، المزايدة تُعتبر فناً يتطلب الذكاء والصبر. نحن نحافظ على هذه القيم التراثية مع إضافة لمسة عصرية",
    culturalInsightEn: "💡 In Saudi tradition, bidding is considered an art requiring intelligence and patience. We preserve these heritage values while adding a modern touch",
    icon: Crown,
    color: "text-purple-600",
    bgGradient: "from-purple-500 to-pink-500"
  },
  {
    id: "ai-recommendations",
    titleAr: "توصيات ذكية مخصصة لك",
    titleEn: "Personalized AI Recommendations",
    descriptionAr: "نظام ذكي يتعلم من تفضيلاتك ويقترح المزادات المناسبة لاهتماماتك وثقافتك",
    descriptionEn: "Smart system that learns your preferences and suggests auctions suited to your interests and culture",
    culturalInsightAr: "🧠 مثل الخبراء في الأسواق التراثية السعودية، نظامنا الذكي يرشدك لأفضل الصفقات بناءً على خبرته المتراكمة",
    culturalInsightEn: "🧠 Like experts in traditional Saudi markets, our AI guides you to the best deals based on accumulated experience",
    icon: Brain,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "cultural-auctions",
    titleAr: "مزادات متنوعة تناسب الثقافة السعودية",
    titleEn: "Diverse Auctions for Saudi Culture",
    descriptionAr: "من التحف الإسلامية إلى السيارات الفاخرة، ومن العقارات إلى اللوحات المميزة - كل ما يناسب الذوق السعودي",
    descriptionEn: "From Islamic artifacts to luxury cars, from real estate to distinctive plates - everything suited to Saudi taste",
    culturalInsightAr: "🏺 نحرص على عرض قطع تحمل قيمة ثقافية وتاريخية، مثل المخطوطات العربية والحرف اليدوية التراثية",
    culturalInsightEn: "🏺 We focus on displaying pieces with cultural and historical value, such as Arabic manuscripts and traditional handicrafts",
    icon: Globe,
    color: "text-green-600",
    bgGradient: "from-green-500 to-emerald-500"
  },
  {
    id: "secure-bidding",
    titleAr: "مزايدة آمنة ومضمونة",
    titleEn: "Secure & Guaranteed Bidding",
    descriptionAr: "نظام أمان متقدم يحمي معاملاتك المالية ويضمن عدالة المزايدة وفقاً لأحكام الشريعة الإسلامية",
    descriptionEn: "Advanced security system protecting your financial transactions and ensuring fair bidding according to Islamic law",
    culturalInsightAr: "🛡️ نطبق مبادئ العدالة والشفافية في التجارة كما جاءت في الشريعة الإسلامية، مع ضمان حقوق جميع الأطراف",
    culturalInsightEn: "🛡️ We apply principles of justice and transparency in trade as prescribed in Islamic law, ensuring the rights of all parties",
    icon: Shield,
    color: "text-indigo-600",
    bgGradient: "from-indigo-500 to-purple-500"
  },
  {
    id: "rewards-system",
    titleAr: "نظام المكافآت والإنجازات",
    titleEn: "Rewards & Achievements System",
    descriptionAr: "اكسب نقاط مكافآت مع كل مزايدة واحصل على ألقاب شرفية تعكس خبرتك في عالم المزادات",
    descriptionEn: "Earn reward points with every bid and gain honorary titles reflecting your expertise in the auction world",
    culturalInsightAr: "🏆 مستوحى من تقاليد الكرم العربي، نكافئ العملاء المخلصين بمزايا خاصة وخدمات مميزة",
    culturalInsightEn: "🏆 Inspired by Arab generosity traditions, we reward loyal customers with special benefits and premium services",
    icon: Award,
    color: "text-orange-600",
    bgGradient: "from-orange-500 to-red-500"
  },
  {
    id: "community",
    titleAr: "مجتمع المزايدين السعوديين",
    titleEn: "Saudi Bidders Community",
    descriptionAr: "انضم لمجتمع من المزايدين الخبراء والمبتدئين، وتعلم فنون المزايدة من أهل الاختصاص",
    descriptionEn: "Join a community of expert and beginner bidders, learn the art of bidding from specialists",
    culturalInsightAr: "👥 في التقاليد السعودية، المجتمع هو أساس النجاح. نوفر منصة للتواصل وتبادل الخبرات بين المزايدين",
    culturalInsightEn: "👥 In Saudi traditions, community is the foundation of success. We provide a platform for communication and experience sharing among bidders",
    icon: Users,
    color: "text-teal-600",
    bgGradient: "from-teal-500 to-green-500"
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const { currentLanguage } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isRTL = currentLanguage.direction === 'rtl';
  
  const currentStepData = onboardingSteps[currentStep];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const skipTour = () => {
    onClose();
  };

  if (!isOpen) return null;

  const IconComponent = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl mx-auto transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
      }`}>
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTour}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600`}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${currentStepData.bgGradient} flex items-center justify-center`}>
            <IconComponent className="h-10 w-10 text-white" />
          </div>
          
          <CardTitle className="text-2xl mb-2">
            {currentLanguage.code === 'ar' ? currentStepData.titleAr : currentStepData.titleEn}
          </CardTitle>
          
          <div className="flex justify-center gap-2 mb-4">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-600' 
                    : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentLanguage.code === 'ar' ? currentStepData.descriptionAr : currentStepData.descriptionEn}
            </p>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong className="block mb-1 text-amber-900 dark:text-amber-100">
                    {currentLanguage.code === 'ar' ? 'نصيحة ثقافية:' : 'Cultural Insight:'}
                  </strong>
                  {currentLanguage.code === 'ar' ? currentStepData.culturalInsightAr : currentStepData.culturalInsightEn}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              {currentLanguage.code === 'ar' ? 'السابق' : 'Previous'}
            </Button>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                {currentStep + 1} / {onboardingSteps.length}
              </Badge>
            </div>

            <Button
              onClick={nextStep}
              className={`flex items-center gap-2 bg-gradient-to-r ${currentStepData.bgGradient} text-white hover:opacity-90`}
            >
              {currentStep === onboardingSteps.length - 1 
                ? (currentLanguage.code === 'ar' ? 'ابدأ التجربة' : 'Start Experience')
                : (currentLanguage.code === 'ar' ? 'التالي' : 'Next')
              }
              {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-gray-500 hover:text-gray-700"
            >
              {currentLanguage.code === 'ar' ? 'تخطي الجولة' : 'Skip Tour'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}