'use client';

import ExchangeForm from '@/components/exchange/ExchangeForm';
import ExchangeRateList from '@/components/dashboard/ExchangeRateList';
import WalletCard from '@/components/dashboard/WalletCard';

export default function MainPage() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <ExchangeRateList />
        <WalletCard />
      </div>

      <div className="lg:mt-0">
        <ExchangeForm />
      </div>
    </div>
  );
}
