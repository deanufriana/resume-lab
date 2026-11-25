import { ref } from "vue";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface TimerState {
  timer: ReturnType<typeof setTimeout> | null;
  remaining: number;
  startedAt: number;
}

const MAX_TOASTS = 5;
const toasts = ref<Toast[]>([]);
const timerStates = new Map<string, TimerState>();

function clearTimer(id: string) {
  const state = timerStates.get(id);
  if (state?.timer) {
    clearTimeout(state.timer);
    state.timer = null;
  }
}

export function useToast() {
  function removeToast(id: string) {
    clearTimer(id);
    timerStates.delete(id);
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }

  function startTimer(id: string, duration: number) {
    if (duration <= 0) return;
    clearTimer(id);
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);
    timerStates.set(id, {
      timer,
      remaining: duration,
      startedAt: Date.now(),
    });
  }

  function pauseToast(id: string) {
    const state = timerStates.get(id);
    if (!state || !state.timer) return;
    clearTimeout(state.timer);
    state.timer = null;
    state.remaining = Math.max(0, state.remaining - (Date.now() - state.startedAt));
  }

  function resumeToast(id: string) {
    const state = timerStates.get(id);
    if (!state || state.timer || state.remaining <= 0) return;
    startTimer(id, state.remaining);
  }

  function addToast(toast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration ?? 3000;
    const newToast: Toast = {
      id,
      ...toast,
      duration,
    };

    if (toasts.value.length >= MAX_TOASTS) {
      const oldest = toasts.value[0];
      if (oldest) removeToast(oldest.id);
    }

    toasts.value.push(newToast);
    startTimer(id, duration);
  }

  return {
    toasts,
    removeToast,
    pauseToast,
    resumeToast,
    success: (message: string, duration?: number) =>
      addToast({ message, type: "success", duration }),
    error: (message: string, duration?: number) => addToast({ message, type: "error", duration }),
    info: (message: string, duration?: number) => addToast({ message, type: "info", duration }),
  };
}
