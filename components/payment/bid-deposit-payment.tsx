import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, CreditCard, AlertCircle, CheckCircle, Clock, Info } from "lucide-react";
import { motion } from "framer-motion";

interface BidDepositPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  auctionId: number;
  auctionTitle: string;
  currentPrice: string;
  bidAmount: string;
  depositAmount: number;
}

export function BidDepositPayment({
  isOpen,
  onClose,
  onSuccess,
  auctionId,
  auctionTitle,
  currentPrice,
  bidAmount,
  depositAmount
}: BidDepositPaymentProps) {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [depositInfo, setDepositInfo] = useState<any>(null);

  useEffect(() => {
    if (isOpen && auctionId) {
      createDepositPaymentIntent();
    }
  }, [isOpen, auctionId]);

  const createDepositPaymentIntent = async () => {
    try {
      const response = await apiRequest("POST", "/api/payments/create-bid-deposit", {
        auctionId,
        bidAmount: parseFloat(bidAmount),
        depositAmount
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setDepositInfo(data.depositInfo);
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الإيداع",
        description: error.message || "فشل في إنشاء إيداع المزايدة",
        variant: "destructive"
      });
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?type=deposit&auction=${auctionId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "فشل في الدفع",
          description: error.message,
          variant: "destructive"
        });
      } else if (paymentIntent?.status === 'succeeded') {
        await apiRequest("POST", "/api/payments/confirm-deposit", {
          paymentIntentId: paymentIntent.id,
          auctionId,
          status: 'paid'
        });

        toast({
          title: "تم الدفع بنجاح",
          description: "تم دفع إيداع المزايدة وأصبح بإمكانك المزايدة الآن",
          variant: "default"
        });

        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "خطأ في الدفع",
        description: error.message || "حدث خطأ أثناء معالجة الدفع",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateDepositPercentage = () => {
    const bidValue = parseFloat(bidAmount);
    return ((depositAmount / bidValue) * 100).toFixed(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            إيداع ضمان المزايدة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                معلومات الإيداع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {auctionTitle}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">السعر الحالي:</span>
                  <div className="font-medium">{parseFloat(currentPrice).toLocaleString()} ريال</div>
                </div>
                <div>
                  <span className="text-gray-500">مزايدتك:</span>
                  <div className="font-medium text-green-600">{parseFloat(bidAmount).toLocaleString()} ريال</div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">مبلغ الإيداع:</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {depositAmount.toLocaleString()} ريال
                    </div>
                    <div className="text-xs text-gray-500">
                      {calculateDepositPercentage()}% من قيمة المزايدة
                    </div>
                  </div>
                </div>
              </div>

              <Badge variant="outline" className="w-full justify-center bg-white dark:bg-gray-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                يسترد الإيداع كاملاً عند انتهاء المزاد
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                  <div className="font-medium">شروط الإيداع:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• الإيداع مطلوب لضمان جدية المزايدة</li>
                    <li>• يسترد الإيداع خلال 24 ساعة من انتهاء المزاد</li>
                    <li>• في حالة الفوز، يحتسب الإيداع من المبلغ الإجمالي</li>
                    <li>• عدم الدفع عند الفوز يؤدي لمصادرة الإيداع</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {clientSecret && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <PaymentElement 
                    options={{
                      layout: 'tabs',
                      fields: {
                        billingDetails: {
                          address: {
                            country: 'never'
                          }
                        }
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        جاري الدفع...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        دفع {depositAmount.toLocaleString()} ريال
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {!clientSecret && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4 animate-spin" />
                جاري تحضير نموذج الدفع...
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}