import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import getQueryClient from '@/lib/getQueryClient';
import { getServerExchangeRates, getServerWallet } from '@/lib/api/server';
import { QUERY_KEYS } from '@/hooks/useExchangeData';
import ExchangeForm from '@/components/exchange/ExchangeForm';
import ExchangeRateList from '@/components/dashboard/ExchangeRateList';
import WalletCard from '@/components/dashboard/WalletCard';

export default async function MainPage() {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.RATES,
      queryFn: getServerExchangeRates,
    }),
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.WALLET,
      queryFn: getServerWallet,
    }),
  ]);
  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <ExchangeRateList />
          <WalletCard />
        </div>

        <div className="lg:mt-0">
          <ExchangeForm />
        </div>
      </div>
    </HydrationBoundary>
  );
}
