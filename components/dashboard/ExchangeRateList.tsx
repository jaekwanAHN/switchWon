'use client';

import { useExchangeRates } from '@/hooks/useExchangeData';

export default function ExchangeRateList() {
  const { data: rates, isLoading } = useExchangeRates();

  if (isLoading) {
    return (
      <section className="bg-white p-6 shadow-sm rounded-xl border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-1">환율 정보</h2>
        <p className="text-sm text-gray-500 mb-6">실시간 환율을 확인하세요.</p>
        <div className="flex h-32 items-center justify-center">
          <span className="text-gray-500 animate-pulse">로딩 중...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 shadow-sm rounded-xl border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1">환율 정보</h2>
      <p className="text-sm text-gray-500 mb-6">실시간 환율을 확인하세요.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {rates?.map((rate) => (
          <div
            key={rate.exchangeRateId}
            className="flex flex-col justify-between rounded-lg bg-gray-50 p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900">{rate.currency}</span>
                <span className="text-xs text-gray-500">
                  {rate.currency === 'USD' ? '미국 달러' : '일본 엔'}
                </span>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  rate.changePercentage > 0 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}
              >
                {rate.changePercentage > 0 ? '▲' : '▼'} {rate.changePercentage}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">
                {rate.rate.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-1">KRW</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
