'use client';

import { useForm, UseFormRegister, UseFormHandleSubmit, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { login } from '@/lib/api/auth';
import { useToastStore } from '@/store/toastStore';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface UseLoginLogicReturn {
  register: UseFormRegister<LoginFormValues>;
  handleSubmit: UseFormHandleSubmit<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  isSubmitting: boolean;
  onSubmit: (data: LoginFormValues) => Promise<void>;
}

export function useLoginLogic(): UseLoginLogicReturn {
  const router = useRouter();
  const { showToast } = useToastStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data.email);

      Cookies.set('accessToken', response.token, { expires: 1 });
      Cookies.set('memberId', response.memberId.toString(), { expires: 1 });

      router.push('/');
    } catch (error) {
      console.error(error);
      showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
