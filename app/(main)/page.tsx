'use client';

import { useExchangeRates, useWallet } from '@/hooks/useExchangeData';

export default function MainPage() {
  const { data: rates, isLoading: isRatesLoading } = useExchangeRates();
  const { data: wallet, isLoading: isWalletLoading } = useWallet();

  if (isRatesLoading || isWalletLoading) {
    return <div className="p-10 text-center">데이터를 불러오는 중... ⏳</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">환율 정보</h2>
        <p className="text-sm text-gray-500 mb-4">실시간 환율을 확인하고 간편하게 환전하세요.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rates?.map((rate) => (
            <div key={rate.exchangeRateId} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <span className="font-bold text-lg">{rate.currency}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {rate.currency === 'USD' ? '미국 달러' : '일본 엔'}
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">{rate.rate.toLocaleString()} KRW</div>
                <div className={`text-sm ${rate.changePercentage > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {rate.changePercentage > 0 ? '▲' : '▼'} {rate.changePercentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">내 지갑</h2>
        <div className="space-y-2">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">총 보유 자산 (KRW 환산)</span>
            <span className="font-bold">{wallet?.totalKrwBalance.toLocaleString()} ₩</span>
          </div>

          {wallet?.wallets.map((w) => (
            <div key={w.walletId} className="flex justify-between py-1">
              <span className="text-gray-600">{w.currency}</span>
              <span className="font-medium">
                {w.balance.toLocaleString()} {w.currency === 'KRW' ? '₩' : (w.currency === 'USD' ? '$' : '¥')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}