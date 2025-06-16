import { useQuery } from "@tanstack/react-query";
import type { Auction } from "@shared/schema";

interface AuctionFilters {
  categoryId?: number;
  status?: string;
  featured?: boolean;
}

export function useAuctions(filters?: AuctionFilters) {
  return useQuery<Auction[]>({
    queryKey: ['/api/auctions', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
      
      const response = await fetch(`/api/auctions?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch auctions');
      }
      return response.json();
    },
  });
}

export function useAuction(id: number) {
  return useQuery<Auction>({
    queryKey: ['/api/auctions', id],
    queryFn: async () => {
      const response = await fetch(`/api/auctions/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch auction');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export function useFeaturedAuctions() {
  return useAuctions({ featured: true, status: 'active' });
}

export function useActiveAuctions() {
  return useAuctions({ status: 'active' });
}

export function useAuctionStats() {
  return useQuery<{ activeAuctions: number; totalUsers: number; totalAuctions: number }>({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    },
  });
}
