import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExchangeRates, getOrderHistory, getWallet, requestExchange } from '@/lib/api/exchange';
import { OrderRequest } from '@/types/exchange';

export const QUERY_KEYS = {
  RATES: ['exchangeRates'],
  WALLET: ['wallet'],
  HISTORY: ['history'],
};

export const useExchangeRates = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RATES,
    queryFn: getExchangeRates,
    refetchInterval: 60000, // 60초마다 폴링 (요구사항)
    // 창 전환했다 돌아왔을 때 깜빡거리지 않게 설정
    staleTime: 1000 * 30,
  });
};

export const useWallet = () => {
  return useQuery({
    queryKey: QUERY_KEYS.WALLET,
    queryFn: getWallet,
  });
};

export const useExchangeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderRequest) => requestExchange(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RATES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HISTORY });
    },
  });
};

export const useOrderHistory = () => {
  return useQuery({
    queryKey: QUERY_KEYS.HISTORY,
    queryFn: getOrderHistory,
    staleTime: 1000 * 60,
  });
};
