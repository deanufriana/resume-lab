<script setup lang="ts">
import { onKeyStroke } from "@vueuse/core";
import { AlertTriangle, X } from "lucide-vue-next";
import { Button } from "./ui";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "default" | "destructive";
  }>(),
  {
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    variant: "default",
  },
);

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

onKeyStroke("Escape", () => {
  if (props.open) emit("cancel");
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4 no-print"
        @click.self="emit('cancel')"
      >
        <div
          role="dialog"
          aria-modal="true"
          class="w-full max-w-md bg-popover text-popover-foreground border rounded-t-xl sm:rounded-lg shadow-xl overflow-hidden flex flex-col"
        >
          <div class="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
            <div class="flex items-start gap-3">
              <div
                :class="[
                  'w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0',
                  variant === 'destructive'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                ]"
              >
                <AlertTriangle class="w-4 h-4" />
              </div>
              <div class="space-y-1">
                <h2 class="text-sm font-semibold leading-snug">{{ title }}</h2>
                <p class="text-xs text-muted-foreground leading-relaxed">{{ description }}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 flex-shrink-0 -mt-1 -mr-1"
              aria-label="Close modal"
              @click="emit('cancel')"
            >
              <X class="w-4 h-4" />
            </Button>
          </div>

          <div class="px-4 sm:px-5 py-3 border-t bg-muted/20 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" @click="emit('cancel')">
              {{ cancelLabel }}
            </Button>
            <Button
              :variant="variant === 'destructive' ? 'destructive' : 'default'"
              size="sm"
              @click="emit('confirm')"
            >
              {{ confirmLabel }}
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
