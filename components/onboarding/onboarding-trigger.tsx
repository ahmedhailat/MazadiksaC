import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/lib/i18n";
import { Info, Sparkles } from "lucide-react";

interface OnboardingTriggerProps {
  onClick: () => void;
  className?: string;
}

export function OnboardingTrigger({ onClick, className }: OnboardingTriggerProps) {
  const { currentLanguage } = useTranslation();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            className={`flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-200 text-amber-700 hover:text-amber-800 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800 dark:text-amber-300 ${className}`}
          >
            <Sparkles className="h-4 w-4" />
            {currentLanguage.code === 'ar' ? 'جولة ثقافية' : 'Cultural Tour'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {currentLanguage.code === 'ar' 
              ? 'تعرف على ثقافة المزادات السعودية'
              : 'Discover Saudi auction culture'
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}