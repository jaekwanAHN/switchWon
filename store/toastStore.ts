import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  type: 'info',
  isVisible: false,

  showToast: (message, type = 'info') => {
    set({ isVisible: true, message, type });

    // 3초 뒤에 자동으로 닫힘
    setTimeout(() => {
      set({ isVisible: false });
    }, 3000);
  },

  hideToast: () => set({ isVisible: false }),
}));
