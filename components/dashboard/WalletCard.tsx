'use client';

import { useWallet } from '@/hooks/useExchangeData';

export default function WalletCard() {
  const { data: wallet, isLoading } = useWallet();

  if (isLoading) {
    return (
      <section className="bg-white p-6 shadow-sm rounded-xl border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">내 지갑</h2>
        <div className="flex h-32 items-center justify-center">
          <span className="text-gray-500 animate-pulse">로딩 중...</span>
        </div>
      </section>
    );
  }

  return (
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
            <div
              key={w.walletId}
              className="flex justify-between items-center text-sm"
            >
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
  );
}
