import { useState, useEffect } from "react";
import { X, Coins, Trophy, Star, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BidComparisonTooltip } from "./bid-comparison-tooltip";
import { BidDepositPayment } from "@/components/payment/bid-deposit-payment";
import { useTranslation } from "@/lib/i18n";
import { usePlaceBid } from "@/hooks/use-bids";
import { useToast } from "@/hooks/use-toast";
import { BadgeUnlockAnimation } from "@/components/rewards/badge-unlock-animation";
import { useAchievementSystem } from "@/hooks/use-achievement-system";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe outside of component render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface BiddingModalProps {
  isOpen: boolean;
  onClose: () => void;
  auctionId: number | null;
  currentPrice: string;
  bidIncrement: string;
  auctionTitle?: string;
}

export function BiddingModal({
  isOpen,
  onClose,
  auctionId,
  currentPrice,
  bidIncrement,
  auctionTitle = "",
}: BiddingModalProps) {
  const { t, currentLanguage } = useTranslation();
  const { toast } = useToast();
  const placeBidMutation = usePlaceBid();
  const { 
    newlyUnlocked, 
    dismissNotification, 
    triggerBidPlaced, 
    triggerPointsEarned 
  } = useAchievementSystem();
  
  const [bidAmount, setBidAmount] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [showDepositPayment, setShowDepositPayment] = useState(false);
  const [depositPaid, setDepositPaid] = useState(false);

  const isRTL = currentLanguage.direction === 'rtl';
  const currentPriceNum = parseFloat(currentPrice);
  const incrementNum = parseFloat(bidIncrement);
  const minimumBid = currentPriceNum + incrementNum;

  useEffect(() => {
    if (isOpen) {
      setBidAmount(minimumBid.toString());
    }
  }, [isOpen, minimumBid]);

  useEffect(() => {
    const bidAmountNum = parseFloat(bidAmount);
    setIsValid(bidAmountNum >= minimumBid && !isNaN(bidAmountNum));
  }, [bidAmount, minimumBid]);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setBidAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auctionId || !isValid) return;

    // For demo purposes, simulate deposit payment and proceed with bid
    if (!depositPaid) {
      // Show deposit confirmation dialog instead of payment
      const confirmed = window.confirm(
        `هل تريد دفع إيداع ضمان قدره ${calculateDepositAmount().toLocaleString()} ريال للمتابعة مع المزايدة؟\n\nسيتم استرداد الإيداع خلال 24 ساعة من انتهاء المزاد.`
      );
      
      if (confirmed) {
        setDepositPaid(true);
        toast({
          title: "تم تأكيد الإيداع",
          description: "تم قبول الإيداع ويمكنك الآن المتابعة للمزايدة",
        });
        return;
      } else {
        return;
      }
    }

    try {
      await placeBidMutation.mutateAsync({
        auctionId,
        amount: parseFloat(bidAmount).toFixed(2),
        bidderId: 1, // Using demo user ID
      });

      // Trigger achievement system
      triggerBidPlaced();
      triggerPointsEarned(10);

      // Show gamified success message with rewards
      toast({
        title: "🎉 مزايدة ناجحة!",
        description: (
          <div className="space-y-2">
            <div>مزايدتك: {parseFloat(bidAmount).toLocaleString()} {t('currency.aed')}</div>
            <div className="flex items-center gap-2 text-sm">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-blue-600">+10 نقاط مكافآت!</span>
            </div>
            <div className="text-xs text-gray-600">تم رفع مستواك! تابع المزايدة لتحصل على المزيد</div>
          </div>
        ),
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "خطأ في المزايدة",
        description: error.message || "حدث خطأ أثناء وضع المزايدة",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setBidAmount("");
    setShowDepositPayment(false);
    onClose();
  };

  const handleDepositSuccess = () => {
    setDepositPaid(true);
    setShowDepositPayment(false);
    toast({
      title: "تم دفع الإيداع بنجاح",
      description: "يمكنك الآن المتابعة للمزايدة",
    });
  };

  const calculateDepositAmount = () => {
    const bidValue = parseFloat(bidAmount);
    return Math.round(bidValue * 0.1); // 10% deposit
  };

  const bidIncrease = parseFloat(bidAmount) - currentPriceNum;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {t('bid.confirm')}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            أدخل مبلغ مزايدتك للمشاركة في هذا المزاد
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {auctionTitle && (
            <div className="text-center">
              <h3 className="font-medium text-gray-900 dark:text-white">{auctionTitle}</h3>
            </div>
          )}

          {/* Bid Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="bidAmount" className="text-sm font-medium">
              {t('bid.your-bid')}
            </Label>
            <div className="relative">
              <Input
                id="bidAmount"
                type="text"
                value={bidAmount}
                onChange={handleBidChange}
                className={`text-center text-xl font-bold ${isRTL ? 'text-right' : 'text-left'} ${
                  isValid ? 'border-success' : 'border-destructive'
                }`}
                placeholder={minimumBid.toString()}
                dir="ltr"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {t('currency.aed')}
              </span>
            </div>
            {!isValid && bidAmount && (
              <p className="text-sm text-destructive">
                {t('bid.min-increment')}: {incrementNum.toLocaleString()} {t('currency.aed')}
              </p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('bid.current-price')}</span>
              <BidComparisonTooltip
                auctionId={auctionId || 0}
                currentPrice={currentPrice}
                bidIncrement={bidIncrement}
                totalBids={50}
                endTime={new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()}
              >
                <span className="font-medium arabic-numbers cursor-help flex items-center gap-1">
                  {currentPriceNum.toLocaleString()} {t('currency.aed')}
                  <TrendingUp className="h-3 w-3 text-green-500 opacity-70" />
                </span>
              </BidComparisonTooltip>
            </div>
            {bidIncrease > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('bid.increase')}</span>
                <span className="font-medium text-accent arabic-numbers">
                  +{bidIncrease.toLocaleString()} {t('currency.aed')}
                </span>
              </div>
            )}
          </div>

          {/* Rewards Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">مكافآت المزايدة</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Coins className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">+10 نقاط</div>
                  <div className="text-xs text-gray-500">لكل مزايدة</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">تقدم المستوى</div>
                  <div className="text-xs text-gray-500">اكسب خبرة</div>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-800 dark:text-yellow-300 font-medium">
                  قريب من إنجاز: "المزايد النشط" (5 مزايدات)
                </span>
              </div>
            </div>
          </div>

          {/* Deposit Requirement Notice */}
          {!depositPaid && (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="space-y-2">
                  <div className="font-medium text-orange-800 dark:text-orange-200">
                    إيداع ضمان مطلوب
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    يتطلب دفع إيداع ضمان قدره {calculateDepositAmount().toLocaleString()} ريال (10% من قيمة المزايدة) لضمان جدية العرض
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    سيتم استرداد الإيداع خلال 24 ساعة من انتهاء المزاد
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              {t('bid.cancel')}
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${depositPaid ? 'bg-primary hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'}`}
              disabled={!isValid || placeBidMutation.isPending}
            >
              {placeBidMutation.isPending ? (
                "جاري المزايدة..."
              ) : depositPaid ? (
                t('bid.confirm-bid')
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  دفع الإيداع والمزايدة
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Badge Unlock Animation */}
      <BadgeUnlockAnimation
        achievement={newlyUnlocked}
        isVisible={!!newlyUnlocked}
        onClose={dismissNotification}
      />

      {/* Bid Deposit Payment Modal */}
      {showDepositPayment && auctionId && (
        <Elements stripe={stripePromise}>
          <BidDepositPayment
            isOpen={showDepositPayment}
            onClose={() => setShowDepositPayment(false)}
            onSuccess={handleDepositSuccess}
            auctionId={auctionId}
            auctionTitle={auctionTitle}
            currentPrice={currentPrice}
            bidAmount={bidAmount}
            depositAmount={calculateDepositAmount()}
          />
        </Elements>
      )}
    </Dialog>
  );
}
