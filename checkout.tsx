import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, CreditCard, Shield, Clock } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface AuctionPayment {
  auctionId: number;
  auctionTitle: string;
  winningBid: number;
  serviceFee: number;
  totalAmount: number;
  auctionEndTime: string;
  imageUrl?: string;
}

const CheckoutForm = ({ paymentData }: { paymentData: AuctionPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'succeeded' | 'failed'>('pending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setPaymentStatus('failed');
        toast({
          title: "فشل في الدفع",
          description: error.message || "حدث خطأ أثناء معالجة الدفع",
          variant: "destructive",
        });
      } else if (paymentIntent?.status === 'succeeded') {
        setPaymentStatus('succeeded');
        
        // Confirm payment with our backend
        await apiRequest('/api/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            auctionId: paymentData.auctionId,
            userId: 1, // Mock user ID
          }),
        });

        toast({
          title: "تم الدفع بنجاح!",
          description: "تم تأكيد دفعتك وسيتم التواصل معك قريباً لتسليم المنتج",
        });

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          setLocation('/payment-success');
        }, 2000);
      }
    } catch (error: any) {
      setPaymentStatus('failed');
      toast({
        title: "خطأ في الدفع",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === 'succeeded') {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-700 mb-2">تم الدفع بنجاح!</h2>
        <p className="text-gray-600">جاري تحويلك إلى صفحة التأكيد...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
          <Shield className="h-5 w-5" />
          <span className="font-medium">دفع آمن ومحمي</span>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          جميع المعاملات محمية بتشفير SSL ومعالجة بواسطة Stripe
        </p>
      </div>

      <PaymentElement 
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              address: {
                country: 'SA',
              }
            }
          }
        }}
      />

      {paymentStatus === 'failed' && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">فشل في معالجة الدفع</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            يرجى المحاولة مرة أخرى أو استخدام طريقة دفع مختلفة
          </p>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-blue-700 text-white py-3"
        disabled={!stripe || !elements || isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            جاري المعالجة...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            دفع {paymentData.totalAmount.toLocaleString()} درهم
          </div>
        )}
      </Button>
    </form>
  );
};

export default function CheckoutPage() {
  const { t, currentLanguage } = useTranslation();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentData, setPaymentData] = useState<AuctionPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get auction payment data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const auctionId = urlParams.get('auction');
    const amount = urlParams.get('amount');

    if (auctionId && amount) {
      const mockPaymentData: AuctionPayment = {
        auctionId: parseInt(auctionId),
        auctionTitle: "مرسيدس C200 موديل 2022",
        winningBid: parseFloat(amount),
        serviceFee: parseFloat(amount) * 0.05, // 5% service fee
        totalAmount: parseFloat(amount) * 1.05,
        auctionEndTime: new Date().toISOString(),
        imageUrl: "/api/placeholder/400/300"
      };

      setPaymentData(mockPaymentData);

      // Create PaymentIntent
      apiRequest('POST', '/api/create-payment-intent', {
        amount: mockPaymentData.totalAmount,
        auctionId: mockPaymentData.auctionId,
        description: `Payment for auction: ${mockPaymentData.auctionTitle}`,
      })
        .then((response) => response.json())
        .then((data: any) => {
          setClientSecret(data.clientSecret);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData || !clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            خطأ في بيانات الدفع
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            لم يتم العثور على بيانات الدفع المطلوبة
          </p>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0070f3',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            إكمال الدفع
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            أكمل عملية الدفع لتأكيد فوزك في المزاد
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                ملخص الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Auction Item */}
              <div className="flex gap-4">
                {paymentData.imageUrl && (
                  <img 
                    src={paymentData.imageUrl} 
                    alt={paymentData.auctionTitle}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {paymentData.auctionTitle}
                  </h3>
                  <Badge variant="secondary" className="mt-1">
                    مزاد رقم #{paymentData.auctionId}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Payment Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">المزايدة الفائزة</span>
                  <span className="font-medium arabic-numbers">
                    {paymentData.winningBid.toLocaleString()} درهم
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">رسوم الخدمة (5%)</span>
                  <span className="font-medium arabic-numbers">
                    {paymentData.serviceFee.toLocaleString()} درهم
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>المجموع الكلي</span>
                  <span className="text-primary arabic-numbers">
                    {paymentData.totalAmount.toLocaleString()} درهم
                  </span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700 mt-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm">
                  <Shield className="h-4 w-4" />
                  <span>ضمان استرداد كامل خلال 24 ساعة في حالة عدم التسليم</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                تفاصيل الدفع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm paymentData={paymentData} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}