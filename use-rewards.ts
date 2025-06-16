import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

export function useRewards(userId: number) {
  return useQuery({
    queryKey: ['rewards', userId],
    queryFn: () => apiRequest<RewardData>(`/api/users/${userId}/rewards`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () => apiRequest<Achievement[]>('/api/achievements'),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useUserAchievements(userId: number) {
  return useQuery({
    queryKey: ['user-achievements', userId],
    queryFn: () => apiRequest<UserAchievement[]>(`/api/users/${userId}/achievements`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAwardPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { userId: number; points: number; reason: string; auctionId?: number }) => {
      return apiRequest('/api/rewards/award', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch rewards data
      queryClient.invalidateQueries({ queryKey: ['rewards', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['user-achievements', variables.userId] });
    },
  });
}

export function useCheckAchievements() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest<UserAchievement[]>(`/api/users/${userId}/achievements/check`, {
        method: 'POST',
      });
    },
    onSuccess: (data, userId) => {
      // Invalidate achievements data
      queryClient.invalidateQueries({ queryKey: ['user-achievements', userId] });
      return data; // Return newly unlocked achievements
    },
  });
}