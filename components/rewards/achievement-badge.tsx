import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Lock, Star } from "lucide-react";

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
  progress?: number; // 0-100 percentage
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const rarityStyles = {
  common: {
    gradient: "from-gray-400 to-gray-600",
    border: "border-gray-300",
    glow: "shadow-gray-400/30",
    bg: "bg-gray-50 dark:bg-gray-800"
  },
  rare: {
    gradient: "from-blue-400 to-blue-600",
    border: "border-blue-300",
    glow: "shadow-blue-400/30",
    bg: "bg-blue-50 dark:bg-blue-900/20"
  },
  epic: {
    gradient: "from-purple-400 to-purple-600",
    border: "border-purple-300",
    glow: "shadow-purple-400/30",
    bg: "bg-purple-50 dark:bg-purple-900/20"
  },
  legendary: {
    gradient: "from-yellow-400 to-orange-500",
    border: "border-yellow-300",
    glow: "shadow-yellow-400/30",
    bg: "bg-yellow-50 dark:bg-yellow-900/20"
  }
};

const sizeStyles = {
  small: {
    container: "w-16 h-20",
    badge: "w-12 h-12",
    icon: "text-2xl",
    text: "text-xs"
  },
  medium: {
    container: "w-24 h-28",
    badge: "w-16 h-16",
    icon: "text-3xl",
    text: "text-sm"
  },
  large: {
    container: "w-32 h-36",
    badge: "w-20 h-20",
    icon: "text-4xl",
    text: "text-base"
  }
};

export function AchievementBadge({ 
  achievement, 
  isUnlocked, 
  progress = 0, 
  onClick,
  size = 'medium' 
}: AchievementBadgeProps) {
  const styles = rarityStyles[achievement.rarity];
  const sizes = sizeStyles[size];

  return (
    <motion.div
      className={`${sizes.container} cursor-pointer group relative`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Badge Container */}
      <div className={`relative ${sizes.badge} mx-auto mb-2`}>
        {/* Main Badge */}
        <div
          className={`
            ${sizes.badge} rounded-full flex items-center justify-center
            ${isUnlocked 
              ? `bg-gradient-to-br ${styles.gradient} ${styles.glow} shadow-lg` 
              : 'bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600'
            }
            transition-all duration-300 group-hover:shadow-xl
          `}
        >
          {/* Achievement Icon */}
          <div className={`${sizes.icon} ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
            {isUnlocked ? achievement.icon : <Lock className="w-1/2 h-1/2" />}
          </div>

          {/* Progress Ring for Partially Completed Achievements */}
          {!isUnlocked && progress > 0 && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-300 dark:text-gray-600"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={`text-blue-500 transition-all duration-500`}
              />
            </svg>
          )}

          {/* Rarity Indicator */}
          {isUnlocked && (
            <div className="absolute -top-1 -right-1">
              <Star className="w-4 h-4 text-yellow-300 fill-current" />
            </div>
          )}
        </div>

        {/* Glow Effect for Unlocked Badges */}
        {isUnlocked && (
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${styles.gradient} opacity-20 blur-md`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>

      {/* Achievement Name */}
      <div className="text-center space-y-1">
        <h4 className={`${sizes.text} font-semibold ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'} line-clamp-2`}>
          {achievement.name}
        </h4>
        
        {/* Progress Text */}
        {!isUnlocked && progress > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(progress)}%
          </div>
        )}

        {/* Rarity Badge */}
        <Badge 
          variant="outline" 
          className={`text-xs ${isUnlocked ? styles.border : 'border-gray-300'} ${isUnlocked ? 'opacity-100' : 'opacity-60'}`}
        >
          {achievement.rarity === 'common' && 'عادي'}
          {achievement.rarity === 'rare' && 'نادر'}
          {achievement.rarity === 'epic' && 'ملحمي'}
          {achievement.rarity === 'legendary' && 'أسطوري'}
        </Badge>
      </div>

      {/* Tooltip on Hover */}
      <div className={`
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
        ${styles.bg} border ${styles.border} rounded-lg shadow-lg z-10
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
        min-w-max max-w-xs
      `}>
        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {achievement.name}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {achievement.description}
        </div>
        <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
          <Star className="w-3 h-3" />
          {achievement.pointsRequired} نقطة
        </div>
        
        {/* Progress Bar */}
        {!isUnlocked && progress > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(progress)}% مكتمل
            </div>
          </div>
        )}

        {/* Tooltip Arrow */}
        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 ${styles.bg} border-r ${styles.border} border-b rotate-45`} />
      </div>
    </motion.div>
  );
}