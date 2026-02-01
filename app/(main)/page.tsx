'use client';

import { useExchangeRates, useWallet } from '@/hooks/useExchangeData';
import ExchangeForm from '@/components/exchange/ExchangeForm'; // 👈 import 추가

export default function MainPage() {
  const { data: rates, isLoading: isRatesLoading } = useExchangeRates();
  const { data: wallet, isLoading: isWalletLoading } = useWallet();

  if (isRatesLoading || isWalletLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          데이터를 불러오는 중... ⏳
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <section className="bg-white p-6 shadow-sm rounded-xl border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-1">환율 정보</h2>
          <p className="text-sm text-gray-500 mb-6">실시간 환율을 확인하세요.</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rates?.map((rate) => (
              <div key={rate.exchangeRateId} className="flex flex-col justify-between rounded-lg bg-gray-50 p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-gray-900">{rate.currency}</span>
                    <span className="text-xs text-gray-500">
                      {rate.currency === 'USD' ? '미국 달러' : '일본 엔'}
                    </span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${rate.changePercentage > 0 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {rate.changePercentage > 0 ? '▲' : '▼'} {rate.changePercentage}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">{rate.rate.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 ml-1">KRW</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 shadow-sm rounded-xl border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">내 지갑</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b pb-4">
              <span className="text-gray-500 font-medium">총 자산 (KRW)</span>
              <span className="text-2xl font-bold text-indigo-600">
                {wallet?.totalKrwBalance.toLocaleString()} ₩
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {wallet?.wallets.map((w) => (
                <div key={w.walletId} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600">
                      {w.currency}
                    </span>
                    <span className="text-gray-700 font-medium">{w.currency} 잔액</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {w.balance.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="lg:mt-0">
        <ExchangeForm />
      </div>
    </div>
  );
}