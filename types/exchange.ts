export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface ExchangeRate {
  exchangeRateId: number;
  currency: 'USD' | 'JPY';
  rate: number;
  changePercentage: number;
  applyDateTime: string;
}

export interface WalletItem {
  walletId: number;
  currency: 'KRW' | 'USD' | 'JPY';
  balance: number;
}

export interface WalletResponse {
  totalKrwBalance: number;
  wallets: WalletItem[];
}

export interface QuoteRequest {
  fromCurrency: string;
  toCurrency: string;
  forexAmount: number;
}

export interface QuoteResponse {
  krwAmount: number;
  appliedRate: number;
}

export interface OrderRequest {
  exchangeRateId: number;
  fromCurrency: string;
  toCurrency: string;
  forexAmount: number;
}

export interface OrderHistory {
  orderId: number;
  fromCurrency: string;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  appliedRate: number;
  orderedAt: string;
}