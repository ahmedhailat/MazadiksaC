import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";
import { CreditCard, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface PaymentButtonProps {
  auctionId: number;
  auctionTitle: string;
  winningBid: number;
  isWinner: boolean;
  isPaid: boolean;
  auctionStatus: string;
}

export function PaymentButton({ 
  auctionId, 
  auctionTitle, 
  winningBid, 
  isWinner, 
  isPaid, 
  auctionStatus 
}: PaymentButtonProps) {
  const { t, currentLanguage } = useTranslation();
  const [, setLocation] = useLocation();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const serviceFee = winningBid * 0.05; // 5% service fee
  const totalAmount = winningBid + serviceFee;

  const handlePayNow = () => {
    // Navigate to checkout page with auction details
    const checkoutUrl = `/checkout?auction=${auctionId}&amount=${winningBid}&title=${encodeURIComponent(auctionTitle)}`;
    setLocation(checkoutUrl);
  };

  // Don't show if not winner or already paid
  if (!isWinner || isPaid || auctionStatus !== 'ended') {
    return null;
  }

  return (
    <>
      <Card className="border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <AlertTriangle className="h-5 w-5" />
            مطلوب إكمال الدفع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">المبلغ المطلوب</span>
            <span className="text-xl font-bold text-orange-600 arabic-numbers">
              {totalAmount.toLocaleString()} درهم
            </span>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>المزايدة الفائزة:</span>
              <span className="arabic-numbers">{winningBid.toLocaleString()} درهم</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم الخدمة (5%):</span>
              <span className="arabic-numbers">{serviceFee.toLocaleString()} درهم</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
            <Clock className="h-4 w-4" />
            <span>يرجى إكمال الدفع خلال 48 ساعة</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPaymentDialog(true)}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              تفاصيل الدفع
            </Button>
            <Button
              onClick={handlePayNow}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              ادفع الآن
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل الدفع المطلوب</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{auctionTitle}</h3>
              <Badge variant="secondary">مزاد رقم #{auctionId}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>المزايدة الفائزة</span>
                <span className="font-medium arabic-numbers">{winningBid.toLocaleString()} درهم</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم الخدمة (5%)</span>
                <span className="font-medium arabic-numbers">{serviceFee.toLocaleString()} درهم</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>المجموع الكلي</span>
                <span className="text-primary arabic-numbers">{totalAmount.toLocaleString()} درهم</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>دفع آمن ومحمي بواسطة Stripe</span>
              </div>
            </div>

            <Button 
              onClick={handlePayNow}
              className="w-full bg-primary hover:bg-blue-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              المتابعة للدفع
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}