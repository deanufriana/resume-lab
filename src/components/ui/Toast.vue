<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="cn(
            'flex items-center gap-3 p-4 rounded-lg border',
            toastVariants[toast.type]
          )"
        >
          <div v-if="toast.type === 'success'" class="flex-shrink-0">
            <svg
              class="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div v-if="toast.type === 'error'" class="flex-shrink-0">
            <svg
              class="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div v-if="toast.type === 'info'" class="flex-shrink-0">
            <svg
              class="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              class="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '../../composables/useToast';
import { cn } from '../../utils/cn';

const { toasts, removeToast } = useToast();

const toastVariants = {
  success: 'bg-primary/10 border-primary/20 text-primary',
  error: 'bg-destructive/10 border-destructive/20 text-destructive',
  info: 'bg-accent border-border text-foreground',
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
