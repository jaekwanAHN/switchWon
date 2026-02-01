'use client';

import { useToastStore } from '@/store/toastStore';
import clsx from 'clsx';

export default function Toast() {
    const { message, type, isVisible, hideToast } = useToastStore();

    return (
        <div
            className={clsx(
                "fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform flex items-center gap-2 cursor-pointer",
                isVisible
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-4 pointer-events-none",

                type === 'success' && "bg-slate-900 text-white",
                type === 'error' && "bg-red-500 text-white",
                type === 'info' && "bg-blue-500 text-white"
            )}
            onClick={hideToast}
        >
            <span>
                {type === 'success' && '✅'}
                {type === 'error' && '🚨'}
                {type === 'info' && 'ℹ️'}
            </span>
            <span className="font-medium text-sm">{message}</span>
        </div>
    );
}