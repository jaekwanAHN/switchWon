'use client';

import { useOrderHistory } from '@/hooks/useExchangeData';
import dayjs from 'dayjs';

export default function HistoryPage() {
    const { data: history, isLoading } = useOrderHistory();

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-lg font-medium text-gray-500 animate-pulse">
                    내역을 불러오는 중... ⏳
                </div>
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="bg-white p-10 text-center rounded-lg shadow border border-gray-100">
                <p className="text-gray-500 text-lg">아직 환전 내역이 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">첫 환전을 진행해보세요!</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">환전 내역</h2>
                <p className="text-sm text-gray-500 mt-1">지난 거래 내역을 확인하세요.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                거래 일시
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                보낸 금액
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                화살표
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                받은 금액
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                적용 환율
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {history.map((item) => (
                            <tr key={item.orderId} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {dayjs(item.orderedAt).format('YYYY-MM-DD HH:mm')}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                    {item.fromAmount.toLocaleString()}
                                    <span className="text-gray-500 ml-1 text-xs">{item.fromCurrency}</span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-400">
                                    →
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-indigo-600">
                                    {item.toAmount.toLocaleString()}
                                    <span className="text-indigo-400 ml-1 text-xs">{item.toCurrency}</span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                    {item.appliedRate.toLocaleString()}
                                    <span className="text-xs ml-1">KRW</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}