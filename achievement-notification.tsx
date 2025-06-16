import { useState, useEffect } from "react";
import { Trophy, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AchievementNotificationProps {
  achievement: {
    id: number;
    name: string;
    description: string;
    icon: string;
    pointsRequired: number;
  } | null;
  isVisible: boolean;
  onClose: () => void;
}

export function AchievementNotification({ achievement, isVisible, onClose }: AchievementNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible && achievement) {
      setShow(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, achievement, onClose]);

  if (!achievement || !isVisible) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-2xl max-w-sm border-2 border-yellow-300">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <Trophy className="h-6 w-6 text-yellow-100" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{achievement.icon}</span>
                <span className="font-bold text-sm">إنجاز جديد!</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{achievement.name}</h3>
              <p className="text-sm text-yellow-100 leading-tight">{achievement.description}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 text-yellow-200" />
                <span className="text-sm font-medium">+{achievement.pointsRequired} نقطة إضافية</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 300);
            }}
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}