import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Bid } from "@shared/schema";

interface BidWithBidder extends Bid {
  bidder: {
    id: number;
    username: string;
    fullName: string;
  } | null;
}

interface PlaceBidData {
  auctionId: number;
  amount: string;
  bidderId: number;
}

export function useBidsForAuction(auctionId: number) {
  return useQuery<BidWithBidder[]>({
    queryKey: ['/api/auctions', auctionId, 'bids'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/auctions/${auctionId}/bids`);
        if (!response.ok) {
          throw new Error('Failed to fetch bids');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching bids:', error);
        throw error;
      }
    },
    enabled: !!auctionId,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    retry: 1,
    retryOnMount: false,
  });
}

export function usePlaceBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PlaceBidData) => {
      const response = await apiRequest(
        'POST',
        `/api/auctions/${data.auctionId}/bids`,
        {
          amount: data.amount,
          bidderId: data.bidderId,
        }
      );
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch auction data
      queryClient.invalidateQueries({ queryKey: ['/api/auctions', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['/api/auctions', variables.auctionId, 'bids'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auctions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}
