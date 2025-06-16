import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Trophy, Coins, TrendingUp } from "lucide-react";

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

export function RewardsDashboard({ userId = 1 }: { userId?: number }) {
  const { data: rewardData, isLoading: rewardsLoading } = useQuery<RewardData>({
    queryKey: ['/api/users', userId, 'rewards'],
  });

  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const { data: userAchievements = [], isLoading: userAchievementsLoading } = useQuery<UserAchievement[]>({
    queryKey: ['/api/users', userId, 'achievements'],
  });

  if (rewardsLoading || achievementsLoading || userAchievementsLoading) {
    return <div className="p-6">Loading rewards...</div>;
  }

  const levelProgress = rewardData ? ((rewardData.totalEarned % 100) / 100) * 100 : 0;
  const nextLevelPoints = rewardData ? 100 - (rewardData.totalEarned % 100) : 100;
  const unlockedAchievementIds = userAchievements.map(ua => ua.achievementId);

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="p-3 bg-blue-100 rounded-full">
                <Coins className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">نقاط المكافآت</p>
                <p className="text-2xl font-bold">{rewardData?.points || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">المستوى</p>
                <p className="text-2xl font-bold">{rewardData?.level || 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">إجمالي النقاط</p>
                <p className="text-2xl font-bold">{rewardData?.totalEarned || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="p-3 bg-purple-100 rounded-full">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">الإنجازات</p>
                <p className="text-2xl font-bold">{userAchievements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            تقدم المستوى
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>المستوى {rewardData?.level}</span>
              <span>{nextLevelPoints} نقطة للمستوى التالي</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          <TabsTrigger value="transactions">سجل النقاط</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const isUnlocked = unlockedAchievementIds.includes(achievement.id);
              return (
                <Card key={achievement.id} className={`${isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant={isUnlocked ? "default" : "secondary"}>
                            {isUnlocked ? "مكتمل" : `${achievement.pointsRequired} نقطة`}
                          </Badge>
                          {isUnlocked && <Trophy className="h-4 w-4 text-yellow-500" />}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل المعاملات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rewardData?.transactions?.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.reason}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div className={`font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points} نقطة
                    </div>
                  </div>
                ))}
                {(!rewardData?.transactions || rewardData.transactions.length === 0) && (
                  <p className="text-center text-gray-500 py-8">لا توجد معاملات بعد</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}