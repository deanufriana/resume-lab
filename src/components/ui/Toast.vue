<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[300px] sm:max-w-sm pointer-events-none no-print"
      aria-live="polite"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :role="toast.type === 'error' ? 'alert' : 'status'"
          :class="
            cn(
              'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border bg-popover text-popover-foreground shadow-lg ring-1 ring-black/5 dark:ring-white/10',
              toastBorderVariants[toast.type],
            )
          "
          @mouseenter="pauseToast(toast.id)"
          @mouseleave="resumeToast(toast.id)"
        >
          <CheckCircle2
            v-if="toast.type === 'success'"
            class="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400"
          />
          <AlertCircle
            v-else-if="toast.type === 'error'"
            class="w-4 h-4 flex-shrink-0 text-destructive"
          />
          <Info v-else class="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />

          <p class="flex-1 text-sm font-medium leading-snug">{{ toast.message }}</p>

          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Close notification"
            @click="removeToast(toast.id)"
          >
            <X class="w-3.5 h-3.5" />
          </Button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertCircle, Info, X } from "lucide-vue-next";
import { useToast } from "../../composables/useToast";
import { cn } from "../../utils/cn";
import Button from "./Button.vue";

const { toasts, removeToast, pauseToast, resumeToast } = useToast();

const toastBorderVariants = {
  success: "border-emerald-500/30",
  error: "border-destructive/40",
  info: "border-border",
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

.toast-move {
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
