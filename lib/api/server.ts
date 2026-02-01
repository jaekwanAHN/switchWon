import { cookies } from 'next/headers';
import { ExchangeRate, WalletResponse } from '@/types/exchange';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

async function fetchServer<T>(endpoint: string): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Server Fetch Failed: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

export const getServerExchangeRates = () => fetchServer<ExchangeRate[]>('/exchange-rates');

export const getServerWallet = () => fetchServer<WalletResponse>('/wallets');
