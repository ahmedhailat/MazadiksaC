import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface RecommendationWithAuction {
  id: number;
  userId: number;
  auctionId: number;
  score: number;
  reason: string;
  type: 'trending' | 'similar' | 'personalized' | 'category';
  viewed: boolean;
  clicked: boolean;
  createdAt: string;
  auction: {
    id: number;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    currentPrice: string;
    bidIncrement: string;
    endTime: string;
    status: string;
    categoryId: number;
    featured: boolean;
    totalBids: number;
    imageUrl?: string;
  };
}

export interface UserPreferences {
  id: number;
  userId: number;
  preferredCategories: string;
  interestScore: string;
  biddingStyle: string;
  createdAt: string;
  updatedAt: string;
}

// Hook to fetch personalized recommendations
export function useRecommendations(userId: number, limit: number = 10) {
  return useQuery<RecommendationWithAuction[]>({
    queryKey: ['/api/users', userId, 'recommendations', limit],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/recommendations?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

// Hook to fetch user preferences
export function useUserPreferences(userId: number) {
  return useQuery<UserPreferences>({
    queryKey: ['/api/users', userId, 'preferences'],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/preferences`);
      if (!response.ok) {
        throw new Error('Failed to fetch user preferences');
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook to mark recommendation as viewed
export function useMarkRecommendationViewed() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, auctionId }: { userId: number; auctionId: number }) => {
      const response = await fetch(`/api/recommendations/${userId}/${auctionId}/viewed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark recommendation as viewed');
      }
      
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      // Invalidate recommendations to update viewed status
      queryClient.invalidateQueries({
        queryKey: ['/api/users', userId, 'recommendations']
      });
    },
  });
}

// Hook to mark recommendation as clicked
export function useMarkRecommendationClicked() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, auctionId }: { userId: number; auctionId: number }) => {
      const response = await fetch(`/api/recommendations/${userId}/${auctionId}/clicked`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark recommendation as clicked');
      }
      
      return response.json();
    },
    onSuccess: (_, { userId }) => {
      // Invalidate recommendations to update clicked status
      queryClient.invalidateQueries({
        queryKey: ['/api/users', userId, 'recommendations']
      });
    },
  });
}

// Hook to track user behavior
export function useBehaviorTracker(userId: number) {
  const queryClient = useQueryClient();
  
  const trackBehavior = useMutation({
    mutationFn: async (behavior: {
      actionType: string;
      auctionId?: number;
      categoryId?: number;
      sessionId?: string;
      metadata?: any;
    }) => {
      const response = await fetch(`/api/users/${userId}/behavior`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(behavior),
      });
      
      if (!response.ok) {
        throw new Error('Failed to track behavior');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate recommendations after behavior tracking
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['/api/users', userId, 'recommendations']
        });
      }, 1000);
    },
  });

  return {
    trackView: (auctionId: number, categoryId?: number, duration?: number) => {
      trackBehavior.mutate({
        actionType: 'view',
        auctionId,
        categoryId,
        metadata: { duration }
      });
    },
    trackClick: (auctionId: number, categoryId?: number) => {
      trackBehavior.mutate({
        actionType: 'click',
        auctionId,
        categoryId
      });
    },
    trackBid: (auctionId: number, categoryId?: number, bidAmount?: string) => {
      trackBehavior.mutate({
        actionType: 'bid',
        auctionId,
        categoryId,
        metadata: { bidAmount }
      });
    },
    trackSearch: (query: string, categoryId?: number) => {
      trackBehavior.mutate({
        actionType: 'search',
        categoryId,
        metadata: { query }
      });
    },
    trackWatch: (auctionId: number, categoryId?: number) => {
      trackBehavior.mutate({
        actionType: 'watch',
        auctionId,
        categoryId
      });
    }
  };
}