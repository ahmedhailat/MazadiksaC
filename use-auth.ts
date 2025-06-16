import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  rewardPoints: number;
  level: number;
  isVerified: boolean;
}

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/user");
        return response;
      } catch (error: any) {
        if (error.message?.includes('401')) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: user as AuthUser | undefined,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
    refetch,
  };
}