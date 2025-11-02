import { ref } from 'vue';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
  function addToast(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration || 3000;
    const newToast: Toast = {
      id,
      ...toast,
      duration,
    };
    toasts.value.push(newToast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }

  return {
    toasts,
    removeToast,
    success: (message: string, duration?: number) => addToast({ message, type: 'success', duration }),
    error: (message: string, duration?: number) => addToast({ message, type: 'error', duration }),
    info: (message: string, duration?: number) => addToast({ message, type: 'info', duration }),
  };
}
