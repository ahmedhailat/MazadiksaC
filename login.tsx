import { useEffect } from "react";
import { useLocation } from "wouter";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/lib/i18n";
import { Brain, Sparkles, Target, TrendingUp } from "lucide-react";

export default function Login() {
  const { currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Marketing content */}
            <div className="space-y-8">
              <div className="text-center lg:text-right">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  {currentLanguage.code === 'ar' 
                    ? 'مرحباً بك في مزاد السعودية' 
                    : 'Welcome to Mazad KSA'
                  }
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  {currentLanguage.code === 'ar' 
                    ? 'اكتشف مزادات مخصصة لك بتقنية الذكاء الاصطناعي'
                    : 'Discover personalized auctions powered by AI technology'
                  }
                </p>
              </div>

              {/* AI Features showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {currentLanguage.code === 'ar' ? 'اقتراحات ذكية' : 'Smart Recommendations'}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentLanguage.code === 'ar' 
                      ? 'نظام ذكي يتعلم من سلوكك ويقترح مزادات مناسبة لاهتماماتك'
                      : 'AI system that learns from your behavior and suggests relevant auctions'
                    }
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {currentLanguage.code === 'ar' ? 'تحليل دقيق' : 'Precise Analysis'}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentLanguage.code === 'ar' 
                      ? 'تحليل عميق للمزادات والأسعار لضمان أفضل الصفقات'
                      : 'Deep analysis of auctions and prices to ensure the best deals'
                    }
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-900">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {currentLanguage.code === 'ar' ? 'اتجاهات السوق' : 'Market Trends'}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentLanguage.code === 'ar' 
                      ? 'تتبع اتجاهات السوق والمزادات الشائعة'
                      : 'Track market trends and popular auction categories'
                    }
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-100 dark:border-orange-900">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <Sparkles className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {currentLanguage.code === 'ar' ? 'تجربة مخصصة' : 'Personalized Experience'}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentLanguage.code === 'ar' 
                      ? 'واجهة مخصصة تتكيف مع تفضيلاتك وأسلوب مزايدتك'
                      : 'Custom interface that adapts to your preferences and bidding style'
                    }
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2">95%</div>
                    <div className="text-sm opacity-90">
                      {currentLanguage.code === 'ar' ? 'دقة التوصيات' : 'Recommendation Accuracy'}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">2.5K+</div>
                    <div className="text-sm opacity-90">
                      {currentLanguage.code === 'ar' ? 'مستخدم نشط' : 'Active Users'}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">500+</div>
                    <div className="text-sm opacity-90">
                      {currentLanguage.code === 'ar' ? 'مزاد يومياً' : 'Daily Auctions'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex items-center justify-center">
              <LoginForm onSuccess={() => setLocation("/")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}