'use client';

import { useState } from 'react';
import { useForm, UseFormRegister, UseFormHandleSubmit, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { useQueryClient, useQuery, keepPreviousData } from '@tanstack/react-query';
import { useExchangeRates, useExchangeMutation, QUERY_KEYS } from '@/hooks/useExchangeData';
import { getQuote } from '@/lib/api/exchange';
import { useDebounce } from '@/hooks/useDebounce';
import { useToastStore } from '@/store/toastStore';
import { QuoteResponse } from '@/types/exchange';

export type TabMode = 'BUY' | 'SELL';
export type Currency = 'USD' | 'JPY';

export interface ExchangeFormValues {
  amount: string;
}

export interface UseExchangeFormLogicReturn {
  formProps: {
    register: UseFormRegister<ExchangeFormValues>;
    handleSubmit: UseFormHandleSubmit<ExchangeFormValues>;
    setValue: UseFormSetValue<ExchangeFormValues>;
    errors: FieldErrors<ExchangeFormValues>;
  };
  handlers: {
    onSubmit: (data: ExchangeFormValues) => void;
    setModeBuy: () => void;
    setModeSell: () => void;
    setCurrency: (currency: Currency) => void;
  };
  data: {
    mode: TabMode;
    currency: Currency;
    quoteData: QuoteResponse | undefined;
    isQuoteFetching: boolean;
    isQuoteError: boolean;
    isMutationPending: boolean;
  };
  uiState: {
    errorMessage: string;
    themeColor: 'red' | 'blue';
    isBuy: boolean;
    isSubmitDisabled: boolean;
  };
}

/** API 에러 응답 (axios 등에서 반환되는 형태). onError는 Error를 받으므로 내부에서 단언해 사용 */
function getApiErrorCode(error: Error): string | undefined {
  const err = error as Error & { response?: { data?: { code?: string } } };
  return err.response?.data?.code;
}

export function useExchangeFormLogic(): UseExchangeFormLogicReturn {
  const queryClient = useQueryClient();
  const [mode, setModeState] = useState<TabMode>('BUY');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { showToast } = useToastStore();

  const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm<ExchangeFormValues>({
    mode: 'onChange',
  });

  const forexAmount = watch('amount');
  const debouncedAmount = useDebounce(forexAmount, 300);

  const { data: rates } = useExchangeRates();
  const exchangeMutation = useExchangeMutation();

  const currentRateObj = rates?.find((r) => r.currency === currency);

  const { data: quoteData, isError: isQuoteError, isFetching: isQuoteFetching } = useQuery({
    queryKey: ['quote', mode, currency, debouncedAmount],
    queryFn: () =>
      getQuote({
        fromCurrency: mode === 'BUY' ? 'KRW' : currency,
        toCurrency: mode === 'BUY' ? currency : 'KRW',
        forexAmount: Number(debouncedAmount),
      }),
    enabled: !!debouncedAmount && Number(debouncedAmount) > 0,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const onSubmit = (data: ExchangeFormValues) => {
    setErrorMessage('');
    if (!currentRateObj) {
      alert('환율 정보를 불러오는 중입니다.');
      return;
    }

    exchangeMutation.mutate(
      {
        exchangeRateId: currentRateObj.exchangeRateId,
        fromCurrency: mode === 'BUY' ? 'KRW' : currency,
        toCurrency: mode === 'BUY' ? currency : 'KRW',
        forexAmount: Number(data.amount),
      },
      {
        onSuccess: () => {
          showToast('환전이 성공적으로 완료되었습니다! 🎉', 'success');
          setErrorMessage('');
          setValue('amount', '');
        },
        onError: (error: Error) => {
          const errorCode = getApiErrorCode(error);

          if (errorCode === 'EXCHANGE_RATE_MISMATCH') {
            setErrorMessage(
              '⚠️ 환율이 변동되어 정보를 갱신했습니다. 변경된 가격을 확인 후 다시 눌러주세요.'
            );
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RATES });
            queryClient.invalidateQueries({ queryKey: ['quote'] });
          } else {
            showToast('환전에 실패했습니다. 잔액을 확인해주세요.', 'error');
          }
        },
      }
    );
  };

  const setModeBuy = () => {
    setModeState('BUY');
    setValue('amount', '');
  };

  const setModeSell = () => {
    setModeState('SELL');
    setValue('amount', '');
  };

  const themeColor = mode === 'BUY' ? 'red' : 'blue';
  const isBuy = mode === 'BUY';
  const isSubmitDisabled =
    exchangeMutation.isPending || !quoteData || isQuoteFetching;

  return {
    formProps: {
      register,
      handleSubmit,
      setValue,
      errors,
    },
    handlers: {
      onSubmit,
      setModeBuy,
      setModeSell,
      setCurrency,
    },
    data: {
      mode,
      currency,
      quoteData,
      isQuoteFetching,
      isQuoteError,
      isMutationPending: exchangeMutation.isPending,
    },
    uiState: {
      errorMessage,
      themeColor,
      isBuy,
      isSubmitDisabled,
    },
  };
}
