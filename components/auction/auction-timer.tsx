import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface AuctionTimerProps {
  endTime: string;
  compact?: boolean;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function AuctionTimer({ endTime, compact = false, className = "" }: AuctionTimerProps) {
  const { t } = useTranslation();
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
          isExpired: false,
        });
      } else {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const formatTimeDisplay = () => {
    if (timeRemaining.isExpired) {
      return "انتهى المزاد";
    }

    if (compact) {
      if (timeRemaining.days > 0) {
        return `${timeRemaining.days} ${t('time.day')} ${timeRemaining.hours} ${t('time.hour')}`;
      } else if (timeRemaining.hours > 0) {
        return `${timeRemaining.hours} ${t('time.hour')} ${timeRemaining.minutes} ${t('time.minute')}`;
      } else {
        return `${timeRemaining.minutes}:${timeRemaining.seconds.toString().padStart(2, '0')}`;
      }
    }

    const parts = [];
    if (timeRemaining.days > 0) {
      parts.push(`${timeRemaining.days} ${timeRemaining.days === 1 ? t('time.day') : t('time.days')}`);
    }
    if (timeRemaining.hours > 0) {
      parts.push(`${timeRemaining.hours} ${timeRemaining.hours === 1 ? t('time.hour') : t('time.hours')}`);
    }
    if (timeRemaining.minutes > 0 && timeRemaining.days === 0) {
      parts.push(`${timeRemaining.minutes} ${timeRemaining.minutes === 1 ? t('time.minute') : t('time.minutes')}`);
    }

    return parts.join(' ');
  };

  const getTimerColor = () => {
    if (timeRemaining.isExpired) {
      return "text-gray-500";
    }
    
    const totalMinutesRemaining = timeRemaining.days * 24 * 60 + timeRemaining.hours * 60 + timeRemaining.minutes;
    
    if (totalMinutesRemaining < 30) {
      return "text-destructive animate-pulse-slow";
    } else if (totalMinutesRemaining < 120) {
      return "text-warning";
    } else {
      return "text-success";
    }
  };

  return (
    <div className={`flex items-center gap-2 ${getTimerColor()} ${className}`}>
      <Clock className="h-4 w-4" />
      <span className={`text-sm font-medium ${compact ? '' : 'font-mono'}`}>
        {formatTimeDisplay()}
      </span>
    </div>
  );
}
