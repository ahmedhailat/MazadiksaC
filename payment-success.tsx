import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Home, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

export default function PaymentSuccessPage() {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  const [location, navigate] = useLocation();
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setParams(urlParams);
  }, []);

  const paymentType = params?.get('type');
  const auctionId = params?.get('auction');

  const handleGoToAuction = () => {
    if (auctionId) {
      navigate(`/auction/${auctionId}`);
    } else {
      navigate('/auctions');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-green-200 shadow-xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            
            <CardTitle className="text-2xl text-green-600 mb-2">
              تم الدفع بنجاح!
            </CardTitle>
            
            <div className="text-gray-600 dark:text-gray-400">
              {paymentType === 'deposit' ? (
                'تم دفع إيداع المزايدة بنجاح'
              ) : paymentType === 'registration' ? (
                'تم دفع رسوم التسجيل بنجاح'
              ) : (
                'تمت عملية الدفع بنجاح'
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {paymentType === 'deposit' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <div className="font-medium">ماذا يحدث الآن؟</div>
                  <ul className="space-y-1 text-xs">
                    <li>• أصبح بإمكانك المزايدة في هذا المزاد</li>
                    <li>• سيتم استرداد الإيداع خلال 24 ساعة من انتهاء المزاد</li>
                    <li>• في حالة الفوز، سيحتسب الإيداع من المبلغ الإجمالي</li>
                  </ul>
                </div>
              </div>
            )}

            {paymentType === 'registration' && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
                  <div className="font-medium">تم تفعيل حسابك!</div>
                  <ul className="space-y-1 text-xs">
                    <li>• حصلت على شارة "عضو موثق"</li>
                    <li>• أصبح بإمكانك المشاركة في جميع المزادات</li>
                    <li>• تمتع بأولوية في خدمة العملاء</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {paymentType === 'deposit' && auctionId && (
                <Button 
                  onClick={handleGoToAuction}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  العودة للمزاد
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              )}

              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                <Home className="h-4 w-4 ml-2" />
                العودة للرئيسية
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <Receipt className="h-3 w-3 inline mr-1" />
              سيتم إرسال إيصال الدفع إلى بريدك الإلكتروني
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}