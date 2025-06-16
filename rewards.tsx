import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Coins, TrendingUp, Gift, Crown, Medal, Award } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { AchievementBadge } from "@/components/rewards/achievement-badge";
import { BadgeUnlockAnimation } from "@/components/rewards/badge-unlock-animation";
import { useAchievementSystem } from "@/hooks/use-achievement-system";

interface RewardData {
  points: number;
  level: number;
  totalEarned: number;
  transactions: Array<{
    id: number;
    points: number;
    type: string;
    reason: string;
    createdAt: string;
  }>;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  category: string;
}

interface UserAchievement {
  id: number;
  achievementId: number;
  unlockedAt: string;
}

export default function RewardsPage() {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  const { 
    achievements: userAchievements, 
    unlockedAchievements, 
    newlyUnlocked, 
    userProgress, 
    getAchievementProgress, 
    dismissNotification 
  } = useAchievementSystem();

  // Mock data - in real app would come from API
  const rewardData: RewardData = {
    points: 2450,
    level: 5,
    totalEarned: 3120,
    transactions: [
      { id: 1, points: 10, type: 'bid', reason: 'مزايدة على معدات البناء', createdAt: '2024-01-15T10:30:00Z' },
      { id: 2, points: 50, type: 'achievement', reason: 'إنجاز: المزايد النشط', createdAt: '2024-01-14T15:20:00Z' },
      { id: 3, points: 25, type: 'bonus', reason: 'مكافأة يومية', createdAt: '2024-01-13T09:15:00Z' },
      { id: 4, points: 10, type: 'bid', reason: 'مزايدة على سيارات', createdAt: '2024-01-12T14:45:00Z' },
    ]
  };


  const levelProgress = ((rewardData.points % 500) / 500) * 100;
  const nextLevelPoints = 500 - (rewardData.points % 500);

  const getLevelIcon = (level: number) => {
    if (level >= 10) return <Crown className="h-6 w-6 text-purple-500" />;
    if (level >= 5) return <Medal className="h-6 w-6 text-blue-500" />;
    return <Award className="h-6 w-6 text-green-500" />;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'bid': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'achievement': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'bonus': return <Gift className="h-4 w-4 text-green-500" />;
      default: return <Coins className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            نظام المكافآت والإنجازات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            اكسب النقاط واحصل على مكافآت حصرية من خلال المشاركة النشطة في المزادات
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">النقاط الحالية</p>
                  <p className="text-3xl font-bold">{rewardData.points.toLocaleString()}</p>
                </div>
                <Coins className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">المستوى</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold">{rewardData.level}</p>
                    {getLevelIcon(rewardData.level)}
                  </div>
                </div>
                <Star className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">مجموع النقاط</p>
                  <p className="text-3xl font-bold">{rewardData.totalEarned.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">الإنجازات</p>
                  <p className="text-3xl font-bold">{userAchievements.length}/{achievements.length}</p>
                </div>
                <Trophy className="h-10 w-10 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              تقدم المستوى
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">المستوى {rewardData.level}</span>
                <span className="text-sm text-gray-600">المستوى {rewardData.level + 1}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-gray-600">
                تحتاج {nextLevelPoints} نقطة للوصول للمستوى التالي
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
            <TabsTrigger value="history">سجل النقاط</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userAchievements.map((achievement) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                const progress = getAchievementProgress(achievement);
                return (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={isUnlocked}
                    progress={progress}
                    size="medium"
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>سجل النقاط</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rewardData.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium">{transaction.reason}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+{transaction.points}</p>
                        <p className="text-sm text-gray-600">نقطة</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Badge Unlock Animation */}
        <BadgeUnlockAnimation
          achievement={newlyUnlocked}
          isVisible={!!newlyUnlocked}
          onClose={dismissNotification}
        />
      </div>
    </div>
  );
}