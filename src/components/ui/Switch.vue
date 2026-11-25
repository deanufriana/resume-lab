<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    defaultValue?: boolean;
    disabled?: boolean;
    variant?: "default" | "amber";
    size?: "sm" | "default";
    class?: HTMLAttributes["class"];
  }>(),
  {
    modelValue: undefined,
    defaultValue: false,
    disabled: false,
    variant: "default",
    size: "default",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", payload: boolean): void;
}>();

const checked = useVModel(props, "modelValue", emit, {
  passive: true,
  defaultValue: props.defaultValue,
});

function toggle() {
  if (props.disabled) return;
  checked.value = !checked.value;
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="Boolean(checked)"
    :disabled="disabled"
    :class="
      cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'h-4 w-7' : 'h-5 w-9',
        checked ? (variant === 'amber' ? 'bg-amber-500' : 'bg-primary') : 'bg-input',
        props.class,
      )
    "
    @click="toggle"
  >
    <span
      :class="
        cn(
          'pointer-events-none block rounded-full bg-background shadow-sm ring-0 transition-transform',
          size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
          checked ? (size === 'sm' ? 'translate-x-3' : 'translate-x-4') : 'translate-x-0',
        )
      "
    />
  </button>
</template>
