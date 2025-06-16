import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";
import { Users, Shield, Trophy, Target, Clock, Award } from "lucide-react";

export default function AboutPage() {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            عن مزاد السعودية
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            منصة المزادات الإلكترونية الرائدة في المملكة العربية السعودية، نوفر تجربة مزايدة آمنة وشفافة لجميع أنواع السلع والخدمات
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                رؤيتنا
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                أن نكون المنصة الأولى والأكثر ثقة للمزادات الإلكترونية في المملكة العربية السعودية، 
                نربط البائعين والمشترين في بيئة آمنة وشفافة تضمن أفضل القيم للجميع.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-green-600" />
                مهمتنا
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                تقديم خدمات مزادات إلكترونية متقدمة تتماشى مع رؤية المملكة 2030، 
                وتساهم في تطوير التجارة الإلكترونية وخلق فرص اقتصادية جديدة للمواطنين والمقيمين.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600 dark:text-gray-400">مستخدم نشط</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">25,000+</div>
              <div className="text-gray-600 dark:text-gray-400">مزاد مكتمل</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">500M+</div>
              <div className="text-gray-600 dark:text-gray-400">ريال حجم المعاملات</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-400">معدل الرضا</div>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>قيمنا الأساسية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">الأمان والثقة</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  نضمن أعلى معايير الأمان والشفافية في جميع المعاملات
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">خدمة العملاء</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  دعم فني متواصل 24/7 لضمان أفضل تجربة للمستخدمين
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">التميز والجودة</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  نسعى للتميز في كل خدمة نقدمها ونطور منصتنا باستمرار
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Timeline */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-orange-600" />
              مسيرتنا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2020
                </div>
                <div>
                  <h4 className="font-bold text-lg">تأسيس الشركة</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    إطلاق منصة مزاد السعودية كأول منصة مزادات إلكترونية متخصصة في المملكة
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  2021
                </div>
                <div>
                  <h4 className="font-bold text-lg">التوسع والنمو</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    وصلنا إلى 10,000 مستخدم وتم إجراء أكثر من 5,000 مزاد ناجح
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  2022
                </div>
                <div>
                  <h4 className="font-bold text-lg">الحصول على التراخيص</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    الحصول على جميع التراخيص الحكومية وشهادات الأمان المطلوبة
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                  2023
                </div>
                <div>
                  <h4 className="font-bold text-lg">الريادة والابتكار</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    إطلاق نظام المكافآت والإنجازات وتطبيق الهاتف المحمول
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>التراخيص والشهادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Badge className="bg-green-500 text-white">معتمد</Badge>
                <span className="text-sm font-medium">وزارة التجارة والاستثمار</span>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Badge className="bg-blue-500 text-white">معتمد</Badge>
                <span className="text-sm font-medium">البنك المركزي السعودي</span>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Badge className="bg-purple-500 text-white">معتمد</Badge>
                <span className="text-sm font-medium">هيئة الأمن السيبراني</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}