import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: {
    type: 'bids_placed' | 'auctions_won' | 'points_earned' | 'consecutive_days' | 'categories_explored';
    target: number;
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
  };
}

interface UserProgress {
  bidsPlaced: number;
  auctionsWon: number;
  pointsEarned: number;
  consecutiveDays: number;
  categoriesExplored: number;
  lastActivityDate: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    name: "المزايد المبتدئ",
    description: "ضع أول مزايدة لك",
    icon: "🎯",
    pointsRequired: 10,
    category: "bidding",
    rarity: "common",
    condition: { type: "bids_placed", target: 1 }
  },
  {
    id: 2,
    name: "المزايد النشط",
    description: "ضع 5 مزايدات في يوم واحد",
    icon: "🔥",
    pointsRequired: 50,
    category: "bidding",
    rarity: "rare",
    condition: { type: "bids_placed", target: 5, timeframe: "daily" }
  },
  {
    id: 3,
    name: "جامع النقاط",
    description: "اجمع 1000 نقطة",
    icon: "💎",
    pointsRequired: 100,
    category: "points",
    rarity: "epic",
    condition: { type: "points_earned", target: 1000 }
  },
  {
    id: 4,
    name: "الخبير المحترف",
    description: "ضع 50 مزايدة",
    icon: "👑",
    pointsRequired: 200,
    category: "bidding",
    rarity: "legendary",
    condition: { type: "bids_placed", target: 50 }
  },
  {
    id: 5,
    name: "الفائز",
    description: "اربح أول مزاد",
    icon: "🏆",
    pointsRequired: 150,
    category: "winning",
    rarity: "rare",
    condition: { type: "auctions_won", target: 1 }
  },
  {
    id: 6,
    name: "المستكشف",
    description: "تصفح 5 فئات مختلفة",
    icon: "🗺️",
    pointsRequired: 25,
    category: "exploration",
    rarity: "common",
    condition: { type: "categories_explored", target: 5 }
  },
  {
    id: 7,
    name: "الملك الذهبي",
    description: "اربح 10 مزادات",
    icon: "👨‍💼",
    pointsRequired: 500,
    category: "winning",
    rarity: "legendary",
    condition: { type: "auctions_won", target: 10 }
  },
  {
    id: 8,
    name: "المثابر",
    description: "نشط لمدة 7 أيام متتالية",
    icon: "📅",
    pointsRequired: 75,
    category: "engagement",
    rarity: "epic",
    condition: { type: "consecutive_days", target: 7 }
  }
];

export function useAchievementSystem() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<number[]>([1, 6]); // Mock initial unlocked
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    bidsPlaced: 2,
    auctionsWon: 0,
    pointsEarned: 150,
    consecutiveDays: 3,
    categoriesExplored: 3,
    lastActivityDate: new Date().toISOString()
  });

  const queryClient = useQueryClient();

  const checkAchievements = useCallback((action: string, data?: any) => {
    let progressUpdate: Partial<UserProgress> = {};
    
    // Update progress based on action
    switch (action) {
      case 'bid_placed':
        progressUpdate = {
          bidsPlaced: userProgress.bidsPlaced + 1,
          lastActivityDate: new Date().toISOString()
        };
        break;
      case 'auction_won':
        progressUpdate = {
          auctionsWon: userProgress.auctionsWon + 1
        };
        break;
      case 'points_earned':
        progressUpdate = {
          pointsEarned: userProgress.pointsEarned + (data?.points || 0)
        };
        break;
      case 'category_explored':
        if (data?.categoryId) {
          progressUpdate = {
            categoriesExplored: Math.max(userProgress.categoriesExplored, data.categoryId)
          };
        }
        break;
    }

    const newProgress = { ...userProgress, ...progressUpdate };
    setUserProgress(newProgress);

    // Check for newly unlocked achievements
    ACHIEVEMENTS.forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return;

      let isUnlocked = false;
      const condition = achievement.condition;

      switch (condition.type) {
        case 'bids_placed':
          if (condition.timeframe === 'daily') {
            // For daily achievements, we'd need to track daily stats
            // For demo purposes, using simple logic
            isUnlocked = action === 'bid_placed' && newProgress.bidsPlaced >= condition.target;
          } else {
            isUnlocked = newProgress.bidsPlaced >= condition.target;
          }
          break;
        case 'auctions_won':
          isUnlocked = newProgress.auctionsWon >= condition.target;
          break;
        case 'points_earned':
          isUnlocked = newProgress.pointsEarned >= condition.target;
          break;
        case 'categories_explored':
          isUnlocked = newProgress.categoriesExplored >= condition.target;
          break;
        case 'consecutive_days':
          isUnlocked = newProgress.consecutiveDays >= condition.target;
          break;
      }

      if (isUnlocked) {
        setUnlockedAchievements(prev => [...prev, achievement.id]);
        setNewlyUnlocked(achievement);
        
        // Auto-hide notification after 6 seconds
        setTimeout(() => {
          setNewlyUnlocked(null);
        }, 6000);
      }
    });
  }, [userProgress, unlockedAchievements]);

  const getAchievementProgress = useCallback((achievement: Achievement): number => {
    const condition = achievement.condition;
    let current = 0;

    switch (condition.type) {
      case 'bids_placed':
        current = userProgress.bidsPlaced;
        break;
      case 'auctions_won':
        current = userProgress.auctionsWon;
        break;
      case 'points_earned':
        current = userProgress.pointsEarned;
        break;
      case 'categories_explored':
        current = userProgress.categoriesExplored;
        break;
      case 'consecutive_days':
        current = userProgress.consecutiveDays;
        break;
    }

    return Math.min(100, (current / condition.target) * 100);
  }, [userProgress]);

  const dismissNotification = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  const triggerBidPlaced = useCallback(() => {
    checkAchievements('bid_placed');
  }, [checkAchievements]);

  const triggerAuctionWon = useCallback(() => {
    checkAchievements('auction_won');
  }, [checkAchievements]);

  const triggerPointsEarned = useCallback((points: number) => {
    checkAchievements('points_earned', { points });
  }, [checkAchievements]);

  const triggerCategoryExplored = useCallback((categoryId: number) => {
    checkAchievements('category_explored', { categoryId });
  }, [checkAchievements]);

  return {
    achievements: ACHIEVEMENTS,
    unlockedAchievements,
    newlyUnlocked,
    userProgress,
    getAchievementProgress,
    dismissNotification,
    triggerBidPlaced,
    triggerAuctionWon,
    triggerPointsEarned,
    triggerCategoryExplored
  };
}