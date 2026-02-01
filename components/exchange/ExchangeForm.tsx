'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useExchangeRates, useExchangeMutation, QUERY_KEYS } from '@/hooks/useExchangeData';
import { getQuote } from '@/lib/api/exchange';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import clsx from 'clsx';

type TabMode = 'BUY' | 'SELL';
type Currency = 'USD' | 'JPY';

export default function ExchangeForm() {
    const queryClient = useQueryClient();
    const [mode, setMode] = useState<TabMode>('BUY');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm({
        mode: 'onChange',
    });

    const forexAmount = watch('amount');
    const debouncedAmount = useDebounce(forexAmount, 300);

    const { data: rates } = useExchangeRates();
    const exchangeMutation = useExchangeMutation();

    const currentRateObj = rates?.find((r) => r.currency === currency);

    const { data: quoteData, isError: isQuoteError, isFetching: isQuoteFetching } = useQuery({
        queryKey: ['quote', mode, currency, debouncedAmount],
        queryFn: () => getQuote({
            fromCurrency: mode === 'BUY' ? 'KRW' : currency,
            toCurrency: mode === 'BUY' ? currency : 'KRW',
            forexAmount: Number(debouncedAmount),
        }),
        enabled: !!debouncedAmount && Number(debouncedAmount) > 0,
        retry: false,
        placeholderData: keepPreviousData,
    });

    const onSubmit = (data: any) => {
        setErrorMessage('');
        if (!currentRateObj) return alert('환율 정보를 불러오는 중입니다.');

        exchangeMutation.mutate({
            exchangeRateId: currentRateObj.exchangeRateId,
            fromCurrency: mode === 'BUY' ? 'KRW' : currency,
            toCurrency: mode === 'BUY' ? currency : 'KRW',
            forexAmount: Number(data.amount),
        }, {
            onSuccess: () => {
                alert('환전이 완료되었습니다! 🎉');
                setErrorMessage('');
                setValue('amount', '');
            },
            onError: (error: any) => {
                const errorCode = error.response?.data?.code;
                const errorMessage = error.response?.data?.message;

                if (errorCode === 'EXCHANGE_RATE_MISMATCH') {
                    setErrorMessage('⚠️ 환율이 변동되어 정보를 갱신했습니다. 변경된 가격을 확인 후 다시 눌러주세요.');
                    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RATES });
                    queryClient.invalidateQueries({ queryKey: ['quote'] });
                } else {
                    setErrorMessage(errorMessage || '환전에 실패했습니다.');
                }
            }
        });
    };

    const themeColor = mode === 'BUY' ? 'red' : 'blue';
    const isBuy = mode === 'BUY';

    return (
        <div className="bg-white p-6 shadow rounded-lg border border-gray-100">

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => { setMode('BUY'); setValue('amount', ''); }}
                    className={clsx(
                        "flex-1 py-3 rounded-md font-bold transition-colors",
                        isBuy ? "bg-red-500 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                >
                    살래요
                </button>
                <button
                    onClick={() => { setMode('SELL'); setValue('amount', ''); }}
                    className={clsx(
                        "flex-1 py-3 rounded-md font-bold transition-colors",
                        !isBuy ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                >
                    팔래요
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currency} {isBuy ? '환전하기' : '판매하기'}
                </label>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="block w-full rounded-md border-gray-300 py-3 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                >
                    <option value="USD">🇺🇸 미국 USD</option>
                    <option value="JPY">🇯🇵 일본 JPY</option>
                </select>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isBuy ? '매수' : '매도'} 금액 ({currency})
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <input
                            type="number"
                            className="block w-full rounded-md border-gray-300 py-3 pl-4 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
                            placeholder="0"
                            step="0.01"
                            {...register('amount', { required: true, min: 1 })}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">{currency}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-2 text-gray-400">
                    ⌄
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                        {isBuy ? '필요 원화' : '받을 원화'}
                    </label>

                    <div className={clsx(
                        "text-xl font-bold text-gray-900 text-right transition-opacity duration-200",
                        isQuoteFetching ? "opacity-50" : "opacity-100"
                    )}>
                        {quoteData ? (
                            <span>{quoteData.krwAmount.toLocaleString()} 원</span>
                        ) : (
                            <span className="text-gray-400 text-base">금액을 입력하세요</span>
                        )}
                    </div>

                    {quoteData && (
                        <div className="text-xs text-right text-gray-500 mt-1">
                            적용 환율: 1 {currency} = {quoteData.appliedRate.toLocaleString()} 원
                        </div>
                    )}
                </div>

                {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 animate-pulse">
                        <span className="text-red-500">ℹ️</span>
                        <p className="text-sm text-red-600 font-medium break-keep">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={exchangeMutation.isPending || !quoteData || isQuoteFetching}
                    className={clsx(
                        "w-full py-4 rounded-md text-white font-bold text-lg shadow-sm transition-all mt-4",
                        isBuy ? "bg-slate-900 hover:bg-slate-800" : "bg-slate-900 hover:bg-slate-800",

                        (exchangeMutation.isPending || !quoteData || isQuoteFetching)
                            ? "opacity-50 cursor-not-allowed"
                            : "opacity-100"
                    )}
                >
                    환전하기
                </button>
            </form>
        </div>
    );
}