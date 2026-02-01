import apiClient from '@/lib/api/axios';
import {
  ApiResponse,
  ExchangeRate,
  WalletResponse,
  QuoteRequest,
  QuoteResponse,
  OrderRequest,
  OrderHistory,
} from '@/types/exchange';

export const getExchangeRates = async (): Promise<ExchangeRate[]> => {
  const { data } = await apiClient.get<ApiResponse<ExchangeRate[]>>('/exchange-rates/latest');
  return data.data;
};

export const getWallet = async (): Promise<WalletResponse> => {
  const { data } = await apiClient.get<ApiResponse<WalletResponse>>('/wallets');
  return data.data;
};

export const getQuote = async (params: QuoteRequest): Promise<QuoteResponse> => {
  const { data } = await apiClient.get<ApiResponse<QuoteResponse>>('/orders/quote', {
    params,
  });
  return data.data;
};

export const requestExchange = async (body: OrderRequest): Promise<string> => {
  const { data } = await apiClient.post<ApiResponse<string>>('/orders', body);
  return data.data;
};

export const getOrderHistory = async (): Promise<OrderHistory[]> => {
  const { data } = await apiClient.get<ApiResponse<OrderHistory[]>>('/orders');
  return data.data;
};