'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/auth';
import Cookies from 'js-cookie';
import { useState } from 'react';

const loginSchema = z.object({
    email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            setServerError('');
            const response = await login(data.email);

            // ✅ 쿠키에 토큰 저장 (유효기간 1일)
            Cookies.set('accessToken', response.token, { expires: 1 });
            Cookies.set('memberId', response.memberId.toString(), { expires: 1 });

            router.push('/');
        } catch (error: any) {
            console.error(error);
            setServerError('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">환전 서비스</h2>
                    <p className="mt-2 text-gray-600">이메일로 간편하게 로그인하세요.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input
                            type="email"
                            placeholder="test@test.com"
                            className={`block w-full rounded-md border p-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('email')}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                    {serverError && <p className="text-center text-sm text-red-600">{serverError}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-slate-900 py-3 text-white font-bold hover:bg-slate-800 disabled:opacity-50"
                    >
                        {isSubmitting ? '로그인 중...' : '시작하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}