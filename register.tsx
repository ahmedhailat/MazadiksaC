import { useEffect } from "react";
import { useLocation } from "wouter";
import { RegisterForm } from "@/components/auth/register-form";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/lib/i18n";
import { Brain, Sparkles, Target, TrendingUp, Shield, Award, Users, Zap } from "lucide-react";

export default function Register() {
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
    <div className={`min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Marketing content */}
            <div className="space-y-8">
              <div className="text-center lg:text-right">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  {currentLanguage.code === 'ar' 
                    ? 'انضم إلى مزاد السعودية' 
                    : 'Join Mazad KSA'
                  }
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  {currentLanguage.code === 'ar' 
                    ? 'احصل على توصيات مزادات مخصصة بتقنية الذكاء الاصطناعي'
                    : 'Get personalized auction recommendations powered by AI'
                  }
                </p>
              </div>

              {/* Benefits showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-900">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {currentLanguage.code === 'ar' ? 'ذكاء اصطناعي متقدم' : 'Advanced AI'}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentLanguage.code === 'ar' 
                      ? 'نظام توصيات ذكي يتعلم من سلوكك ويقترح أفضل المزادات'
                      : 'Smart recommendation system that learns from your behavior'
                    }
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {currentLanguage.code === 'ar' ? 'أمان متقدم' : 'Advanced Security'}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentLanguage.code === 'ar' 
                      ? 'حماية كاملة لبياناتك ومعاملاتك المالية'
                      : 'Complete protection for your data and financial transactions'
                    }
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {currentLanguage.code === 'ar' ? 'برنامج المكافآت' : 'Rewards Program'}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentLanguage.code === 'ar' 
                      ? 'اكسب نقاط مكافآت مع كل مزايدة ناجحة'
                      : 'Earn reward points with every successful bid'
                    }
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-orange-100 dark:border-orange-900">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {currentLanguage.code === 'ar' ? 'مجتمع نشط' : 'Active Community'}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentLanguage.code === 'ar' 
                      ? 'انضم لآلاف المزايدين في السعودية'
                      : 'Join thousands of bidders across Saudi Arabia'
                    }
                  </p>
                </div>
              </div>

              {/* Success stories */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <Zap className="h-8 w-8" />
                  <h3 className="text-2xl font-bold">
                    {currentLanguage.code === 'ar' ? 'قصص نجاح' : 'Success Stories'}
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2">5K+</div>
                    <div className="text-sm opacity-90">
                      {currentLanguage.code === 'ar' ? 'مستخدم نشط' : 'Active Users'}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">15K+</div>
                    <div className="text-sm opacity-90">
                      {currentLanguage.code === 'ar' ? 'مزاد مكتمل' : 'Completed Auctions'}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">99%</div>
                    <div className="text-sm opacity-90">
                      {currentLanguage.code === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Registration form */}
            <div className="flex items-center justify-center">
              <RegisterForm onSuccess={() => setLocation("/")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}